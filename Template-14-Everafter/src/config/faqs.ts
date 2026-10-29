import type { Faq } from './types';

export const generalFaqs: Faq[] = [
  { q: 'How far ahead should we get in touch?', a: 'For full planning and destination weddings we suggest 12–18 months. Partial planning and coordination can often be arranged with 4–6 months, subject to availability.' },
  { q: 'Do you work only on weddings?', a: 'Weddings are our speciality, but we also plan elopements, vow renewals, private celebrations and corporate events with the same care.' },
  { q: 'Can we meet before committing?', a: 'Yes. A consultation is a relaxed 45-minute conversation about your plans, with no obligation. It can be held by video call or in person at the studio.' },
  { q: 'What does it cost to work with you?', a: 'Our packages start at the prices shown on the Packages page. Every celebration is quoted individually once we understand scope, destination and guest count.' },
  { q: 'Are the venues on this site real?', a: 'No. This website is a demonstration template. The studio, projects, venues, people and prices are fictional and shown for illustration only.' }
];

export const contactFaqs: Faq[] = [
  { q: 'Is the contact form actually sending my message?', a: 'Not in this demonstration. Without a backend the form validates your details and shows a preview, but nothing is delivered to a real planner. See the demo notice for details.' },
  { q: 'How quickly would a real studio reply?', a: 'In a live version of this site the response time shown on this page would apply. It is configurable in src/config/site.ts.' },
  { q: 'Can I book a consultation on a weekend?', a: 'Saturday appointments are available by arrangement. Choose the preferred time in your message and the team would confirm it.' },
  { q: 'Do you travel for site visits?', a: 'Yes — for destination weddings we make at least one scouting visit, and often two, which are described in the destination planning service.' }
];
