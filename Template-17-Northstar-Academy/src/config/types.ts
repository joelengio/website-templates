export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Category {
  id: string;
  name: string;
  blurb: string;
  /** Illustration motif used by CourseCover (see components/CourseCover.tsx). */
  motif: 'code' | 'design' | 'marketing' | 'business' | 'data' | 'ai' | 'language' | 'skills';
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  /** Zero-based index into `options`. */
  correct: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  /** Percentage (0–100) required to pass. Falls back to `learning.defaultPassMark`. */
  passMark?: number;
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  /** Reading paragraphs. */
  body: string[];
  keyPoints: string[];
  /** A short reflection/practice prompt. */
  practice: string;
  /** Optional locally hosted demonstration clip. */
  media?: { src: string; poster?: string; caption: string; transcript: string };
}

export interface Module {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
  quiz: Quiz;
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  categoryId: string;
  instructorId: string;
  difficulty: Difficulty;
  /** Total hours of the (fictional) full course. */
  hours: number;
  /** Estimated lesson count of the (fictional) full course. The demo edition ships `modules`. */
  catalogLessons: number;
  /** 0 = free. Currency comes from `site.currency`. */
  price: number;
  /** Fictional demo rating, 0–5. Always labelled as demonstration data. */
  rating: number;
  ratingCount: number;
  featured?: boolean;
  /** Cover palette (any CSS colours) used by the generated illustration. */
  palette: [string, string, string];
  objectives: string[];
  requirements: string[];
  modules: Module[];
  /** Keywords that improve search matching. */
  tags: string[];
}

export interface Instructor {
  slug: string;
  name: string;
  title: string;
  specialization: string;
  bio: string[];
  credentials: string[];
  /** Portrait illustration settings (see components/Portrait.tsx). */
  portrait: { skin: string; hair: string; hairStyle: 'short' | 'long' | 'bun' | 'curly' | 'bald' | 'waves'; top: string; bg: string; glasses?: boolean; beard?: boolean };
  location: string;
  years: number;
}

export interface LearningPath {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: Difficulty;
  courseSlugs: string[];
  skills: string[];
  outcome: string;
}

export interface Plan {
  id: string;
  name: string;
  audience: string;
  monthly: number;
  /** Price per month when billed annually. */
  annualMonthly: number;
  highlighted?: boolean;
  cta: string;
  features: string[];
  /** Feature keys included, used by the comparison table. */
  includes: string[];
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  palette: [string, string, string];
  body: string[];
  tags: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  course: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface NavItem {
  label: string;
  to: string;
  /** Page key in config/layout.ts `pages`; the item is hidden when that page is disabled. */
  page: keyof PagesConfig;
}

export interface PagesConfig {
  home: boolean;
  courses: boolean;
  instructors: boolean;
  paths: boolean;
  plans: boolean;
  about: boolean;
  journal: boolean;
  contact: boolean;
  learn: boolean;
}
