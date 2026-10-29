import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { site } from '../config/site';
import type { Product } from '../config/types';
import { availability, defaultSelection, findVariant, galleryFor, getCategory, getProductBySlug, optionValueInStock, relatedProducts, stockMessage, type Selection } from '../lib/catalog';
import { maxQtyFor } from '../lib/pricing';
import { productJsonLd } from '../lib/seo';
import { addItem } from '../state/actions';
import { useRecentProducts } from '../state/hooks';
import { recordViewed } from '../state/stores';
import { useUI } from '../state/ui';
import { Gallery } from '../components/Gallery';
import { Icon } from '../components/Icon';
import { Price, ProductBadges, ProductGrid, WishlistButton } from '../components/ProductCard';
import { Seo } from '../components/Seo';
import { Breadcrumbs, QtyStepper, SectionHeading } from '../components/ui';
import NotFound from './NotFound';

function Options({ product, sel, onSelect }: { product: Product; sel: Selection; onSelect: (name: string, value: string) => void }) {
  return (
    <div className="options">
      {product.options.map((o) => (
        <fieldset key={o.name} className="option">
          <legend>{o.name}: <strong>{sel[o.name]}</strong></legend>
          <div className={`option-values${o.type === 'color' ? ' is-color' : ''}`} role="radiogroup" aria-label={o.name}>
            {o.values.map((v) => {
              const inStock = optionValueInStock(product, sel, o.name, v.value);
              const checked = sel[o.name] === v.value;
              return (
                <label key={v.value} className={`opt${checked ? ' is-checked' : ''}${inStock ? '' : ' is-soldout'}${o.type === 'color' ? ' opt-color' : ''}`}>
                  <input type="radio" name={`opt-${o.name}`} value={v.value} checked={checked} onChange={() => onSelect(o.name, v.value)} aria-label={`${o.name} ${v.value}${inStock ? '' : ' (unavailable in this combination)'}`} />
                  {o.type === 'color' ? <span className="swatch" style={{ background: v.swatch }} aria-hidden="true" /> : <span>{v.value}</span>}
                  {o.type === 'color' && <span className="opt-name">{v.value}</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function ProductView({ product }: { product: Product }) {
  const { setCartOpen, announce } = useUI();
  const [sel, setSel] = useState<Selection>(() => defaultSelection(product));
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const variant = findVariant(product, sel);
  const gallery = galleryFor(product, sel);
  const av = availability(product);
  const max = maxQtyFor(variant);
  const canBuy = product.status === 'active' && Boolean(variant) && (variant?.stock ?? 0) > 0;
  const category = getCategory(product.category);
  const related = relatedProducts(product);
  const recent = useRecentProducts(product.id);

  useEffect(() => { recordViewed(product.id); }, [product.id]);

  const select = (name: string, value: string) => {
    const next = { ...sel, [name]: value };
    setSel(next); setError('');
    const v = findVariant(product, next);
    setQty((q) => Math.max(1, Math.min(q, maxQtyFor(v) || 1)));
  };
  const add = () => {
    if (!variant) { setError('Select all options before adding to your bag.'); return; }
    const res = addItem(product.id, variant.id, qty);
    if (!res.ok) { setError(res.message); announce(res.message); return; }
    setError(''); announce(res.message); setCartOpen(true);
  };
  const buttonLabel = product.status === 'coming-soon' ? site.labels.comingSoon : !variant ? 'Select options' : variant.stock <= 0 ? site.labels.soldOut : site.labels.addToCart;

  return (
    <>
      <Seo title={product.name} description={`${product.tagline} ${product.description}`.slice(0, 300)} path={`/products/${product.slug}`} image={gallery[0]?.src} type="product" jsonLd={productJsonLd(product)} />
      <div className="container product-page">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, ...(category ? [{ label: category.name, to: `/shop?category=${category.id}` }] : []), { label: product.name }]} />
        <div className="product-layout">
          <Gallery images={gallery} name={product.name} />
          <div className="product-info">
            <ProductBadges product={product} />
            <h1>{product.name}</h1>
            <p className="product-tagline">{product.tagline}</p>
            <Price product={product} variantPrice={variant} className="price-lg" />
            <p className="sku">SKU {variant?.sku ?? product.sku}</p>
            <p className="product-desc">{product.description}</p>

            <form onSubmit={(e) => { e.preventDefault(); add(); }} noValidate aria-label={`Purchase options for ${product.name}`}>
              {product.options.length > 0 && <Options product={product} sel={sel} onSelect={select} />}
              <p className={`stock-msg is-${variant ? (variant.stock <= 0 ? 'out' : variant.stock <= 5 ? 'low' : 'in') : 'none'}`} role="status">
                <Icon name={variant && variant.stock > 0 ? 'check' : 'info'} size={16} /> {stockMessage(product, variant)}
              </p>
              <div className="buy-row">
                <QtyStepper value={qty} max={Math.max(1, max)} onChange={(n) => setQty(Math.max(1, Math.min(n, Math.max(1, max))))} label={product.name} disabled={!canBuy} />
                <button type="submit" className="btn btn-lg" disabled={!canBuy} aria-disabled={!canBuy}>{buttonLabel}</button>
              </div>
              {error && <p className="field-error" role="alert"><Icon name="alert" size={14} /> {error}</p>}
              <WishlistButton product={product} showLabel className="wish-text" />
            </form>

            <ul className="assurances">
              <li><Icon name="truck" size={18} /> {site.productPage.shipping}</li>
              <li><Icon name="package" size={18} /> {site.productPage.returns}</li>
            </ul>

            <div className="accordion">
              <details open>
                <summary>Features</summary>
                <ul className="ticks">{product.features.map((f) => <li key={f}>{f}</li>)}</ul>
              </details>
              <details>
                <summary>Materials & details</summary>
                <dl className="spec-list">{product.details.map((d) => <div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>)}</dl>
              </details>
              <details>
                <summary>Shipping & returns</summary>
                <p>{product.shippingNote ?? site.productPage.shipping}</p>
                <p>{site.productPage.returns}</p>
                <p><Link to="/faq#shipping">Read the full shipping information</Link></p>
              </details>
            </div>
            {av === 'coming-soon' && <p className="fine">This product is shown to demonstrate the “coming soon” status. It cannot be added to the bag.</p>}
          </div>
        </div>

        <section className="section" aria-labelledby="related-title">
          <SectionHeading id="related-title" eyebrow="You may also like" title="Related products" />
          <ProductGrid products={related} />
        </section>
        {recent.length > 0 && (
          <section className="section" aria-labelledby="recent-title">
            <SectionHeading id="recent-title" eyebrow="Pick up where you left off" title="Recently viewed" />
            <ProductGrid products={recent} />
          </section>
        )}
      </div>
    </>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  if (!product) return <NotFound />;
  return <ProductView key={product.slug} product={product} />;
}
