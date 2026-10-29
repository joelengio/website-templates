import { Link } from 'react-router-dom';
import { STORAGE_KEYS } from '../lib/storage';
import { Seo } from '../components/Seo';
import { Breadcrumbs, PageHeader } from '../components/ui';
import { ResetDemoButton } from './Orders';

export default function DemoInfo() {
  return (
    <>
      <Seo title="About this demonstration" description="What is real and what is simulated in the MERIDIAN STORE template: local cart, demonstration checkout and browser storage." path="/demo" />
      <PageHeader eyebrow="Demonstration" title="How this demo works" text="MERIDIAN STORE is a template showcase. The shopping logic is real; the business, payments and fulfilment are not.">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About this demo' }]} />
      </PageHeader>
      <div className="container narrow prose section-tight">
        <h2 className="h3">What is real</h2>
        <ul className="ticks">
          <li>The bag, wishlist and order history work and persist in your browser.</li>
          <li>Prices, discounts, shipping and tax are calculated from the product and rule data in the template configuration.</li>
          <li>Variant, stock and quantity checks stop unavailable items from being ordered.</li>
        </ul>
        <h2 className="h3">What is simulated</h2>
        <ul className="ticks">
          <li><strong>No payment is taken.</strong> There is no card form, no payment authorisation and no payment provider connected.</li>
          <li><strong>No order is placed.</strong> Confirming a DEMO order only creates a summary and a reference such as MER-DEMO-261029-ABCD in your browser.</li>
          <li>The business, products, people, reviews and policies are fictional. Stock levels are demonstration values.</li>
        </ul>
        <h2 className="h3">What is stored in your browser</h2>
        <p>These localStorage keys hold your bag, wishlist, recently viewed products and demo orders. Nothing is transmitted:</p>
        <ul className="mono-list">{Object.values(STORAGE_KEYS).map((k) => <li key={k}><code>{k}</code></li>)}</ul>
        <p>Demo orders contain the fictional contact and delivery details you typed. Please use sample details only.</p>
        <div className="order-tools"><ResetDemoButton className="btn" /> <Link to="/orders" className="btn btn-outline">View demo orders</Link></div>
        <h2 className="h3">Using this as a real store</h2>
        <p>The architecture separates configuration, pricing logic and storage so a commerce backend (for example Shopify, WooCommerce, Stripe or a custom API) can be connected later. Those integrations are <strong>not</strong> included or tested in this template; see the README for extension points.</p>
      </div>
    </>
  );
}
