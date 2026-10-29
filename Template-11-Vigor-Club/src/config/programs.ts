import { images } from './images';
import type { Program } from './types';

/** Program categories shown as filter chips. Every program's `category` must appear here. */
export const programCategories = ['Strength', 'Conditioning', 'Combat', 'Recovery', 'Coaching'];

export const intensityLabels = ['', 'Low', 'Moderate', 'Elevated', 'High', 'Maximum'];

/** Add, remove or reorder programs here. `trainerSlugs` must match slugs in trainers.ts. */
export const programs: Program[] = [
  {
    slug: 'strength-training',
    name: 'Strength Training',
    category: 'Strength',
    summary: 'Coached barbell and dumbbell work built on the big lifts and progressive loading.',
    description: [
      'Strength Training is the backbone of the club. Each session is built around a primary lift — squat, hinge, press or pull — followed by accessory work chosen to support it.',
      'Coaches guide technique and help you choose loads that suit your experience, so you can progress at a sensible pace in a group that trains alongside you.'
    ],
    duration: 60,
    intensity: 4,
    level: 'All levels',
    trainerSlugs: ['maya-okafor', 'marcus-reid'],
    image: images.progStrength,
    highlights: ['Coached barbell fundamentals', 'Structured progression blocks', 'Small coach-to-member ratios'],
    expect: ['A guided warm-up and movement preparation', 'One primary lift with coached working sets', 'Accessory work and a short cool-down'],
    bring: ['Flat-soled training shoes', 'Water bottle', 'Small towel']
  },
  {
    slug: 'functional-training',
    name: 'Functional Training',
    category: 'Conditioning',
    summary: 'Multi-planar circuits using kettlebells, sleds and bodyweight to build practical, balanced fitness.',
    description: [
      'Functional Training blends carries, hinges, pushes, pulls and core work into well-paced circuits. Movements are scalable, so a first-timer and a seasoned member can share the same floor.',
      'Expect varied formats from week to week, always with a coach cueing positions and offering regressions or progressions.'
    ],
    duration: 50,
    intensity: 3,
    level: 'Beginner-friendly',
    trainerSlugs: ['tessa-whitlock', 'jonas-lindqvist'],
    image: images.progFunctional,
    highlights: ['Kettlebells, sleds and bodyweight', 'Scalable for every level', 'Varied weekly formats'],
    expect: ['Demonstration of every station', 'Timed circuits with coach cueing', 'Optional finisher and stretch'],
    bring: ['Training shoes', 'Water bottle']
  },
  {
    slug: 'hiit',
    name: 'HIIT',
    category: 'Conditioning',
    summary: 'High-intensity interval sessions on bikes, rowers and the turf lane — short, sharp and timed.',
    description: [
      'HIIT sessions alternate hard efforts with timed recovery across rowers, air bikes, sleds and bodyweight stations. Work-to-rest ratios are posted so you can manage your own effort.',
      'Because intensity is high, coaches encourage pacing and will adapt the session if you are new to interval training.'
    ],
    duration: 40,
    intensity: 5,
    level: 'Intermediate',
    trainerSlugs: ['jonas-lindqvist', 'tessa-whitlock'],
    image: images.progHiit,
    highlights: ['Timed work and rest intervals', 'Rowers, bikes and sled lane', 'Pacing guidance from coaches'],
    expect: ['A progressive warm-up', 'Three to five interval blocks', 'A guided cool-down'],
    bring: ['Training shoes', 'Water bottle', 'Towel']
  },
  {
    slug: 'boxing-fitness',
    name: 'Boxing Fitness',
    category: 'Combat',
    summary: 'Pad work, bag rounds and footwork drills for conditioning — non-contact, no sparring.',
    description: [
      'Boxing Fitness teaches stance, footwork and basic combinations before layering them into bag rounds and partner pad work. It is a conditioning class: there is no sparring and no contact between members.',
      'Gloves and wraps are available to borrow, and coaches break every combination down step by step.'
    ],
    duration: 55,
    intensity: 4,
    level: 'All levels',
    trainerSlugs: ['dario-velasquez'],
    image: images.progBoxing,
    highlights: ['Technique first, no sparring', 'Heavy-bag rounds', 'Gloves and wraps available'],
    expect: ['Skipping and shadow-boxing warm-up', 'Technique drills and pad work', 'Bag rounds with conditioning finisher'],
    bring: ['Hand wraps (or borrow)', 'Training shoes', 'Water bottle']
  },
  {
    slug: 'mobility',
    name: 'Mobility',
    category: 'Recovery',
    summary: 'Controlled range-of-motion work, breathing and positional drills to move and feel better.',
    description: [
      'Mobility combines slow, loaded stretching, joint-by-joint preparation and breathing practices. It is designed to complement harder training days and suits almost everyone.',
      'This class is general fitness education, not physiotherapy. If you have an injury or medical condition, check with a qualified professional first.'
    ],
    duration: 45,
    intensity: 2,
    level: 'All levels',
    trainerSlugs: ['priya-raman'],
    image: images.progMobility,
    highlights: ['Joint-by-joint preparation', 'Breathing and positional drills', 'Pairs well with heavy training'],
    expect: ['A short breathing reset', 'Guided mobility flows and holds', 'Optional foam-rolling at the end'],
    bring: ['Comfortable clothing', 'Water bottle']
  },
  {
    slug: 'personal-training',
    name: 'Personal Training',
    category: 'Coaching',
    summary: 'One-to-one coaching in a private bay, with sessions planned around your goals and schedule.',
    description: [
      'Personal Training starts with a conversation about your goals, history and preferences. Your coach designs sessions around you and adjusts as you progress.',
      'Sessions are booked directly with your trainer — send an enquiry and the club will help you find a coach and a time.'
    ],
    duration: 60,
    intensity: 3,
    level: 'All levels',
    trainerSlugs: ['marcus-reid', 'maya-okafor', 'priya-raman'],
    image: images.progPersonal,
    highlights: ['Fully tailored sessions', 'Private coaching bay', 'Flexible scheduling'],
    expect: ['An initial goals conversation', 'Sessions planned around your needs', 'Regular progress check-ins'],
    bring: ['Training shoes', 'Water bottle'],
    bookingNote: 'One-to-one sessions are arranged by enquiry rather than through the class timetable.'
  },
  {
    slug: 'group-conditioning',
    name: 'Group Conditioning',
    category: 'Conditioning',
    summary: 'Energetic coached classes mixing strength intervals, cardio blocks and team formats.',
    description: [
      'Group Conditioning brings together strength stations and cardio blocks in partner and team formats. The playlist is loud, the coaching is clear, and you work at your own level.',
      'It is a social class — a good place to meet other members and build a routine.'
    ],
    duration: 45,
    intensity: 4,
    level: 'All levels',
    trainerSlugs: ['tessa-whitlock', 'dario-velasquez'],
    image: images.progGroup,
    highlights: ['Partner and team formats', 'Strength plus cardio blocks', 'High-energy social atmosphere'],
    expect: ['Clear station demonstrations', 'Rotating blocks with timed work', 'A group finisher'],
    bring: ['Training shoes', 'Water bottle', 'Towel']
  },
  {
    slug: 'performance-training',
    name: 'Performance Training',
    category: 'Strength',
    summary: 'Athletic development: power, speed and strength-endurance for experienced trainees.',
    description: [
      'Performance Training uses jumps, throws, sprints and heavy compound lifts to build athletic qualities. It assumes a solid training base and comfort with technical lifts.',
      'Sessions are capped at small group sizes so coaches can give focused feedback.'
    ],
    duration: 60,
    intensity: 5,
    level: 'Advanced',
    trainerSlugs: ['jonas-lindqvist', 'maya-okafor'],
    image: images.progPerformance,
    highlights: ['Power, speed and strength-endurance', 'Capped group sizes', 'Technical coaching'],
    expect: ['A structured warm-up with movement prep', 'Power and speed work', 'Heavy compound lifts and a finisher'],
    bring: ['Lifting or training shoes', 'Water bottle', 'Towel']
  }
];

export const getProgram = (slug: string) => programs.find((p) => p.slug === slug);
