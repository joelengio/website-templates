/** Shared configuration types. Every editable block of the template is typed here. */

export type IconName =
  | 'compass' | 'building' | 'ledger' | 'percent' | 'vault' | 'wave' | 'columns' | 'spark'
  | 'rocket' | 'store' | 'briefcase' | 'cart' | 'cpu' | 'home' | 'tower'
  | 'arrow' | 'check' | 'close' | 'menu' | 'calendar' | 'clock' | 'phone' | 'mail' | 'pin' | 'search'
  | 'chevron' | 'plus' | 'minus' | 'shield' | 'info' | 'book' | 'users' | 'target' | 'chart' | 'calc'
  | 'linkedin' | 'x' | 'instagram' | 'trash' | 'reset' | 'quote' | 'alert' | 'file';

export interface ImageAsset {
  /** Full-size file under /public. */
  src: string;
  /** Optional smaller file (used in srcset). */
  small?: string;
  smallWidth?: number;
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

export interface Currency {
  /** ISO 4217 code used for display only. No exchange rates are applied anywhere. */
  code: string;
  /** BCP-47 locale used for number formatting. */
  locale: string;
}

export type PricingModel = 'fixed' | 'monthly' | 'hourly' | 'project' | 'quote';

export interface ServicePricing {
  model: PricingModel;
  /** Starting price in the display currency (omit for `quote`). */
  from?: number;
  /** Text after the price, e.g. "per engagement". */
  unit?: string;
  note: string;
}

export interface Service {
  slug: string;
  name: string;
  icon: IconName;
  categories: string[];
  summary: string;
  description: string[];
  deliverables: string[];
  idealClient: string[];
  benefits: string[];
  process: { title: string; text: string }[];
  pricing: ServicePricing;
  image: string;
  faqs?: { q: string; a: string }[];
}

export interface ServiceCategory {
  id: string;
  label: string;
}

export interface Industry {
  slug: string;
  name: string;
  icon: IconName;
  image: string;
  summary: string;
  intro: string;
  needs: string[];
  challenges: string[];
  outcomes: string[];
  services: string[];
  scenario: { title: string; text: string };
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  specialization: string;
  image: ImageAsset;
  summary: string;
  bio: string[];
  /** Demonstration credentials only — never use real professional designations you cannot verify. */
  credentials: string[];
  services: string[];
  focus: string[];
}

export interface PlanFeatureRow {
  id: string;
  label: string;
  group: string;
  /** One value per plan, in the same order as `plans`. `true`/`false` render as a tick/dash. */
  values: (boolean | string)[];
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  highlight?: boolean;
  /** Price per month when billed monthly, in the display currency. */
  monthly: number;
  /** Plan-specific annual discount (percent). Falls back to `pricing.annualDiscountPercent`. */
  annualDiscountPercent?: number;
  idealFor: string;
  includes: string[];
  cta: string;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  /** Price per month when billed monthly. */
  monthly: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  segment: string;
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'callout'; title: string; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  /** ISO date. Demonstration articles carry illustrative dates only. */
  date: string;
  author: string;
  image: string;
  body: ArticleBlock[];
}

export interface Office {
  id: string;
  name: string;
  address: string[];
  note: string;
  phone: string;
  email: string;
  mapQuery?: string;
}

export interface HomeSectionConfig {
  id:
    | 'hero' | 'stats' | 'services' | 'about' | 'advisory' | 'segments' | 'why' | 'process'
    | 'toolPreview' | 'testimonials' | 'insights' | 'cta';
  enabled: boolean;
}
