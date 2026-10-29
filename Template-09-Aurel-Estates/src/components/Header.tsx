import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { headerCta, mainNav } from '../config/navigation';
import { pages } from '../config/layout';
import { site } from '../config/site';
import { useShortlist } from '../hooks/useShortlist';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Modal } from './Modal';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = useShortlist();
  const location = useLocation();
  const items = mainNav.filter((i) => pages[i.page]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Logo />
        <nav className="site-nav" aria-label="Primary">
          <ul>
            {items.map((i) => (
              <li key={i.to}>
                <NavLink to={i.to} end={i.to === '/'}>
                  {i.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          {pages.properties && (
            <Link to="/favorites" className="icon-link" aria-label={`Saved homes (${favorites.length})`}>
              <Icon name="heart" />
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </Link>
          )}
          {pages[headerCta.page] && (
            <Link to={headerCta.to} className="btn btn--brass site-header__cta">
              {headerCta.label}
            </Link>
          )}
          <button type="button" className="icon-link menu-toggle" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>
      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} label="Site menu" side="right" className="menu-panel">
        <div className="menu-panel__head">
          <span className="menu-panel__title">{site.brand.name}</span>
          <button type="button" className="icon-link" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <Icon name="close" size={24} />
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className="menu-panel__list">
            {items.map((i) => (
              <li key={i.to}>
                <NavLink to={i.to} end={i.to === '/'} onClick={() => setMenuOpen(false)}>
                  {i.label}
                </NavLink>
              </li>
            ))}
            {pages.properties && (
              <li>
                <NavLink to="/favorites" onClick={() => setMenuOpen(false)}>
                  Saved homes {favorites.length > 0 && <span className="badge badge--inline">{favorites.length}</span>}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        {pages[headerCta.page] && (
          <Link to={headerCta.to} className="btn btn--brass menu-panel__cta" onClick={() => setMenuOpen(false)}>
            {headerCta.label}
          </Link>
        )}
      </Modal>
    </header>
  );
}
