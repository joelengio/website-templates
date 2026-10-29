import { img } from './images';
import type { Faq, Service } from './types';

const f = (q: string, a: string): Faq => ({ q, a });

/** All prices are illustrative placeholders. Replace `priceFrom` and `priceLabel` with your own. */
export const services: Service[] = [
  {
    slug: 'full-wedding-planning',
    questionnaireId: 'full',
    title: 'Full Wedding Planning',
    tagline: 'Every decision, composed and carried.',
    summary: 'From the first conversation to the last dance, a dedicated team designs, manages and delivers your entire celebration.',
    description: [
      'Full planning is for couples who want the experience of their wedding to be as beautiful as the day itself. We take on the creative direction, the logistics and the thousand small decisions between, so you can stay present for what matters.',
      'You will have a lead planner and a designer from the first meeting, a single shared plan that tracks every supplier and deadline, and a studio that treats your budget with the same care as its own.'
    ],
    priceLabel: 'From $14,500',
    priceFrom: 14500,
    idealFor: 'Couples planning a 60–200 guest celebration over 9–18 months',
    stages: [
      { title: 'Discovery', text: 'A long conversation about who you are, how you want guests to feel, and what matters most. We leave with a creative brief.' },
      { title: 'Design & venue', text: 'Mood boards, venue shortlists, and a preliminary budget. We negotiate and secure the venue and key suppliers.' },
      { title: 'Build', text: 'Menus, florals, music, stationery, rentals, guest experience and accommodation are designed and confirmed.' },
      { title: 'Refine', text: 'Tastings, trials, run-sheets and a full walk-through. Every detail is checked and re-checked.' },
      { title: 'Celebrate', text: 'The full team is on site from first delivery to the last departure, managing everything quietly.' }
    ],
    inclusions: [
      'Dedicated lead planner and designer',
      'Creative direction and mood boards',
      'Venue search, negotiation and booking',
      'Supplier sourcing, briefing and management',
      'Budget tracking and payment calendar',
      'Guest accommodation and transport planning',
      'Two on-site walk-throughs',
      'Full-day coordination team'
    ],
    faqs: [
      f('When should we start?', 'We recommend 12–18 months before the wedding, particularly for peak dates and destination locations.'),
      f('Can we keep some tasks ourselves?', 'Of course. Many couples keep one or two creative tasks — the vows, a playlist — and we plan around them.'),
      f('Is the price all-inclusive?', 'The planning fee covers our time and team. Venue, suppliers and rentals are budgeted separately and passed through at cost.')
    ],
    image: img('como-gardens')
  },
  {
    slug: 'partial-planning',
    questionnaireId: 'partial',
    title: 'Partial Planning',
    tagline: 'Expert guidance where you need it.',
    summary: 'You plan the big picture; we step in for the pieces that need a professional — suppliers, timelines and design.',
    description: [
      'Partial planning is designed for couples who have started, have strong instincts, and want a trusted professional alongside them. We agree the scope together — whether it is supplier introductions, a design review or logistics — and tailor our support to it.',
      'You keep creative control and the satisfaction of making many of the decisions, while avoiding costly mistakes and the stress of managing a dozen suppliers alone.'
    ],
    priceLabel: 'From $6,200',
    priceFrom: 6200,
    idealFor: 'Couples who have a venue and want expert support for the remainder',
    stages: [
      { title: 'Review', text: 'We review your plans, contracts and budget and agree where support will help most.' },
      { title: 'Scope', text: 'A written scope of the areas we will manage, with named deliverables and dates.' },
      { title: 'Support', text: 'Regular check-ins, supplier introductions, design and timeline reviews, and contract advice.' },
      { title: 'Handover', text: 'A final run-sheet and briefing, then our day-of team takes over.' }
    ],
    inclusions: [
      'Initial planning review session',
      'Supplier recommendations and introductions',
      'Contract and timeline review',
      'Monthly planning calls',
      'Design and styling advice',
      'Day-of coordination team',
      'Rehearsal management'
    ],
    faqs: [
      f('Can partial planning grow into full planning?', 'Yes. If you decide you want more support, we can extend the scope at the same rate.'),
      f('Do you need to approve our suppliers?', 'No, but we are happy to advise and will flag any contractual concerns.')
    ],
    image: img('bouquet-blush', { position: '50% 40%' })
  },
  {
    slug: 'wedding-day-coordination',
    questionnaireId: 'coordination',
    title: 'Wedding Day Coordination',
    tagline: 'You plan it. We make sure it unfolds.',
    summary: 'A seasoned team takes over four to six weeks before, so the day runs exactly as you imagined.',
    description: [
      'Coordination is the quietest of our services and often the most valuable. We review everything you have arranged, speak to each supplier, build a minute-by-minute timeline and then run the day so that you and your family do not have to.',
      'On the morning, you will be greeted by a calm team who already know the plan, the people and the contingencies.'
    ],
    priceLabel: 'From $3,400',
    priceFrom: 3400,
    idealFor: 'Couples who have planned themselves and want a calm, experienced hand on the day',
    stages: [
      { title: 'Handover', text: 'Six weeks before, we receive your plans, contracts and contacts and review them in detail.' },
      { title: 'Confirm', text: 'We contact every supplier, confirm arrival times and fill gaps in the plan.' },
      { title: 'Rehearse', text: 'We run the ceremony rehearsal and brief the wedding party.' },
      { title: 'Deliver', text: 'Two coordinators and an assistant manage the day from set-up to send-off.' }
    ],
    inclusions: [
      'Pre-wedding planning meeting',
      'Supplier confirmation calls',
      'Detailed day-of timeline',
      'Ceremony rehearsal',
      'Up to 12 hours of on-site coordination',
      'Two coordinators and an assistant',
      'Emergency kit and contingency plan'
    ],
    faqs: [
      f('How early should we book?', 'Ideally 4–6 months out, though we can sometimes accommodate shorter timelines.'),
      f('Can you help if our venue has its own coordinator?', 'Yes — we work alongside venue teams, and we represent you and your guests.')
    ],
    image: img('table-white', { position: '50% 45%' })
  },
  {
    slug: 'destination-weddings',
    questionnaireId: 'destination',
    title: 'Destination Weddings',
    tagline: 'Remarkable places, handled end-to-end.',
    summary: 'Scouting, legal guidance, local partners and guest travel for weddings anywhere in our destination portfolio.',
    description: [
      'A destination wedding invites guests into a place as well as a day. We have trusted local partners in each of our destinations, and our team handles the complexity so that your celebration feels simple.',
      'We scout every venue in person, guide you through legal and paperwork requirements, and create a guest journey that makes travelling a pleasure rather than an obligation.'
    ],
    priceLabel: 'From $18,500',
    priceFrom: 18500,
    idealFor: 'Couples planning a wedding abroad with 30–150 guests',
    stages: [
      { title: 'Location', text: 'We help you choose a destination and shortlist venues, matched to season, guest list and budget.' },
      { title: 'Scouting', text: 'At least one planner visit to confirm venues, meet local suppliers and plan the logistics.' },
      { title: 'Paperwork', text: 'Guidance on legal requirements, with referrals to local officials for legal advice.' },
      { title: 'Guest journey', text: 'Travel, accommodation, welcome events and printed guides for your guests.' },
      { title: 'Weekend', text: 'Our team travels to run the weekend, supported by local partners.' }
    ],
    inclusions: [
      'Destination and venue shortlist',
      'In-person scouting trip',
      'Local supplier network',
      'Guest accommodation blocks',
      'Welcome and farewell events',
      'Legal paperwork guidance',
      'On-site team for the entire weekend'
    ],
    faqs: [
      f('Do we have to marry legally at the destination?', 'Not always. Many couples marry legally at home and hold a symbolic ceremony abroad. We explain the options for each destination and recommend you confirm requirements with official sources.'),
      f('Who pays for the travel of your team?', 'Travel is budgeted transparently as a pass-through cost with no mark-up.')
    ],
    image: img('amalfi-town')
  },
  {
    slug: 'venue-styling',
    questionnaireId: 'styling',
    title: 'Venue Styling',
    tagline: 'Spaces dressed to feel like yours.',
    summary: 'Layout, lighting, linen, furniture and detail — a venue transformed with restraint and craft.',
    description: [
      'Good styling does not announce itself. We study the architecture, the light and the season, then add only what a space needs — table landscapes, lighting, furniture, signage and small touches that make guests feel considered.',
      'Venue styling can be commissioned alone or combined with planning, and always includes a site visit, a scaled layout and a full installation team.'
    ],
    priceLabel: 'From $4,800',
    priceFrom: 4800,
    idealFor: 'Couples with a venue who want it to feel unmistakably theirs',
    stages: [
      { title: 'Site visit', text: 'We measure, photograph and study the light at the time your event will take place.' },
      { title: 'Concept', text: 'A design board covering palette, textiles, tableware, lighting and layout.' },
      { title: 'Sourcing', text: 'Rental, custom and bespoke pieces are sourced, tested and confirmed.' },
      { title: 'Install', text: 'Our team arrives the day before and dresses the space.' }
    ],
    inclusions: [
      'Site visit and scaled layout',
      'Design concept and mood board',
      'Table landscape design',
      'Lighting and candle plan',
      'Furniture and rental sourcing',
      'Full installation and breakdown'
    ],
    faqs: [
      f('Can you work with our venue’s furniture?', 'Yes, and we often prefer to. We add or replace only what elevates the design.'),
      f('Do you offer rental items?', 'We have a small in-house collection and use specialist rental partners for the rest.')
    ],
    image: img('table-banquet')
  },
  {
    slug: 'floral-and-event-design',
    questionnaireId: 'floral',
    title: 'Floral & Event Design',
    tagline: 'Flowers as architecture, light as atmosphere.',
    summary: 'Seasonal floral installations, ceremony structures, bouquets and tablescapes created in our own studio.',
    description: [
      'Our floral studio designs for each wedding afresh, working with growers who cultivate seasonally. We favour natural movement, generous scale and a limited palette that feels edited rather than ornate.',
      'From a single bridal bouquet to a hanging installation over an entire ballroom, our designers build, transport and install everything personally.'
    ],
    priceLabel: 'From $3,900',
    priceFrom: 3900,
    idealFor: 'Couples who want flowers to be a defining feature of the day',
    stages: [
      { title: 'Consult', text: 'A conversation about colour, mood, season and budget, often with sample stems.' },
      { title: 'Proposal', text: 'A detailed floral proposal with sketches and an itemised budget.' },
      { title: 'Mock-up', text: 'We prepare a sample arrangement or table for your approval.' },
      { title: 'Install', text: 'Hand-built in the studio and installed on the day by our team.' }
    ],
    inclusions: [
      'Floral concept and sketches',
      'Bridal and wedding-party flowers',
      'Ceremony structures and aisle design',
      'Reception centrepieces',
      'Seasonal sourcing from specialist growers',
      'Installation and collection'
    ],
    faqs: [
      f('Can you design with out-of-season flowers?', 'We always recommend seasonal blooms, but we will be honest about any compromises in colour or availability.'),
      f('Do you offer dried or sustainable options?', 'Yes. We use foam-free mechanics, and dried or preserved elements where they suit the design.')
    ],
    image: img('florals-dahlia')
  },
  {
    slug: 'private-celebrations',
    questionnaireId: 'private',
    title: 'Private Celebrations',
    tagline: 'Landmark moments, thoughtfully hosted.',
    summary: 'Milestone birthdays, anniversaries, vow renewals and family gatherings planned with wedding-level attention.',
    description: [
      'Not every celebration is a wedding, and the best ones are often the most personal. We plan milestone birthdays, anniversary dinners, engagement parties and vow renewals, always starting with who will be in the room.',
      'We design for the people, not the format — whether that is an intimate supper for twelve or a weekend away for eighty.'
    ],
    priceLabel: 'From $5,500',
    priceFrom: 5500,
    idealFor: 'Hosts planning a milestone for 10–120 guests',
    stages: [
      { title: 'Listen', text: 'We learn about the guest of honour and the people who love them.' },
      { title: 'Plan', text: 'Venue, food, music and styling are brought together in a considered proposal.' },
      { title: 'Prepare', text: 'Suppliers are confirmed, guests are briefed and details are tested.' },
      { title: 'Host', text: 'Our team looks after the event so that you can be a guest at your own party.' }
    ],
    inclusions: [
      'Event design and planning',
      'Venue and supplier sourcing',
      'Menu and drinks design',
      'Styling and florals',
      'Guest communication',
      'On-site hosting team'
    ],
    faqs: [
      f('Is there a minimum guest count?', 'No. We have planned dinners for six and weekends for eighty.'),
      f('Can you plan surprise celebrations?', 'Yes — discretion is built into how we work.')
    ],
    image: img('detail-champagne')
  },
  {
    slug: 'corporate-events',
    questionnaireId: 'corporate',
    title: 'Corporate Events',
    tagline: 'Gatherings with the polish of a wedding.',
    summary: 'Retreats, brand evenings, award dinners and client hospitality with considered design and flawless delivery.',
    description: [
      'We bring the same attention to hospitality and detail that defines our weddings to corporate gatherings. Our events are designed to feel generous and human, and to leave guests with a clear impression of the host.',
      'We work to brief and budget, with clear reporting and a single point of contact from first meeting to final invoice.'
    ],
    priceLabel: 'From $7,500',
    priceFrom: 7500,
    idealFor: 'Teams hosting retreats, dinners or launches for 30–300 guests',
    stages: [
      { title: 'Brief', text: 'We agree objectives, audience, budget and measures of success.' },
      { title: 'Concept', text: 'A creative concept, venue shortlist and programme outline.' },
      { title: 'Production', text: 'Suppliers, staging, catering and travel are procured and managed.' },
      { title: 'Delivery', text: 'Our team runs the event on site, with a post-event report.' }
    ],
    inclusions: [
      'Event concept and programme design',
      'Venue sourcing and negotiation',
      'Catering and drinks design',
      'Production and staging',
      'Guest registration and communication',
      'Post-event report'
    ],
    faqs: [
      f('Do you work with corporate procurement?', 'Yes. We can provide supplier documentation, insurance details and itemised quotations.'),
      f('Can you plan events outside the studio’s home region?', 'Yes, through our network of destination partners.')
    ],
    image: img('ballroom-hall')
  }
];

export const getService = (slug?: string) => services.find((s) => s.slug === slug);
