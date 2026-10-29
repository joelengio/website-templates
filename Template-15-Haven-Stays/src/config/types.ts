export type Money = number; // integer cents

export interface Img {
  src: string;
  alt: string;
}

export type RoomCategory = 'Rooms' | 'Suites' | 'Family' | 'Villas';

export interface Room {
  id: string;
  slug: string;
  name: string;
  category: RoomCategory;
  tagline: string;
  /** Nightly starting rate in whole currency units (before seasons, plans, taxes). */
  baseRate: number;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  beds: string;
  areaSqm: number;
  view: string;
  description: string;
  highlights: string[];
  amenities: string[]; // amenity ids
  images: Img[];
  /** Number of identical rooms of this type (drives the simulated availability). */
  units: number;
  featured?: boolean;
}

export interface Amenity {
  id: string;
  label: string;
  icon: string;
  /** Show in the property-wide amenities section. */
  property?: boolean;
  description?: string;
}

export interface Season {
  id: string;
  name: string;
  /** Inclusive MM-DD range; may wrap over the year end (12-20 → 01-06). */
  from: string;
  to: string;
  multiplier: number;
  minNights: number;
  /** Simulated occupancy (0–100) used to generate demonstration availability. */
  occupancy: number;
}

export interface RatePlan {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  /** Per-night add-ons priced separately (e.g. breakfast). */
  perAdultNight?: number;
  perChildNight?: number;
  /** Days before check-in until which cancellation is free; null = non-refundable. */
  freeCancelDays: number | null;
  /** Illustrative fee if cancelled late: nights charged (Infinity-like 'all'). */
  lateCancelNights: number | 'all';
  inclusions: string[];
}

export interface Fee {
  id: string;
  label: string;
  kind: 'percent' | 'perNight' | 'perAdultNight' | 'perStay';
  amount: number; // percent as 8 = 8%
  taxable: boolean;
  capNights?: number;
  note?: string;
}

export interface Tax {
  id: string;
  label: string;
  rate: number; // percent
}

export interface Promotion {
  id: string;
  label: string;
  description: string;
  code?: string;
  auto: boolean;
  type: 'percent' | 'fixed';
  value: number; // percent or whole currency units per stay
  minNights?: number;
  maxNights?: number;
  /** Check-in must fall in this inclusive MM-DD window (may wrap the year end). */
  stayWindow?: { from: string; to: string };
  /** Days between today and check-in. */
  minAdvanceDays?: number;
  categories?: RoomCategory[];
  roomIds?: string[];
  excludePlans?: string[];
  requireChildren?: boolean;
  exactAdults?: number;
  noChildren?: boolean;
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  tags?: string[];
}
export interface MenuSection {
  title: string;
  items: MenuItem[];
}
export interface Venue {
  slug: string;
  name: string;
  kind: 'Restaurant' | 'Bar' | 'Café' | 'Private dining';
  tagline: string;
  description: string;
  story: string;
  hours: { label: string; time: string }[];
  dress: string;
  images: Img[];
  menu: MenuSection[];
  highlights: string[];
}

export interface Experience {
  slug: string;
  title: string;
  category: 'Wellness' | 'Outdoors' | 'Culinary' | 'Excursions' | 'Private';
  summary: string;
  description: string;
  duration: string;
  price: string;
  schedule: string;
  includes: string[];
  image: Img;
  gallery: Img[];
  level?: string;
  featured?: boolean;
}

export interface Offer {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  promoId: string;
  image: Img;
  inclusions: string[];
  conditions: string[];
  /** Pre-select this room in the booking engine. */
  roomSlug?: string;
  suggestedNights: number;
}

export interface Review {
  name: string;
  trip: string;
  quote: string;
  rating: number;
  stayed: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string;
  readMinutes: number;
  excerpt: string;
  image: Img;
  body: string[];
}

export interface Attraction {
  slug: string;
  name: string;
  type: string;
  distance: string;
  summary: string;
  image: Img;
}
