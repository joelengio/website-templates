import { journalImages as j } from './images';
import type { Article } from './types';

export const journalCategories = ['Training', 'Recovery', 'Technique', 'Club life'];

export const journalDisclaimer =
  'Articles are general information written for a fictional club and are not medical advice. Individual results vary; speak with a qualified professional before changing your training.';

/** Add articles here — they appear on /journal, in related content and in sitemap.xml automatically. */
export const articles: Article[] = [
  {
    slug: 'how-to-start-strength-training',
    title: 'How to start strength training without the overwhelm',
    category: 'Training',
    excerpt: 'A calm, practical way to begin: choose a handful of movements, learn them well and let consistency do the work.',
    date: '2026-09-12', readMinutes: 5, author: 'Maya Okafor', image: j[0], tags: ['beginners', 'strength', 'technique'],
    body: [
      { paragraphs: ['Walking into a gym for the first time can feel like arriving at a party where everyone knows the rules. The good news is that effective strength training is built on a small number of ideas, and you can learn them one at a time.'] },
      { heading: 'Start with patterns, not exercises', paragraphs: ['Rather than memorising dozens of exercises, begin with a few movement patterns: squatting, hinging, pushing, pulling and carrying. A coach can show you simple versions of each and help you find a comfortable range of motion.'] },
      { heading: 'Keep the first weeks simple', paragraphs: ['Two or three sessions each week is plenty to start. Choose loads that let you finish every set with good technique, and write your sessions down so you can see what you did last time.', 'If anything feels painful rather than challenging, stop and speak to a qualified professional.'] },
      { heading: 'Progress is personal', paragraphs: ['Some weeks you will add weight, some weeks you will add repetitions, and some weeks you will simply turn up. All of it counts.'] }
    ]
  },
  {
    slug: 'warm-up-habits-that-last',
    title: 'Warm-up habits that actually last',
    category: 'Technique',
    excerpt: 'Ten useful minutes before you train — and how to make them a routine you will keep.',
    date: '2026-08-28', readMinutes: 4, author: 'Priya Raman', image: j[2], tags: ['warm-up', 'mobility'],
    body: [
      { paragraphs: ['A good warm-up raises your body temperature, rehearses the movements you are about to perform and gets your attention in the room. It does not need to be elaborate.'] },
      { heading: 'A simple structure', paragraphs: ['Begin with two or three minutes of easy cardio, move through a few joint circles and mobility drills, then perform lighter versions of your first exercise before adding load.'] },
      { heading: 'Make it automatic', paragraphs: ['Attach your warm-up to something you already do, like putting your bag down or filling your bottle. Tying habits together is one of the most reliable ways to keep them.'] }
    ]
  },
  {
    slug: 'building-a-weekly-training-rhythm',
    title: 'Building a weekly training rhythm',
    category: 'Training',
    excerpt: 'How to mix strength, conditioning and recovery across a normal, busy week.',
    date: '2026-08-14', readMinutes: 6, author: 'Marcus Reid', image: j[3], tags: ['planning', 'consistency'],
    body: [
      { paragraphs: ['The best programme is the one you can keep doing. Start by looking at your week honestly: which days have space, and which are already full?'] },
      { heading: 'Anchor the non-negotiables', paragraphs: ['Pick two sessions you will protect, ideally at times that rarely change. Add others around them as life allows.'] },
      { heading: 'Balance hard and easy', paragraphs: ['Alternate demanding sessions with lighter ones. A mobility class or an easy walk is still training for your long-term routine.'] },
      { heading: 'Review monthly', paragraphs: ['Once a month, look back at what felt good and what slipped. Adjust the plan rather than abandoning it.'] }
    ]
  },
  {
    slug: 'boxing-fitness-first-class',
    title: 'What to expect at your first boxing fitness class',
    category: 'Club life',
    excerpt: 'No sparring, no experience needed. Here is how a typical session flows from wraps to cool-down.',
    date: '2026-07-30', readMinutes: 4, author: 'Dario Velasquez', image: j[4], tags: ['boxing', 'beginners'],
    body: [
      { paragraphs: ['Boxing fitness borrows the training methods of boxing — skipping, shadow work, bag rounds — without the contact. Nobody hits you and you do not hit anyone.'] },
      { heading: 'Before class', paragraphs: ['Arrive ten minutes early so a coach can show you how to wrap your hands and choose gloves. Wear light, comfortable clothing and flat shoes.'] },
      { heading: 'During class', paragraphs: ['Expect to learn a stance, a handful of punches and simple footwork patterns, then string them together over timed rounds. Rest between rounds is built in.'] }
    ]
  },
  {
    slug: 'recovery-basics-for-busy-people',
    title: 'Recovery basics for busy people',
    category: 'Recovery',
    excerpt: 'Sleep, food, movement and downtime: the unglamorous habits that make training sustainable.',
    date: '2026-07-16', readMinutes: 5, author: 'Priya Raman', image: j[1], tags: ['recovery', 'sleep'],
    body: [
      { paragraphs: ['Training is the stimulus; recovery is where you adapt to it. Fortunately, the fundamentals are simple and free.'] },
      { heading: 'Protect your sleep', paragraphs: ['Aim for a regular bedtime and a dark, cool room. If sleep is a persistent problem, talk to a healthcare professional.'] },
      { heading: 'Move gently on rest days', paragraphs: ['Walking, easy cycling or a mobility session can help you feel looser without adding much stress.'] },
      { heading: 'Treat the extras as extras', paragraphs: ['Saunas and cold plunges can be enjoyable parts of a routine, but they are not a substitute for sleep and good basics. Enjoy them, and keep expectations realistic.'] }
    ]
  },
  {
    slug: 'kettlebell-swing-basics',
    title: 'The kettlebell swing: a hinge, not a squat',
    category: 'Technique',
    excerpt: 'Three cues that help most beginners find a safe, powerful swing pattern.',
    date: '2026-06-25', readMinutes: 4, author: 'Tessa Whitlock', image: j[5], tags: ['kettlebell', 'technique'],
    body: [
      { paragraphs: ['The swing is one of the most useful conditioning movements — and one of the most commonly mis-taught. The key is to treat it as a hip hinge.'] },
      { heading: 'Three cues', paragraphs: ['Push your hips back as if closing a car door with them. Keep your back long and the bell close to your body. Snap your hips forward and let the bell float to chest height — your arms guide it, they do not lift it.'] },
      { heading: 'Get coached', paragraphs: ['Video can only show so much. Ask a coach to watch a few swings so they can adjust your setup before you add speed or load.'] }
    ]
  },
  {
    slug: 'sprint-intervals-pacing',
    title: 'Pacing sprint intervals so the last one counts',
    category: 'Training',
    excerpt: 'Interval work is about repeatable quality. Learn to pace the first rounds so the final one is still sharp.',
    date: '2026-06-05', readMinutes: 5, author: 'Jonas Lindqvist', image: j[6], tags: ['hiit', 'pacing'],
    body: [
      { paragraphs: ['Many people start the first interval too hard and spend the rest of the session surviving. A better target is to produce the same quality of effort across every round.'] },
      { heading: 'Use a reference effort', paragraphs: ['Choose an effort you could repeat eight times and call it your base. Occasionally go a little harder, but always return to your reference.'] },
      { heading: 'Respect the rest', paragraphs: ['Rest is part of the session design. If you cut it short, you change the training effect and make later rounds sloppier.'] }
    ]
  },
  {
    slug: 'member-spotlight-saturday-social',
    title: 'Inside Saturday Social: a fictional member spotlight',
    category: 'Club life',
    excerpt: 'A look at the Saturday class that doubles as the club’s weekly meet-up — told by fictional members.',
    date: '2026-05-18', readMinutes: 3, author: 'Tessa Whitlock', image: j[7], tags: ['community', 'group'],
    body: [
      { paragraphs: ['Every Saturday, a mixed group of fictional members gathers for a team-format class. Partners change every round, and the finisher is always a shared challenge.'] },
      { heading: 'Why it works', paragraphs: ['Accountability and friendliness. Members say having people expect them is the strongest reason they show up.'] },
      { heading: 'Note', paragraphs: ['This article is a fictional piece written for the template. Replace it with real member stories — with their permission — for your own club.'] }
    ]
  }
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
