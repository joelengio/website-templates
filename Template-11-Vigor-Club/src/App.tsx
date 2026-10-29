import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { site } from './config/site';
import Home from './pages/Home';

const Programs = lazy(() => import('./pages/Programs'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Trainers = lazy(() => import('./pages/Trainers'));
const TrainerDetail = lazy(() => import('./pages/TrainerDetail'));
const Membership = lazy(() => import('./pages/Membership'));
const Facilities = lazy(() => import('./pages/Facilities'));
const About = lazy(() => import('./pages/About'));
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
    console.error(`${site.brand.name} rendering error`, error, info.componentStack);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="container narrow error-screen" role="alert">
        <h1 className="h-mega">Something went wrong</h1>
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
            <Route path="programs" element={<Programs />} />
            <Route path="programs/:slug" element={<ProgramDetail />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="trainers/:slug" element={<TrainerDetail />} />
            <Route path="membership" element={<Membership />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="about" element={<About />} />
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
