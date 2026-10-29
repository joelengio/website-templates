import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { pages } from './config/layout';
import Home from './pages/Home';

const Rooms = lazy(() => import('./pages/Rooms'));
const RoomDetail = lazy(() => import('./pages/RoomDetail'));
const Booking = lazy(() => import('./pages/Booking'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const Reservations = lazy(() => import('./pages/Reservations'));
const ReservationDetail = lazy(() => import('./pages/ReservationDetail'));
const Dining = lazy(() => import('./pages/Dining'));
const VenueDetail = lazy(() => import('./pages/VenueDetail'));
const Experiences = lazy(() => import('./pages/Experiences'));
const ExperienceDetail = lazy(() => import('./pages/ExperienceDetail'));
const Offers = lazy(() => import('./pages/Offers'));
const OfferDetail = lazy(() => import('./pages/OfferDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Explore = lazy(() => import('./pages/Explore'));
const Journal = lazy(() => import('./pages/Journal'));
const Article = lazy(() => import('./pages/Article'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {pages.rooms && <Route path="rooms" element={<Rooms />} />}
        {pages.rooms && <Route path="rooms/:slug" element={<RoomDetail />} />}
        {pages.booking && <Route path="booking" element={<Booking />} />}
        {pages.booking && <Route path="booking/confirmation/:id" element={<Confirmation />} />}
        {pages.booking && <Route path="reservations" element={<Reservations />} />}
        {pages.booking && <Route path="reservations/:id" element={<ReservationDetail />} />}
        {pages.dining && <Route path="dining" element={<Dining />} />}
        {pages.dining && <Route path="dining/:slug" element={<VenueDetail />} />}
        {pages.experiences && <Route path="experiences" element={<Experiences />} />}
        {pages.experiences && <Route path="experiences/:slug" element={<ExperienceDetail />} />}
        {pages.offers && <Route path="offers" element={<Offers />} />}
        {pages.offers && <Route path="offers/:slug" element={<OfferDetail />} />}
        {pages.gallery && <Route path="gallery" element={<Gallery />} />}
        {pages.about && <Route path="about" element={<About />} />}
        {pages.explore && <Route path="explore" element={<Explore />} />}
        {pages.journal && <Route path="journal" element={<Journal />} />}
        {pages.journal && <Route path="journal/:slug" element={<Article />} />}
        {pages.contact && <Route path="contact" element={<Contact />} />}
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
