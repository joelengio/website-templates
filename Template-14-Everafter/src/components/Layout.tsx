import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { site } from '../config/site';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { NewsletterForm } from './NewsletterForm';

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export function Layout() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  // The menu is tied to the path it was opened on, so navigating always closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenAt((cur) => ((typeof v === 'function' ? v(cur === pathname) : v) ? pathname : null));
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  const overHero = pathname === '/' && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // New page: reset scroll, close menu, move focus to <main> so keyboard and screen-reader users start at the content.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (first.current) {
      first.current = false;
      return;
    }
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.current?.querySelector<HTMLElement>('a')?.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    toggle.current?.focus();
  };

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') return closeMenu();
    if (e.key !== 'Tab') return;
    const items = Array.from(menu.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const all = [toggle.current!, ...items];
    const idx = all.indexOf(document.activeElement as HTMLElement);
    if (e.shiftKey && idx <= 0) {
      e.preventDefault();
      all[all.length - 1].focus();
    } else if (!e.shiftKey && idx === all.length - 1) {
      e.preventDefault();
      all[0].focus();
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header${overHero ? ' is-over-hero' : ''}${scrolled ? ' is-scrolled' : ''}${open ? ' is-menu-open' : ''}`} onKeyDown={open ? onMenuKey : undefined}>
        <div className="container site-header__inner">
          <Link to="/" className="site-header__brand">
            <Logo />
          </Link>
          <nav className="site-nav" aria-label="Primary">
            <ul>
              {site.nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to}>{n.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Link to={site.headerCta.to} className="btn btn--outline btn--sm site-header__cta">
            <span>{site.headerCta.label}</span>
          </Link>
          <button type="button" ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? 'close' : 'menu'} size={26} />
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
        <div id="mobile-menu" ref={menu} className="mobile-menu" hidden={!open} role="dialog" aria-label="Site menu">
          <nav aria-label="Mobile">
            <ul>
              {site.nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to}>{n.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Link to={site.headerCta.to} className="btn btn--primary"><span>{site.headerCta.label}</span></Link>
          <p className="mobile-menu__contact">
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
          </p>
        </div>
      </header>

      <main id="main" ref={main} tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__top">
            <div className="site-footer__brand">
              <Logo />
              <p>{site.footer.blurb}</p>
              {site.newsletter.enabled && <NewsletterForm />}
            </div>
            <div className="site-footer__cols">
              {site.footer.columns.map((col) => (
                <nav key={col.title} aria-label={col.title}>
                  <h2 className="site-footer__title">{col.title}</h2>
                  <ul>
                    {col.links.map((l) => (
                      <li key={l.to + l.label}><Link to={l.to}>{l.label}</Link></li>
                    ))}
                  </ul>
                </nav>
              ))}
              <div>
                <h2 className="site-footer__title">Studio</h2>
                <address>
                  {site.contact.office.lines.map((l) => (<span key={l}>{l}</span>))}
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                  <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
                </address>
                <ul className="site-footer__social" aria-label="Social media">
                  {site.social.map((s) => (
                    <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="site-footer__bottom">
            <p>{site.footer.copyright}</p>
            <p className="site-footer__demo">Demonstration website — fictional studio, projects and prices. Enquiries are not sent to anyone.</p>
            {site.publisher.show && (
              <p className="site-footer__publisher">
                {site.publisher.note} <span>© {new Date().getFullYear()} {site.publisher.name}.</span>
              </p>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
