import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { emptyFilters, filterProducts, getProducts } from '../lib/catalog';
import { formatMoney } from '../lib/money';
import { useUI } from '../state/ui';
import { Icon } from './Icon';
import { SafeImg } from './ui';
import { useDialog } from './useDialog';
import { galleryFor, defaultSelection } from '../lib/catalog';

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI();
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const close = () => { setSearchOpen(false); setQ(''); };
  useDialog(searchOpen, close, ref);
  const results = useMemo(() => (q.trim() ? filterProducts(getProducts(), { ...emptyFilters(), q }).slice(0, 5) : []), [q]);
  if (!searchOpen) return null;
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (q.trim()) { navigate(`/shop?q=${encodeURIComponent(q.trim())}`); close(); } };
  return (
    <div className="search-root" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={ref} className="search-panel" role="dialog" aria-modal="true" aria-label="Search the store" tabIndex={-1}>
        <form onSubmit={submit} role="search" className="search-form">
          <Icon name="search" />
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input id="site-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bags, linen, vases…" autoComplete="off" data-autofocus />
          <button type="submit" className="btn btn-sm">Search</button>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close search"><Icon name="close" /></button>
        </form>
        <div className="search-results" aria-live="polite">
          {q.trim() && results.length === 0 && <p className="muted">No products match “{q.trim()}”. Try a different word or <Link to="/shop" onClick={close}>browse everything</Link>.</p>}
          {results.length > 0 && (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link to={`/products/${p.slug}`} onClick={close}>
                    <SafeImg src={galleryFor(p, defaultSelection(p))[0]?.src ?? ''} alt="" width={56} height={70} />
                    <span className="sr-name">{p.name}</span>
                    <span className="sr-price">{formatMoney(p.minPriceMinor, { currency: p.currency, compact: true })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {results.length > 0 && <button type="button" className="text-btn" onClick={() => { navigate(`/shop?q=${encodeURIComponent(q.trim())}`); close(); }}>See all results for “{q.trim()}”</button>}
          {!q.trim() && <p className="muted">Popular: <Link to="/shop?q=linen" onClick={close}>linen</Link>, <Link to="/shop?q=leather" onClick={close}>leather</Link>, <Link to="/shop?q=stoneware" onClick={close}>stoneware</Link>, <Link to="/shop?q=candle" onClick={close}>candle</Link></p>}
        </div>
      </div>
    </div>
  );
}
