import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { commerce, countryOptions } from '../config/commerce';
import { site } from '../config/site';
import { applyPromo, clearBag, removePromo } from '../state/actions';
import { useCartPricing } from '../state/hooks';
import { useUI } from '../state/ui';
import { CartLine } from '../components/CartLine';
import { FreeShippingBar } from '../components/CartDrawer';
import { TotalsTable } from '../components/OrderSummary';
import { Seo } from '../components/Seo';
import { Breadcrumbs, DemoNotice, EmptyState, PageHeader, SelectField } from '../components/ui';
import { Icon } from '../components/Icon';

export function PromoForm() {
  const { cart, totals } = useCartPricing();
  const { announce } = useUI();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = applyPromo(code);
    setMsg({ ok: r.ok, text: r.message }); announce(r.message);
    if (r.ok) setCode('');
  };
  if (cart.promoCode && totals.promo) {
    return (
      <div className="promo-applied">
        <p><Icon name="check" size={16} /> <strong>{totals.promo.code}</strong> applied — {totals.promo.description}</p>
        <button type="button" className="text-btn" onClick={() => { removePromo(); setMsg(null); announce('Promo code removed.'); }}>Remove</button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="promo-form" noValidate>
      {cart.promoCode && totals.promoError && <p className="field-error" role="alert"><Icon name="alert" size={14} /> {totals.promoError} <button type="button" className="text-btn" onClick={() => removePromo()}>Remove code</button></p>}
      <div className={`field${msg && !msg.ok ? ' has-error' : ''}`}>
        <label htmlFor="promo-code">Promo code</label>
        <div className="promo-row">
          <input id="promo-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. WELCOME10" autoComplete="off" aria-describedby="promo-msg" />
          <button type="submit" className="btn btn-outline btn-sm">Apply</button>
        </div>
      </div>
      <p id="promo-msg" className={msg ? (msg.ok ? 'form-success' : 'field-error') : 'fine'} role={msg && !msg.ok ? 'alert' : undefined}>{msg ? msg.text : 'Try WELCOME10, SAVE20 or FREESHIP (demonstration codes).'}</p>
    </form>
  );
}

export default function Cart() {
  const [country, setCountry] = useState<string>(commerce.defaultCountry);
  const [confirmClear, setConfirmClear] = useState(false);
  const { announce } = useUI();
  const navigate = useNavigate();
  const dest = { country };
  const { lines, totals } = useCartPricing(dest);
  const standard = totals.shippingOptions[0];
  return (
    <>
      <Seo title="Your bag" path="/cart" noindex />
      <PageHeader eyebrow="Your bag" title={totals.itemCount ? `Bag (${totals.itemCount})` : 'Your bag'}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Bag' }]} />
      </PageHeader>
      <div className="container">
        {lines.length === 0 ? (
          <EmptyState title="Your bag is empty" text="Your bag is stored in this browser. Browse the collection and add something you love." actions={<><Link to="/shop" className="btn">Shop all products</Link><Link to="/collections" className="btn btn-outline">Collections</Link></>} />
        ) : (
          <div className="cart-layout">
            <section aria-label="Items in your bag">
              <FreeShippingBar totals={totals} />
              <ul className="cart-lines is-page">{lines.map((l) => <CartLine key={l.key} line={l} />)}</ul>
              <div className="cart-tools">
                <Link to="/shop" className="text-btn"><Icon name="chevronLeft" size={16} /> Continue shopping</Link>
                {confirmClear ? (
                  <span className="confirm-inline" role="group" aria-label="Confirm clearing your bag">Remove all items?
                    <button type="button" className="btn btn-sm" onClick={() => { clearBag(); setConfirmClear(false); announce('Your bag has been cleared.'); }}>Yes, clear bag</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirmClear(false)}>Cancel</button>
                  </span>
                ) : <button type="button" className="text-btn" onClick={() => setConfirmClear(true)}><Icon name="trash" size={16} /> Clear bag</button>}
              </div>
            </section>
            <aside className="cart-summary" aria-labelledby="summary-title">
              <h2 id="summary-title" className="h3">Order summary</h2>
              <PromoForm />
              <SelectField label="Estimate shipping to" value={country} onChange={(e) => setCountry(e.target.value)}>
                {countryOptions().map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </SelectField>
              <TotalsTable totals={totals} shippingLabel={standard ? `Shipping (${standard.method.label.toLowerCase()})` : 'Shipping'} />
              <p className="fine">Final shipping and tax are confirmed at checkout from your delivery address. Estimates use demonstration rules.</p>
              <button type="button" className="btn btn-lg btn-block" disabled={totals.hasIssues || totals.itemCount === 0} onClick={() => navigate('/checkout')}>{site.labels.checkout}</button>
              {totals.hasIssues && <p className="field-error" role="alert">Some items are unavailable or exceed stock. Update your bag to continue.</p>}
              <DemoNotice compact />
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
