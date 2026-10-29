export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface NavItem {
  label: string;
  to: string;
}

export interface Cta {
  label: string;
  to: string;
}

export type Level = 'All levels' | 'Beginner-friendly' | 'Intermediate' | 'Advanced';

export interface Program {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string[];
  /** Typical session length in minutes. */
  duration: number;
  /** 1 (low) – 5 (maximum). */
  intensity: 1 | 2 | 3 | 4 | 5;
  level: Level;
  trainerSlugs: string[];
  image: ImageAsset;
  highlights: string[];
  expect: string[];
  bring: string[];
  /** One-to-one programs are not part of the group timetable. */
  bookingNote?: string;
}

export interface Trainer {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  bio: string[];
  specialties: string[];
  /** Always fictional demonstration credentials — replace with real, verifiable ones for a real business. */
  qualifications: string[];
  yearsExperience: number;
  programSlugs: string[];
  image: ImageAsset;
}

export interface ClassSession {
  id: string;
  title: string;
  programSlug: string;
  /** 0 = Monday … 6 = Sunday */
  day: number;
  /** 24-hour "HH:MM" */
  start: string;
  duration: number;
  trainerSlug: string;
  capacity: number;
  room: string;
  blurb: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  /** Price per month when billed monthly. */
  monthly: number;
  /** Price per month when billed annually. */
  annualMonthly: number;
  joiningFee: number;
  highlight?: boolean;
  badge?: string;
  benefits: string[];
  cta: string;
}

export interface ComparisonRow {
  label: string;
  group: string;
  /** true/false render a tick/cross; strings render as text. Keyed by plan id. */
  values: Record<string, boolean | string>;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Facility {
  slug: string;
  name: string;
  area: string;
  summary: string;
  highlights: string[];
  image: ImageAsset;
}

export interface GalleryItem {
  id: string;
  caption: string;
  area: string;
  image: ImageAsset;
}

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  author: string;
  image: ImageAsset;
  body: { heading?: string; paragraphs: string[] }[];
  tags: string[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface HoursRow {
  days: string;
  hours: string;
}
