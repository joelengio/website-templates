import type { AddOn, Plan, PlanFeatureRow } from './types';

/**
 * Engagement plans and pricing. All values are DEMONSTRATION prices in the display currency.
 * Prices are calculated, not hard-coded: annual price = monthly × 12 × (1 − discount%).
 */
export const pricing = {
  /** Default annual discount (percent) when a plan does not define its own. */
  annualDiscountPercent: 15,
  defaultCycle: 'monthly' as 'monthly' | 'annual',
  heading: 'Engagement plans',
  intro: 'Choose a rhythm that fits how you like to work. Every price on this page is a demonstration value.',
};

export const plans: Plan[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    tagline: 'Clarity and a written plan',
    monthly: 240,
    idealFor: 'Individuals and small households starting a structured plan',
    includes: ['Annual planning session', 'Written goals and cash-flow summary', 'Quarterly email check-in', 'Access to the calculators and library'],
    cta: 'Ask about Foundation',
  },
  {
    id: 'advisory',
    name: 'Advisory',
    tagline: 'Regular advice with a named adviser',
    highlight: true,
    monthly: 640,
    annualDiscountPercent: 18,
    idealFor: 'Business owners and families who want regular, hands-on guidance',
    includes: ['Quarterly adviser meetings', 'Cash-flow and tax-calendar support', 'Monthly management summary', 'Priority scheduling', 'Everything in Foundation'],
    cta: 'Ask about Advisory',
  },
  {
    id: 'partnership',
    name: 'Partnership',
    tagline: 'A coordinated team around you',
    monthly: 1480,
    annualDiscountPercent: 20,
    idealFor: 'Established businesses and wealth households with complex needs',
    includes: ['Dedicated adviser team', 'Monthly strategy sessions', 'Transaction and funding support (scoped separately)', 'Adviser coordination across tax, legal and banking', 'Everything in Advisory'],
    cta: 'Ask about Partnership',
  },
];

/** Comparison table rows. `values` follows the order of `plans`. */
export const planFeatures: PlanFeatureRow[] = [
  { id: 'meetings', group: 'Advice', label: 'Adviser meetings', values: ['1 per year', 'Quarterly', 'Monthly'] },
  { id: 'named', group: 'Advice', label: 'Named adviser', values: [false, true, 'Adviser team'] },
  { id: 'plan', group: 'Advice', label: 'Written financial plan', values: [true, true, true] },
  { id: 'reviews', group: 'Advice', label: 'Plan reviews', values: ['Annual', 'Quarterly', 'Monthly'] },
  { id: 'cashflow', group: 'Business', label: 'Cash-flow forecast', values: [false, true, true] },
  { id: 'reporting', group: 'Business', label: 'Management reporting', values: [false, 'Monthly summary', 'Monthly pack'] },
  { id: 'taxcal', group: 'Business', label: 'Tax-planning calendar', values: [false, true, true] },
  { id: 'transactions', group: 'Business', label: 'Transaction support', values: [false, false, 'Scoped separately'] },
  { id: 'response', group: 'Support', label: 'Response time (demo)', values: ['3 business days', '1 business day', 'Same day'] },
  { id: 'library', group: 'Support', label: 'Calculators & insights library', values: [true, true, true] },
];

export const addOns: AddOn[] = [
  { id: 'bookkeeping', name: 'Monthly bookkeeping', description: 'Reconciled books and a simple management report each month.', monthly: 420 },
  { id: 'forecast', name: 'Rolling cash-flow forecast refresh', description: 'A monthly refresh of your forecast and scenarios.', monthly: 180 },
  { id: 'family', name: 'Family governance session', description: 'A facilitated session for family decisions, twice a year.', monthly: 120 },
  { id: 'board', name: 'Board / investor pack support', description: 'Quarterly pack preparation and review.', monthly: 260 },
];

export const pricingFaqs: { q: string; a: string }[] = [
  { q: 'Are these real prices?', a: 'No. Every price on this site is a demonstration value included so the template shows how plans, discounts and add-ons are calculated. Replace them in src/config/plans.ts.' },
  { q: 'How is the annual price calculated?', a: 'Annual price = monthly price × 12, reduced by the plan’s annual discount percentage. The page shows the effective monthly equivalent and the saving compared with paying monthly.' },
  { q: 'Can I add services to a plan?', a: 'Yes — the optional add-ons update the estimated total instantly. In a real firm you would confirm scope in a written engagement letter.' },
  { q: 'Does clicking a plan buy or subscribe me to anything?', a: 'No. The plan buttons open an enquiry form pre-filled with your selection. Nothing is purchased and no payment is taken.' },
  { q: 'Do plans include tax or investment products?', a: 'This template makes no such claim. A real firm should state clearly what is and is not included, and any regulated activities involved.' },
  { q: 'Can I change or end an engagement?', a: 'In a real firm you would describe notice periods and change terms here. For this demonstration there are no contracts.' },
];
