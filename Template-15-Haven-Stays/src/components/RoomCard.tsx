import { Link } from 'react-router-dom';
import type { Room } from '../config/types';
import { amenities as catalogue } from '../config/amenities';
import { money } from '../lib/format';
import Icon from './Icon';
import Img from './Img';

interface Props {
  room: Room;
  badge?: { text: string; tone: 'ok' | 'warn' | 'bad' };
  query?: string;
}

export default function RoomCard({ room, badge, query = '' }: Props) {
  const top = room.amenities.slice(0, 4).map((id) => catalogue.find((a) => a.id === id)?.label).filter(Boolean);
  return (
    <article className="room-card reveal">
      <Link to={`/rooms/${room.slug}${query}`} className="room-card__media" tabIndex={-1} aria-hidden="true">
        <Img src={room.images[0].src} alt="" ratio={[4, 3]} />
        <span className="room-card__cat">{room.category}</span>
        {badge && <span className={`badge badge--${badge.tone}`}>{badge.text}</span>}
      </Link>
      <div className="room-card__body">
        <h3><Link to={`/rooms/${room.slug}${query}`}>{room.name}</Link></h3>
        <p className="room-card__tag">{room.tagline}</p>
        <ul className="room-card__facts" aria-label="Key facts">
          <li><Icon name="users" size={16} /> Up to {room.maxOccupancy}</li>
          <li><Icon name="bed" size={16} /> {room.beds}</li>
          <li><Icon name="area" size={16} /> {room.areaSqm} m²</li>
        </ul>
        <p className="room-card__am">{top.join(' · ')}</p>
        <div className="room-card__foot">
          <p className="price"><span>From</span> <strong>{money(room.baseRate)}</strong> <span>/ night</span></p>
          <Link className="btn btn--secondary btn--sm" to={`/rooms/${room.slug}${query}`}>View room</Link>
        </div>
      </div>
    </article>
  );
}
