import type { NavItem, NavLink } from './types';

/** Primary navigation. An item with `mega` opens a mega menu on desktop and an accordion in the mobile menu. */
export const primaryNav: NavItem[] = [
  { label: 'New', href: '/collections/new-arrivals' },
  {
    label: 'Shop',
    href: '/shop',
    mega: {
      columns: [
        {
          title: 'Shop by category',
          links: [
            { label: 'All products', href: '/shop' },
            { label: 'Bags & accessories', href: '/shop?category=bags-accessories' },
            { label: 'Apparel', href: '/shop?category=apparel' },
            { label: 'Homeware', href: '/shop?category=homeware' },
            { label: 'Furniture & lighting', href: '/shop?category=furniture-lighting' },
            { label: 'Beauty & fragrance', href: '/shop?category=beauty' }
          ]
        },
        {
          title: 'Curated',
          links: [
            { label: 'Best sellers', href: '/shop?sort=bestsellers' },
            { label: 'New arrivals', href: '/shop?sort=newest&new=1' },
            { label: 'On sale', href: '/shop?sale=1' },
            { label: 'Gifts under $100', href: '/collections/gifts-under-100' }
          ]
        },
        {
          title: 'Help',
          links: [
            { label: 'Shipping & returns', href: '/faq#shipping' },
            { label: 'Demo checkout explained', href: '/demo' },
            { label: 'Order history (demo)', href: '/orders' }
          ]
        }
      ],
      feature: { title: 'The Leather Atelier', text: 'Totes, cardholders and crossbodies in full-grain leather.', href: '/collections/leather-atelier', cta: 'Explore the collection', image: '/images/collection-leather-atelier.webp', alt: 'A leather tote, cardholder and crossbody bag on a stone shelf' }
    }
  },
  {
    label: 'Collections',
    href: '/collections',
    mega: {
      columns: [
        {
          title: 'Collections',
          links: [
            { label: 'The Slow Home', href: '/collections/the-slow-home' },
            { label: 'The Leather Atelier', href: '/collections/leather-atelier' },
            { label: 'Linen & Wool', href: '/collections/linen-and-wool' },
            { label: 'Ritual & Fragrance', href: '/collections/ritual-and-fragrance' }
          ]
        },
        {
          title: 'More to explore',
          links: [
            { label: 'Light & Form', href: '/collections/light-and-form' },
            { label: 'Quiet Essentials', href: '/collections/quiet-essentials' },
            { label: 'Gifts Under $100', href: '/collections/gifts-under-100' },
            { label: 'All collections', href: '/collections' }
          ]
        }
      ],
      feature: { title: 'The Slow Home', text: 'Stoneware, wool and linen for unhurried rooms.', href: '/collections/the-slow-home', cta: 'Shop the collection', image: '/images/collection-the-slow-home.webp', alt: 'Stoneware mugs, a vase and a folded throw on a shelf' }
    }
  },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' }
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  { title: 'Shop', links: [{ label: 'All products', href: '/shop' }, { label: 'Collections', href: '/collections' }, { label: 'New arrivals', href: '/collections/new-arrivals' }, { label: 'Wishlist', href: '/wishlist' }] },
  { title: 'Help', links: [{ label: 'FAQ & support', href: '/faq' }, { label: 'Shipping', href: '/faq#shipping' }, { label: 'Returns & exchanges', href: '/faq#returns' }, { label: 'Contact', href: '/contact' }, { label: 'Order history (demo)', href: '/orders' }] },
  { title: 'Meridian', links: [{ label: 'Our story', href: '/about' }, { label: 'Journal', href: '/journal' }, { label: 'About this demo', href: '/demo' }] },
  { title: 'Legal', links: [{ label: 'Privacy & local storage', href: '/legal/privacy' }, { label: 'Terms of use', href: '/legal/terms' }, { label: 'Shipping & returns policy', href: '/legal/shipping-returns' }] }
];
