import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BookingWidget from '../components/BookingWidget';
import Button from '../components/Button';
import { PageHero } from '../components/Section';
import RoomCard from '../components/RoomCard';
import { amenities as catalogue } from '../config/amenities';
import { rooms, roomCategories } from '../config/rooms';
import { seoRoutes } from '../config/seo';
import { useReservations } from '../hooks/useReservations';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { availability } from '../lib/availability';
import { diffDays } from '../lib/dates';
import { filterRooms, readFilters, writeFilters, type RoomFilters, type SortKey } from '../lib/filters';
import { plural } from '../lib/format';
import { readStay, roomFits, writeStay } from '../lib/stay';

const maxPrice = Math.ceil(Math.max(...rooms.map((r) => r.baseRate)) / 50) * 50;
const filterAmenities = ['seaview', 'plunge', 'bathtub', 'balcony', 'kitchenette', 'fireplace', 'spa-access', 'butler', 'accessible'];

export default function Rooms() {
  useSeo({ ...seoRoutes['/rooms'], path: '/rooms' });
  const [sp, setSp] = useSearchParams();
  const [f, setF] = useState<RoomFilters>(() => readFilters(sp, maxPrice));
  const stay = readStay(sp);
  const reservations = useReservations();
  const ref = useReveal<HTMLDivElement>();
  const hasDates = !!stay.checkIn && !!stay.checkOut && diffDays(stay.checkIn, stay.checkOut) > 0;

  // Local state keeps typing and checkboxes responsive; the URL mirrors it so filters survive reloads and can be shared.
  const update = (patch: Partial<RoomFilters>) => {
    const next = { ...f, ...patch };
    setF(next);
    setSp(writeFilters(next, maxPrice, sp), { replace: true });
  };
  const results = useMemo(() => filterRooms(rooms, f), [f.q, f.category, f.guests, f.maxPrice, f.sort, f.amenities.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = f.q || f.category !== 'all' || f.guests || f.maxPrice < maxPrice || f.amenities.length;
  const keep = hasDates ? `?${writeStay({ checkIn: stay.checkIn, checkOut: stay.checkOut, adults: stay.adults, children: stay.children })}` : '';

  const badgeFor = (id: string) => {
    if (!hasDates) return undefined;
    const room = rooms.find((r) => r.id === id)!;
    if (!roomFits(room, stay.adults, stay.children).fits) return { text: 'Does not fit your party', tone: 'warn' as const };
    const a = availability(room, stay.checkIn, stay.checkOut, reservations);
    return a.available ? { text: a.left <= 2 ? `Only ${a.left} left (simulated)` : 'Available (simulated)', tone: a.left <= 2 ? ('warn' as const) : ('ok' as const) } : { text: 'Sold out (simulated)', tone: 'bad' as const };
  };

  return (
    <div ref={ref}>
      <PageHero kicker="Accommodation" title="Rooms & Suites" text="Ten room types across four categories. Filter by what matters, or enter dates to see simulated availability." />
      <section className="section section--cream">
        <div className="container">
          <div className="panel reveal">
            <h2 className="panel__title">Check availability</h2>
            <BookingWidget idPrefix="rooms" initial={hasDates ? { checkIn: stay.checkIn, checkOut: stay.checkOut, adults: stay.adults, children: stay.children } : undefined} to="/rooms" label="Show availability" />
          </div>
          <div className="listing">
            <aside className="filters" aria-label="Room filters">
              <form onSubmit={(e) => e.preventDefault()} role="search">
                <div className="filters__head">
                  <h2>Filter</h2>
                  {active ? <Button variant="text" onClick={() => update({ q: '', category: 'all', guests: 0, maxPrice, amenities: [] })}>Clear all</Button> : null}
                </div>
                <div className="field">
                  <label htmlFor="room-q">Search</label>
                  <input id="room-q" type="search" placeholder="Name, view, bed…" value={f.q} onChange={(e) => update({ q: e.target.value })} />
                </div>
                <fieldset>
                  <legend>Room type</legend>
                  <div className="chips" role="group">
                    {['all', ...roomCategories].map((c) => (
                      <button key={c} type="button" className={`chip${f.category === c ? ' is-on' : ''}`} aria-pressed={f.category === c} onClick={() => update({ category: c })}>{c === 'all' ? 'All' : c}</button>
                    ))}
                  </div>
                </fieldset>
                <div className="field">
                  <label htmlFor="room-guests">Guest capacity</label>
                  <select id="room-guests" value={f.guests} onChange={(e) => update({ guests: Number(e.target.value) })}>
                    <option value={0}>Any</option>
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}{n === 6 ? '' : '+'} {n === 1 ? 'guest' : 'guests'}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="room-price">Max nightly rate: <strong>${f.maxPrice}</strong></label>
                  <input id="room-price" type="range" min={150} max={maxPrice} step={10} value={f.maxPrice} onChange={(e) => update({ maxPrice: Number(e.target.value) })} />
                </div>
                <fieldset>
                  <legend>Amenities</legend>
                  <div className="checklist">
                    {filterAmenities.map((id) => {
                      const a = catalogue.find((x) => x.id === id)!;
                      return (
                        <label key={id} className="check">
                          <input type="checkbox" checked={f.amenities.includes(id)} onChange={(e) => update({ amenities: e.target.checked ? [...f.amenities, id] : f.amenities.filter((x) => x !== id) })} />
                          <span>{a.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </form>
            </aside>
            <div className="listing__main">
              <div className="listing__bar">
                <p role="status" aria-live="polite" id="room-count">{plural(results.length, 'room')} {active ? 'match your filters' : 'available to browse'}</p>
                <div className="field field--inline">
                  <label htmlFor="room-sort">Sort by</label>
                  <select id="room-sort" value={f.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="size-desc">Largest first</option>
                    <option value="capacity-desc">Highest capacity</option>
                  </select>
                </div>
              </div>
              {results.length === 0 ? (
                <div className="empty" role="status">
                  <h3>No rooms match those filters</h3>
                  <p>Try removing an amenity, increasing the maximum rate or lowering the guest count.</p>
                  <Button onClick={() => update({ q: '', category: 'all', guests: 0, maxPrice, amenities: [] })}>Clear all filters</Button>
                </div>
              ) : (
                <div className="grid grid--2">{results.map((r) => <RoomCard key={r.id} room={r} badge={badgeFor(r.id)} query={keep} />)}</div>
              )}
              <p className="note">Availability shown here is simulated for demonstration. <Link to="/contact#faq">Learn more</Link>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
