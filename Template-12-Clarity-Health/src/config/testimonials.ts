import type { Testimonial } from './types';

/** FICTIONAL testimonials written for the demonstration. Never publish invented reviews as real ones. */
export const testimonials: Testimonial[] = [
  { id: 't1', quote: 'I left with a one-page plan I could actually follow. It felt like the appointment had been designed around me.', name: 'Imaginary Patient A.', context: 'Fictional · General Medicine' },
  { id: 't2', quote: 'The waiting area was so calm that my daughter forgot she was at the doctor. This is what a family clinic should feel like.', name: 'Imaginary Parent B.', context: 'Fictional · Pediatrics' },
  { id: 't3', quote: 'Clear explanations, no jargon, and every question answered. I would have liked to stay and chat for longer.', name: 'Imaginary Patient C.', context: 'Fictional · Cardiology' },
  { id: 't4', quote: 'Booking was effortless, and rescheduling took a few taps. Everything was explained before I arrived.', name: 'Imaginary Patient D.', context: 'Fictional · Physiotherapy' }
];
