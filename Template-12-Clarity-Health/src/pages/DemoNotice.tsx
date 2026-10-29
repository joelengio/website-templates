import { Link } from 'react-router-dom';
import { booking } from '../config/booking';
import { site } from '../config/site';
import { Seo } from '../components/Seo';
import { LinkButton, Notice, PageHero } from '../components/ui';

export default function DemoNotice() {
  return (
    <>
      <Seo title="Demo & privacy notice" description={`How the ${site.brand.name} demonstration works: what is stored in your browser, what is never collected, and the limits of this template.`} />
      <PageHero eyebrow="Demonstration & privacy" title="What this website is — and is not" lead={`${site.brand.name} is a website template showcase. Please read this short notice.`} />
      <section className="section-tight">
        <div className="container narrow prose">
          <Notice tone="emergency" title="Emergencies" role="alert">{site.notices.emergency}</Notice>
          <h2>This is a demonstration</h2>
          <p>{site.brand.name} is a fictional clinic. Its doctors, services, prices, testimonials, addresses, phone numbers and e-mail addresses are invented. It does not provide medical care, advice or appointments, and it cannot be contacted.</p>
          <h2>What the booking demo stores</h2>
          <p>{site.notices.privacy}</p>
          <ul>
            <li>Stored in your browser’s localStorage under the key <code>{booking.storageKey}</code>: the specialty, doctor, service, date and time you chose, plus the name, e-mail address and optional phone number you typed.</li>
            <li>Never collected: medical history, symptoms, diagnoses, insurance credentials, government identity numbers, payment details.</li>
            <li>Never transmitted: no analytics, no tracking, no server requests carrying your details.</li>
            <li>You can delete everything at any time from <Link to="/appointments">My demo appointments</Link>, or by clearing your browser’s site data.</li>
          </ul>
          <h2>Compliance statement</h2>
          <p>This template makes no claim of HIPAA, GDPR or any other regulatory compliance. A real clinic must obtain independent legal and security review before collecting any patient information.</p>
          <h2>Medical information</h2>
          <p>{site.notices.medical}</p>
          <div className="btn-row">
            <LinkButton to="/book" icon="calendar">Try the booking demo</LinkButton>
            <LinkButton to="/patient-information" variant="secondary">Patient information</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
