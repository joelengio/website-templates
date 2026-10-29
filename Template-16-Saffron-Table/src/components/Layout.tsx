import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { features } from '../config/features';
import { site } from '../config/site';
import { useDialog } from '../hooks/useDialog';
import { calculateOrder } from '../lib/order';
import { orderSettings } from '../config/features';
import { menuItems } from '../config/menu';
import { useOrderLines } from '../lib/orderStore';
import { ButtonLink } from './Button';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';

function useOrderCount(): number {
  const lines = useOrderLines();
  return calculateOrder(lines, menuItems, orderSettings).itemCount;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const count = useOrderCount();
  useDialog(panelRef, { active: open, onClose: () => setOpen(false), modal: false });

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  const nav = site.nav.filter((n) => (n.to === '/gallery' ? features.gallery : n.to === '/journal' ? features.journal : n.to === '/private-dining' ? features.privateDining : true));

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="container site-header__bar">
        <Logo onClick={() => setOpen(false)} />
        <nav className="site-nav" aria-label="Primary">
          <ul>
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          {features.orderBuilder && (
            <Link to="/order" className="icon-btn order-link" aria-label={`Order builder, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <Icon name="bag" />
              {count > 0 && <span className="badge-count" aria-hidden="true">{count}</span>}
            </Link>
          )}
          {features.reservations && (
            <ButtonLink to={site.headerCta.to} size="sm" className="header-cta">
              {site.headerCta.label}
            </ButtonLink>
          )}
          <button ref={toggleRef} type="button" className="icon-btn nav-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
      <div id="mobile-nav" ref={panelRef} className="mobile-nav" hidden={!open} role="dialog" aria-modal="false" aria-label="Site menu">
        <nav aria-label="Mobile">
          <ul>
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to}>{n.label}</NavLink>
              </li>
            ))}
            {features.orderBuilder && (
              <li>
                <NavLink to="/order">Order builder (demo)</NavLink>
              </li>
            )}
          </ul>
        </nav>
        {features.reservations && (
          <ButtonLink to={site.headerCta.to} size="lg">
            Reserve a table
          </ButtonLink>
        )}
      </div>
    </header>
  );
}

const socialIcon: Record<string, IconName> = { Instagram: 'instagram', Facebook: 'facebook', Pinterest: 'pinterest' };

function Footer() {
  const { contact } = site;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Logo />
            <p>{site.brand.cuisine}</p>
            <address>
              <p>
                {contact.address.line1}, {contact.address.line2}
                <br />
                {contact.address.city}, {contact.address.region} {contact.address.postcode}
              </p>
              <p>
                <a href={contact.phoneHref}>{contact.phone}</a>
                <br />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            </address>
            <ul className="social" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`}>
                    <Icon name={socialIcon[s.label] ?? 'external'} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {site.footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="footer-title">{col.title}</h2>
              <ul>
                {col.links
                  .filter((l) => (l.to === '/order' ? features.orderBuilder : true))
                  .map((l) => (
                    <li key={l.to}>
                      <Link to={l.to}>{l.label}</Link>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="footer-title">Hours</h2>
            <ul className="hours-list">
              {site.hoursDisplay.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="site-footer__legal">
          <p>{site.footer.legal}</p>
          <p>
            © {new Date().getFullYear()} {site.brand.name}.
            {site.publisher.showCredit && (
              <>
                {' '}
                Template by{' '}
                <a href={site.publisher.url} target="_blank" rel="noopener noreferrer">
                  {site.publisher.name}
                </a>{' '}
                · {site.publisher.label}.
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Scrolls to top / hash on navigation and moves focus to the main region for screen-reader users. */
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <RouteEffects />
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
