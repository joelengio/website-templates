import type { Article } from './types';

export const articleCategories = ['Everyday wellness', 'Heart & circulation', 'Skin & sun', 'Family health', 'Movement', 'Preparing for care', 'Dental health'];

/**
 * General educational articles written for the template. They have NOT been reviewed by a clinician, give no individual
 * advice, and make no treatment claims. Replace with reviewed content (and say who reviewed it) before using on a real site.
 */
export const articles: Article[] = [
  {
    id: 'a1', slug: 'building-a-simple-sleep-routine', title: 'Building a simple sleep routine', category: 'Everyday wellness', image: 'art-1', date: '2026-09-12', readMinutes: 4, relatedSpecialty: 'general-medicine',
    excerpt: 'A gentle look at everyday habits many people find helpful when thinking about their sleep.',
    sections: [
      { heading: 'Why routines matter', paragraphs: ['Many people find that going to bed and waking at similar times helps them feel more settled. Our bodies tend to like predictability, and a regular rhythm is one of the simplest habits to try.', 'Sleep needs differ from person to person. This article is general information, and it is not designed to assess or treat any sleep concern.'] },
      { heading: 'Habits people often try', paragraphs: ['A calm wind-down period before bed is a common suggestion. Some people dim lights, put screens away or read a few pages of a book.'], list: ['Keep a regular wake-up time where you can', 'Make the bedroom dark, quiet and comfortable', 'Limit caffeine later in the day', 'Notice how heavy meals and alcohol affect you'] },
      { heading: 'When to speak to a professional', paragraphs: ['If sleep problems persist or affect your daily life, speak to a qualified healthcare professional. They can consider your individual circumstances, which a general article cannot.'] }
    ]
  },
  {
    id: 'a2', slug: 'everyday-habits-for-heart-health', title: 'Everyday habits for heart health', category: 'Heart & circulation', image: 'art-2', date: '2026-08-28', readMinutes: 5, relatedSpecialty: 'cardiology',
    excerpt: 'Small, well-known lifestyle habits that health organizations commonly discuss when talking about heart health.',
    sections: [
      { heading: 'Small steps add up', paragraphs: ['Public-health guidance often highlights regular movement, a varied diet, not smoking and managing stress as general building blocks of heart health.', 'This page is a general introduction. It does not assess your personal risk and is not a substitute for advice from a qualified clinician.'] },
      { heading: 'Things many people consider', paragraphs: ['Starting with one change is often easier than changing everything at once.'], list: ['Finding movement you enjoy, such as walking', 'Adding more vegetables, whole grains and legumes to meals', 'Choosing water more often than sugary drinks', 'Making time to rest and unwind'] },
      { heading: 'Getting personal advice', paragraphs: ['Ask a qualified healthcare professional about your own situation, including whether any checks are right for you. If you have chest pain or feel seriously unwell, call your local emergency number immediately.'] }
    ]
  },
  {
    id: 'a3', slug: 'sun-safety-basics', title: 'Sun safety basics', category: 'Skin & sun', image: 'art-3', date: '2026-07-19', readMinutes: 4, relatedSpecialty: 'dermatology',
    excerpt: 'Widely shared, practical ideas for enjoying the outdoors while looking after your skin.',
    sections: [
      { heading: 'Think in layers', paragraphs: ['Sun protection works best as a combination: shade, clothing, sunglasses and sunscreen. No single measure does everything.'] },
      { heading: 'Common practical tips', paragraphs: ['Public-health organizations often suggest planning outdoor time around the strongest part of the day and re-applying sunscreen according to its label.'], list: ['Seek shade in the middle of the day', 'Wear a broad-brimmed hat and sunglasses', 'Cover up with lightweight clothing', 'Follow the instructions on your sunscreen'] },
      { heading: 'Know your own skin', paragraphs: ['If you are worried about a change to your skin, speak to a qualified healthcare professional. This article cannot tell you whether anything on your skin is a concern.'] }
    ]
  },
  {
    id: 'a4', slug: 'helping-children-build-dental-habits', title: 'Helping children build dental habits', category: 'Dental health', image: 'art-4', date: '2026-06-30', readMinutes: 3, relatedSpecialty: 'dentistry',
    excerpt: 'Friendly, practical ideas for making tooth-brushing a normal part of the day.',
    sections: [
      { heading: 'Make it routine', paragraphs: ['Children usually do best with predictable routines. Brushing at the same moments each day, such as after breakfast and before bed, can help it feel normal.'] },
      { heading: 'Ideas many families use', paragraphs: ['Turning brushing into a song or a small game can make it more fun for younger children.'], list: ['Let children choose their own toothbrush', 'Brush together so they can copy you', 'Use a timer or a favorite song', 'Praise effort rather than perfection'] },
      { heading: 'Talk to a dental professional', paragraphs: ['A dental professional can advise on brushing techniques and visit schedules that suit your child. This article is general information only.'] }
    ]
  },
  {
    id: 'a5', slug: 'gentle-movement-for-desk-days', title: 'Gentle movement for desk days', category: 'Movement', image: 'art-5', date: '2026-06-02', readMinutes: 4, relatedSpecialty: 'physiotherapy',
    excerpt: 'Simple prompts to break up long periods of sitting, written for a general audience.',
    sections: [
      { heading: 'Why break up sitting?', paragraphs: ['Many people find that changing position regularly is more comfortable than holding one posture for hours. Short, frequent breaks are often easier to maintain than long ones.'] },
      { heading: 'Ideas to try', paragraphs: ['Choose movements that feel comfortable and stop if anything hurts.'], list: ['Stand up and stretch each hour', 'Take a short walk after meetings', 'Adjust your chair and screen so you feel comfortable', 'Look away from your screen at regular intervals'] },
      { heading: 'When to get help', paragraphs: ['If you have pain or discomfort that persists, speak to a qualified healthcare professional, who can consider your individual circumstances.'] }
    ]
  },
  {
    id: 'a6', slug: 'getting-the-most-from-your-appointment', title: 'Getting the most from your appointment', category: 'Preparing for care', image: 'art-6', date: '2026-05-14', readMinutes: 3, relatedSpecialty: 'general-medicine',
    excerpt: 'Practical preparation ideas that help any healthcare visit feel more productive.',
    sections: [
      { heading: 'Prepare a short list', paragraphs: ['Appointments can feel quick. Writing down your top two or three questions beforehand helps ensure you cover what matters most to you.'] },
      { heading: 'Things worth bringing', paragraphs: ['A real clinic will tell you exactly what to bring. Common items include:'], list: ['A list of questions', 'A note of any regular medicines you take', 'Previous letters or results if you have them', 'A friend or relative if you would like support'] },
      { heading: 'Afterwards', paragraphs: ['Ask for next steps to be written down, and check that you understand them before you leave.'] }
    ]
  },
  {
    id: 'a7', slug: 'understanding-health-screening', title: 'Understanding health screening', category: 'Preparing for care', image: 'art-7', date: '2026-04-22', readMinutes: 5, relatedSpecialty: 'womens-health',
    excerpt: 'A plain-language introduction to what screening means — and what it does not.',
    sections: [
      { heading: 'What is screening?', paragraphs: ['Screening generally means checking people who have no obvious symptoms, to look for early signs of a health condition. It is different from investigating a specific concern.'] },
      { heading: 'Things to know', paragraphs: ['Screening can be valuable, but it is not perfect and is not right for everyone at every age.'], list: ['Different tests are recommended for different people', 'A normal result does not guarantee health', 'Some results lead to further tests', 'National and local guidance varies'] },
      { heading: 'Make an informed choice', paragraphs: ['A qualified healthcare professional can explain which screening, if any, is appropriate for you. This article does not recommend any specific test.'] }
    ]
  },
  {
    id: 'a8', slug: 'staying-hydrated-day-to-day', title: 'Staying hydrated, day to day', category: 'Everyday wellness', image: 'art-8', date: '2026-03-10', readMinutes: 3, relatedSpecialty: 'general-medicine',
    excerpt: 'Everyday ideas for drinking enough fluids without turning it into a chore.',
    sections: [
      { heading: 'Fluids and everyday life', paragraphs: ['Fluid needs vary with age, activity, climate and health. Many people simply find it helpful to have water within reach.'] },
      { heading: 'Easy habits', paragraphs: ['Linking drinks to existing routines is a popular way to remember.'], list: ['Keep a water bottle where you can see it', 'Have a glass with each meal', 'Add a slice of fruit if you like the flavor', 'Notice how you feel during hot weather or exercise'] },
      { heading: 'Individual needs', paragraphs: ['If you have a medical condition or have been given specific fluid advice, follow the guidance of your healthcare professional.'] }
    ]
  }
];
