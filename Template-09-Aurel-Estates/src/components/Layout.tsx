import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { site } from '../config/site';
import { CompareTray } from './CompareTray';
import { Footer } from './Footer';
import { Header } from './Header';

/** Scrolls to top / hash on navigation and moves focus to the new page's heading for assistive tech. */
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
    if (first.current) {
      first.current = false;
      return;
    }
    const target = document.querySelector<HTMLElement>('[data-page-heading]') ?? document.getElementById('main');
    target?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); const m = document.getElementById('main'); m?.focus(); m?.scrollIntoView(); }}>
        Skip to main content
      </a>
      {site.demo.showBanner && (
        <div className="demo-banner" role="note">
          {site.demo.bannerText}
        </div>
      )}
      <Header />
      <main id="main" tabIndex={-1}>
        <div key={pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
      <Footer />
      <CompareTray />
      <RouteEffects />
    </>
  );
}
