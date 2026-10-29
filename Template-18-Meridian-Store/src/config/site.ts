/**
 * Brand, contact, SEO and site-wide copy.
 * MERIDIAN STORE is a FICTIONAL demonstration retailer. The template publisher (OneStop Infinite) is credited separately in `publisher`.
 */
export const site = {
  brand: {
    name: 'MERIDIAN STORE',
    /** Shown in the header wordmark when a logo image is not used. */
    wordmark: 'MERIDIAN',
    wordmarkSub: 'STORE',
    tagline: 'Considered objects for a quieter home and wardrobe',
    logo: '/logo.svg',
    favicon: '/favicon.svg'
  },
  publisher: {
    name: 'OneStop Infinite',
    credit: 'Template by OneStop Infinite',
    url: 'https://www.onestopinfinite.example'
  },
  /** Public URL of the deployed site. Used for canonical links, sitemap.xml and Open Graph. Override with VITE_SITE_URL at build time. */
  url: 'https://www.example-meridian-store.com',
  contact: {
    email: 'hello@example-meridian-store.com',
    phone: '+1 (555) 010-4180',
    address: ['18 Meridian Lane', 'Studio 4', 'Portland, OR 97205', 'United States'],
    hours: 'Monday – Friday, 9:00 – 17:00 (Pacific)',
    responseTime: 'We aim to reply within two business days.'
  },
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
    { label: 'YouTube', href: 'https://www.youtube.com/' }
  ],
  seo: {
    titleTemplate: '%s — MERIDIAN STORE',
    defaultTitle: 'MERIDIAN STORE — Considered objects for home and wardrobe',
    defaultDescription: 'A premium editorial storefront template: browse a demonstration catalogue of bags, apparel, homeware, lighting and beauty with a real local cart and demo checkout.',
    ogImage: '/images/og-image.webp',
    twitterCard: 'summary_large_image',
    themeColor: '#faf7f2'
  },
  /** Announcement bar. `{freeShipping}` is replaced with the formatted free-shipping threshold. */
  announcement: {
    enabled: true,
    text: 'Free standard shipping on US orders over {freeShipping}',
    linkLabel: 'Shipping details',
    linkHref: '/faq#shipping'
  },
  demo: {
    banner: 'Demonstration store — products are fictional and no real orders or payments are taken.',
    checkoutNotice: 'This is a DEMONSTRATION checkout. No payment is requested, processed or authorised, and no order is placed or transmitted anywhere. Please use fictional details only.',
    confirmLabel: 'Confirm DEMO order',
    orderPrefix: 'MER-DEMO'
  },
  newsletter: {
    title: 'Notes from the studio',
    text: 'Quiet updates on new arrivals, restocks and journal stories. This is a demonstration form: your email is checked in your browser and is not stored or sent anywhere.',
    button: 'Subscribe (demo)',
    image: '/images/newsletter-bg.webp'
  },
  labels: {
    addToCart: 'Add to bag',
    cart: 'Bag',
    checkout: 'Checkout (demo)',
    wishlist: 'Wishlist',
    freeShippingMessage: 'You qualify for free standard shipping',
    soldOut: 'Sold out',
    comingSoon: 'Coming soon'
  },
  productPage: {
    shipping: 'Orders are dispatched from our demonstration studio within 1–2 business days. Delivery estimates and costs are calculated from the shipping rules in this template.',
    returns: 'Return unworn, unused items within 30 days for a refund to the original method (demonstration policy text — replace with your own).',
    care: 'Care and material notes are listed with each product. Colours may vary slightly between screens.'
  }
} as const;

export type Site = typeof site;
