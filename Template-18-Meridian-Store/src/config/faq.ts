import type { FaqGroup } from './types';

/** FAQ / support content. Rates quoted here should match src/config/commerce.ts; replace all text with your own policies. */
export const faqGroups: FaqGroup[] = [
  {
    id: 'shipping', title: 'Shipping',
    items: [
      { q: 'How much does shipping cost?', a: 'Shipping is calculated from your destination at checkout. In this demonstration, US standard delivery is $8 and free on orders of $150 or more after discounts; express delivery is $22. Other regions are listed in the checkout delivery step.' },
      { q: 'How long will delivery take?', a: 'Demonstration estimates: US standard 3–5 business days, express 1–2 business days; international 5–14 business days depending on region. No real parcels are ever shipped by this template.' },
      { q: 'Do you ship internationally?', a: 'The demonstration store lists the United States, Canada, the United Kingdom, selected EU countries, Australia, Japan and Singapore. Edit the shipping zones in src/config/commerce.ts to match your business.' }
    ]
  },
  {
    id: 'returns', title: 'Returns',
    items: [
      { q: 'What is the returns policy?', a: 'Demonstration policy: unworn, unused items in original packaging may be returned within 30 days for a refund to the original payment method. Replace this with your real policy.' },
      { q: 'How do I start a return?', a: 'In a real store you would use a returns portal or contact support with your order reference. In this demonstration, orders are local to your browser and nothing is processed.' }
    ]
  },
  {
    id: 'exchanges', title: 'Exchanges',
    items: [
      { q: 'Can I exchange for a different size or colour?', a: 'Demonstration policy: yes, subject to availability, within 30 days. Contact support with your order reference and the item you would like instead.' },
      { q: 'What if my item arrives damaged?', a: 'Contact us within 7 days with photographs. In a real store you would offer a replacement or refund.' }
    ]
  },
  {
    id: 'payment', title: 'Payment',
    items: [
      { q: 'Which payment methods do you accept?', a: 'None. This template does not collect or process payments: there is no card form, no payment authorisation and no payment provider connected. A real store would add a payment provider such as Stripe, Shopify Payments or WooCommerce gateways.' },
      { q: 'Is my information safe?', a: 'The demonstration checkout keeps everything in your browser. Nothing is sent to a server, and you should only use fictional sample details. Never type real card numbers; the demo will refuse values that look like card numbers.' }
    ]
  },
  {
    id: 'demo-orders', title: 'Demonstration orders',
    items: [
      { q: 'Did my demo order really go through?', a: 'No. Confirming a DEMO order creates a summary and a reference such as MER-DEMO-261029-ABCD and saves it in your browser so you can review it under Order history. No order is placed, paid for or transmitted.' },
      { q: 'How do I remove my demo data?', a: 'Open Order history (or the Privacy page) and choose "Reset demo data" to remove the saved bag, wishlist, recently viewed items and demo orders from this browser.' }
    ]
  },
  {
    id: 'help', title: 'Customer help',
    items: [
      { q: 'How do I find the right size?', a: 'Each apparel product lists its fit and model height. If you are between sizes, size up for a looser fit. Sizes and fit notes are demonstration content.' },
      { q: 'How can I contact you?', a: 'Use the contact form or the email address on the Contact page. The form is a demonstration and does not send anything.' }
    ]
  }
];
