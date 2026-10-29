import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { headerCta, navigation } from '../config/navigation';
import { pages } from '../config/layout';
import { site } from '../config/site';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Modal } from './Modal';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const items = navigation.filter((i) => pages[i.page]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Logo />
        <nav className="site-nav" aria-label="Primary">
          <ul>
            {items.map((i) => (
              <li key={i.to}>
                <NavLink to={i.to}>{i.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          {pages[headerCta.page] && (
            <Link to={headerCta.to} className="btn btn--ink btn--sm site-header__cta">
              {headerCta.label}
            </Link>
          )}
          <button type="button" className="icon-btn menu-toggle" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} label="Site menu" side="right" className="menu-panel">
        <div className="menu-panel__head">
          <span className="menu-panel__title">{site.name}</span>
          <button type="button" className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
            <Icon name="x" size={24} />
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className="menu-panel__list">
            {pages.home && (
              <li>
                <NavLink to="/" end>
                  Home
                </NavLink>
              </li>
            )}
            {items.map((i) => (
              <li key={i.to}>
                <NavLink to={i.to}>{i.label}</NavLink>
              </li>
            ))}
            {pages.contact && (
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
            )}
          </ul>
        </nav>
        {pages[headerCta.page] && (
          <Link to={headerCta.to} className="btn btn--primary menu-panel__cta">
            {headerCta.label}
          </Link>
        )}
        <p className="menu-panel__note">Demo only: no accounts, no payments.</p>
      </Modal>
    </header>
  );
}
