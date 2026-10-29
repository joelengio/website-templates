import type { Article } from './types';
import { journalImages as ji } from './images';

/**
 * ─── JOURNAL ───────────────────────────────────────────────────────────────
 * All articles are FICTIONAL demonstration content and are not medical advice.
 */
export const journalNotice =
  'Demonstration editorial content written for the template. Not medical advice — replace with your own articles.';

export const journalCategories = ['Rest', 'Skin', 'Mindfulness', 'Seasonal', 'Rituals'];

export const articles: Article[] = [
  {
    slug: 'the-art-of-slow-mornings',
    title: 'The Art of Slow Mornings',
    excerpt: 'Five small habits that make the first hour of the day feel less like a sprint.',
    category: 'Rest',
    author: 'Amara Ellison',
    date: '2026-03-04',
    readMinutes: 5,
    image: ji[0],
    body: [
      { type: 'p', text: 'Most of us begin the day by reaching for a screen. A slow morning is a gentle protest against that reflex: a small window in which nothing is demanded of you yet.' },
      { type: 'h2', text: 'Start with light' },
      { type: 'p', text: 'Open the curtains before you open your phone. Natural light is one of the simplest cues for the body that the day has begun.' },
      { type: 'h2', text: 'Five habits to try' },
      { type: 'list', items: ['Drink a glass of water before coffee', 'Stretch for two minutes', 'Leave your phone in another room', 'Write one line of intention', 'Eat something warm, sitting down'] },
      { type: 'quote', text: 'Slowness is not laziness. It is attention, given generously.' },
      { type: 'p', text: 'None of this needs to be perfect. Choose one habit and keep it for a week before adding another.' }
    ]
  },
  {
    slug: 'understanding-your-skin-barrier',
    title: 'Understanding Your Skin Barrier',
    excerpt: 'Why less is often more when skin feels tight, flushed or sensitive.',
    category: 'Skin',
    author: 'Priya Nair',
    date: '2026-02-18',
    readMinutes: 6,
    image: ji[3],
    body: [
      { type: 'p', text: 'The skin barrier is the outermost layer that keeps moisture in and irritants out. When it is disrupted, skin can feel tight, look red or react to products it once tolerated.' },
      { type: 'h2', text: 'Signs your barrier needs support' },
      { type: 'list', items: ['Tightness after cleansing', 'Stinging with usually gentle products', 'Dry patches alongside breakouts', 'Redness that comes and goes'] },
      { type: 'h2', text: 'A simple reset' },
      { type: 'p', text: 'Pause strong actives, choose a gentle cleanser, and layer a fragrance-free moisturiser. Give skin two to four weeks before reintroducing anything new.' },
      { type: 'p', text: 'This article is general, fictional demonstration content. For skin concerns, speak with a qualified professional.' }
    ]
  },
  {
    slug: 'a-beginners-guide-to-breathwork',
    title: "A Beginner's Guide to Breathwork",
    excerpt: 'A simple three-step practice to settle the mind in under five minutes.',
    category: 'Mindfulness',
    author: 'Lena Kowalski',
    date: '2026-01-27',
    readMinutes: 4,
    image: ji[1],
    body: [
      { type: 'p', text: 'Breath is the one automatic function we can also steer. Slowing it can signal safety to the body and make space between a stressful thought and our response.' },
      { type: 'h2', text: 'Try this: 4-6 breathing' },
      { type: 'list', items: ['Sit comfortably and soften your shoulders', 'Inhale through the nose for a count of four', 'Exhale slowly for a count of six', 'Repeat for three minutes'] },
      { type: 'quote', text: 'A longer exhale is an invitation to let go.' },
      { type: 'p', text: 'If you feel dizzy, return to normal breathing. People with respiratory or medical conditions should seek professional guidance.' }
    ]
  },
  {
    slug: 'winter-rituals-for-warmth',
    title: 'Winter Rituals for Warmth',
    excerpt: 'Hot stones, spiced tea and the case for staying in.',
    category: 'Seasonal',
    author: 'Noor Haddad',
    date: '2025-12-09',
    readMinutes: 5,
    image: ji[2],
    body: [
      { type: 'p', text: 'Cold weather asks us to retreat a little. Rather than fight it, we design our winter menu around warmth: heated stones, steaming towels, spice and soft light.' },
      { type: 'h2', text: 'At-home warmth' },
      { type: 'list', items: ['A foot soak with Epsom salts', 'A warm oil self-massage before bed', 'Spiced pear tea', 'An early night, no screens'] },
      { type: 'p', text: 'Winter is not a season to push through. It is a season to be tended.' }
    ]
  },
  {
    slug: 'what-to-expect-at-your-first-massage',
    title: 'What to Expect at Your First Massage',
    excerpt: 'From the consultation to aftercare — a calm walk-through.',
    category: 'Rituals',
    author: 'Mateo Ruiz',
    date: '2025-11-14',
    readMinutes: 5,
    image: ji[6],
    body: [
      { type: 'p', text: 'Your first massage should feel easy. Here is what happens, so there are no surprises.' },
      { type: 'h2', text: 'Before you begin' },
      { type: 'p', text: 'Your therapist will ask about your goals, any injuries and pressure preferences. You are always in control and can ask for changes at any time.' },
      { type: 'h2', text: 'During' },
      { type: 'p', text: 'You will be draped with towels at all times, with only the area being worked on uncovered. Breathe, and let your mind wander.' },
      { type: 'h2', text: 'Afterwards' },
      { type: 'list', items: ['Drink water', 'Take it easy for the rest of the day', 'Note how your body feels tomorrow'] }
    ]
  },
  {
    slug: 'why-linen-and-wood-matter',
    title: 'Why Linen and Wood Matter',
    excerpt: 'How natural materials shape the feeling of a room.',
    category: 'Rest',
    author: 'Amara Ellison',
    date: '2025-10-02',
    readMinutes: 4,
    image: ji[4],
    body: [
      { type: 'p', text: 'Materials change how we feel before we consciously notice them. Linen softens sound, wood warms the light and plaster holds a gentle, matte stillness.' },
      { type: 'quote', text: 'A calm room is mostly made of things you stop noticing.' },
      { type: 'p', text: 'At home, start small: swap one synthetic throw for linen, or place one wooden bowl where you can see it.' }
    ]
  },
  {
    slug: 'a-walk-in-the-misty-hills',
    title: 'A Walk in the Misty Hills',
    excerpt: 'Why a short walk outdoors belongs in every wellness routine.',
    category: 'Mindfulness',
    author: 'Lena Kowalski',
    date: '2025-09-12',
    readMinutes: 3,
    image: ji[5],
    body: [
      { type: 'p', text: 'Not every ritual needs a treatment room. Ten minutes of slow walking outdoors can reset a busy afternoon.' },
      { type: 'list', items: ['Leave headphones at home', 'Notice five sounds', 'Walk slower than you think you need to', 'End with three long breaths'] },
      { type: 'p', text: 'Fictional demonstration content for the template.' }
    ]
  },
  {
    slug: 'building-an-evening-wind-down',
    title: 'Building an Evening Wind-Down',
    excerpt: 'A gentle sequence to help the day end well.',
    category: 'Rituals',
    author: 'Daniel Okafor',
    date: '2025-08-21',
    readMinutes: 4,
    image: ji[7],
    body: [
      { type: 'p', text: 'A wind-down is a bridge between the demands of the day and the rest of the night. It need not be long, but it helps if it is consistent.' },
      { type: 'h2', text: 'A 20-minute sequence' },
      { type: 'list', items: ['Dim the lights an hour before bed', 'Warm shower or foot soak', 'Five minutes of stretching', 'A few lines in a journal', 'Phone out of the bedroom'] },
      { type: 'quote', text: 'Consistency matters more than perfection.' }
    ]
  }
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
