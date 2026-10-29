import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';

const Specialties = lazy(() => import('./pages/Specialties'));
const SpecialtyDetail = lazy(() => import('./pages/SpecialtyDetail'));
const Doctors = lazy(() => import('./pages/Doctors'));
const DoctorDetail = lazy(() => import('./pages/DoctorDetail'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Booking = lazy(() => import('./pages/Booking'));
const Appointments = lazy(() => import('./pages/Appointments'));
const About = lazy(() => import('./pages/About'));
const PatientInfo = lazy(() => import('./pages/PatientInfo'));
const Journal = lazy(() => import('./pages/Journal'));
const JournalArticle = lazy(() => import('./pages/JournalArticle'));
const Contact = lazy(() => import('./pages/Contact'));
const DemoNotice = lazy(() => import('./pages/DemoNotice'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="specialties" element={<Specialties />} />
          <Route path="specialties/:slug" element={<SpecialtyDetail />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:slug" element={<DoctorDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="book" element={<Booking />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="about" element={<About />} />
          <Route path="patient-information" element={<PatientInfo />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<JournalArticle />} />
          <Route path="contact" element={<Contact />} />
          <Route path="demo-notice" element={<DemoNotice />} />
          <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
  );
}
