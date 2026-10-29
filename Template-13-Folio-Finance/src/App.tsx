import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { pages } from './config/layout';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Industries = lazy(() => import('./pages/Industries'));
const IndustryDetail = lazy(() => import('./pages/IndustryDetail'));
const About = lazy(() => import('./pages/About'));
const Team = lazy(() => import('./pages/Team'));
const TeamDetail = lazy(() => import('./pages/TeamDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Tools = lazy(() => import('./pages/Tools'));
const Insights = lazy(() => import('./pages/Insights'));
const Article = lazy(() => import('./pages/Article'));
const Booking = lazy(() => import('./pages/Booking'));
const Contact = lazy(() => import('./pages/Contact'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

export default function App() {
  return (
    <Suspense fallback={<div className="page-loading" role="status">Loading…</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          {pages.services && <Route path="services" element={<Services />} />}
          {pages.services && <Route path="services/:slug" element={<ServiceDetail />} />}
          {pages.industries && <Route path="industries" element={<Industries />} />}
          {pages.industries && <Route path="industries/:slug" element={<IndustryDetail />} />}
          {pages.about && <Route path="about" element={<About />} />}
          {pages.team && <Route path="team" element={<Team />} />}
          {pages.team && <Route path="team/:slug" element={<TeamDetail />} />}
          {pages.pricing && <Route path="pricing" element={<Pricing />} />}
          {pages.tools && <Route path="tools" element={<Tools />} />}
          {pages.insights && <Route path="insights" element={<Insights />} />}
          {pages.insights && <Route path="insights/:slug" element={<Article />} />}
          {pages.booking && <Route path="book" element={<Booking />} />}
          {pages.contact && <Route path="contact" element={<Contact />} />}
          {pages.disclaimer && <Route path="disclaimer" element={<Disclaimer />} />}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
