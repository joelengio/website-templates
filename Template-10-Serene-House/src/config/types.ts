export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export type TreatmentCategoryId = 'massage' | 'facial' | 'body' | 'wellness';
export type PackageCategoryId = 'wellness' | 'spa-day' | 'couples' | 'seasonal';

export interface Category<Id extends string = string> {
  id: Id;
  name: string;
  description: string;
}

export interface PriceOption {
  minutes: number;
  price: number;
}

export interface Treatment {
  slug: string;
  name: string;
  category: TreatmentCategoryId;
  summary: string;
  description: string[];
  /** First option is the default. Price is per guest. */
  options: PriceOption[];
  image: ImageAsset;
  benefits: string[];
  includes: string[];
  suitableFor: string;
  notes?: string;
  featured?: boolean;
  /** Maximum guests that can book this treatment in one appointment (1 = single guest only). */
  maxGuests: number;
  tags: string[];
}

export interface PackageItem {
  label: string;
  /** Standalone value used to compute the saving. */
  value: number;
}

export interface SpaPackage {
  slug: string;
  name: string;
  category: PackageCategoryId;
  tagline: string;
  description: string;
  price: number;
  /** Per-guest or per-couple label shown after the price, e.g. "per guest". */
  priceNote: string;
  duration: string;
  minutes: number;
  guests: number;
  maxGuests: number;
  items: PackageItem[];
  /** Ids from `packageComparisonRows`. */
  features: string[];
  image: ImageAsset;
  highlight?: boolean;
  validUntil?: string;
  featured?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialties: TreatmentCategoryId[];
  /** 0 = Sunday … 6 = Saturday */
  workingDays: number[];
  languages: string[];
  image: ImageAsset;
}

export interface GalleryItem {
  id: string;
  category: string;
  image: ImageAsset;
  caption: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  image: ImageAsset;
  body: ArticleBlock[];
}

export interface NavItem {
  label: string;
  to: string;
}

export interface BusinessDay {
  day: number;
  label: string;
  /** 24h "HH:MM"; null when closed. */
  open: string | null;
  close: string | null;
}

export type HomeSectionId =
  | 'hero'
  | 'intro'
  | 'treatments'
  | 'philosophy'
  | 'packages'
  | 'gallery'
  | 'testimonials'
  | 'journal'
  | 'booking'
  | 'newsletter';

export interface HomeSectionConfig {
  id: HomeSectionId;
  enabled: boolean;
}
