import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { footerColumns, primaryNav } from '../config/navigation';
import { site } from '../config/site';
import { formatMoney } from '../lib/money';
import { freeShippingThresholdMinor } from '../lib/pricing';
import { useCartState, useWishlistIds } from '../state/hooks';
import { useUI } from '../state/ui';
import { CartDrawer } from './CartDrawer';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { SearchOverlay } from './SearchOverlay';
import { SafeImg } from './ui';
import { useDialog } from './useDialog';
import type { NavItem } from '../config/types';

function Announcement() {
  if (!site.announcement.enabled) return null;
  const threshold = freeShippingThresholdMinor();
  const text = site.announcement.text.replace('{freeShipping}', threshold !== undefined ? formatMoney(threshold, { compact: true }) : '');
  return (
    <div className="announce-bar">
      <div className="container">
        <p>{text} <Link to={site.announcement.linkHref}>{site.announcement.linkLabel}</Link></p>
      </div>
    </div>
  );
}

function MegaItem({ item, open, onOpen, onClose }: { item: NavItem; open: boolean; onOpen: () => void; onClose: () => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const id = `mega-${item.label.toLowerCase().replace(/\W+/g, '-')}`;
  const mega = item.mega!;
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);
  return (
    <li
      ref={ref} className={`nav-item has-mega${open ? ' is-open' : ''}`}
      onMouseEnter={() => { window.clearTimeout(timer.current); onOpen(); }}
      onMouseLeave={() => { timer.current = window.setTimeout(onClose, 140); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onClose(); }}
    >
      <NavLink to={item.href} end={item.href === '/'} className="nav-link" onClick={onClose}>{item.label}</NavLink>
      <button type="button" className="nav-caret" aria-expanded={open} aria-controls={id} aria-label={`${item.label} menu`} onClick={() => (open ? onClose() : onOpen())}>
        <Icon name="chevronDown" size={14} />
      </button>
      <div id={id} className="mega" hidden={!open}>
        <div className="mega-inner container">
          <div className="mega-cols">
            {mega.columns.map((c) => (
              <div key={c.title}>
                <p className="mega-title">{c.title}</p>
                <ul>{c.links.map((l) => <li key={l.href}><Link to={l.href} onClick={onClose}>{l.label}</Link></li>)}</ul>
              </div>
            ))}
          </div>
          {mega.feature && (
            <Link to={mega.feature.href} className="mega-feature" onClick={onClose}>
              <SafeImg src={mega.feature.image} alt={mega.feature.alt} width={400} height={250} />
              <span className="mega-feature-text"><strong>{mega.feature.title}</strong><span>{mega.feature.text}</span><em>{mega.feature.cta} →</em></span>
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUI();
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const close = () => setMenuOpen(false);
  useDialog(menuOpen, close, ref);
  if (!menuOpen) return null;
  return (
    <div className="drawer-root" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={ref} className="drawer drawer-left" role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1}>
        <div className="drawer-head">
          <Logo />
          <button type="button" className="icon-btn" onClick={close} aria-label="Close menu" data-autofocus><Icon name="close" /></button>
        </div>
        <nav aria-label="Mobile" className="drawer-body mobile-nav">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.label}>
                {item.mega ? (
                  <>
                    <button type="button" className="mobile-acc" aria-expanded={expanded === item.label} onClick={() => setExpanded(expanded === item.label ? null : item.label)}>{item.label}<Icon name="chevronDown" size={18} /></button>
                    {expanded === item.label && (
                      <div className="mobile-sub">
                        <Link to={item.href} onClick={close}>All {item.label.toLowerCase()}</Link>
                        {item.mega.columns.map((c) => (
                          <div key={c.title}>
                            <p className="mega-title">{c.title}</p>
                            <ul>{c.links.map((l) => <li key={l.href}><Link to={l.href} onClick={close}>{l.label}</Link></li>)}</ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : <Link to={item.href} className="mobile-link" onClick={close}>{item.label}</Link>}
              </li>
            ))}
            <li><Link to="/wishlist" className="mobile-link" onClick={close}>Wishlist</Link></li>
            <li><Link to="/orders" className="mobile-link" onClick={close}>Order history (demo)</Link></li>
            <li><Link to="/faq" className="mobile-link" onClick={close}>Help & FAQ</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

function Header() {
  const { setCartOpen, setSearchOpen, setMenuOpen } = useUI();
  const cart = useCartState();
  const wish = useWishlistIds();
  const count = cart.lines.reduce((n, l) => n + l.qty, 0);
  const location = useLocation();
  // the open menu is tied to the path it was opened on, so navigating closes it without an effect
  const [mega, setMega] = useState<{ label: string; path: string } | null>(null);
  const openMega = mega && mega.path === location.pathname ? mega.label : null;
  const setOpenMega = (update: string | null | ((c: string | null) => string | null)) =>
    setMega((cur) => { const curLabel = cur && cur.path === location.pathname ? cur.label : null; const next = typeof update === 'function' ? update(curLabel) : update; return next ? { label: next, path: location.pathname } : null; });
  return (
    <>
      <aside aria-label="Store notices">
        <div className="demo-band"><div className="container"><strong>DEMO</strong> {site.demo.banner}</div></div>
        <Announcement />
      </aside>
      <header className="site-header">
      <div className="header-main container">
        <button type="button" className="icon-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
        <Logo />
        <nav aria-label="Primary" className="primary-nav">
          <ul>
            {primaryNav.map((item) =>
              item.mega ? (
                <MegaItem key={item.label} item={item} open={openMega === item.label} onOpen={() => setOpenMega(item.label)} onClose={() => setOpenMega((c) => (c === item.label ? null : c))} />
              ) : (
                <li key={item.label} className="nav-item"><NavLink to={item.href} className="nav-link">{item.label}</NavLink></li>
              )
            )}
          </ul>
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search"><Icon name="search" /></button>
          <Link to="/wishlist" className="icon-btn has-count" aria-label={`Wishlist, ${wish.length} ${wish.length === 1 ? 'item' : 'items'}`}>
            <Icon name="heart" />{wish.length > 0 && <span className="count-dot" aria-hidden="true">{wish.length}</span>}
          </Link>
          <button type="button" className="icon-btn has-count" onClick={() => setCartOpen(true)} aria-label={`${site.labels.cart}, ${count} ${count === 1 ? 'item' : 'items'}`} aria-haspopup="dialog">
            <Icon name="bag" />{count > 0 && <span className="count-dot" aria-hidden="true">{count}</span>}
          </button>
        </div>
      </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>{site.brand.tagline}.</p>
          <address>
            {site.contact.address.map((l) => <span key={l}>{l}<br /></span>)}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a><br />
            <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, '')}`}>{site.contact.phone}</a>
          </address>
          <ul className="social" aria-label="Social media">
            {site.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}
          </ul>
        </div>
        {footerColumns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="footer-title">{c.title}</p>
            <ul>{c.links.map((l) => <li key={l.href}><Link to={l.href}>{l.label}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="footer-base">
        <div className="container">
          <p>© {new Date().getFullYear()} {site.brand.name} — a fictional demonstration business. Products, prices and stories are invented.</p>
          <p>{site.publisher.credit}. Checkout is a demonstration: no payments are taken and no orders are placed.</p>
        </div>
      </div>
    </footer>
  );
}

/** Scroll to top / hash target on navigation and move focus to the main region for keyboard and screen-reader users. */
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
    if (first.current) { first.current = false; return; }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  const { toast } = useUI();
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}><Outlet /></main>
      <Footer />
      <CartDrawer />
      <MobileMenu />
      <SearchOverlay />
      <RouteEffects />
      <div className={`toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite" aria-atomic="true">{toast}</div>
    </>
  );
}
