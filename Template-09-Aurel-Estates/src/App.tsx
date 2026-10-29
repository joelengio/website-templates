import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { pages } from './config/layout';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Compare = lazy(() => import('./pages/Compare'));
const JournalIndex = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalIndex })));
const JournalArticle = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalArticle })));

export default function App() {
  return (
    <Suspense fallback={<p className="route-loading" role="status">Loading…</p>}>
      <Routes>
        <Route element={<Layout />}>
          {pages.home && <Route index element={<Home />} />}
          {pages.properties && (
            <>
              <Route path="properties" element={<Properties />} />
              <Route path="properties/:slug" element={<PropertyDetail />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="compare" element={<Compare />} />
            </>
          )}
          {pages.about && <Route path="about" element={<About />} />}
          {pages.services && <Route path="services" element={<Services />} />}
          {pages.journal && (
            <>
              <Route path="journal" element={<JournalIndex />} />
              <Route path="journal/:slug" element={<JournalArticle />} />
            </>
          )}
          {pages.contact && <Route path="contact" element={<Contact />} />}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
