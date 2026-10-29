/** Route-level title and description. Titles are passed through site.seo.titleTemplate. */
export const seoRoutes: Record<string, { title: string; description: string }> = {
  '/': { title: 'Boutique hotel & resort', description: 'Haven Stays — a fictional boutique resort of terraced stone villas above a private cove. Browse rooms, offers, dining and try the local booking demonstration.' },
  '/rooms': { title: 'Rooms & Suites', description: 'Filter and compare ten rooms, suites and villas — from garden kings to a private pool villa.' },
  '/booking': { title: 'Reserve your stay', description: 'Choose dates, guests and a room, review a transparent price breakdown and confirm a local demonstration booking.' },
  '/reservations': { title: 'Manage a reservation', description: 'View, change or cancel the demonstration reservations stored in this browser.' },
  '/offers': { title: 'Offers & Packages', description: 'Seasonal offers, couples retreats, family vacations, wellness getaways and extended-stay savings.' },
  '/dining': { title: 'Dining', description: 'Restaurants, a terrace café, a bronze bar and private dining with menus and opening hours.' },
  '/experiences': { title: 'Experiences', description: 'Wellness rituals, sailing, hikes, culinary classes and private experiences at Haven Stays.' },
  '/gallery': { title: 'Gallery', description: 'A categorized gallery of the resort, rooms, dining, wellness and destination.' },
  '/about': { title: 'About', description: 'The story, philosophy, facilities, team and sustainability notes of Haven Stays.' },
  '/explore': { title: 'Explore the coast', description: 'Local attractions, travel tips and guides to the fictional coast around Haven Stays.' },
  '/journal': { title: 'Journal', description: 'Stories on dining, wellness, design and the destination.' },
  '/contact': { title: 'Contact & FAQ', description: 'Contact details, directions, FAQ and policies — plus a validated demonstration enquiry form.' },
};
