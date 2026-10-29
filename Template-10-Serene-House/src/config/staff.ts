import type { StaffMember } from './types';
import { teamImages } from './images';

/** Team members, their specialties and demo working days (0 = Sunday). Drives the About page and booking. */
export const staff: StaffMember[] = [
  { id: 'amara-ellison', name: 'Amara Ellison', role: 'Founder & Lead Therapist', bio: 'With fifteen years in holistic bodywork, Amara created Serene House as a place where care is never rushed.', specialties: ['massage', 'wellness'], workingDays: [1, 2, 3, 4, 5], languages: ['English', 'French'], image: teamImages[0] },
  { id: 'mateo-ruiz', name: 'Mateo Ruiz', role: 'Senior Massage Therapist', bio: 'Mateo blends deep tissue and sports massage with a calm, intuitive touch.', specialties: ['massage'], workingDays: [2, 3, 4, 5, 6], languages: ['English', 'Spanish'], image: teamImages[1] },
  { id: 'priya-nair', name: 'Priya Nair', role: 'Lead Esthetician', bio: 'Priya specialises in sensitive skin and botanical facial protocols.', specialties: ['facial', 'body'], workingDays: [1, 3, 4, 5, 6], languages: ['English', 'Hindi'], image: teamImages[2] },
  { id: 'noor-haddad', name: 'Noor Haddad', role: 'Body Ritual Specialist', bio: 'Noor leads our wraps, scrubs and baths, and designs the seasonal rituals.', specialties: ['body', 'massage'], workingDays: [1, 2, 4, 5, 6], languages: ['English', 'Arabic'], image: teamImages[3] },
  { id: 'lena-kowalski', name: 'Lena Kowalski', role: 'Wellness Guide', bio: 'Lena guides breathwork, sound baths and yoga nidra with a gentle, grounded presence.', specialties: ['wellness'], workingDays: [2, 3, 4, 6], languages: ['English', 'Polish'], image: teamImages[4] },
  { id: 'daniel-okafor', name: 'Daniel Okafor', role: 'Massage & Prenatal Therapist', bio: 'Daniel is certified in prenatal massage and brings a calm, reassuring style.', specialties: ['massage', 'body'], workingDays: [1, 3, 5, 6], languages: ['English'], image: teamImages[5] }
];
