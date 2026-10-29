import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PageHero } from '../components/Section';
import { ManageReservations, ReservationWizard } from '../components/ReservationWizard';
import { useSeo } from '../hooks/useSeo';
import { pageSeo } from '../lib/seo';
import { useReservations } from '../lib/reservationStore';
import type { Reservation } from '../lib/reservations';

export default function Reserve() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const manage = pathname.startsWith('/reserve/manage');
  const reservations = useReservations();
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [wizardKey, setWizardKey] = useState(0);
  const seoPath = manage ? '/reserve/manage' : '/reserve';
  const seo = pageSeo(seoPath);
  useSeo({ ...seo, path: seoPath });

  const upcomingCount = reservations.filter((r) => r.status === 'confirmed').length;
  const startEdit = (r: Reservation) => {
    setEditing(r);
    setWizardKey((k) => k + 1);
    navigate('/reserve');
  };

  return (
    <>
      <PageHero eyebrow="Reservations · demo" title={manage ? 'My reservations' : editing ? 'Modify your reservation' : 'Reserve a table'} lead="An interactive simulation: choose a date, party size and seating, then see how a booking flow behaves. Nothing is sent to a restaurant." image="pasta-table" />
      <section className="section section--dark">
        <div className="container">
          <nav className="tabs" aria-label="Reservation sections">
            <Link to="/reserve" aria-current={!manage ? 'page' : undefined} onClick={() => { if (!manage) return; setEditing(null); setWizardKey((k) => k + 1); }}>Book a table</Link>
            <Link to="/reserve/manage" aria-current={manage ? 'page' : undefined}>My reservations{upcomingCount > 0 ? ` (${upcomingCount})` : ''}</Link>
          </nav>
          {manage ? (
            <ManageReservations onModify={startEdit} onBook={() => { setEditing(null); setWizardKey((k) => k + 1); navigate('/reserve'); }} />
          ) : (
            <ReservationWizard
              key={wizardKey}
              editing={editing}
              onExitEdit={() => { setEditing(null); }}
              onViewReservations={() => navigate('/reserve/manage')}
              onModify={startEdit}
            />
          )}
        </div>
      </section>
    </>
  );
}
