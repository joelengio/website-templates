import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { commerce, countryOptions } from '../config/commerce';
import { site } from '../config/site';
import { formatMoney } from '../lib/money';
import { createOrder, countryName } from '../lib/orders';
import { priceLines, zoneFor } from '../lib/pricing';
import { regionLabel, REGION_REQUIRED, validateAddress, validateContact, type AddressFields, type ContactFields } from '../lib/validation';
import { clearBag } from '../state/actions';
import { useCartPricing } from '../state/hooks';
import { cartStore, saveOrder } from '../state/stores';
import { useUI } from '../state/ui';
import { CartLine } from '../components/CartLine';
import { Icon } from '../components/Icon';
import { TotalsTable } from '../components/OrderSummary';
import { Seo } from '../components/Seo';
import { Breadcrumbs, DemoNotice, EmptyState, PageHeader, SafeImg, SelectField, TextField } from '../components/ui';
import { PromoForm } from './Cart';
import { galleryFor } from '../lib/catalog';

const STEPS = ['Bag', 'Details', 'Delivery', 'Review & confirm'] as const;
const emptyContact: ContactFields = { email: '', firstName: '', lastName: '', phone: '' };
const emptyAddress: AddressFields = { country: commerce.defaultCountry, line1: '', line2: '', city: '', region: '', postcode: '' };

