import { Link, useParams, useSearchParams } from 'react-router-dom';
import { formatMoney } from '../lib/money';
import { countryName } from '../lib/orders';
import { useOrders } from '../state/hooks';
import { TotalsTable } from '../components/OrderSummary';
import { Seo } from '../components/Seo';
import { Breadcrumbs, DemoNotice, EmptyState, PageHeader, SafeImg } from '../components/ui';
import { Icon } from '../components/Icon';

export default function OrderDetail() {
  const { reference } = useParams();
  const [params] = useSearchParams();
  const order = useOrders().find((o) => o.reference === reference);
  if (!order) {
    return (
      <div className="container section-tight">
        <Seo title="Order not found" noindex />
        <EmptyState icon="package" title="We can’t find that demo order" text="Demo orders are stored only in the browser that created them. It may have been reset, or created on another device." actions={<><Link to="/orders" className="btn">Order history</Link><Link to="/shop" className="btn btn-outline">Shop</Link></>} />
      </div>
    );
  }
  const fresh = params.get('new') === '1';
  const t = order.totals;
  return (
    <>
      <Seo title={`Demo order ${order.reference}`} path={`/orders/${order.reference}`} noindex />
      <PageHeader eyebrow={fresh ? 'Demo order confirmed' : 'Demo order'} title={fresh ? 'Your DEMO order summary' : `Demo order ${order.reference}`}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Order history', to: '/orders' }, { label: order.reference }]} />
      </PageHeader>
      <div className="container section-tight order-detail">
        <div className="demo-notice is-strong" role="note">
          <span className="demo-tag">DEMO</span>
          <p><strong>This is a demonstration summary.</strong> No order was placed, no payment was taken or authorised, and nothing was sent to any server or person. It exists only in this browser.</p>
        </div>
        <dl className="order-meta">
          <div><dt>Demo reference</dt><dd className="mono">{order.reference}</dd></div>
          <div><dt>Created</dt><dd>{new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</dd></div>
          <div><dt>Delivery method</dt><dd>{order.method.label} · {order.method.eta}</dd></div>
        </dl>
        <div className="order-grid">
          <section aria-labelledby="od-items">
            <h2 id="od-items" className="h3">Items</h2>
            <ul className="summary-lines">
              {order.lines.map((l) => (
                <li key={`${l.productId}-${l.variantId}`}>
                  <SafeImg src={l.image} alt="" width={80} height={100} />
                  <div><p><Link to={`/products/${l.slug}`}>{l.name}</Link></p><p className="muted">{l.variantLabel && `${l.variantLabel} · `}Qty {l.qty} · {formatMoney(l.unitMinor, { currency: order.currency })} each</p></div>
                  <p>{formatMoney(l.lineMinor, { currency: order.currency })}</p>
                </li>
              ))}
            </ul>
            <TotalsTable totals={{ ...t, promo: order.promo }} currency={order.currency} shippingLabel={`Shipping (${order.method.label.toLowerCase()})`} totalLabel="Total (demo)" />
          </section>
          <aside aria-labelledby="od-details">
            <h2 id="od-details" className="h3">Sample details entered</h2>
            <h3 className="h5">Contact</h3>
            <p>{order.contact.firstName} {order.contact.lastName}<br />{order.contact.email}{order.contact.phone && <><br />{order.contact.phone}</>}</p>
            <h3 className="h5">Delivery address</h3>
            <address>{order.address.line1}<br />{order.address.line2 && <>{order.address.line2}<br /></>}{order.address.city}{order.address.region && `, ${order.address.region}`} {order.address.postcode}<br />{countryName(order.address.country)}</address>
            <h3 className="h5">Payment</h3>
            <p className="muted"><Icon name="info" size={14} /> None — this demonstration never collects or processes payment.</p>
            <div className="order-tools"><Link to="/orders" className="btn btn-outline btn-sm">All demo orders</Link><Link to="/shop" className="btn btn-sm">Continue shopping</Link></div>
          </aside>
        </div>
        <DemoNotice compact />
      </div>
    </>
  );
}
