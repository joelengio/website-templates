import { Link, useParams } from 'react-router-dom';
import { collections } from '../config/collections';
import { collectionProducts, getCollection } from '../lib/catalog';
import { ProductBrowser } from '../components/ProductBrowser';
import { Seo } from '../components/Seo';
import { Breadcrumbs, PageHeader, SafeImg, SectionHeading } from '../components/ui';
import NotFound from './NotFound';

export function CollectionsIndex() {
  return (
    <>
      <Seo title="Collections" description="Curated MERIDIAN STORE collections: The Slow Home, The Leather Atelier, Linen & Wool, Ritual & Fragrance and more." path="/collections" />
      <PageHeader eyebrow="Curated" title="Collections" text="Edited groups of products, chosen to work together.">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} />
      </PageHeader>
      <section className="section container">
        <ul className="collection-grid is-index">
          {collections.map((c) => (
            <li key={c.slug}>
              <Link to={`/collections/${c.slug}`} className="collection-tile">
                <SafeImg src={c.heroImage} alt={c.heroAlt} width={1600} height={1000} />
                <span className="collection-label"><strong>{c.name}</strong><small>{c.tagline}</small><em>{c.products.length} products</em></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function CollectionDetail() {
  const { slug } = useParams();
  const c = getCollection(slug);
  if (!c) return <NotFound />;
  const products = collectionProducts(c.slug);
  const related = collections.filter((x) => x.slug !== c.slug).slice(0, 3);
  return (
    <>
      <Seo title={c.name} description={`${c.tagline} ${c.description}`} path={`/collections/${c.slug}`} image={c.heroImage} />
      <section className="collection-hero">
        <SafeImg src={c.heroImage} alt={c.heroAlt} className="collection-hero-img" width={1600} height={1000} eager />
        <div className="container collection-hero-copy">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Collections', to: '/collections' }, { label: c.name }]} />
          <p className="eyebrow">Collection</p>
          <h1>{c.name}</h1>
          <p className="lede">{c.description}</p>
        </div>
      </section>
      <section className="container collection-story"><p>{c.story}</p></section>
      <ProductBrowser products={products} emptyHint="This collection has no products matching your filters." />
      <section className="section container" aria-labelledby="related-col">
        <SectionHeading id="related-col" eyebrow="Keep exploring" title="Related collections" />
        <ul className="collection-grid">
          {related.map((r) => (
            <li key={r.slug}>
              <Link to={`/collections/${r.slug}`} className="collection-tile">
                <SafeImg src={r.heroImage} alt={r.heroAlt} width={1600} height={1000} />
                <span className="collection-label"><strong>{r.name}</strong><small>{r.tagline}</small></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
