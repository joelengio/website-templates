import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { pages } from './config/layout';
import { Layout } from './components/Layout';
import { LearnLayout } from './components/LearnLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const InstructorsIndex = lazy(() => import('./pages/Instructors').then((m) => ({ default: m.InstructorsIndex })));
const InstructorDetail = lazy(() => import('./pages/Instructors').then((m) => ({ default: m.InstructorDetail })));
const Paths = lazy(() => import('./pages/Paths'));
const Plans = lazy(() => import('./pages/Plans'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const JournalIndex = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalIndex })));
const JournalArticle = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalArticle })));
const Dashboard = lazy(() => import('./pages/learn/Dashboard'));
const CourseHome = lazy(() => import('./pages/learn/CourseHome'));
const LessonPage = lazy(() => import('./pages/learn/LessonPage'));
const QuizPage = lazy(() => import('./pages/learn/QuizPage'));
const Bookmarks = lazy(() => import('./pages/learn/Library').then((m) => ({ default: m.Bookmarks })));
const Completed = lazy(() => import('./pages/learn/Library').then((m) => ({ default: m.Completed })));
const Certificate = lazy(() => import('./pages/learn/Certificate'));

export default function App() {
  return (
    <Suspense fallback={<p className="route-loading" role="status">Loading…</p>}>
      <Routes>
        {pages.learn && (
          <>
            <Route path="learn/:slug/lesson/:lessonId" element={<LessonPage />} />
            <Route path="learn/:slug/quiz/:quizId" element={<QuizPage />} />
            <Route path="learn" element={<LearnLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="completed" element={<Completed />} />
              <Route path=":slug" element={<CourseHome />} />
              <Route path=":slug/certificate" element={<Certificate />} />
            </Route>
          </>
        )}
        <Route element={<Layout />}>
          {pages.home && <Route index element={<Home />} />}
          {pages.courses && (
            <>
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:slug" element={<CourseDetail />} />
            </>
          )}
          {pages.instructors && (
            <>
              <Route path="instructors" element={<InstructorsIndex />} />
              <Route path="instructors/:slug" element={<InstructorDetail />} />
            </>
          )}
          {pages.paths && <Route path="paths" element={<Paths />} />}
          {pages.plans && <Route path="plans" element={<Plans />} />}
          {pages.about && <Route path="about" element={<About />} />}
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
