import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';

const Treatments = lazy(() => import('./pages/Treatments'));
const TreatmentDetail = lazy(() => import('./pages/TreatmentDetail'));
const Packages = lazy(() => import('./pages/Packages'));
const Booking = lazy(() => import('./pages/Booking'));
const BookingManage = lazy(() => import('./pages/BookingManage'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Journal = lazy(() => import('./pages/Journal'));
const JournalArticle = lazy(() => import('./pages/JournalArticle'));
const Contact = lazy(() => import('./pages/Contact'));
const DemoNoticePage = lazy(() => import('./pages/DemoNotice'));
const NotFound = lazy(() => import('./pages/NotFound'));

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SERENE HOUSE rendering error', error, info.componentStack);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="container narrow error-screen" role="alert">
        <h1 className="h-display">Something went wrong</h1>
        <p className="lead">The page could not be displayed. Please reload, or return to the home page.</p>
        <p><a className="btn btn--primary" href="/"><span>Back to home</span></a></p>
      </div>
    );
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="route-loading" role="status" aria-label="Loading page" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="treatments" element={<Treatments />} />
            <Route path="treatments/:slug" element={<TreatmentDetail />} />
            <Route path="packages" element={<Packages />} />
            <Route path="booking" element={<Booking />} />
            <Route path="booking/manage" element={<BookingManage />} />
            <Route path="about" element={<About />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/:slug" element={<JournalArticle />} />
            <Route path="contact" element={<Contact />} />
            <Route path="demo-notice" element={<DemoNoticePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
