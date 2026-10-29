import { booking as bookingDefaults, seasons as seasonDefaults } from '../config/booking';
import type { Room, Season } from '../config/types';
import { addDays, diffDays, isValidISO } from './dates';
import { requiredMinNights } from './pricing';

export type StayErrorCode =
  | 'CHECKIN_MISSING' | 'CHECKOUT_MISSING' | 'DATE_INVALID' | 'CHECKIN_PAST' | 'CHECKOUT_BEFORE_CHECKIN'
  | 'ZERO_NIGHTS' | 'TOO_LONG' | 'TOO_FAR' | 'MIN_NIGHTS' | 'ADULTS_MIN' | 'OCCUPANCY' | 'CHILDREN' | 'ADULTS_MAX';

export interface StayError {
  code: StayErrorCode;
  field: 'checkIn' | 'checkOut' | 'guests';
  message: string;
}

export interface StayInput {
  checkIn: string | null | undefined;
  checkOut: string | null | undefined;
  adults: number;
  children: number;
}

interface Limits {
  today: string;
  maxNights: number;
  maxAdvanceDays: number;
  minNights: number;
  seasons: Season[];
}
export const defaultLimits = (today: string): Limits => ({
  today,
  maxNights: bookingDefaults.maxNights,
  maxAdvanceDays: bookingDefaults.maxAdvanceDays,
  minNights: bookingDefaults.minNights,
  seasons: seasonDefaults,
});

/** Validates dates only (no room selected yet). */
export function validateDates(input: Pick<StayInput, 'checkIn' | 'checkOut'>, limits: Limits): StayError[] {
  const errs: StayError[] = [];
  const { checkIn, checkOut } = input;
  if (!checkIn) errs.push({ code: 'CHECKIN_MISSING', field: 'checkIn', message: 'Choose a check-in date.' });
  else if (!isValidISO(checkIn)) errs.push({ code: 'DATE_INVALID', field: 'checkIn', message: 'The check-in date is not a valid date.' });
  if (!checkOut) errs.push({ code: 'CHECKOUT_MISSING', field: 'checkOut', message: 'Choose a check-out date.' });
  else if (!isValidISO(checkOut)) errs.push({ code: 'DATE_INVALID', field: 'checkOut', message: 'The check-out date is not a valid date.' });
  if (errs.length || !checkIn || !checkOut) return errs;

  if (checkIn < limits.today) errs.push({ code: 'CHECKIN_PAST', field: 'checkIn', message: 'Check-in cannot be in the past.' });
  if (diffDays(limits.today, checkIn) > limits.maxAdvanceDays) errs.push({ code: 'TOO_FAR', field: 'checkIn', message: `Reservations open up to ${limits.maxAdvanceDays} days ahead.` });
  if (checkOut < checkIn) errs.push({ code: 'CHECKOUT_BEFORE_CHECKIN', field: 'checkOut', message: 'Check-out must be after check-in.' });
  else if (checkOut === checkIn) errs.push({ code: 'ZERO_NIGHTS', field: 'checkOut', message: 'A stay needs at least one night — check-out must be after check-in.' });
  else {
    const n = diffDays(checkIn, checkOut);
    if (n > limits.maxNights) errs.push({ code: 'TOO_LONG', field: 'checkOut', message: `Online stays are limited to ${limits.maxNights} nights. Contact us for longer stays.` });
    const min = requiredMinNights(checkIn, checkOut, limits.seasons, limits.minNights);
    if (n < min && !errs.length) errs.push({ code: 'MIN_NIGHTS', field: 'checkOut', message: `Stays starting on this date require at least ${min} nights.` });
  }
  return errs;
}

export function validateGuests(adults: number, children: number, room?: Pick<Room, 'maxAdults' | 'maxChildren' | 'maxOccupancy' | 'name'>): StayError[] {
  const errs: StayError[] = [];
  if (!Number.isInteger(adults) || adults < 1) errs.push({ code: 'ADULTS_MIN', field: 'guests', message: 'At least one adult must travel.' });
  if (!Number.isInteger(children) || children < 0) errs.push({ code: 'CHILDREN', field: 'guests', message: 'Number of children is invalid.' });
  if (room && !errs.length) {
    if (adults > room.maxAdults) errs.push({ code: 'ADULTS_MAX', field: 'guests', message: `${room.name} sleeps up to ${room.maxAdults} adults.` });
    else if (children > room.maxChildren) errs.push({ code: 'CHILDREN', field: 'guests', message: room.maxChildren === 0 ? `${room.name} is for adults only.` : `${room.name} sleeps up to ${room.maxChildren} ${room.maxChildren === 1 ? 'child' : 'children'}.` });
    if (adults + children > room.maxOccupancy) errs.push({ code: 'OCCUPANCY', field: 'guests', message: `${room.name} has a maximum occupancy of ${room.maxOccupancy} guests.` });
  }
  return errs;
}

export const validateStay = (input: StayInput, limits: Limits, room?: Room) => [...validateDates(input, limits), ...validateGuests(input.adults, input.children, room)];

/** Earliest check-out the picker should offer. */
export const earliestCheckOut = (checkIn: string, limits: Pick<Limits, 'seasons' | 'minNights'>) => addDays(checkIn, requiredMinNights(checkIn, addDays(checkIn, 1), limits.seasons, limits.minNights));

/* ---- contact / guest details ---- */
export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requests: string;
}
export type FieldErrors<T extends string> = Partial<Record<T, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d][\d\s().-]{5,}$/;

export function validateGuest(g: GuestDetails): FieldErrors<keyof GuestDetails> {
  const e: FieldErrors<keyof GuestDetails> = {};
  if (g.firstName.trim().length < 2) e.firstName = 'Enter your first name.';
  if (g.lastName.trim().length < 2) e.lastName = 'Enter your last name.';
  if (!EMAIL.test(g.email.trim())) e.email = 'Enter a valid email address.';
  if (!PHONE.test(g.phone.trim())) e.phone = 'Enter a valid phone number (digits, spaces, + or -).';
  if (g.requests.length > 500) e.requests = 'Special requests are limited to 500 characters.';
  return e;
}

export interface ContactForm {
  name: string;
  email: string;
  topic: string;
  message: string;
}
export function validateContact(c: ContactForm): FieldErrors<keyof ContactForm> {
  const e: FieldErrors<keyof ContactForm> = {};
  if (c.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL.test(c.email.trim())) e.email = 'Enter a valid email address.';
  if (!c.topic) e.topic = 'Choose a topic.';
  if (c.message.trim().length < 10) e.message = 'Please write at least 10 characters.';
  else if (c.message.length > 1500) e.message = 'Messages are limited to 1,500 characters.';
  return e;
}
