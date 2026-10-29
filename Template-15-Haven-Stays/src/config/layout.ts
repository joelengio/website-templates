/** Which pages exist and which homepage sections appear — in order. Set enabled: false to hide, reorder to move. */
export const pages = {
  rooms: true,
  booking: true,
  dining: true,
  experiences: true,
  offers: true,
  gallery: true,
  about: true,
  explore: true,
  journal: true,
  contact: true,
};

export type HomeSectionId =
  | 'intro'
  | 'rooms'
  | 'experiences'
  | 'amenities'
  | 'dining'
  | 'wellness'
  | 'destination'
  | 'offers'
  | 'reviews'
  | 'journal'
  | 'cta';

export const homeSections: { id: HomeSectionId; enabled: boolean }[] = [
  { id: 'intro', enabled: true },
  { id: 'rooms', enabled: true },
  { id: 'experiences', enabled: true },
  { id: 'amenities', enabled: true },
  { id: 'dining', enabled: true },
  { id: 'wellness', enabled: true },
  { id: 'destination', enabled: true },
  { id: 'offers', enabled: true },
  { id: 'reviews', enabled: true },
  { id: 'journal', enabled: true },
  { id: 'cta', enabled: true },
];

export const hero = {
  image: { src: '/images/hero-coast.webp', alt: 'Illustration of terraced stone villas above a cove at sunset' },
  kicker: 'Cala Verana · Est. 2026 (fictional)',
  title: 'A quieter kind of luxury',
  text: 'Twenty-four rooms, suites and villas set into an olive-terraced hillside above a private cove. Slow mornings, long lunches, and nowhere you need to be.',
  /** Show the booking search widget over the hero. */
  showBookingWidget: true,
};

export const navigation = {
  main: [
    { label: 'Rooms & Suites', to: '/rooms', page: 'rooms' },
    { label: 'Offers', to: '/offers', page: 'offers' },
    { label: 'Dining', to: '/dining', page: 'dining' },
    { label: 'Experiences', to: '/experiences', page: 'experiences' },
    { label: 'Gallery', to: '/gallery', page: 'gallery' },
    { label: 'Explore', to: '/explore', page: 'explore' },
    { label: 'About', to: '/about', page: 'about' },
    { label: 'Contact', to: '/contact', page: 'contact' },
  ] as { label: string; to: string; page: keyof typeof pages }[],
  cta: { label: 'Reserve', to: '/booking' },
  footerColumns: [
    {
      title: 'Stay',
      links: [
        { label: 'Rooms & Suites', to: '/rooms' },
        { label: 'Offers & Packages', to: '/offers' },
        { label: 'Reserve a stay', to: '/booking' },
        { label: 'Manage a reservation', to: '/reservations' },
      ],
    },
    {
      title: 'Discover',
      links: [
        { label: 'Dining', to: '/dining' },
        { label: 'Experiences', to: '/experiences' },
        { label: 'Explore the coast', to: '/explore' },
        { label: 'Journal', to: '/journal' },
      ],
    },
    {
      title: 'Haven',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Gallery', to: '/gallery' },
        { label: 'Contact & FAQ', to: '/contact' },
        { label: 'Policies', to: '/contact#policies' },
      ],
    },
  ],
};
