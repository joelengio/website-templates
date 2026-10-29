import { Link, useParams, useSearchParams } from 'react-router-dom';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import BookingWidget from '../components/BookingWidget';
import { LinkButton } from '../components/Button';
import Icon from '../components/Icon';
import RoomCard from '../components/RoomCard';
import RoomGallery from '../components/RoomGallery';
import { Breadcrumb } from '../components/Section';
import { amenities as catalogue } from '../config/amenities';
import { ratePlans, seasons } from '../config/booking';
import { rooms } from '../config/rooms';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { money } from '../lib/format';
import { readStay, writeStay } from '../lib/stay';
import NotFound from './NotFound';

const SEASON_LABEL = (from: string, to: string) => {
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const f = (s: string) => `${m[Number(s.slice(0, 2)) - 1]} ${Number(s.slice(3))}`;
  return `${f(from)} – ${f(to)}`;
};

export default function RoomDetail() {
  const { slug } = useParams();
  const room = rooms.find((r) => r.slug === slug && r.units > 0);
  const [sp] = useSearchParams();
  const ref = useReveal<HTMLDivElement>();
  useSeo({ title: room?.name ?? 'Room not found', description: room?.description ?? 'Room not found', path: `/rooms/${slug}`, image: room?.images[0].src, noindex: !room });
  if (!room) return <NotFound />;
  const stay = readStay(sp);
  const hasDates = !!stay.checkIn && !!stay.checkOut;
  const bookHref = `/booking?${writeStay({ checkIn: stay.checkIn, checkOut: stay.checkOut, adults: Math.min(stay.adults, room.maxAdults), children: Math.min(stay.children, room.maxChildren), room: room.id })}`;
  const roomAmenities = room.amenities.map((id) => catalogue.find((a) => a.id === id)).filter(Boolean);
  const related = rooms.filter((r) => r.id !== room.id && r.units > 0).sort((a, b) => Number(b.category === room.category) - Number(a.category === room.category) || Math.abs(a.baseRate - room.baseRate) - Math.abs(b.baseRate - room.baseRate)).slice(0, 3);

  return (
    <div ref={ref} className="room-detail">
      <div className="container">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Rooms & Suites', to: '/rooms' }, { label: room.name }]} />
        <div className="room-detail__top">
          <RoomGallery images={room.images} name={room.name} />
          <aside className="book-card" aria-labelledby="book-card-h">
            <p className="kicker">{room.category}</p>
            <h2 id="book-card-h" className="book-card__title">Reserve this room</h2>
            <p className="price price--lg"><span>From</span> <strong>{money(room.baseRate)}</strong> <span>/ night</span></p>
            <p className="muted">Rate before season, taxes and fees. Prices vary by date — see the rate table below.</p>
            <BookingWidget room={room.id} initial={hasDates ? { checkIn: stay.checkIn, checkOut: stay.checkOut, adults: Math.min(stay.adults, room.maxAdults), children: Math.min(stay.children, room.maxChildren) } : { adults: 2, children: 0 }} label="Check availability" idPrefix="rd" />
            <LinkButton to={bookHref} variant="secondary" className="book-card__direct">Book this room</LinkButton>
            <p className="note">Demonstration booking — no payment is taken.</p>
          </aside>
        </div>

        <div className="room-detail__main">
          <div>
            <h1 className="display">{room.name}</h1>
            <p className="lead">{room.tagline}</p>
            <p>{room.description}</p>
            <ul className="highlights">{room.highlights.map((h) => <li key={h}><Icon name="check" size={18} /> {h}</li>)}</ul>

            <h2 className="h3">Room details</h2>
            <dl className="spec">
              <div><dt>Occupancy</dt><dd>Up to {room.maxOccupancy} guests ({room.maxAdults} adults{room.maxChildren ? `, ${room.maxChildren} ${room.maxChildren === 1 ? 'child' : 'children'}` : ', adults only'})</dd></div>
              <div><dt>Beds</dt><dd>{room.beds}</dd></div>
              <div><dt>Size</dt><dd>{room.areaSqm} m² ({Math.round(room.areaSqm * 10.764)} sq ft)</dd></div>
              <div><dt>View</dt><dd>{room.view}</dd></div>
              <div><dt>Category</dt><dd>{room.category}</dd></div>
              <div><dt>Rooms of this type</dt><dd>{room.units}</dd></div>
            </dl>

            <h2 className="h3">Room amenities</h2>
            <ul className="amenity-list">{roomAmenities.map((a) => <li key={a!.id}><Icon name={a!.icon} size={20} /> {a!.label}</li>)}</ul>
          </div>
          <div>
            <h2 className="h3">Rate information</h2>
            <p className="muted">Nightly rate for this room by season (flexible rate, weekday). Fridays and Saturdays add a weekend uplift; discounts, taxes and fees are calculated at booking.</p>
            <div className="table-wrap">
              <table className="rate-table">
                <caption className="sr-only">Nightly rates by season for {room.name}</caption>
                <thead><tr><th scope="col">Season</th><th scope="col">Dates</th><th scope="col" className="num">Per night</th><th scope="col" className="num">Min. stay</th></tr></thead>
                <tbody>
                  {seasons.map((s) => (
                    <tr key={s.id}>
                      <th scope="row">{s.name}</th>
                      <td>{SEASON_LABEL(s.from, s.to)}</td>
                      <td className="num">{money(Math.round(room.baseRate * s.multiplier))}</td>
                      <td className="num">{s.minNights}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="h4">Rate plans</h3>
            <ul className="plan-list">{ratePlans.map((p) => <li key={p.id}><strong>{p.name}</strong> — {p.description}</li>)}</ul>
            <h2 className="h3">Availability (simulated)</h2>
            <AvailabilityCalendar room={room} />
          </div>
        </div>

        <section aria-labelledby="related-h" className="related">
          <h2 id="related-h" className="display display--sm">Related accommodation</h2>
          <div className="grid grid--3">{related.map((r) => <RoomCard key={r.id} room={r} />)}</div>
          <p><Link to="/rooms" className="btn btn--text">Back to all rooms</Link></p>
        </section>
      </div>
    </div>
  );
}
