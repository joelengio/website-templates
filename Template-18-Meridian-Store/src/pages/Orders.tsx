import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatMoney } from '../lib/money';
import { useOrders } from '../state/hooks';
import { resetDemoData } from '../state/stores';
import { useUI } from '../state/ui';
import { Seo } from '../components/Seo';
import { Breadcrumbs, DemoNotice, EmptyState, PageHeader } from '../components/ui';

export function ResetDemoButton({ className = 'btn btn-outline btn-sm' }: { className?: string }) {
  const [confirm, setConfirm] = useState(false);
  const { announce } = useUI();
  if (confirm) {
    return (
      <span className="confirm-inline" role="group" aria-label="Confirm reset">This removes your bag, wishlist, recently viewed items and demo orders from this browser.
        <button type="button" className="btn btn-sm" onClick={() => { resetDemoData(); setConfirm(false); announce('All demo data has been reset.'); }}>Yes, reset everything</button>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(false)}>Cancel</button>
      </span>
    );
  }
  return <button type="button" className={className} onClick={() => setConfirm(true)}>Reset demo data</button>;
}

export default function Orders() {
  const orders = useOrders();
  return (
    <>
      <Seo title="Demo order history" path="/orders" noindex />
      <PageHeader eyebrow="Demonstration only" title="Order history" text="Demo orders created with the demonstration checkout. They exist only in this browser — nothing was placed, paid for or sent.">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Order history' }]} />
      </PageHeader>
      <div className="container section-tight">
        <DemoNotice compact />
        {orders.length === 0 ? (
          <EmptyState icon="package" title="No demo orders yet" text="When you confirm a DEMO order at checkout, its summary is saved here." actions={<Link to="/shop" className="btn">Start shopping</Link>} />
        ) : (
          <>
            <ul className="order-list">
              {orders.map((o) => (
                <li key={o.reference}>
                  <Link to={`/orders/${o.reference}`} className="order-row">
                    <span><strong>{o.reference}</strong><small>{new Date(o.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</small></span>
                    <span>{o.lines.reduce((n, l) => n + l.qty, 0)} items</span>
                    <span className="order-total">{formatMoney(o.totals.totalMinor, { currency: o.currency })}</span>
                    <span className="badge">DEMO</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="order-tools"><ResetDemoButton /></div>
          </>
        )}
      </div>
    </>
  );
}
