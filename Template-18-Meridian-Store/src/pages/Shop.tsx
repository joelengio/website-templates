import { getProducts } from '../lib/catalog';
import { ProductBrowser } from '../components/ProductBrowser';
import { Seo } from '../components/Seo';
import { Breadcrumbs, PageHeader } from '../components/ui';

export default function Shop() {
  return (
    <>
      <Seo title="Shop all products" description="Browse every product in the MERIDIAN STORE demonstration catalogue — bags, apparel, homeware, furniture, lighting and beauty — with filters, search and sorting." path="/shop" />
      <PageHeader eyebrow="The catalogue" title="Shop all products" text="Filter by category, price, colour and availability. Every filtered view has its own shareable link.">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />
      </PageHeader>
      <ProductBrowser products={getProducts()} />
    </>
  );
}
