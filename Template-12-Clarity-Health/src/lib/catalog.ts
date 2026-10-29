import { articles } from '../config/articles';
import { doctors } from '../config/doctors';
import { services } from '../config/services';
import { specialties } from '../config/specialties';
import type { Article, ConsultMode, Doctor, Service, Specialty } from '../config/types';

export const specialtyById = (id: string): Specialty | undefined => specialties.find((s) => s.id === id);
export const specialtyBySlug = (slug: string): Specialty | undefined => specialties.find((s) => s.slug === slug);
export const doctorById = (id: string): Doctor | undefined => doctors.find((d) => d.id === id);
export const doctorBySlug = (slug: string): Doctor | undefined => doctors.find((d) => d.slug === slug);
export const serviceById = (id: string): Service | undefined => services.find((s) => s.id === id);
export const serviceBySlug = (slug: string): Service | undefined => services.find((s) => s.slug === slug);
export const articleBySlug = (slug: string): Article | undefined => articles.find((a) => a.slug === slug);

export const doctorsOfSpecialty = (specialtyId: string): Doctor[] => doctors.filter((d) => d.specialtyId === specialtyId);
export const servicesOfSpecialty = (specialtyId: string): Service[] => services.filter((s) => s.specialtyIds.includes(specialtyId));

export const sharedModes = (d: Doctor, s: Service): ConsultMode[] => s.modes.filter((m) => d.modes.includes(m));

/** A doctor can deliver a service when it belongs to their specialty and they share at least one consultation format. */
export const canDeliver = (d: Doctor, s: Service): boolean => s.specialtyIds.includes(d.specialtyId) && sharedModes(d, s).length > 0;

export const servicesForDoctor = (d: Doctor): Service[] => services.filter((s) => canDeliver(d, s));
export const doctorsForService = (s: Service, specialtyId?: string): Doctor[] =>
  doctors.filter((d) => canDeliver(d, s) && (!specialtyId || d.specialtyId === specialtyId));

/** Services offered in the booking flow for a specialty (and optionally a chosen doctor). */
export function bookableServices(specialtyId: string, doctorId?: string): Service[] {
  const doc = doctorId ? doctorById(doctorId) : undefined;
  if (doc) return servicesForDoctor(doc).filter((s) => s.specialtyIds.includes(specialtyId));
  return servicesOfSpecialty(specialtyId).filter((s) => eligibleDoctors(specialtyId, s).length > 0);
}

/** Doctors who can deliver the service for the chosen specialty/doctor, and who are taking new patients in the demo. */
export function eligibleDoctors(specialtyId: string, service: Service, doctorId?: string): Doctor[] {
  const pool = doctorsForService(service, specialtyId).filter((d) => d.acceptingNewPatients);
  return doctorId ? pool.filter((d) => d.id === doctorId) : pool;
}

/** Consultation formats available for the service across the eligible doctors. */
export function availableModes(pool: Doctor[], service: Service): ConsultMode[] {
  return service.modes.filter((m) => pool.some((d) => d.modes.includes(m)));
}

export const relatedArticles = (a: Article, limit = 3): Article[] =>
  articles
    .filter((x) => x.id !== a.id)
    .map((x) => ({ x, score: (x.category === a.category ? 2 : 0) + (x.relatedSpecialty && x.relatedSpecialty === a.relatedSpecialty ? 1 : 0) }))
    .sort((p, q) => q.score - p.score || (p.x.date < q.x.date ? 1 : -1))
    .slice(0, limit)
    .map((r) => r.x);
