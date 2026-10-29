import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { site } from '../config/site';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <aside className="demo-strip" aria-label="Demonstration notice">
        <div className="container">
          <strong>Demonstration site.</strong> {site.brand.name} is a fictional brand — prices, people and results are sample content.
        </div>
      </aside>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
