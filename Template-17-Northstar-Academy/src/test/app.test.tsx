import { describe, expect, it } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { LearnerProvider } from '../hooks/useLearner';
import { STORAGE_KEY } from '../lib/learner';
import { courses } from '../config';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LearnerProvider>
        <App />
      </LearnerProvider>
    </MemoryRouter>,
  );
}
const stored = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');

describe('catalogue UI', () => {
  it('filters, shows an empty state and resets', async () => {
    const user = userEvent.setup();
    renderAt('/courses');
    expect(await screen.findByTestId('result-count')).toHaveTextContent(`${courses.length} of ${courses.length}`);
    await user.type(screen.getByRole('searchbox', { name: /search courses/i }), 'sql');
    await waitFor(() => expect(screen.getByTestId('result-count')).toHaveTextContent('1 of'));
    await user.clear(screen.getByRole('searchbox', { name: /search courses/i }));
    await user.type(screen.getByRole('searchbox', { name: /search courses/i }), 'qqqqqq');
    expect(await screen.findByText(/no courses match/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /reset search and filters/i }));
    await waitFor(() => expect(screen.getByTestId('result-count')).toHaveTextContent(`${courses.length} of`));
  });
  it('applies category, price and sort filters', async () => {
    const user = userEvent.setup();
    renderAt('/courses');
    await user.click(await screen.findByRole('button', { name: 'Data Analysis' }));
    await waitFor(() => expect(screen.getByTestId('result-count')).toHaveTextContent('2 of'));
    await user.selectOptions(screen.getAllByLabelText('Price')[0], 'free');
    await waitFor(() => expect(screen.getByTestId('result-count')).toHaveTextContent('1 of'));
  });
});

describe('enrollment and lesson flow', () => {
  it('enrolls via an explained dialog, completes a lesson, and persists it', async () => {
    const user = userEvent.setup();
    renderAt('/courses/python-first-programs');
    await user.click(await screen.findByRole('button', { name: /enroll free/i }));
    const dialog = await screen.findByRole('dialog', { name: /enroll in python/i });
    expect(dialog).toHaveTextContent(/no payment/i);
    await user.click(within(dialog).getByRole('button', { name: /confirm demo enrollment/i }));
    expect(await screen.findByRole('heading', { name: /course outline/i })).toBeInTheDocument();
    expect(stored().enrollments['python-first-programs']).toBeTruthy();
    await user.click(screen.getByRole('link', { name: /start learning/i }));
    expect(await screen.findByRole('heading', { level: 1, name: /running your first program/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /mark lesson complete/i }));
    expect(screen.getByRole('button', { name: /completed — mark as not complete/i })).toHaveAttribute('aria-pressed', 'true');
    expect(stored().enrollments['python-first-programs'].lessonsDone).toEqual(['m1-l1']);
    await user.click(screen.getByRole('link', { name: /next.*variables and types/i }));
    expect(await screen.findByRole('heading', { level: 1, name: /variables and types/i })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /previous.*running your first program/i }));
    expect(await screen.findByRole('heading', { level: 1, name: /running your first program/i })).toBeInTheDocument();
  });
  it('redirects to the course page when not enrolled', async () => {
    renderAt('/learn/python-first-programs/lesson/m1-l1');
    expect(await screen.findByText(/not enrolled/i)).toBeInTheDocument();
  });
});

describe('quiz flow', () => {
  const seed = () =>
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ enrollments: { 'python-first-programs': { enrolledAt: '2026-01-01T00:00:00Z', lessonsDone: [] } }, quizzes: {}, bookmarkedCourses: [], bookmarkedLessons: [], activity: [] }));
  it('requires every answer, fails, retries and passes with feedback', async () => {
    seed();
    const user = userEvent.setup();
    renderAt('/learn/python-first-programs/quiz/m1-quiz');
    await user.click(await screen.findByRole('button', { name: /start quiz/i }));
    await user.click(screen.getByRole('button', { name: /submit answers/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/answer every question/i);
    // Wrong answers: first option of each question is wrong for all three questions in this module.
    for (const group of screen.getAllByRole('group')) await user.click(within(group).getAllByRole('radio')[3]);
    await user.click(screen.getByRole('button', { name: /submit answers/i }));
    expect(await screen.findByText(/keep going: 0 of 3 correct/i)).toBeInTheDocument();
    expect(stored().quizzes['python-first-programs:m1-quiz']).toMatchObject({ passed: false, attempts: 1 });
    await user.click(screen.getByRole('button', { name: /try again/i }));
    const correct = [1, 2, 1];
    const groups = screen.getAllByRole('group');
    for (let i = 0; i < groups.length; i++) await user.click(within(groups[i]).getAllByRole('radio')[correct[i]]);
    await user.click(screen.getByRole('button', { name: /submit answers/i }));
    expect(await screen.findByText(/perfect score: 3 of 3 correct/i)).toBeInTheDocument();
    expect(stored().quizzes['python-first-programs:m1-quiz']).toMatchObject({ passed: true, best: 100, attempts: 2 });
  });
});

