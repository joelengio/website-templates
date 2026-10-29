import type { Facility } from './types';

export const facilities: Facility[] = [
  { id: 'reception', name: 'Reception & lounge', description: 'A bright, quiet arrival space with step-free access, drinking water and comfortable seating.', image: 'fac-reception' },
  { id: 'consultation', name: 'Consultation suites', description: 'Private rooms designed for conversation, with soft lighting and space for family members.', image: 'fac-consultation' },
  { id: 'diagnostics', name: 'Diagnostics floor', description: 'On-site imaging and testing so that more of your care can happen in a single visit.', image: 'fac-diagnostics' },
  { id: 'rehab', name: 'Rehabilitation studio', description: 'An airy movement studio for guided exercise, posture work and recovery sessions.', image: 'fac-rehab' },
  { id: 'family', name: 'Family & children’s area', description: 'A playful corner that helps younger patients feel at ease.', image: 'fac-family' }
];
