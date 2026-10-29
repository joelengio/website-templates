import { img } from './images';
import type { Article } from './types';

/** Fictional editorial content written for demonstration. Edit freely or replace with your own journal. */
export const journalCategories = ['Planning', 'Design', 'Destinations', 'Real Weddings', 'Etiquette'];

export const articles: Article[] = [
  {
    slug: 'how-to-choose-a-wedding-date',
    title: 'How to choose a wedding date (without losing a year of sleep)',
    excerpt: 'Season, light, guests, weather and cost all pull in different directions. A calm framework for deciding.',
    category: 'Planning',
    date: '2025-09-14',
    readMinutes: 6,
    author: 'Theodore Okafor',
    image: img('provence-sunset'),
    tags: ['dates', 'seasons', 'budget'],
    sections: [
      { paragraphs: ['Choosing a date feels like a small decision and quickly becomes a large one. The date shapes the venue, the light, the flowers, the guest list and often the budget. Before you open a calendar, decide what you want the day to feel like.'] },
      { heading: 'Start with the feeling, not the month', paragraphs: ['A long, late-summer dinner outdoors suggests a different season than a candlelit winter celebration. Ask yourselves where you imagine standing and what the light looks like. The answer usually narrows the year to a few months.', 'Consider guests too. If grandparents or international friends are essential, school holidays and long weekends matter more than the perfect Saturday.'] },
      { heading: 'Think in shoulder seasons', paragraphs: ['The weeks just before and after peak season often combine good weather with better availability and pricing. May and September remain our most recommended months for destination weddings in Europe.'] },
      { heading: 'Hold two dates', paragraphs: ['Where possible, ask venues to hold two dates for a short period. It reduces pressure and lets you compare suppliers before committing.'] }
    ]
  },
  {
    slug: 'the-case-for-a-smaller-guest-list',
    title: 'The case for a smaller guest list',
    excerpt: 'Why many of our most memorable weddings have fewer than seventy guests, and how to get there kindly.',
    category: 'Planning',
    date: '2025-08-02',
    readMinutes: 5,
    author: 'Isabel Marchetti',
    image: img('amalfi-coast'),
    tags: ['guest list', 'intimate'],
    sections: [
      { paragraphs: ['A smaller wedding is not a lesser one. With fewer guests, budgets stretch further, conversations deepen and the day tends to feel more like a gathering than a production.'] },
      { heading: 'Decide your principles first', paragraphs: ['Agree on rules before you write names: for instance, people you have both seen in the last two years, or people who have been part of your lives personally rather than socially.'] },
      { heading: 'Spend on the experience', paragraphs: ['Every guest you remove frees budget to spend elsewhere — better food, nicer wine, more relaxed pacing, or flights for the people you most want there.'] },
      { heading: 'Be kind and clear', paragraphs: ['If you are saying no to people, do it early and personally where you can. A short, warm message goes a long way.'] }
    ]
  },
  {
    slug: 'designing-with-seasonal-flowers',
    title: 'Designing with seasonal flowers',
    excerpt: 'What is genuinely in bloom, month by month, and how to build a palette around it.',
    category: 'Design',
    date: '2025-07-11',
    readMinutes: 7,
    author: 'Wren Calloway',
    image: img('florals-dahlia'),
    tags: ['florals', 'seasonal', 'design'],
    sections: [
      { paragraphs: ['Seasonal flowers look better, last longer and cost less. They also tie a wedding to its moment, which is where the most memorable celebrations get their character.'] },
      { heading: 'Spring', paragraphs: ['Ranunculus, tulips, sweet peas and blossom branches give a soft, airy quality. Their delicacy suits outdoor ceremonies, but they need cool storage and careful handling.'] },
      { heading: 'Summer', paragraphs: ['Garden roses, delphinium, scabious and herbs offer abundance and fragrance. Choose a loose, gathered style that feels like a freshly picked garden.'] },
      { heading: 'Autumn', paragraphs: ['Dahlias, chrysanthemums, berries and foliage bring depth — burgundy, copper and plum. They pair well with candlelight and warm textiles.'] },
      { heading: 'Winter', paragraphs: ['Amaryllis, hellebores, evergreens and white flowers create quiet drama. Combine with lots of candles for a glowing room.'] }
    ]
  },
  {
    slug: 'a-weekend-in-tuscany-what-to-expect',
    title: 'A wedding weekend in Tuscany: what to expect',
    excerpt: 'From travel days to harvest dinners — how a Tuscan wedding weekend usually unfolds.',
    category: 'Destinations',
    date: '2025-06-20',
    readMinutes: 6,
    author: 'Isabel Marchetti',
    image: img('tuscany-vineyard'),
    tags: ['Tuscany', 'destination'],
    sections: [
      { paragraphs: ['Tuscany rewards slow weekends. Guests tend to arrive on Thursday, gather informally on Friday, and celebrate fully on Saturday before a relaxed Sunday brunch.'] },
      { heading: 'Thursday: arrivals', paragraphs: ['Keep the first evening light. A simple supper at the estate lets guests settle in and meet before the main event.'] },
      { heading: 'Saturday: the day itself', paragraphs: ['Summer afternoons are hot. Begin the ceremony after 17:00 and plan cooling touches: shade, fans, chilled water and linen.'] },
      { heading: 'Practicalities', paragraphs: ['Many estates cap the number of overnight guests. Plan transport carefully and confirm legal requirements with official sources well in advance.'] }
    ]
  },
  {
    slug: 'a-day-with-the-highland-piper',
    title: 'Real wedding: Highland Hearth',
    excerpt: 'An autumn castle weekend with a piper, a library whisky reception and a ceilidh.',
    category: 'Real Weddings',
    date: '2025-05-05',
    readMinutes: 4,
    author: 'Lucía Hartmann',
    image: img('highland-castle'),
    tags: ['Scotland', 'real wedding'],
    sections: [
      { paragraphs: ['Isla and Fraser (fictional) wanted tradition without stiffness. The result was a weekend that felt like a very good house party in a very old house.'] },
      { heading: 'The procession', paragraphs: ['A piper led guests along the shore to the ceremony, with the loch behind the couple and a sky that obligingly cleared an hour before.'] },
      { heading: 'The details', paragraphs: ['Deep burgundy florals, candles in every window and a drinks reception in the library set the tone. The ceilidh band had every generation on the floor by ten.'] }
    ]
  },
  {
    slug: 'planning-for-weather',
    title: 'Planning for weather: calm contingency design',
    excerpt: 'Every outdoor wedding needs a plan B. Here is how to make it as beautiful as plan A.',
    category: 'Planning',
    date: '2025-04-17',
    readMinutes: 5,
    author: 'Theodore Okafor',
    image: img('orangery-blossom'),
    tags: ['weather', 'contingency'],
    sections: [
      { paragraphs: ['Weather is the one variable no planner controls. What we can control is how prepared we are, and how good the alternative looks.'] },
      { heading: 'Design plan B first', paragraphs: ['Many couples treat the rain plan as an afterthought. We design it as carefully as the main plan, so that either version feels intentional.'] },
      { heading: 'Decide early', paragraphs: ['Set a clear decision time with the venue — usually 48 hours and again on the morning. Tell guests in advance how decisions will be communicated.'] },
      { heading: 'Embrace the elements', paragraphs: ['Umbrellas, blankets, pashminas and a warm drink on arrival make guests feel looked after whatever the forecast.'] }
    ]
  },
  {
    slug: 'writing-vows-that-sound-like-you',
    title: 'Writing vows that sound like you',
    excerpt: 'Practical advice for writing personal vows, from structure to length to delivery.',
    category: 'Etiquette',
    date: '2025-03-08',
    readMinutes: 4,
    author: 'Amir Desai',
    image: img('detail-rings'),
    tags: ['vows', 'ceremony'],
    sections: [
      { paragraphs: ['Personal vows are the most honest part of many ceremonies. They are also the part couples worry about most.'] },
      { heading: 'Keep to one minute', paragraphs: ['Aim for 150–200 words. Brevity gives each sentence weight.'] },
      { heading: 'Make specific promises', paragraphs: ['“I promise to always make the coffee” says more than “I promise to love you forever”. Specifics are memorable and funny, and they sound like you.'] },
      { heading: 'Practise out loud', paragraphs: ['Read them aloud several times, and print a copy in a large type on a card so nerves do not get in the way.'] }
    ]
  },
  {
    slug: 'the-long-table-dinner',
    title: 'The long table: designing the seated dinner',
    excerpt: 'Why one long table might be the best idea in wedding design — and how to make it work.',
    category: 'Design',
    date: '2025-02-12',
    readMinutes: 5,
    author: 'Wren Calloway',
    image: img('table-tulips'),
    tags: ['tables', 'reception', 'design'],
    sections: [
      { paragraphs: ['A single long table turns dinner into a shared event rather than a series of separate ones. It feels generous, and it photographs beautifully.'] },
      { heading: 'Work out the numbers', paragraphs: ['Allow 60–70 cm per guest. A table for 40 guests needs about 14 metres, which is why this style suits garden or barn settings best.'] },
      { heading: 'Keep the centre low', paragraphs: ['Use low arrangements, candles and herbs so guests can see each other across the table. Add a few taller pieces on pedestals for rhythm.'] },
      { heading: 'Seat with care', paragraphs: ['Mix people thoughtfully. A seating plan is, after all, a hosting gift.'] }
    ]
  },
  {
    slug: 'honest-guide-to-destination-wedding-costs',
    title: 'An honest guide to destination wedding costs',
    excerpt: 'Where money goes, where it does not, and what surprises couples most.',
    category: 'Destinations',
    date: '2025-01-22',
    readMinutes: 7,
    author: 'Isabel Marchetti',
    image: img('algarve-coast'),
    tags: ['budget', 'destination'],
    sections: [
      { paragraphs: ['A destination wedding is often assumed to be cheaper than one at home. Sometimes it is, but the costs are different, and surprises are common.'] },
      { heading: 'Where savings appear', paragraphs: ['Smaller guest lists, lower labour costs in some regions and shorter, more focused celebrations can reduce spending significantly.'] },
      { heading: 'Where costs hide', paragraphs: ['Scouting trips, local planning fees, translations, legal paperwork and guest transport add up. Always budget for a contingency of 10–15 per cent.'] },
      { heading: 'Be transparent with guests', paragraphs: ['Tell guests early about costs and offer a range of accommodation. Generosity of information is the kindest gift.'] }
    ]
  }
];

export const getArticle = (slug?: string) => articles.find((a) => a.slug === slug);

export const relatedArticles = (current: Article, count = 3) =>
  articles
    .filter((a) => a.slug !== current.slug)
    .map((a) => ({
      a,
      score: (a.category === current.category ? 3 : 0) + a.tags.filter((t) => current.tags.includes(t)).length * 2
    }))
    .sort((x, y) => y.score - x.score || +new Date(y.a.date) - +new Date(x.a.date))
    .slice(0, count)
    .map((r) => r.a);
