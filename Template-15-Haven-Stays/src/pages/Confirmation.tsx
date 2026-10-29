import { Link, useParams } from 'react-router-dom';
import Button, { LinkButton } from '../components/Button';
import Icon from '../components/Icon';
import PriceBreakdown from '../components/PriceBreakdown';
import ReservationSummary from '../components/ReservationSummary';
import { PageHero } from '../components/Section';
import { site } from '../config/site';
import { useReservations } from '../hooks/useReservations';
import { useSeo } from '../hooks/useSeo';

export default function Confirmation() {
  const { id = '' } = useParams();
  const list = useReservations();
  const r = list.find((x) => x.id === id);
  useSeo({ title: 'Reservation confirmed (demo)', description: 'Your local demonstration reservation.', path: `/booking/confirmation/${id}`, noindex: true });
  if (!r) {
    return (
      <section className="section section--cream"><div className="container narrow">
        <h1 className="display">Reservation not found</h1>
        <p>We could not find “{id}” in this browser. Demonstration reservations are stored locally and are removed if site data is cleared.</p>
        <LinkButton to="/reservations">Manage reservations</LinkButton>
      </div></section>
    );
  }
  return (
    <>
      <PageHero kicker="Demonstration booking" title="Your reservation is saved" text="This demonstration reservation exists only in this browser." />
      <section className="section section--cream">
        <div className="container narrow">
          <div className="notice notice--strong" role="status"><Icon name="info" size={20} /><p><strong>Not a real booking.</strong> {site.demoNotice} No payment has been taken and no confirmation email was sent.</p></div>
          <h2 className="display display--sm">Reservation details</h2>
          <ReservationSummary r={r} />
          <PriceBreakdown quote={r.quote} />
          <div className="form__actions">
            <LinkButton to={`/reservations/${r.id}`} arrow>View, change or cancel</LinkButton>
            <Button variant="ghost" onClick={() => window.print()}><Icon name="print" size={18} /> Print</Button>
            <Link to="/" className="btn btn--text">Back to home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
