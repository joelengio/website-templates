import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { features } from './config/features';
import Home from './pages/Home';

const Menus = lazy(() => import('./pages/Menus'));
const Reserve = lazy(() => import('./pages/Reserve'));
const Experiences = lazy(() => import('./pages/Experiences'));
const ExperienceDetail = lazy(() => import('./pages/ExperienceDetail'));
const PrivateDining = lazy(() => import('./pages/PrivateDining'));
const Story = lazy(() => import('./pages/Story'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Journal = lazy(() => import('./pages/Journal'));
const Article = lazy(() => import('./pages/Article'));
const Contact = lazy(() => import('./pages/Contact'));
const Order = lazy(() => import('./pages/Order'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Loading() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" /> Loading…
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menus" element={<Menus />} />
          {features.reservations && <Route path="reserve" element={<Reserve />} />}
          {features.reservations && <Route path="reserve/manage" element={<Reserve />} />}
          {features.reservations && <Route path="reservations" element={<Navigate to="/reserve/manage" replace />} />}
          <Route path="experiences" element={<Experiences />} />
          <Route path="experiences/:slug" element={<ExperienceDetail />} />
          {features.privateDining && <Route path="private-dining" element={<PrivateDining />} />}
          <Route path="our-story" element={<Story />} />
          {features.gallery && <Route path="gallery" element={<Gallery />} />}
          {features.journal && <Route path="journal" element={<Journal />} />}
          {features.journal && <Route path="journal/:slug" element={<Article />} />}
          <Route path="contact" element={<Contact />} />
          {features.orderBuilder && <Route path="order" element={<Order />} />}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