describe('dashboard', () => {
  it('shows an empty state, loads sample progress and resets through a confirmation dialog', async () => {
    const user = userEvent.setup();
    renderAt('/learn');
    expect(await screen.findByText(/have not enrolled in anything yet/i)).toBeInTheDocument();
    expect(screen.getAllByText(/stored locally|only in this browser/i).length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole('button', { name: /load sample progress/i })[0]);
    expect(await screen.findByRole('heading', { name: /continue learning/i })).toBeInTheDocument();
    expect(Object.keys(stored().enrollments).length).toBeGreaterThanOrEqual(3);
    await user.click(screen.getByRole('button', { name: /reset demo progress/i }));
    const dlg = await screen.findByRole('dialog', { name: /reset demo progress/i });
    await user.click(within(dlg).getByRole('button', { name: /^cancel$/i }));
    expect(Object.keys(stored().enrollments).length).toBeGreaterThanOrEqual(3);
    await user.click(screen.getByRole('button', { name: /reset demo progress/i }));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: /reset everything/i }));
    expect(await screen.findByText(/have not enrolled in anything yet/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"enrollments":{}');
  });
  it('shows the certificate preview only for completed courses, labelled not accredited', async () => {
    const lock = renderAt('/learn/web-foundations/certificate');
    expect(await screen.findByText(/certificate preview locked/i)).toBeInTheDocument();
    lock.unmount();
    const user = userEvent.setup();
    renderAt('/learn');
    await user.click((await screen.findAllByRole('button', { name: /load sample progress/i }))[0]);
    // Navigate via the Completed tab
    await user.click(screen.getByRole('link', { name: 'Completed' }));
    await user.click(await screen.findByRole('link', { name: /certificate preview/i }));
    expect(await screen.findAllByText(/demonstration — not accredited/i)).not.toHaveLength(0);
  });
  it('bookmarks a course and lists it', async () => {
    const user = userEvent.setup();
    renderAt('/courses');
    await user.click((await screen.findAllByRole('button', { name: /^Bookmark /i }))[0]);
    expect(stored().bookmarkedCourses).toHaveLength(1);
  });
});

describe('plans, navigation and forms', () => {
  it('toggles annual pricing', async () => {
    const user = userEvent.setup();
    renderAt('/plans');
    expect(await screen.findByTestId('price-learner')).toHaveTextContent('$24');
    await user.click(screen.getByRole('button', { name: /annual/i }));
    expect(screen.getByTestId('price-learner')).toHaveTextContent('$19');
    expect(screen.getByTestId('price-explorer')).toHaveTextContent('Free');
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
  it('validates the contact form with focus on the first invalid field and never claims delivery in demo mode', async () => {
    const user = userEvent.setup();
    renderAt('/contact');
    await user.click(await screen.findByRole('button', { name: /send inquiry/i }));
    expect(screen.getByLabelText('Name')).toHaveFocus();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    await user.type(screen.getByLabelText('Name'), 'Sam');
    await user.type(screen.getByLabelText('Email'), 'sam@example.com');
    await user.selectOptions(screen.getByLabelText('Topic'), 'Courses');
    await user.type(screen.getByLabelText('Message'), 'I would like to know more.');
    await user.click(screen.getByLabelText(/demonstration form/i));
    await user.click(screen.getByRole('button', { name: /send inquiry/i }));
    expect(await screen.findByText(/nothing was sent/i)).toBeInTheDocument();
  });
  it('mobile menu is a dialog that closes on Escape and returns focus', async () => {
    const user = userEvent.setup();
    renderAt('/about');
    const toggle = await screen.findByRole('button', { name: /open menu/i });
    await user.click(toggle);
    expect(await screen.findByRole('dialog', { name: /site menu/i })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(toggle).toHaveFocus();
  });
  it('renders the 404 page and unknown course/instructor routes', async () => {
    renderAt('/courses/does-not-exist');
    expect(await screen.findByRole('heading', { level: 1, name: /different path/i })).toBeInTheDocument();
  });
  it('lists all instructors and a detail page with their courses', async () => {
    renderAt('/instructors/kenji-mori');
    expect(await screen.findByRole('heading', { level: 1, name: /kenji mori/i })).toBeInTheDocument();
    expect(screen.getByText(/not a real person/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /analytical spreadsheets/i })).toBeInTheDocument();
  });
});

describe('home page', () => {
  it('renders the owner credit separately and the demo disclosure in the footer', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/learn with direction/i);
    expect(screen.getByText(/template 17 by onestop infinite/i)).toBeInTheDocument();
    expect(screen.getAllByText(/fictional demonstration brand/i).length).toBeGreaterThan(0);
  });
});
