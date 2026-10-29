import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';

const Weddings = lazy(() => import('./pages/Weddings'));
const WeddingDetail = lazy(() => import('./pages/WeddingDetail'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Packages = lazy(() => import('./pages/Packages'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const About = lazy(() => import('./pages/About'));
const Journal = lazy(() => import('./pages/Journal'));
const JournalArticle = lazy(() => import('./pages/JournalArticle'));
const Plan = lazy(() => import('./pages/Plan'));
const Contact = lazy(() => import('./pages/Contact'));
const DemoNotice = lazy(() => import('./pages/DemoNotice'));
const Credits = lazy(() => import('./pages/Credits'));
const NotFound = lazy(() => import('./pages/NotFound'));

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('EVERAFTER rendering error', error, info.componentStack);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="container container--narrow error-screen" role="alert">
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
            <Route path="weddings" element={<Weddings />} />
            <Route path="weddings/:slug" element={<WeddingDetail />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="packages" element={<Packages />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/:slug" element={<DestinationDetail />} />
            <Route path="about" element={<About />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/:slug" element={<JournalArticle />} />
            <Route path="plan" element={<Plan />} />
            <Route path="contact" element={<Contact />} />
            <Route path="demo-notice" element={<DemoNotice />} />
            <Route path="credits" element={<Credits />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
