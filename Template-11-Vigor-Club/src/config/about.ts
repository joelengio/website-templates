import { classes } from './classes';
import { facilities } from './facilities';
import { programs } from './programs';
import { trainers } from './trainers';

/** About page content. Edit freely; every field is plain text. */
export const about = {
  hero: { eyebrow: 'About the club', title: 'Built around coaching, not equipment', intro: 'VIGOR CLUB is a fictional training club created to show how a premium fitness brand can look and feel online.' },
  story: {
    title: 'Our story',
    paragraphs: [
      'Vigor Club began as a single-room strength gym with one idea: great coaching should be the main attraction. As the community grew, the space grew with it — adding studios, a conditioning yard and a recovery floor.',
      'This is a fictional story written for the template. Replace it with your own history, founders and milestones.'
    ]
  },
  mission: { title: 'Our mission', text: 'To make confident, well-coached training available to people at every level — and to build a community that makes showing up the easy part.' },
  values: [
    { title: 'Coaching first', text: 'Every session has a coach who knows what you are working on and why.' },
    { title: 'Honest progress', text: 'We celebrate consistency over quick fixes and never promise guaranteed results.' },
    { title: 'Open to everyone', text: 'Beginners and seasoned athletes share the floor, supported by scalable sessions.' },
    { title: 'Sustainable effort', text: 'Smart programming and recovery help you keep training for the long term.' }
  ],
  philosophy: {
    title: 'Training philosophy',
    points: ['Master the basics, then progress deliberately.', 'Train hard enough to improve; recover well enough to repeat.', 'Measure what matters to you — strength, skill, energy or consistency.', 'Health varies: always train within your own limits and seek professional advice when unsure.']
  },
  team: { title: 'Meet the team', text: 'Six coaches, one shared standard of coaching.' },
  community: { title: 'Community', text: 'From early-morning lifters to Saturday social classes, the club is a place people choose to spend time. Member events, skill workshops and charity challenges are examples of what you might run — configure your own.' },
  facilities: { title: 'The space', text: 'Six zones under one roof: strength, cardio, functional, studios, private coaching bays and recovery.' },
  stats: [
    { value: String(facilities.length), label: 'Training zones' },
    { value: String(classes.length), label: 'Weekly classes' },
    { value: String(trainers.length), label: 'Coaches' },
    { value: String(programs.length), label: 'Programs' }
  ]
};
