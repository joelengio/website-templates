export interface ImageAsset {
  key: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
}

export type CtaLink = { label: string; to: string };

/* ---------- Menu ---------- */
export interface DietaryLabel {
  id: string;
  label: string;
  short: string;
  description: string;
  /** Show as a filter chip on the Menus page. */
  filterable: boolean;
}
export interface AllergenLabel {
  id: string;
  label: string;
}
export interface MenuCategory {
  id: string;
  label: string;
  intro: string;
}
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Shown after the price, e.g. "per person" or "for two". */
  priceNote?: string;
  category: string;
  image?: string;
  dietary: string[];
  allergens: string[];
  available: boolean;
  featured?: boolean;
  spicy?: boolean;
  courses?: string[];
  pairing?: { label: string; price: number };
  /** Short note shown when an item is limited, e.g. "Weekends only". */
  availabilityNote?: string;
}
export interface FeaturedMenuSection {
  id: string;
  title: string;
  intro: string;
  itemIds: string[];
}

/* ---------- Reservations ---------- */
export interface ServicePeriod {
  label: string;
  open: string; // HH:mm
  lastSeating: string; // HH:mm
}
export interface SeatingArea {
  id: string;
  name: string;
  description: string;
  /** Demonstration capacity: seats available per time slot. */
  capacity: number;
  minParty: number;
  maxParty: number;
  image?: string;
}
export interface ClosedDate {
  /** "MM-DD" (every year) or "YYYY-MM-DD". */
  date: string;
  reason: string;
}
export interface ReservationSettings {
  slotIntervalMinutes: number;
  diningDurationMinutes: number;
  minPartySize: number;
  maxPartySize: number;
  bookingWindowDays: number;
  sameDayLeadMinutes: number;
  /** Indexed by weekday, 0 = Sunday. Empty array = closed. */
  hours: Record<number, ServicePeriod[]>;
  closedDates: ClosedDate[];
  seatingAreas: SeatingArea[];
  demoLoad: {
    seed: string;
    /** 0–1 baseline occupancy per weekday (0 = Sunday). */
    weekdayLoad: Record<number, number>;
    peakFrom: string;
    peakTo: string;
    peakBoost: number;
  };
  occasions: string[];
}

/* ---------- Content ---------- */
export interface Experience {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  description: string[];
  image: string;
  gallery: string[];
  duration: string;
  priceFrom: number;
  priceNote: string;
  guests: string;
  includes: string[];
  goodToKnow: string[];
  seasonal?: boolean;
  category: string;
}
export interface PrivateSpace {
  id: string;
  name: string;
  description: string;
  seated: number;
  standing: number;
  image: string;
  features: string[];
}
export interface PrivatePackage {
  id: string;
  name: string;
  summary: string;
  priceFrom: number;
  priceNote: string;
  minGuests: number;
  maxGuests: number;
  includes: string[];
}
export interface PrivateMenu {
  id: string;
  name: string;
  price: number;
  priceNote: string;
  courses: string[];
}
export interface Chef {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio: string;
  signature: string;
}
export interface Testimonial {
  quote: string;
  author: string;
  context: string;
}
export interface Award {
  title: string;
  issuer: string;
  year: string;
}
export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; items: string[] };
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // YYYY-MM-DD
  readMinutes: number;
  image: string;
  blocks: ArticleBlock[];
}
export interface GalleryItem {
  image: string;
  category: string;
  caption: string;
}
export interface HomeSection {
  id: HomeSectionId;
  enabled: boolean;
}
export type HomeSectionId =
  | 'hero'
  | 'concept'
  | 'signature'
  | 'philosophy'
  | 'menus'
  | 'atmosphere'
  | 'privateDining'
  | 'awards'
  | 'testimonials'
  | 'journal'
  | 'reserveCta';

export interface PageSeo {
  title: string;
  description: string;
  image?: string;
}
