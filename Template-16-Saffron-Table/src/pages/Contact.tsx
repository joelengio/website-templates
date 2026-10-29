import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/Button';
import { ContactForm } from '../components/Forms';
import { Icon } from '../components/Icon';
import { DemoNotice, PageHero, SectionHeading } from '../components/Section';
import { contactContent } from '../config/content';
import { site } from '../config/site';
import { useSeo } from '../hooks/useSeo';
import { pageSeo } from '../lib/seo';

export default function Contact() {
  useSeo({ ...pageSeo('/contact'), path: '/contact' });
  const { contact } = site;
  return (
    <>
      <PageHero {...contactContent} image="terrace" />
      <section className="section section--dark">
        <div className="container contact">
          <div className="contact__info">
            <h2 className="h3">Visit</h2>
            <address>
              <p><Icon name="pin" size={18} /> {contact.address.line1}, {contact.address.line2}<br />{contact.address.city}, {contact.address.region} {contact.address.postcode}, {contact.address.country}</p>
              <p><Icon name="phone" size={18} /> <a href={contact.phoneHref}>{contact.phone}</a></p>
              <p><Icon name="mail" size={18} /> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
            </address>
            <h2 className="h3">Opening hours</h2>
            <ul className="hours-list">{site.hoursDisplay.map((h) => <li key={h.days}><span>{h.days}</span><span>{h.hours}</span></li>)}</ul>
            <p className="muted">{site.hoursNote} Holiday closures are applied in the reservation tool.</p>
            <ButtonLink to="/reserve" icon="arrow" size="lg">Reserve a table</ButtonLink>
          </div>
          <div className="contact__form">
            <h2 className="h3">Send a message</h2>
            <DemoNotice>Demonstration form: nothing is sent.</DemoNotice>
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="section section--soft" aria-labelledby="location-title">
        <div className="container split">
          <div>
            <SectionHeading id="location-title" eyebrow="Location" title="Demonstration location" lead={contact.mapLabel} />
            <div className="map" role="img" aria-label="Stylised placeholder map showing the restaurant location. Replace with an embedded map.">
              <svg viewBox="0 0 400 260" aria-hidden="true" focusable="false">
                <rect width="400" height="260" fill="var(--c-roast)" />
                <g stroke="var(--c-saffron-deep)" strokeWidth="1" opacity=".55" fill="none">
                  <path d="M0 70h400M0 150h400M0 210h400M80 0v260M190 0v260M300 0v260" />
                  <path d="M0 260L400 0" />
                </g>
                <circle cx="190" cy="150" r="9" fill="var(--c-saffron)" />
                <circle cx="190" cy="150" r="20" fill="none" stroke="var(--c-saffron)" opacity=".5" />
                <text x="204" y="146" fill="var(--c-cream)" fontSize="13" fontFamily="sans-serif">Saffron Table</text>
                <text x="204" y="162" fill="var(--c-muted-on-dark)" fontSize="10" fontFamily="sans-serif">14 Copper Lane (fictional)</text>
              </svg>
            </div>
            <p className="muted">This is a placeholder illustration, not a real map. Embed your map provider of choice in <code>src/pages/Contact.tsx</code> and set <code>site.contact.mapHref</code>.</p>
          </div>
          <div>
            <SectionHeading eyebrow="Directions" title="Getting here" />
            <dl className="directions">
              {contact.directions.map((d) => <div key={d.mode}><dt>{d.mode}</dt><dd>{d.text}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>
      <section className="section section--dark" aria-labelledby="policies-title">
        <div className="container">
          <SectionHeading id="policies-title" eyebrow="Good to know" title="Restaurant policies" />
          <ul className="policy-grid">
            {site.policies.map((p) => <li key={p.title}><h3>{p.title}</h3><p>{p.text}</p></li>)}
          </ul>
          <p className="muted">Questions about private events? Visit <Link to="/private-dining">private dining</Link>.</p>
        </div>
      </section>
    </>
  );
}
