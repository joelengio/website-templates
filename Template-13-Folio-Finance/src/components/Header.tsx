import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { headerCta, mainNav } from '../config/navigation';
import { pages } from '../config/layout';
import { useDialog } from '../hooks/useDialog';
import { Icon } from './Icon';
import { LinkButton } from './Button';
import { Logo } from './Logo';

const enabled = (to: string) => {
  const map: Record<string, keyof typeof pages> = {
    '/services': 'services', '/industries': 'industries', '/about': 'about', '/team': 'team', '/pricing': 'pricing',
    '/tools': 'tools', '/insights': 'insights', '/book': 'booking', '/contact': 'contact', '/disclaimer': 'disclaimer',
  };
  const key = map[to];
  return key ? pages[key] : true;
};

export function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const nav = mainNav.filter((n) => enabled(n.to));

  useEffect(() => setOpen(false), [location.pathname]);
  useDialog(open, () => setOpen(false), panelRef);

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link to="/" className="site-header__brand">
          <Logo />
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <ul>
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          {enabled(headerCta.to) && (
            <LinkButton to={headerCta.to} variant="primary" className="site-header__cta">
              {headerCta.label}
            </LinkButton>
          )}
          <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? 'close' : 'menu'} size={22} />
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-menu" ref={panelRef} role="dialog" aria-modal="true" aria-label="Site menu">
          <nav aria-label="Mobile">
            <ul>
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} className={({ isActive }) => `mobile-menu__link${isActive ? ' is-active' : ''}`}>
                    {n.label}
                    <Icon name="chevron" size={18} />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          {enabled(headerCta.to) && (
            <LinkButton to={headerCta.to} variant="primary" className="mobile-menu__cta">
              {headerCta.label}
            </LinkButton>
          )}
          <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>
            Close menu
          </button>
        </div>
      )}
    </header>
  );
}
