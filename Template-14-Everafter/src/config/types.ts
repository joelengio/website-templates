/** Shared types for every configurable content collection. */
export interface ImageRef {
  /** Full-size image URL (served from /public). */
  src: string;
  /** Smaller variant used for cards and thumbnails. */
  small: string;
  alt: string;
  /** CSS object-position, used to keep the subject in frame when cropped. */
  position?: string;
}

export interface NavItem {
  label: string;
  to: string;
  /** Optional children render as a simple list in the footer and mobile menu only. */
  children?: NavItem[];
}

export interface Cta {
  label: string;
  to: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface WeddingProject {
  slug: string;
  title: string;
  /** Short location line shown on cards, e.g. "Lake Como, Italy". */
  location: string;
  /** Filter value for the location filter (country or region). */
  region: string;
  destinationSlug: string;
  style: string;
  theme: string;
  eventType: string;
  guests: number;
  season: string;
  year: number;
  summary: string;
  story: string[];
  services: string[];
  palette: string[];
  highlights: string[];
  cover: ImageRef;
  gallery: ImageRef[];
}

export interface ServiceStage {
  title: string;
  text: string;
}

export interface Service {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  description: string[];
  priceLabel: string;
  /** Numeric "from" price in the template currency; omit to show only priceLabel. */
  priceFrom?: number;
  idealFor: string;
  stages: ServiceStage[];
  inclusions: string[];
  faqs: Faq[];
  image: ImageRef;
  /** Maps to the service ids used in the questionnaire. */
  questionnaireId: string;
}

export interface PackageTier {
  id: string;
  name: string;
  tagline: string;
  description: string;
  startingPrice: number;
  priceNote: string;
  featured?: boolean;
  /** Feature ids (see packageFeatures) included in this tier. */
  includes: string[];
  image: ImageRef;
}

export interface PackageFeature {
  id: string;
  label: string;
  group: string;
  /** Optional per-tier text values, otherwise a check mark is shown. */
  values?: Record<string, string>;
}

export interface AddOn {
  id: string;
  label: string;
  description: string;
  price: number;
  unit: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  continent: string;
  category: string;
  tagline: string;
  summary: string;
  venueStyles: string[];
  bestSeason: string;
  guestRange: string;
  travel: string;
  planningNotes: string[];
  cover: ImageRef;
  gallery: ImageRef[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  specialty: string;
}

export interface Testimonial {
  quote: string;
  names: string;
  detail: string;
}

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  author: string;
  image: ImageRef;
  sections: ArticleSection[];
  tags: string[];
}

export interface Option {
  id: string;
  label: string;
  hint?: string;
}
