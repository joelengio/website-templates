import { trainerImages } from './images';
import type { Trainer } from './types';

/**
 * All trainers and credentials are FICTIONAL demonstration content.
 * Replace with real staff and verifiable qualifications before launch.
 */
export const credentialNote = 'Qualifications listed on this page are fictional demonstration content.';

export const trainers: Trainer[] = [
  {
    slug: 'maya-okafor',
    name: 'Maya Okafor',
    role: 'Head of Strength',
    tagline: 'Strong technique first, heavier weights second.',
    bio: [
      'Maya leads the club’s strength programme and mentors the coaching team. Her sessions are known for calm cueing, clear progressions and a no-ego floor.',
      'Outside the club she competes in recreational powerlifting meets and writes the Journal’s technique series.'
    ],
    specialties: ['Barbell technique', 'Strength programming', 'Performance lifting'],
    qualifications: ['Strength & Conditioning Coach (fictional demonstration credential)', 'Barbell Technique Certificate (fictional)', 'First Aid & CPR (fictional)'],
    yearsExperience: 12,
    programSlugs: ['strength-training', 'performance-training', 'personal-training'],
    image: trainerImages[0]
  },
  {
    slug: 'dario-velasquez',
    name: 'Dario Velasquez',
    role: 'Boxing & Conditioning Coach',
    tagline: 'Rhythm, footwork, and rounds that fly by.',
    bio: [
      'Dario spent a decade coaching amateur boxers before bringing his pad-work style to fitness classes. He teaches technique patiently and keeps rounds fast.',
      'His classes are non-contact and welcome complete beginners.'
    ],
    specialties: ['Boxing technique', 'Pad work', 'Conditioning circuits'],
    qualifications: ['Boxing Fitness Instructor (fictional demonstration credential)', 'Group Exercise Instructor (fictional)', 'First Aid & CPR (fictional)'],
    yearsExperience: 10,
    programSlugs: ['boxing-fitness', 'group-conditioning'],
    image: trainerImages[1]
  },
  {
    slug: 'priya-raman',
    name: 'Priya Raman',
    role: 'Mobility & Movement Coach',
    tagline: 'Move well so you can train hard, for longer.',
    bio: [
      'Priya blends mobility science with breathing practice to help members prepare for and recover from training. Her classes are slow, precise and surprisingly demanding.',
      'She also offers one-to-one movement assessments for general fitness (not medical treatment).'
    ],
    specialties: ['Mobility', 'Breathwork', 'Movement preparation'],
    qualifications: ['Movement & Mobility Coach (fictional demonstration credential)', 'Breathwork Facilitator (fictional)', 'First Aid & CPR (fictional)'],
    yearsExperience: 9,
    programSlugs: ['mobility', 'personal-training'],
    image: trainerImages[2]
  },
  {
    slug: 'jonas-lindqvist',
    name: 'Jonas Lindqvist',
    role: 'Performance & HIIT Coach',
    tagline: 'Speed, power and smart pacing.',
    bio: [
      'Jonas previously coached track athletes and now designs the club’s interval and performance sessions. He is meticulous about pacing, warm-ups and recovery.',
      'Expect clear targets, posted work-to-rest ratios and honest feedback.'
    ],
    specialties: ['Sprint mechanics', 'Interval training', 'Power development'],
    qualifications: ['Performance Coach (fictional demonstration credential)', 'Speed & Agility Specialist (fictional)', 'First Aid & CPR (fictional)'],
    yearsExperience: 11,
    programSlugs: ['hiit', 'performance-training', 'functional-training'],
    image: trainerImages[3]
  },
  {
    slug: 'tessa-whitlock',
    name: 'Tessa Whitlock',
    role: 'Functional & Group Coach',
    tagline: 'Big energy, clear coaching, everyone included.',
    bio: [
      'Tessa runs the club’s most popular group classes. She builds sessions that scale for first-timers and regulars alike, and she knows every member by name.',
      'Her focus is community: partners, teams and a little friendly competition.'
    ],
    specialties: ['Functional circuits', 'Group coaching', 'Kettlebell training'],
    qualifications: ['Group Exercise Instructor (fictional demonstration credential)', 'Kettlebell Coach (fictional)', 'First Aid & CPR (fictional)'],
    yearsExperience: 8,
    programSlugs: ['functional-training', 'group-conditioning', 'hiit'],
    image: trainerImages[4]
  },
  {
    slug: 'marcus-reid',
    name: 'Marcus Reid',
    role: 'Personal Training Lead',
    tagline: 'A plan that fits your life — then we stick to it.',
    bio: [
      'Marcus coaches members one-to-one, specialising in people returning to training or starting for the first time. He listens first and programmes second.',
      'He also leads the club’s Foundations strength class on Sundays.'
    ],
    specialties: ['Beginner coaching', 'Habit building', 'General strength'],
    qualifications: ['Personal Trainer (fictional demonstration credential)', 'Behaviour-Change Coach (fictional)', 'First Aid & CPR (fictional)'],
    yearsExperience: 7,
    programSlugs: ['personal-training', 'strength-training'],
    image: trainerImages[5]
  }
];

export const getTrainer = (slug: string) => trainers.find((t) => t.slug === slug);
