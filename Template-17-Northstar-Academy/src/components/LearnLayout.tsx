import { NavLink, Outlet } from 'react-router-dom';
import { DemoNotice } from './ui';
import { Footer } from './Footer';
import { Header } from './Header';
import { RouteEffects, SkipLink } from './Layout';

/** Shell for the learner dashboard pages: site header, a persistent demo disclosure and dashboard tabs. */
export function LearnLayout() {
  return (
    <>
      <SkipLink />
      <Header />
      <div className="learn-shell">
        <div className="container">
          <DemoNotice compact />
          <nav className="learn-tabs" aria-label="Learning dashboard">
            <NavLink to="/learn" end>Overview</NavLink>
            <NavLink to="/learn/bookmarks">Bookmarks</NavLink>
            <NavLink to="/learn/completed">Completed</NavLink>
            <NavLink to="/courses">Browse courses</NavLink>
          </nav>
        </div>
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <Footer />
      <RouteEffects />
    </>
  );
}
