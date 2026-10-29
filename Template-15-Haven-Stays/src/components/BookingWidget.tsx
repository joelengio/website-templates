import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateDates, validateGuests, defaultLimits } from '../lib/validation';
import { today, writeStay } from '../lib/stay';
import Button from './Button';
import DateRangePicker from './DateRangePicker';
import GuestPicker from './GuestPicker';
import { booking } from '../config/booking';

interface Props {
  initial?: { checkIn?: string; checkOut?: string; adults?: number; children?: number };
  room?: string;
  to?: string;
  label?: string;
  variant?: 'hero' | 'panel';
  idPrefix?: string;
}

/** Search widget: validates dates and guests, then opens the booking engine with the selection prefilled. */
export default function BookingWidget({ initial, room, to = '/booking', label = 'Check availability', variant = 'panel', idPrefix = 'bw' }: Props) {
  const nav = useNavigate();
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? '');
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? '');
  const [adults, setAdults] = useState(initial?.adults ?? booking.defaultAdults);
  const [children, setChildren] = useState(initial?.children ?? booking.defaultChildren);
  const [errors, setErrors] = useState<{ dates?: string; guests?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = validateDates({ checkIn, checkOut }, defaultLimits(today()));
    const g = validateGuests(adults, children);
    if (d.length || g.length) {
      setErrors({ dates: d[0]?.message, guests: g[0]?.message });
      return;
    }
    nav(`${to}?${writeStay({ checkIn, checkOut, adults, children, room })}`);
  };

  return (
    <form className={`bw bw--${variant}`} onSubmit={submit} noValidate aria-label="Search availability">
      <DateRangePicker idPrefix={idPrefix} checkIn={checkIn} checkOut={checkOut} error={errors.dates} onChange={(a, b) => { setCheckIn(a); setCheckOut(b); setErrors({}); }} />
      <GuestPicker idPrefix={idPrefix} adults={adults} children={children} error={errors.guests} onChange={(a, c) => { setAdults(a); setChildren(c); setErrors({}); }} />
      <Button type="submit" arrow>{label}</Button>
    </form>
  );
}
