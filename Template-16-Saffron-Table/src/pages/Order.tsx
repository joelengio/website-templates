import { Link } from 'react-router-dom';
import { Button, ButtonLink } from '../components/Button';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { AllergyNotice } from '../components/Menu';
import { DemoNotice, PageHero } from '../components/Section';
import { menuItems } from '../config/menu';
import { orderSettings } from '../config/features';
import { useSeo } from '../hooks/useSeo';
import { formatCents, formatMoney } from '../lib/format';
import { calculateOrder } from '../lib/order';
import { orderStore, useOrderLines } from '../lib/orderStore';
import { pageSeo } from '../lib/seo';

const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;

export default function Order() {
  useSeo({ ...pageSeo('/order'), path: '/order', noindex: true });
  const lines = useOrderLines();
  const totals = calculateOrder(lines, menuItems, orderSettings);

  return (
    <>
      <PageHero eyebrow="Order builder · demo" title="Plan an order" lead="Add dishes, adjust quantities and see an estimate with service charge and tax." image="grill-platter" />
      <section className="section section--dark">
        <div className="container order">
          <DemoNotice tone="warn">{orderSettings.disclaimer}</DemoNotice>
          <AllergyNotice compact />
          {totals.lines.length === 0 ? (
            <div className="empty empty--large">
              <Icon name="bag" size={40} />
              <h2>Your demo order is empty</h2>
              <p>Browse the menus and choose “Add to demo order” on any available dish.</p>
              <ButtonLink to="/menus" icon="arrow">Browse the menus</ButtonLink>
            </div>
          ) : (
            <div className="order__layout">
              <ul className="order__lines" aria-label="Order items">
                {totals.lines.map(({ item, qty, lineCents }) => (
                  <li key={item.id} className="order-line">
                    {item.image && <div className="order-line__img"><Img name={item.image} sizes="96px" /></div>}
                    <div className="order-line__info">
                      <h3>{item.name}</h3>
                      <p>{formatMoney(item.price)}{item.priceNote ? ` ${item.priceNote}` : ''} each</p>
                    </div>
                    <div className="qty" role="group" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" className="icon-btn" onClick={() => orderStore.setQty(item.id, qty - 1)} aria-label={`Decrease quantity of ${item.name}`}><Icon name="minus" size={16} /></button>
                      <output aria-live="polite" aria-label={`${qty} of ${item.name}`}>{qty}</output>
                      <button type="button" className="icon-btn" onClick={() => orderStore.setQty(item.id, qty + 1)} disabled={qty >= orderSettings.maxQuantity} aria-label={`Increase quantity of ${item.name}`}><Icon name="plus" size={16} /></button>
                    </div>
                    <p className="order-line__total">{formatCents(lineCents)}</p>
                    <button type="button" className="icon-btn" onClick={() => orderStore.remove(item.id)} aria-label={`Remove ${item.name}`}><Icon name="trash" size={18} /></button>
                  </li>
                ))}
              </ul>
              <aside className="order__summary" aria-label="Order summary">
                <h2>Order summary</h2>
                <dl>
                  <div><dt>Items</dt><dd>{totals.itemCount}</dd></div>
                  <div><dt>Subtotal</dt><dd data-testid="subtotal">{formatCents(totals.subtotalCents)}</dd></div>
                  <div><dt>Service charge ({pct(orderSettings.serviceChargeRate)})</dt><dd data-testid="service">{formatCents(totals.serviceCents)}</dd></div>
                  <div><dt>Tax ({pct(orderSettings.taxRate)})</dt><dd data-testid="tax">{formatCents(totals.taxCents)}</dd></div>
                  <div className="order__total"><dt>Estimated total</dt><dd data-testid="total">{formatCents(totals.totalCents)}</dd></div>
                </dl>
                <p className="order__note">Estimate only. Nothing has been ordered, paid for or sent to the kitchen.</p>
                <div className="order__actions">
                  <Button variant="ghost" icon="print" onClick={() => window.print()}>Print summary</Button>
                  <Button variant="text" icon="trash" onClick={() => orderStore.clear()}>Clear order</Button>
                </div>
                <p className="order__alt">Dining with us? <Link to="/reserve">Reserve a table</Link>.</p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
