/** Feature switches. Disabled features disappear from navigation, menus and routes. */
export const features = {
  /** Local demonstration order builder (add items, quantities, totals). */
  orderBuilder: true,
  reservations: true,
  journal: true,
  gallery: true,
  privateDining: true,
  /** Reveal-on-scroll animation (also disabled by prefers-reduced-motion). */
  scrollReveal: true,
};

export const orderSettings = {
  /** Fractions: 0.08 = 8%. */
  taxRate: 0.08,
  serviceChargeRate: 0.125,
  taxAppliesToServiceCharge: false,
  maxQuantity: 20,
  disclaimer:
    'This is a planning tool only. No order is placed, paid for, or sent to the kitchen, and no payment is taken.',
};
