import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

const heroRoutes = ['/'];

export default function Layout() {
  const { pathname, hash } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  // On route change: restore scroll position, jump to hash targets, and move focus to <main> for keyboard/screen reader users.
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
    if (first.current) first.current = false;
    else if (!main.current?.contains(document.activeElement)) main.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header transparentTop={heroRoutes.includes(pathname)} />
      <main id="main" ref={main} tabIndex={-1}>
        <Suspense fallback={<div className="route-loading" role="status">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
