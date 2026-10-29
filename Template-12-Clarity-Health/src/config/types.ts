import type { IconName } from '../components/icon-paths';

export type ImageKey = string;
export type ConsultMode = 'in-person' | 'video';
export type ServiceCategory = 'consultation' | 'diagnostic' | 'preventive' | 'specialist' | 'screening';

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BusinessDay {
  /** 0 = Sunday … 6 = Saturday */
  day: number;
  label: string;
  /** 24h "HH:MM". Leave open/close undefined for a closed day. */
  open?: string;
  close?: string;
}

export interface NavItem {
  label: string;
  to: string;
}

export interface DepartmentContact {
  name: string;
  phone: string;
  phoneHref: string;
  email: string;
  note: string;
}

export interface ClinicLocation {
  id: string;
  name: string;
  addressLines: string[];
  phone: string;
  phoneHref: string;
  email: string;
  hoursSummary: string[];
  facilities: string[];
  directions: string;
  image: ImageKey;
}

export interface Specialty {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon: IconName;
  image: ImageKey;
  summary: string;
  description: string[];
  conditionsHeading?: string;
  /** General-interest topics this specialty typically covers (educational, not a diagnosis list). */
  commonTopics: string[];
  keywords: string[];
}

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  title: string;
  specialtyId: string;
  image: ImageKey;
  languages: string[];
  yearsExperience: number;
  acceptingNewPatients: boolean;
  /** 0 = Sunday … 6 = Saturday */
  workingDays: number[];
  modes: ConsultMode[];
  summary: string;
  bio: string[];
  qualifications: string[];
  interests: string[];
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  specialtyIds: string[];
  summary: string;
  description: string[];
  whatToExpect: string[];
  durationMinutes: number;
  /** Demonstration price in the configured currency. Shown only when booking.pricing.show is true. */
  price: number;
  modes: ConsultMode[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  context: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image: ImageKey;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: ImageKey;
  date: string;
  readMinutes: number;
  relatedSpecialty?: string;
  sections: ArticleSection[];
}

export interface Faq {
  id: string;
  group: string;
  question: string;
  answer: string;
}

export type HomeSectionId =
  | 'hero'
  | 'intro'
  | 'specialties'
  | 'doctors'
  | 'services'
  | 'why'
  | 'experience'
  | 'facilities'
  | 'testimonials'
  | 'info'
  | 'articles'
  | 'contact';

export interface HomeSectionConfig {
  id: HomeSectionId;
  enabled: boolean;
}
