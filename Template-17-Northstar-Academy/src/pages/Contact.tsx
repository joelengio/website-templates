import { contactFaqs, site } from '../config';
import { useSeo } from '../hooks/useSeo';
import { ContactForm } from '../components/ContactForm';
import { Icon } from '../components/Icon';
import { FaqList, PageHero, Section } from '../components/ui';

export default function Contact() {
  useSeo({ title: 'Contact', description: 'Contact the Northstar Academy demonstration team. The form validates input but sends nothing in demo mode.', path: '/contact' });
  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to the academy" intro="Questions about courses, teams or this template? This demonstration form validates your input but sends nothing." />
      <Section>
        <div className="split">
          <div className="contact-info">
            <h2 className="h3">Business information</h2>
            <ul>
              <li><Icon name="mail" size={20} /><span><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></span></li>
              <li><Icon name="phone" size={20} /><span>{site.contact.phone}</span></li>
              <li><Icon name="pin" size={20} /><address>{site.contact.address.map((l) => <span key={l}>{l}<br /></span>)}</address></li>
              <li><Icon name="clock" size={20} /><span>{site.contact.hours}</span></li>
            </ul>
            <p className="fine">{site.disclosure}</p>
          </div>
          <div>
            <h2 className="h3">Send an inquiry</h2>
            <ContactForm topics={['Courses', 'Teams / corporate training', 'Plans & pricing', 'Partnerships', 'Something else']} heading="Contact form" />
          </div>
        </div>
      </Section>
      <Section tone="soft">
        <h2 className="section-title">Frequently asked questions</h2>
        <FaqList items={contactFaqs} />
      </Section>
    </>
  );
}