export default function Checkout() {
  const navigate = useNavigate();
  const { announce } = useUI();
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState(emptyContact);
  const [address, setAddress] = useState(emptyAddress);
  const [methodId, setMethodId] = useState<string>('');
  const [ack, setAck] = useState(false);
  const [errors, setErrors] = useState<{ contact: ReturnType<typeof validateContact>; address: ReturnType<typeof validateAddress> }>({ contact: {}, address: {} });
  const [submitError, setSubmitError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstRender = useRef(true);

  const dest = useMemo(() => ({ country: address.country, region: address.region }), [address.country, address.region]);
  const { lines, totals } = useCartPricing(dest, methodId || undefined);
  const countries = useMemo(() => countryOptions(), []);
  const countryCodes = countries.map((c) => c.code);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus();
  }, [step]);

  const errorList = [...Object.values(errors.contact), ...Object.values(errors.address)].filter(Boolean) as string[];
  const focusFirstInvalid = () => requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  const goto = (n: number, message = '') => { setSubmitError(message); setStep(n); };
  const continueFromBag = () => {
    if (!lines.length) return;
    if (totals.hasIssues) { setSubmitError('Some items are unavailable or exceed stock. Update your bag before continuing.'); return; }
    goto(1);
  };
  const submitDetails = (e: FormEvent) => {
    e.preventDefault();
    const c = validateContact(contact), a = validateAddress(address, countryCodes);
    setErrors({ contact: c, address: a });
    if (Object.keys(c).length || Object.keys(a).length) { announce('Please fix the highlighted fields.'); focusFirstInvalid(); return; }
    goto(2);
  };
  const submitDelivery = (e: FormEvent) => {
    e.preventDefault();
    if (!totals.shippingMethodId) { setSubmitError('No delivery method is available for this destination.'); return; }
    setMethodId(totals.shippingMethodId);
    goto(3);
  };
  const confirm = () => {
    setSubmitError('');
    if (!ack) { setSubmitError('Please tick the box to confirm you understand this is a demonstration.'); return; }
    // Re-validate everything against the current catalogue — stock or prices may have changed since the bag was built.
    const fresh = priceLines(cartStore.get().lines);
    if (!fresh.length) { goto(0, 'Your bag is empty.'); return; }
    if (fresh.some((l) => l.issue)) { goto(0, 'Some items are no longer available in the requested quantity. Please review your bag.'); return; }
    const c = validateContact(contact), a = validateAddress(address, countryCodes);
    if (Object.keys(c).length || Object.keys(a).length) { setErrors({ contact: c, address: a }); goto(1, 'Some details need attention.'); return; }
    try {
      const order = createOrder({ lines: fresh, contact, address, promoCode: cartStore.get().promoCode, methodId: methodId || totals.shippingMethodId || '' });
      saveOrder(order);
      clearBag();
      announce(`Demo order ${order.reference} created. No payment was taken.`);
      navigate(`/orders/${order.reference}?new=1`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'We could not create the demo order.');
    }
  };

  const setC = (k: keyof ContactFields) => (e: React.ChangeEvent<HTMLInputElement>) => setContact({ ...contact, [k]: e.target.value });
  const setA = (k: keyof AddressFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setAddress({ ...address, [k]: e.target.value });
  const zone = zoneFor(address.country);
  const selected = totals.shippingOptions.find((o) => o.method.id === (methodId || totals.shippingMethodId));

  const headings = ['Review your bag', 'Contact and delivery details', 'Choose a delivery method', 'Review and confirm your DEMO order'];

  return (
    <>
      <Seo title="Checkout (demonstration)" path="/checkout" noindex />
      <PageHeader eyebrow="Demonstration checkout" title="Checkout">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Bag', to: '/cart' }, { label: 'Checkout' }]} />
      </PageHeader>
      <div className="container checkout">
        <DemoNotice />
        {lines.length === 0 ? (
          <EmptyState title="Your bag is empty" text="Add something to your bag before checking out." actions={<Link to="/shop" className="btn">Shop all products</Link>} />
        ) : (
          <>
            <ol className="stepper" aria-label="Checkout progress">
              {STEPS.map((s, i) => (
                <li key={s} className={i === step ? 'is-current' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
                  <span className="step-num">{i < step ? <Icon name="check" size={14} /> : i + 1}</span><span className="step-label">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mobile-total">Order total <strong>{formatMoney(totals.totalMinor)}</strong> <span className="muted">· {totals.itemCount} items</span></p>

            <div className="checkout-layout">
              <div className="checkout-main">
                <h2 className="h3" tabIndex={-1} ref={headingRef}>{headings[step]}</h2>
                {submitError && <p className="form-error" role="alert"><Icon name="alert" size={16} /> {submitError}</p>}

                {step === 0 && (
                  <>
                    <ul className="cart-lines is-page">{lines.map((l) => <CartLine key={l.key} line={l} />)}</ul>
                    <div className="step-actions"><Link to="/cart" className="text-btn">Edit in bag</Link><button type="button" className="btn btn-lg" onClick={continueFromBag}>Continue to details</button></div>
                  </>
                )}

                {step === 1 && (
                  <form onSubmit={submitDetails} noValidate ref={formRef} aria-label="Contact and delivery details">
                    <p className="fine"><Icon name="info" size={14} /> Please use fictional sample details. Nothing is sent anywhere. Never enter card numbers — this demonstration does not accept payment details.</p>
                    {errorList.length > 0 && <div className="form-error" role="alert"><strong>Please fix the following:</strong><ul>{errorList.map((m) => <li key={m}>{m}</li>)}</ul></div>}
                    <fieldset>
                      <legend>Contact</legend>
                      <TextField label="Email" type="email" autoComplete="email" value={contact.email} onChange={setC('email')} error={errors.contact.email} placeholder="alex@example.com" />
                      <div className="field-row">
                        <TextField label="First name" autoComplete="given-name" value={contact.firstName} onChange={setC('firstName')} error={errors.contact.firstName} />
                        <TextField label="Last name" autoComplete="family-name" value={contact.lastName} onChange={setC('lastName')} error={errors.contact.lastName} />
                      </div>
                      <TextField label="Phone" type="tel" optional autoComplete="tel" value={contact.phone} onChange={setC('phone')} error={errors.contact.phone} />
                    </fieldset>
                    <fieldset>
                      <legend>Delivery address</legend>
                      <SelectField label="Country" autoComplete="country" value={address.country} onChange={(e) => { setAddress({ ...address, country: e.target.value, region: '' }); setMethodId(''); }} error={errors.address.country}>
                        {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </SelectField>
                      <TextField label="Address" autoComplete="address-line1" value={address.line1} onChange={setA('line1')} error={errors.address.line1} />
                      <TextField label="Apartment, suite, etc." optional autoComplete="address-line2" value={address.line2} onChange={setA('line2')} error={errors.address.line2} />
                      <div className="field-row">
                        <TextField label="City" autoComplete="address-level2" value={address.city} onChange={setA('city')} error={errors.address.city} />
                        <TextField label={regionLabel(address.country)} optional={!REGION_REQUIRED.has(address.country)} autoComplete="address-level1" value={address.region} onChange={setA('region')} error={errors.address.region} hint={address.country === 'US' ? 'Two-letter code, e.g. OR or CA (used for the demo tax estimate).' : undefined} />
                        <TextField label="Postal code" autoComplete="postal-code" value={address.postcode} onChange={setA('postcode')} error={errors.address.postcode} />
                      </div>
                    </fieldset>
                    <div className="step-actions"><button type="button" className="text-btn" onClick={() => goto(0)}>Back</button><button type="submit" className="btn btn-lg">Continue to delivery</button></div>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={submitDelivery}>
                    <fieldset>
                      <legend className="sr-only">Delivery method for {zone?.label ?? countryName(address.country)}</legend>
                      {totals.shippingOptions.length === 0 && <p className="form-error" role="alert">We do not deliver to this destination in the demonstration.</p>}
                      <div className="radio-cards" role="radiogroup" aria-label="Delivery method">
                        {totals.shippingOptions.map((o) => {
                          const checked = o.method.id === (methodId || totals.shippingMethodId);
                          return (
                            <label key={o.method.id} className={`radio-card${checked ? ' is-checked' : ''}`}>
                              <input type="radio" name="delivery" value={o.method.id} checked={checked} onChange={() => setMethodId(o.method.id)} />
                              <span className="radio-card-main"><strong>{o.method.label}</strong><span>{o.method.eta}</span><small>{o.method.description}</small></span>
                              <span className="radio-card-price">{o.free ? <><s>{formatMoney(o.baseMinor)}</s> Free</> : formatMoney(o.priceMinor)}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                    <div className="step-actions"><button type="button" className="text-btn" onClick={() => goto(1)}>Back</button><button type="submit" className="btn btn-lg" disabled={totals.shippingOptions.length === 0}>Continue to review</button></div>
                  </form>
                )}

                {step === 3 && (
                  <div className="review">
                    <div className="review-block"><div><h3 className="h5">Contact</h3><p>{contact.firstName} {contact.lastName}<br />{contact.email}{contact.phone && <><br />{contact.phone}</>}</p></div><button type="button" className="text-btn" onClick={() => goto(1)}>Edit<span className="sr-only"> contact details</span></button></div>
                    <div className="review-block"><div><h3 className="h5">Delivery address</h3><address>{address.line1}<br />{address.line2 && <>{address.line2}<br /></>}{address.city}{address.region && `, ${address.region}`} {address.postcode}<br />{countryName(address.country)}</address></div><button type="button" className="text-btn" onClick={() => goto(1)}>Edit<span className="sr-only"> address</span></button></div>
                    <div className="review-block"><div><h3 className="h5">Delivery method</h3><p>{selected?.method.label} · {selected?.method.eta}<br />{selected?.free ? 'Free' : formatMoney(selected?.priceMinor ?? 0)}</p></div><button type="button" className="text-btn" onClick={() => goto(2)}>Edit<span className="sr-only"> delivery method</span></button></div>
                    <div className="review-block is-stack"><h3 className="h5">Promo code</h3><PromoForm /></div>
                    <div className="review-block is-stack">
                      <h3 className="h5">Payment</h3>
                      <p><Icon name="info" size={14} /> <strong>No payment is requested.</strong> This demonstration has no card form and never authorises or captures payment. A real store would connect a payment provider here.</p>
                    </div>
                    <label className="check ack"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /><span>I understand this is a <strong>demonstration</strong>: no real order will be placed, paid for or transmitted.</span></label>
                    <div className="step-actions"><button type="button" className="text-btn" onClick={() => goto(2)}>Back</button><button type="button" className="btn btn-lg" onClick={confirm}>{site.demo.confirmLabel}</button></div>
                  </div>
                )}
              </div>

              <aside className="checkout-summary" aria-labelledby="co-summary">
                <h2 id="co-summary" className="h4">Order summary</h2>
                <ul className="summary-lines">
                  {lines.map((l) => l.product && l.variant && (
                    <li key={l.key}>
                      <SafeImg src={galleryFor(l.product, l.variant.options)[0]?.src ?? ''} alt="" width={64} height={80} />
                      <div><p>{l.product.name}</p><p className="muted">{l.variant.label && `${l.variant.label} · `}Qty {l.qty}</p></div>
                      <p>{formatMoney(l.lineMinor)}</p>
                    </li>
                  ))}
                </ul>
                <TotalsTable totals={totals} shippingLabel={step >= 2 && selected ? `Shipping (${selected.method.label.toLowerCase()})` : 'Shipping (estimate)'} totalLabel={step === 3 ? 'Total (demo)' : 'Estimated total'} />
                {totals.freeShipping.thresholdMinor !== undefined && !totals.freeShipping.qualified && <p className="fine">Add {formatMoney(totals.freeShipping.remainingMinor)} more for free standard shipping.</p>}
                <DemoNotice compact />
              </aside>
            </div>
          </>
        )}
      </div>
    </>
  );
}
