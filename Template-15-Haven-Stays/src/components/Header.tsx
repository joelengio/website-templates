import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navigation, pages } from '../config/layout';
import { LinkButton } from './Button';
import Icon from './Icon';
import Logo from './Logo';

export default function Header({ transparentTop }: { transparentTop: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Mobile drawer: lock scroll, trap focus, close on Escape and return focus to the toggle.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('no-scroll');
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      } else if (e.key === 'Tab') {
        const f = [toggleRef.current!, ...focusables()];
        const first = f[0];
        const last = f[f.length - 1];
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
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const solid = scrolled || open || !transparentTop;
  const links = navigation.main.filter((l) => pages[l.page]);

  return (
    <header className={`site-header${solid ? ' site-header--solid' : ''}${open ? ' is-open' : ''}`}>
      <div className="container site-header__bar">
        <Logo inverted={!solid} />
        <nav className="site-nav" aria-label="Primary">
          <ul>
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          <NavLink to="/reservations" className="site-header__manage">Manage stay</NavLink>
          {pages.booking && <LinkButton to={navigation.cta.to} variant={solid ? 'primary' : 'light'} className="site-header__cta">{navigation.cta.label}</LinkButton>}
          <button ref={toggleRef} type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'close' : 'menu'} size={24} />
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>
      <div id="mobile-nav" ref={panelRef} className="mobile-nav" hidden={!open} role="dialog" aria-modal="true" aria-label="Site menu">
        <nav aria-label="Mobile">
          <ul>
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to}>{l.label}</NavLink>
              </li>
            ))}
            <li><NavLink to="/reservations">Manage a reservation</NavLink></li>
          </ul>
        </nav>
        {pages.booking && <LinkButton to={navigation.cta.to} className="mobile-nav__cta">{navigation.cta.label} a stay</LinkButton>}
      </div>
    </header>
  );
}
