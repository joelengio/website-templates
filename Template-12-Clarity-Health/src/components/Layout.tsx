import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { site } from '../config/site';
import { ctas, footerBlurb, footerGroups, navigation } from '../config/navigation';
import { Icon } from './Icon';
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
        const inside = [...panelRef.current.querySelectorAll<HTMLElement>('a[href],button')];
        const ring = [toggleRef.current, ...inside];
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
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
        <Link to="/" className="brand-link" aria-label={`${site.brand.name} — home`}>
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
          <LinkButton to={ctas.book.to} className="header-cta" icon="calendar" size="sm">{ctas.bookShort.label}</LinkButton>
          <button ref={toggleRef} type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
      <div id="mobile-menu" ref={panelRef} className="mobile-panel" hidden={!open}>
        <nav aria-label="Mobile">
          {[{ label: 'Home', to: '/' }, ...navigation].map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `mobile-link ${isActive ? 'is-active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <LinkButton to={ctas.book.to} className="mobile-cta" icon="calendar">{ctas.book.label}</LinkButton>
        <Link to={ctas.manage.to} className="mobile-manage">{ctas.manage.label}</Link>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    </header>
  );
}

function Footer() {
  const c = site.contact;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>{footerBlurb}</p>
          <p className="footer-emergency"><Icon name="alert" size={18} /> {site.notices.emergency}</p>
        </div>
        {footerGroups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="footer-title">{g.title}</h2>
            <ul>
              {g.links.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className="footer-title">Visit (fictional)</h2>
          <address>
            {c.addressLines.map((l) => <span key={l}>{l}<br /></span>)}
            <a href={`tel:${c.phoneHref}`}>{c.phone}</a><br />
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </address>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {site.brand.name}. {site.publisher.notice} {site.notices.medical}</p>
        <p>{site.publisher.templateCredit}</p>
      </div>
    </footer>
  );
}

export function Layout() {
  const { pathname, hash } = useLocation();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (!hash) return;
    }
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="demo-bar" role="region" aria-label="Demonstration and emergency notice">
        <p><strong>Demo:</strong> {site.notices.demoBar}</p>
        <p className="demo-bar-emergency"><Icon name="alert" size={16} /> {site.notices.emergency}</p>
      </div>
      <Header />
      <main id="main" tabIndex={-1} className="page" key={pathname}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
