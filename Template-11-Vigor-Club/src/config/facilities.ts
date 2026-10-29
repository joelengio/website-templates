import { facilityImages as f } from './images';
import type { Facility, GalleryItem } from './types';

/** Facility areas (Facilities page + home preview). The six required areas are listed first. */
export const facilities: Facility[] = [
  { slug: 'strength', name: 'Strength Hall', area: 'Strength', summary: 'Eight platforms, six power racks and a full range of plates, dumbbells and specialty bars.', highlights: ['8 lifting platforms', '6 power racks', 'Calibrated plates to 25 kg'], image: f.strength },
  { slug: 'cardio', name: 'Cardio Deck', area: 'Cardio', summary: 'Treadmills, rowers, ski-ergs and air bikes in front of floor-to-ceiling windows.', highlights: ['Treadmills and curved runners', 'Rowers and ski-ergs', 'Natural light'], image: f.cardio },
  { slug: 'functional', name: 'Functional Yard', area: 'Functional', summary: 'Turf lane, sleds, ropes, kettlebells and rigs for conditioning and athletic work.', highlights: ['15 m sled lane', 'Battle ropes and kettlebells', 'Overhead rig'], image: f.functional },
  { slug: 'group', name: 'Studio A & B', area: 'Group exercise', summary: 'Two sprung-floor studios with premium sound for classes, mobility and team formats.', highlights: ['Sprung floors', 'Premium sound system', 'Class equipment included'], image: f.group },
  { slug: 'personal', name: 'Private Coaching Bays', area: 'Personal training', summary: 'Semi-private bays equipped for one-to-one sessions without the noise of the main floor.', highlights: ['Private bays', 'Full equipment access', 'Quiet coaching environment'], image: f.personal },
  { slug: 'recovery', name: 'Recovery Rooms', area: 'Recovery', summary: 'Infrared sauna, cold plunge and a stretch lounge to wind down after training.', highlights: ['Sauna', 'Cold plunge', 'Stretch lounge'], image: f.recovery }
];

/** Gallery images (Facilities page). `area` powers the area filter. */
export const gallery: GalleryItem[] = [
  { id: 'g1', caption: 'Strength Hall — power racks', area: 'Strength', image: f.strength },
  { id: 'g2', caption: 'Cardio Deck — morning light', area: 'Cardio', image: f.cardio },
  { id: 'g3', caption: 'Functional Yard — rope work', area: 'Functional', image: f.functional },
  { id: 'g4', caption: 'Studio A — group class', area: 'Group exercise', image: f.group },
  { id: 'g5', caption: 'Private coaching bay', area: 'Personal training', image: f.personal },
  { id: 'g6', caption: 'Recovery lounge', area: 'Recovery', image: f.recovery },
  { id: 'g7', caption: 'Cold plunge', area: 'Recovery', image: f.plunge },
  { id: 'g8', caption: 'Indoor sprint lanes', area: 'Functional', image: f.track },
  { id: 'g9', caption: 'Boxing zone', area: 'Group exercise', image: f.boxing },
  { id: 'g10', caption: 'Kettlebell wall', area: 'Strength', image: f.free }
];
