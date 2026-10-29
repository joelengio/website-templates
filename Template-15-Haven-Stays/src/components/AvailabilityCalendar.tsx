import { useState } from 'react';
import type { Room } from '../config/types';
import { unitsLeft } from '../lib/availability';
import { addMonths, formatDate, monthGrid, startOfMonth } from '../lib/dates';
import { useReservations } from '../hooks/useReservations';
import { today } from '../lib/stay';
import { booking } from '../config/booking';
import Icon from './Icon';

/** Month view of the *simulated* availability for one room type. */
export default function AvailabilityCalendar({ room }: { room: Room }) {
  const t = today();
  const [month, setMonth] = useState(startOfMonth(t));
  const reservations = useReservations();
  const last = startOfMonth(addMonths(t, 12));
  return (
    <div className="avail">
      <div className="avail__nav">
        <button type="button" className="icon-btn" onClick={() => setMonth(addMonths(month, -1))} disabled={month <= startOfMonth(t)} aria-label="Previous month"><Icon name="chevron-left" /></button>
        <h3>{formatDate(month, { month: 'long', year: 'numeric' })}</h3>
        <button type="button" className="icon-btn" onClick={() => setMonth(addMonths(month, 1))} disabled={month >= last} aria-label="Next month"><Icon name="chevron-right" /></button>
      </div>
      <table className="avail__grid">
        <caption className="sr-only">Simulated availability for {room.name}</caption>
        <thead>
          <tr>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <th key={d} scope="col"><span aria-hidden="true">{d.slice(0, 2)}</span><span className="sr-only">{d}</span></th>)}</tr>
        </thead>
        <tbody>
          {monthGrid(month).map((w, i) => (
            <tr key={i}>
              {w.map((d, j) => {
                if (!d) return <td key={j} />;
                const past = d < t;
                const left = past ? 0 : unitsLeft(room, d, reservations);
                const state = past ? 'past' : left === 0 ? 'sold' : left <= booking.scarcityThreshold ? 'low' : 'open';
                const label = past ? 'past' : left === 0 ? 'sold out (simulated)' : `${left} left (simulated)`;
                return (
                  <td key={d} className={`avail__cell avail__cell--${state}`} title={`${formatDate(d)} — ${label}`}>
                    <span aria-hidden="true">{Number(d.slice(8))}</span>
                    <span className="sr-only">{formatDate(d, { weekday: 'long', day: 'numeric', month: 'long' })}: {label}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="legend" aria-label="Legend">
        <li><i className="avail__sw avail__sw--open" /> Available</li>
        <li><i className="avail__sw avail__sw--low" /> Limited</li>
        <li><i className="avail__sw avail__sw--sold" /> Sold out</li>
      </ul>
      <p className="note">Simulated demonstration data — not connected to a real hotel inventory.</p>
    </div>
  );
}
