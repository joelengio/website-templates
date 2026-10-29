import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button, { LinkButton } from '../components/Button';
import Modal from '../components/Modal';
import { PageHero } from '../components/Section';
import { seoRoutes } from '../config/seo';
import { useReservations } from '../hooks/useReservations';
import { useSeo } from '../hooks/useSeo';
import { formatDate } from '../lib/dates';
import { cents } from '../lib/format';
import { reservationStore } from '../lib/reservations';

export default function Reservations() {
  useSeo({ ...seoRoutes['/reservations'], path: '/reservations', noindex: true });
  const list = useReservations();
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    const r = reservationStore.get(code);
    if (r && r.guest.email.trim().toLowerCase() === email.trim().toLowerCase()) {
      nav(`/reservations/${r.id}`);
    } else setMsg('No reservation in this browser matches that code and email.');
  };

  return (
    <>
      <PageHero kicker="Reservations" title="Manage a reservation" text="Reservations made in this demonstration are stored in this browser only." />
      <section className="section section--cream">
        <div className="container">
          <div className="grid grid--2 reservations-grid">
            <div>
              <h2 className="display display--sm">Your demonstration reservations</h2>
              {list.length === 0 ? (
                <div className="empty" role="status">
                  <h3>No reservations yet</h3>
                  <p>Complete the booking demonstration and your reservation will appear here.</p>
                  <LinkButton to="/booking" arrow>Reserve a stay</LinkButton>
                </div>
              ) : (
                <>
                  <ul className="res-list">
                    {list.map((r) => (
                      <li key={r.id} className={`res-card res-card--${r.status}`}>
                        <div>
                          <p className="code">{r.id}</p>
                          <h3><Link to={`/reservations/${r.id}`}>{r.roomName}</Link></h3>
                          <p>{formatDate(r.checkIn, { day: 'numeric', month: 'short', year: 'numeric' })} → {formatDate(r.checkOut, { day: 'numeric', month: 'short', year: 'numeric' })} · {r.quote.nights} nights</p>
                        </div>
                        <div className="res-card__side">
                          <span className={`badge badge--${r.status === 'confirmed' ? 'ok' : 'bad'}`}>{r.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}</span>
                          <strong>{cents(r.quote.total)}</strong>
                          <Link to={`/reservations/${r.id}`} className="btn btn--secondary btn--sm">Manage</Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button variant="text" onClick={() => setConfirmClear(true)}>Delete all demonstration data</Button>
                </>
              )}
            </div>
            <div>
              <h2 className="display display--sm">Find a reservation</h2>
              <form onSubmit={lookup} className="form" noValidate>
                <div className="field"><label htmlFor="lk-code">Confirmation code</label><input id="lk-code" value={code} onChange={(e) => { setCode(e.target.value); setMsg(''); }} placeholder="HS-XXXXXX" autoComplete="off" /></div>
                <div className="field"><label htmlFor="lk-email">Email used to book</label><input id="lk-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setMsg(''); }} autoComplete="email" /></div>
                {msg && <p className="field-error" role="alert">{msg}</p>}
                <Button type="submit" variant="secondary">Find reservation</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Modal open={confirmClear} onClose={() => setConfirmClear(false)} title="Delete demonstration data?">
        <p>This permanently removes every demonstration reservation stored in this browser.</p>
        <div className="form__actions"><Button variant="ghost" onClick={() => setConfirmClear(false)}>Keep them</Button><Button onClick={() => { reservationStore.clear(); setConfirmClear(false); }}>Delete all</Button></div>
      </Modal>
    </>
  );
}
