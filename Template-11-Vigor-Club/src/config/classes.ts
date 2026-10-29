import type { ClassSession } from './types';

export const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const c = (
  id: string, title: string, programSlug: string, day: number, start: string, duration: number,
  trainerSlug: string, capacity: number, room: string, blurb: string
): ClassSession => ({ id, title, programSlug, day, start, duration, trainerSlug, capacity, room, blurb });

/**
 * Weekly recurring timetable. `day` is 0 (Monday) – 6 (Sunday); `start` is 24-hour "HH:MM".
 * `programSlug` / `trainerSlug` must exist in programs.ts / trainers.ts. `capacity` is a demonstration figure.
 */
export const classes: ClassSession[] = [
  c('mon-0630-iron', 'Iron Hour', 'strength-training', 0, '06:30', 60, 'maya-okafor', 14, 'Strength Hall', 'Squat-focused coached session with accessory work.'),
  c('mon-1215-hiit', 'Lunch Burner', 'hiit', 0, '12:15', 40, 'jonas-lindqvist', 18, 'Turf Lane', 'A tight interval session designed around a lunch break.'),
  c('mon-1730-box', 'Boxing Fundamentals', 'boxing-fitness', 0, '17:30', 55, 'dario-velasquez', 16, 'Boxing Zone', 'Stance, footwork and combinations — perfect for new members.'),
  c('mon-1900-mob', 'Mobility Reset', 'mobility', 0, '19:00', 45, 'priya-raman', 16, 'Studio B', 'Unwind with controlled stretching and breathing.'),
  c('tue-0630-func', 'Functional Flow', 'functional-training', 1, '06:30', 50, 'tessa-whitlock', 16, 'Studio A', 'Kettlebell and bodyweight circuits to start the day.'),
  c('tue-1200-group', 'Team Conditioning', 'group-conditioning', 1, '12:00', 45, 'tessa-whitlock', 20, 'Studio A', 'Partner formats and a group finisher.'),
  c('tue-1800-bar', 'Barbell Foundations', 'strength-training', 1, '18:00', 60, 'maya-okafor', 12, 'Strength Hall', 'Learn or refine the big lifts with a coach beside you.'),
  c('tue-1915-hiit', 'Engine Room', 'hiit', 1, '19:15', 40, 'jonas-lindqvist', 18, 'Turf Lane', 'Rowers, bikes and sleds in timed intervals.'),
  c('wed-0630-perf', 'Performance Lab', 'performance-training', 2, '06:30', 60, 'jonas-lindqvist', 10, 'Turf Lane', 'Power and speed development for experienced members.'),
  c('wed-1215-mob', 'Mobility Reset', 'mobility', 2, '12:15', 45, 'priya-raman', 16, 'Studio B', 'A midday movement break.'),
  c('wed-1730-box', 'Boxing Rounds', 'boxing-fitness', 2, '17:30', 55, 'dario-velasquez', 16, 'Boxing Zone', 'Bag rounds and pad work with conditioning finishers.'),
  c('wed-1845-iron', 'Iron Hour', 'strength-training', 2, '18:45', 60, 'maya-okafor', 14, 'Strength Hall', 'Press-focused coached session.'),
  c('thu-0630-group', 'Dawn Conditioning', 'group-conditioning', 3, '06:30', 45, 'tessa-whitlock', 20, 'Studio A', 'High-energy group class before work.'),
  c('thu-1200-func', 'Functional Flow', 'functional-training', 3, '12:00', 50, 'jonas-lindqvist', 16, 'Studio A', 'Carries, hinges and core in scalable circuits.'),
  c('thu-1800-box', 'Boxing Fundamentals', 'boxing-fitness', 3, '18:00', 55, 'dario-velasquez', 16, 'Boxing Zone', 'A technique-first boxing class for all levels.'),
  c('thu-1915-mob', 'Mobility Unwind', 'mobility', 3, '19:15', 45, 'priya-raman', 16, 'Studio B', 'Slow, loaded stretching to close the day.'),
  c('fri-0630-hiit', 'Friday Fire', 'hiit', 4, '06:30', 40, 'jonas-lindqvist', 18, 'Turf Lane', 'Intervals to finish the week strong.'),
  c('fri-1215-iron', 'Iron Hour', 'strength-training', 4, '12:15', 60, 'maya-okafor', 14, 'Strength Hall', 'Hinge-focused coached session.'),
  c('fri-1730-group', 'Team Conditioning', 'group-conditioning', 4, '17:30', 45, 'dario-velasquez', 20, 'Studio A', 'Partner circuits and a friendly finisher.'),
  c('sat-0800-perf', 'Performance Lab', 'performance-training', 5, '08:00', 60, 'jonas-lindqvist', 10, 'Turf Lane', 'Weekend power session with capped numbers.'),
  c('sat-0915-box', 'Boxing Rounds', 'boxing-fitness', 5, '09:15', 55, 'dario-velasquez', 16, 'Boxing Zone', 'A longer round-based session.'),
  c('sat-1030-group', 'Saturday Social', 'group-conditioning', 5, '10:30', 45, 'tessa-whitlock', 20, 'Studio A', 'Team formats and a coffee-ready finish.'),
  c('sat-1145-mob', 'Mobility Reset', 'mobility', 5, '11:45', 45, 'priya-raman', 16, 'Studio B', 'Recover from the week.'),
  c('sun-0900-func', 'Functional Flow', 'functional-training', 6, '09:00', 50, 'tessa-whitlock', 16, 'Studio A', 'A relaxed Sunday circuit.'),
  c('sun-1015-mob', 'Mobility Reset', 'mobility', 6, '10:15', 45, 'priya-raman', 16, 'Studio B', 'Gentle range-of-motion work.'),
  c('sun-1130-found', 'Strength Foundations', 'strength-training', 6, '11:30', 60, 'marcus-reid', 12, 'Strength Hall', 'A beginner-friendly introduction to coached lifting.')
];
