import type { LegalPage } from './types';

/** Legal and policy pages (rendered at /legal/:slug). This is placeholder text for a demonstration — have real policies reviewed by a qualified professional. */
export const legalPages: LegalPage[] = [
  {
    slug: 'privacy', title: 'Privacy & local storage', updated: '2026-10-01',
    intro: 'MERIDIAN STORE is a demonstration website. It has no server, no accounts and no analytics, and it does not send any information you enter to any external service.',
    sections: [
      { heading: 'What is stored in your browser', paragraphs: ['To demonstrate a shopping bag, wishlist and order history, the site uses your browser\'s localStorage. The keys are: meridian-store:cart:v1 (items in your bag and applied promo code), meridian-store:wishlist:v1 (saved product IDs), meridian-store:orders:v1 (demonstration orders, including the sample contact and delivery details you typed), meridian-store:recent:v1 (recently viewed product IDs) and meridian-store:theme-preference (if present).', 'This data never leaves your device. You can remove it at any time with "Reset demo data" or by clearing your browser\'s site data.'] },
      { heading: 'Sample details only', paragraphs: ['The demonstration checkout asks for contact and delivery details only so the order summary looks realistic. Please enter fictional information. The checkout never asks for card numbers, CVV codes, passwords or banking credentials, and refuses values that look like card numbers.'] },
      { heading: 'If you adapt this template', paragraphs: ['A real store must publish its own privacy notice describing the data it collects, the legal basis, retention periods, processors and customer rights. Replace this page accordingly.'] }
    ]
  },
  {
    slug: 'terms', title: 'Terms of use', updated: '2026-10-01',
    intro: 'These placeholder terms describe the demonstration nature of MERIDIAN STORE.',
    sections: [
      { heading: 'Demonstration only', paragraphs: ['Products, prices, stock levels, reviews, people and businesses shown on this site are fictional. Nothing on this site is an offer to sell and no contract is formed by using the demonstration checkout.'] },
      { heading: 'Template licence', paragraphs: ['The website template is published by OneStop Infinite. See the LICENSE file shipped with the template for the terms under which it may be used.'] }
    ]
  },
  {
    slug: 'shipping-returns', title: 'Shipping & returns policy', updated: '2026-10-01',
    intro: 'Demonstration policy text. Replace with your own before launching a real store.',
    sections: [
      { heading: 'Shipping', paragraphs: ['Orders would be dispatched within one to two business days. Delivery costs and estimates are calculated at checkout from the rules in src/config/commerce.ts.'] },
      { heading: 'Returns and exchanges', paragraphs: ['Unworn, unused items may be returned within 30 days of delivery. Exchanges are subject to availability. Items damaged in transit should be reported within seven days.'] }
    ]
  }
];
