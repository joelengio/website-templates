import type { CommerceConfig, CountryOption } from './types';

/**
 * Pricing, shipping, tax and promotion rules. Everything the cart and checkout calculate is driven from here.
 * All illustrative: shipping rates, tax rates and promo codes are demonstration values, not tax or legal advice.
 */
export const commerce: CommerceConfig = {
  currency: { code: 'USD', locale: 'en-US' },
  defaultCountry: 'US',
  /** Highest quantity of one variant a customer may add (also capped by stock). */
  maxQtyPerLine: 10,
  /** Stock at or below this shows "Only N left" (demonstration inventory, not live data). */
  lowStockThreshold: 5,
  shipping: {
    /** The free-shipping threshold shown across the site is read from the `freeOver` value of the default country's standard method. */
    zones: [
      {
        id: 'us', label: 'United States', countries: ['US'],
        methods: [
          { id: 'standard', label: 'Standard delivery', description: 'Tracked, signature not required.', eta: '3–5 business days', price: 8, freeOver: 150 },
          { id: 'express', label: 'Express delivery', description: 'Priority handling and tracked courier.', eta: '1–2 business days', price: 22 }
        ]
      },
      {
        id: 'ca', label: 'Canada', countries: ['CA'],
        methods: [
          { id: 'standard', label: 'Standard delivery', description: 'Tracked delivery.', eta: '5–8 business days', price: 14, freeOver: 250 },
          { id: 'express', label: 'Express delivery', description: 'Priority tracked courier.', eta: '2–4 business days', price: 34 }
        ]
      },
      {
        id: 'uk', label: 'United Kingdom', countries: ['GB'],
        methods: [
          { id: 'standard', label: 'Standard delivery', description: 'Tracked delivery.', eta: '4–7 business days', price: 12, freeOver: 250 },
          { id: 'express', label: 'Express delivery', description: 'Priority tracked courier.', eta: '2–3 business days', price: 30 }
        ]
      },
      {
        id: 'eu', label: 'European Union', countries: ['DE', 'FR', 'IE', 'NL', 'ES', 'IT'],
        methods: [
          { id: 'standard', label: 'Standard delivery', description: 'Tracked delivery.', eta: '5–9 business days', price: 14, perExtraItem: 2, freeOver: 300 },
          { id: 'express', label: 'Express delivery', description: 'Priority tracked courier.', eta: '3–5 business days', price: 36 }
        ]
      },
      {
        id: 'row', label: 'Rest of world', countries: ['AU', 'JP', 'SG'],
        methods: [{ id: 'standard', label: 'International delivery', description: 'Tracked delivery. Duties may apply on arrival.', eta: '7–14 business days', price: 28, perExtraItem: 4 }]
      }
    ]
  },
  tax: {
    enabled: true,
    /** 'exclusive' = tax is added at checkout (US style). 'inclusive' = prices already contain tax. Individual rates may override. */
    mode: 'exclusive',
    /** Whether shipping is included in the taxable amount for exclusive taxes. */
    taxShipping: false,
    defaultRatePct: 0,
    rates: [
      { country: 'US', ratePct: 6, label: 'Sales tax (estimate)' },
      { country: 'US', region: 'CA', ratePct: 7.25, label: 'Sales tax (estimate)' },
      { country: 'US', region: 'NY', ratePct: 8.875, label: 'Sales tax (estimate)' },
      { country: 'US', region: 'OR', ratePct: 0, label: 'Sales tax' },
      { country: 'CA', ratePct: 5, label: 'GST (estimate)' },
      { country: 'GB', ratePct: 20, label: 'VAT included', inclusive: true },
      { country: 'DE', ratePct: 19, label: 'VAT included', inclusive: true },
      { country: 'FR', ratePct: 20, label: 'VAT included', inclusive: true },
      { country: 'IE', ratePct: 23, label: 'VAT included', inclusive: true },
      { country: 'NL', ratePct: 21, label: 'VAT included', inclusive: true },
      { country: 'ES', ratePct: 21, label: 'VAT included', inclusive: true },
      { country: 'IT', ratePct: 22, label: 'VAT included', inclusive: true },
      { country: 'AU', ratePct: 10, label: 'GST included', inclusive: true }
    ]
  },
  promos: [
    { code: 'WELCOME10', type: 'percent', value: 10, description: '10% off your order' },
    { code: 'MERIDIAN25', type: 'percent', value: 25, minSubtotal: 200, maxDiscount: 120, description: '25% off orders over $200 (max $120)' },
    { code: 'SAVE20', type: 'fixed', value: 20, minSubtotal: 100, description: '$20 off orders over $100' },
    { code: 'FREESHIP', type: 'free-shipping', value: 0, description: 'Free standard shipping' },
    { code: 'OLDSEASON', type: 'percent', value: 30, expiresAt: '2020-01-01', description: 'Expired demonstration code' }
  ]
};

/** Country names for the checkout form. Only countries that appear in a shipping zone are offered. */
export const countryNames: Record<string, string> = {
  US: 'United States', CA: 'Canada', GB: 'United Kingdom', DE: 'Germany', FR: 'France', IE: 'Ireland', NL: 'Netherlands', ES: 'Spain', IT: 'Italy', AU: 'Australia', JP: 'Japan', SG: 'Singapore'
};
export const countryOptions = (): CountryOption[] =>
  commerce.shipping.zones.flatMap((z) => z.countries).map((code) => ({ code, name: countryNames[code] ?? code }));
