import { Link } from 'react-router-dom';
import type { Product } from '../config/types';
import { site } from '../config/site';
import { availability, galleryFor, defaultSelection, salePercent, isOnSale } from '../lib/catalog';
import { formatMoney } from '../lib/money';
import { toggleWishlist } from '../state/stores';
import { useWishlistIds } from '../state/hooks';
import { useUI } from '../state/ui';
import { Icon } from './Icon';
import { SafeImg } from './ui';

export function Price({ product, variantPrice, className = '' }: { product: Pick<Product, 'priceMinor' | 'compareAtMinor' | 'minPriceMinor' | 'maxPriceMinor' | 'currency'>; variantPrice?: { priceMinor: number; compareAtMinor?: number }; className?: string }) {
  const price = variantPrice ?? product;
  const compare = variantPrice ? variantPrice.compareAtMinor : product.compareAtMinor;
  const from = !variantPrice && product.minPriceMinor !== product.maxPriceMinor;
  const shown = variantPrice ? price.priceMinor : product.minPriceMinor;
  return (
    <p className={`price ${className}`}>
      {from && <span className="price-from">From </span>}
      <span className={compare ? 'price-now is-sale' : 'price-now'}>{formatMoney(shown, { currency: product.currency, compact: true })}</span>
      {compare && (
        <>
          <s className="price-was"><span className="sr-only">Was </span>{formatMoney(compare, { currency: product.currency, compact: true })}</s>
          <span className="sr-only"> (on sale)</span>
        </>
      )}
    </p>
  );
}

export function WishlistButton({ product, className = '', showLabel }: { product: Product; className?: string; showLabel?: boolean }) {
  const ids = useWishlistIds();
  const { announce } = useUI();
  const on = ids.includes(product.id);
  return (
    <button
      type="button" className={`wish-btn${on ? ' is-on' : ''} ${className}`} aria-pressed={on}
      aria-label={showLabel ? undefined : on ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      onClick={() => announce(toggleWishlist(product.id) ? `${product.name} added to your wishlist.` : `${product.name} removed from your wishlist.`)}
    >
      <Icon name="heart" size={showLabel ? 18 : 20} fill={on ? 'currentColor' : 'none'} />
      {showLabel && <span>{on ? 'Saved to wishlist' : 'Add to wishlist'}</span>}
    </button>
  );
}

export function ProductBadges({ product }: { product: Product }) {
  const av = availability(product);
  const sale = product.compareAtMinor ? salePercent(product) : 0;
  return (
    <div className="badges">
      {av === 'coming-soon' && <span className="badge">{site.labels.comingSoon}</span>}
      {av === 'sold-out' && <span className="badge is-muted">{site.labels.soldOut}</span>}
      {av !== 'sold-out' && av !== 'coming-soon' && product.isNew && <span className="badge is-new">New</span>}
      {av !== 'sold-out' && av !== 'coming-soon' && isOnSale(product) && <span className="badge is-sale">{sale ? `−${sale}%` : 'Sale'}</span>}
      {av === 'low-stock' && <span className="badge">Low stock</span>}
    </div>
  );
}

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const sel = defaultSelection(product);
  const imgs = galleryFor(product, sel);
  const colors = product.options.find((o) => o.type === 'color');
  const unavailable = availability(product) === 'sold-out' || availability(product) === 'coming-soon';
  return (
    <article className={`card${unavailable ? ' is-unavailable' : ''}`}>
      <div className="card-media">
        <Link to={`/products/${product.slug}`} className="card-image-link" tabIndex={-1} aria-hidden="true">
          <SafeImg src={imgs[0]?.src ?? ''} alt="" className="card-img" width={800} height={1000} eager={priority} sizes="(min-width: 1024px) 25vw, 50vw" />
          {imgs[1] && <SafeImg src={imgs[1].src} alt="" className="card-img card-img-alt" width={800} height={1000} sizes="(min-width: 1024px) 25vw, 50vw" />}
        </Link>
        <ProductBadges product={product} />
        <WishlistButton product={product} className="card-wish" />
      </div>
      <div className="card-body">
        <h3 className="card-title"><Link to={`/products/${product.slug}`}>{product.name}</Link></h3>
        <Price product={product} />
        {colors && colors.values.length > 1 && (
          <ul className="swatches" aria-label={`${colors.values.length} ${colors.name.toLowerCase()} options`}>
            {colors.values.slice(0, 5).map((v) => <li key={v.value} style={{ background: v.swatch }} title={v.value} />)}
            {colors.values.length > 5 && <li className="swatch-more">+{colors.values.length - 5}</li>}
          </ul>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <ul className="product-grid">
      {products.map((p, i) => <li key={p.id}><ProductCard product={p} priority={i < priorityCount} /></li>)}
    </ul>
  );
}
