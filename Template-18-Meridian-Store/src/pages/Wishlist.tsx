import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../config/types';
import { availability, defaultSelection, findVariant, galleryFor, getProductById, variantAvailability } from '../lib/catalog';
import { addItem } from '../state/actions';
import { useWishlistIds } from '../state/hooks';
import { toggleWishlist } from '../state/stores';
import { useUI } from '../state/ui';
import { Price, ProductBadges } from '../components/ProductCard';
import { Seo } from '../components/Seo';
import { Breadcrumbs, EmptyState, PageHeader, SafeImg } from '../components/ui';
import { Icon } from '../components/Icon';

function WishlistItem({ product }: { product: Product }) {
  const { announce, setCartOpen } = useUI();
  const buyable = product.variants.filter((v) => v.stock > 0);
  const [variantId, setVariantId] = useState(() => findVariant(product, defaultSelection(product))?.id ?? product.variants[0].id);
  const [error, setError] = useState('');
  const img = galleryFor(product, product.variants.find((v) => v.id === variantId)?.options ?? {})[0];
  const canBuy = product.status === 'active' && buyable.length > 0;
  const move = () => {
    const res = addItem(product.id, variantId, 1);
    if (!res.ok) { setError(res.message); announce(res.message); return; }
    toggleWishlist(product.id);
    announce(`${product.name} moved to your bag.`);
    setCartOpen(true);
  };
  return (
    <li className="wish-item">
      <Link to={`/products/${product.slug}`} className="wish-img" tabIndex={-1} aria-hidden="true"><SafeImg src={img?.src ?? ''} alt="" width={400} height={500} /></Link>
      <div className="wish-body">
        <ProductBadges product={product} />
        <h2 className="h4"><Link to={`/products/${product.slug}`}>{product.name}</Link></h2>
        <Price product={product} />
        {canBuy && product.options.length > 0 && (
          <div className="field">
            <label htmlFor={`wv-${product.id}`}>Choose option</label>
            <select id={`wv-${product.id}`} value={variantId} onChange={(e) => { setVariantId(e.target.value); setError(''); }}>
              {product.variants.map((v) => <option key={v.id} value={v.id} disabled={v.stock <= 0}>{v.label}{variantAvailability(product, v) === 'sold-out' ? ' — sold out' : ''}</option>)}
            </select>
          </div>
        )}
        {!canBuy && <p className="muted">{availability(product) === 'coming-soon' ? 'Coming soon' : 'Currently sold out'}</p>}
        {error && <p className="field-error" role="alert">{error}</p>}
        <div className="wish-actions">
          <button type="button" className="btn btn-sm" disabled={!canBuy} onClick={move}>Move to bag</button>
          <button type="button" className="text-btn" onClick={() => { toggleWishlist(product.id); announce(`${product.name} removed from your wishlist.`); }} aria-label={`Remove ${product.name} from wishlist`}><Icon name="trash" size={16} /> Remove</button>
        </div>
      </div>
    </li>
  );
}

export default function Wishlist() {
  const ids = useWishlistIds();
  const products = ids.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p));
  return (
    <>
      <Seo title="Wishlist" path="/wishlist" noindex />
      <PageHeader eyebrow="Saved for later" title={products.length ? `Wishlist (${products.length})` : 'Wishlist'} text="Your wishlist is saved in this browser only.">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      </PageHeader>
      <div className="container section-tight">
        {products.length === 0 ? (
          <EmptyState icon="heart" title="Your wishlist is empty" text="Tap the heart on any product to save it here for later." actions={<Link to="/shop" className="btn">Discover products</Link>} />
        ) : <ul className="wish-list">{products.map((p) => <WishlistItem key={p.id} product={p} />)}</ul>}
      </div>
    </>
  );
}
