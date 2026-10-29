export type SectionConfig = { id: string; enabled: boolean };

export type PropertyType = 'Villa' | 'Modern House' | 'Family Home' | 'Lodge' | 'Cottage' | 'Apartment';
export type PropertyStatus = 'available' | 'under-offer';
export type FeatureKey =
  | 'pool'
  | 'garden'
  | 'garage'
  | 'waterview'
  | 'fireplace'
  | 'smart-home'
  | 'guest-house'
  | 'wine-cellar'
  | 'solar'
  | 'home-office'
  | 'terrace'
  | 'gym';

export interface PropertyImage {
  src: string;
  /** Thumbnail used on cards; falls back to src. */
  thumb?: string;
  alt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  status: PropertyStatus;
  type: PropertyType;
  price: number;
  neighborhood: string;
  region: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  lotSqm: number;
  yearBuilt: number;
  parking: number;
  features: FeatureKey[];
  description: string[];
  highlights: string[];
  images: PropertyImage[];
  featured: boolean;
  /** ISO date; drives the "Newest" sort. */
  listedAt: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  image: PropertyImage;
  body: string[];
}
