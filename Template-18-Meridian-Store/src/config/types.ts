/** Shared type definitions for the MERIDIAN STORE configuration. Money values in config files are written in MAJOR units (e.g. 285 or 62.5)
 *  and converted once to integer MINOR units (cents) when the catalogue is built, so runtime maths never touches floating-point money. */

export type ProductStatus = 'active' | 'coming-soon' | 'archived';
export type OptionType = 'color' | 'size' | 'text';

export interface OptionValue {
  value: string;
  /** CSS colour for colour swatches. */
  swatch?: string;
}
export interface ProductOption {
  name: string;
  type: OptionType;
  values: OptionValue[];
}
export interface VariantInput {
  /** Map of option name → chosen value. Must cover every option of the product. */
  options: Record<string, string>;
  /** Demonstration stock level (units). 0 = sold out. */
  stock: number;
  /** Optional variant-specific price (major units). Defaults to the product price. */
  price?: number;
  compareAtPrice?: number;
  sku?: string;
}
export interface ProductImage {
  src: string;
  alt: string;
  /** Show this image first when this value of `imageOption` is selected (e.g. "Cognac"). Images without it are shared by every variant. */
  option?: string;
}
export interface ProductDetail {
  label: string;
  value: string;
}
export interface ProductInput {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  /** Defaults to the store currency. Multi-currency catalogues are not supported (see CUSTOMIZATION_GUIDE.md). */
  currency?: string;
  sku: string;
  status: ProductStatus;
  featured?: boolean;
  /** Best-seller rank (1 = top). Omit when not a best seller. */
  bestseller?: number;
  /** Show the "New" badge. */
  isNew?: boolean;
  /** ISO date (YYYY-MM-DD) used by "Newest" sorting. */
  addedOn: string;
  options: ProductOption[];
  /** Name of the option whose value selects the product image (usually "Color"). */
  imageOption?: string;
  variants: VariantInput[];
  images: ProductImage[];
  features: string[];
  details: ProductDetail[];
  /** Overrides the shipping paragraph shown on the product page. */
  shippingNote?: string;
}

/** Runtime variant (money in minor units). */
export interface Variant {
  id: string;
  options: Record<string, string>;
  label: string;
  sku: string;
  priceMinor: number;
  compareAtMinor?: number;
  stock: number;
}
export interface Product extends Omit<ProductInput, 'price' | 'compareAtPrice' | 'variants' | 'currency'> {
  currency: string;
  priceMinor: number;
  compareAtMinor?: number;
  minPriceMinor: number;
  maxPriceMinor: number;
  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}
export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  /** Product slugs, in display order. */
  products: string[];
  /** Short editorial paragraph shown under the collection hero. */
  story: string;
}

// ── commerce rules ────────────────────────────────────────────────────────────
export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  /** Delivery estimate shown to the customer. */
  eta: string;
  /** Flat rate in major units. */
  price: number;
  /** Optional extra cost per additional item (major units). */
  perExtraItem?: number;
  /** Order value (after discounts, major units) at or above which this method is free. */
  freeOver?: number;
}
export interface ShippingZone {
  id: string;
  label: string;
  /** ISO 3166-1 alpha-2 country codes. */
  countries: string[];
  methods: ShippingMethod[];
}
export interface TaxRate {
  country: string;
  /** Optional state/province code (e.g. "CA"). */
  region?: string;
  ratePct: number;
  label: string;
  /** true = prices already include this tax (tax is extracted, not added). Defaults to the global tax.mode. */
  inclusive?: boolean;
}
export type PromoType = 'percent' | 'fixed' | 'free-shipping';
export interface PromoCode {
  code: string;
  type: PromoType;
  /** Percent (0–100) for "percent"; major currency units for "fixed"; ignored for "free-shipping". */
  value: number;
  description: string;
  minSubtotal?: number;
  /** Cap for percentage discounts (major units). */
  maxDiscount?: number;
  /** ISO date; the code is rejected on/after this date. */
  expiresAt?: string;
  active?: boolean;
}
export interface CommerceConfig {
  currency: { code: string; locale: string };
  defaultCountry: string;
  maxQtyPerLine: number;
  lowStockThreshold: number;
  shipping: { zones: ShippingZone[] };
  tax: { enabled: boolean; mode: 'exclusive' | 'inclusive'; taxShipping: boolean; defaultRatePct: number; rates: TaxRate[] };
  promos: PromoCode[];
}

export interface CountryOption {
  code: string;
  name: string;
}

// ── content ───────────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}
export interface MegaColumn {
  title: string;
  links: NavLink[];
}
export interface MegaMenu {
  columns: MegaColumn[];
  feature?: { title: string; text: string; href: string; cta: string; image: string; alt: string };
}
export interface NavItem extends NavLink {
  mega?: MegaMenu;
}

export type JournalBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'products'; title: string; slugs: string[] };
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  author: string;
  image: string;
  alt: string;
  body: JournalBlock[];
}
export interface Testimonial {
  name: string;
  location: string;
  quote: string;
  product?: string;
}
export interface FaqGroup {
  id: string;
  title: string;
  items: { q: string; a: string }[];
}
export interface LegalPage {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
}
export interface HomeSection {
  id: 'hero' | 'categories' | 'new-arrivals' | 'collections' | 'story' | 'best-sellers' | 'editorial' | 'testimonials' | 'journal' | 'newsletter';
  enabled: boolean;
}
