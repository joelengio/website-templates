import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { site } from '../config/site';
import { ctas, footerBlurb, footerGroups, navigation } from '../config/navigation';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';
import { LinkButton } from './ui';

function Header() {
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const open = openAt === pathname;
  const setOpen = useCallback((v: boolean | ((o: boolean) => boolean)) => setOpenAt((cur) => ((typeof v === 'function' ? v(cur === pathname) : v) ? pathname : null)), [pathname]);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current && toggleRef.current) {
        const links = [...panelRef.current.querySelectorAll<HTMLElement>('a[href],button')];
        const first = toggleRef.current;
        const last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="brand-link">
          <Logo />
        </Link>
        <nav className="nav-desktop" aria-label="Primary">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <LinkButton to={ctas.join.to} className="header-cta" arrow={false}>{ctas.join.label}</LinkButton>
          <button ref={toggleRef} type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
      <div id="mobile-menu" ref={panelRef} className="mobile-panel" hidden={!open}>
        <nav aria-label="Mobile">
          {[{ label: 'Home', to: '/' }, ...navigation].map((item, i) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `mobile-link ${isActive ? 'is-active' : ''}`}>
              <span className="mobile-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <LinkButton to={ctas.join.to} className="mobile-cta">{ctas.join.label}</LinkButton>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    </header>
  );
}

const socialIcon = (label: string): IconName | null => {
  const l = label.toLowerCase();
  return l.includes('instagram') ? 'instagram' : l.includes('facebook') ? 'facebook' : l.includes('youtube') ? 'youtube' : null;
};

function Footer() {
  const c = site.contact;
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-giant" aria-hidden="true">{site.brand.name}</p>
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>{footerBlurb}</p>
            {site.social.length > 0 && (
              <ul className="social" aria-label="Social media">
                {site.social.map((s) => {
                  const icon = socialIcon(s.label);
                  return (
                    <li key={s.label}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`}>
                        {icon ? <Icon name={icon} size={20} /> : s.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {footerGroups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="footer-title">{g.title}</h2>
              <ul>
                {g.links.map((l) => (
                  <li key={l.to + l.label}><Link to={l.to}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="footer-title">Visit</h2>
            <address>
              {c.addressLines.map((l) => <span key={l}>{l}<br /></span>)}
              <a href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}>{c.phone}</a><br />
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </address>
            <ul className="hours-mini">
              {site.hours.map((h) => <li key={h.days}><span>{h.days}</span> {h.hours}</li>)}
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <p>© {site.legal.year} {site.brand.name}. {site.legal.demoDisclaimer}</p>
          <p>{site.legal.healthDisclaimer}</p>
          {site.template.showCredit && (
            <p className="template-credit">
              {site.template.creditUrl ? <a href={site.template.creditUrl} target="_blank" rel="noopener noreferrer">{site.template.creditLabel}</a> : site.template.creditLabel}
              {' · '}{site.template.productName}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

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
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <RouteEffects />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
