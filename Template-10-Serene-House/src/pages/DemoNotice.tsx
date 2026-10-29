import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { booking } from '../config/booking';
import { Seo } from '../components/Seo';
import { SectionHeading } from '../components/ui';

export default function DemoNoticePage() {
  return (
    <>
      <Seo title={site.pages.notice.title} description={site.pages.notice.description} />
      <section className="page-hero"><div className="container narrow"><SectionHeading as="h1" eyebrow="Information" title="Demo notice & privacy" /></div></section>
      <section className="section section--tight">
        <div className="container narrow prose">
          <p>{site.publisher.notice}</p>
          <h2 className="h-sub">Bookings</h2>
          <p>{booking.disclosure}</p>
          <h2 className="h-sub">Contact form and newsletter</h2>
          <p>Without a configured endpoint the contact form only validates your input; the message is not delivered anywhere. The newsletter field validates an address but stores and sends nothing.</p>
          <h2 className="h-sub">Local storage</h2>
          <p>Demonstration bookings are saved in this browser (localStorage key <code>{booking.storageKey}</code>). You can cancel or delete them at any time from <Link to="/booking/manage">My Bookings</Link>, or clear site data in your browser. No cookies, analytics or third-party trackers are used by this template.</p>
          <h2 className="h-sub">Content</h2>
          <p>Spa treatments, prices, team members, testimonials and journal articles are fictional demonstration content. Illustrations were generated for this template — see ASSET_LICENSES.md in the project files.</p>
        </div>
      </section>
    </>
  );
}
