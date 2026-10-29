import { useSearchParams } from 'react-router-dom';
import { content } from '../config';
import { properties } from '../config/properties';
import { site } from '../config/site';
import { useSeo } from '../hooks/useSeo';
import { Icon } from '../components/Icon';
import { InquiryForm } from '../components/InquiryForm';
import { PageHero } from '../components/Section';

export default function Contact() {
  const [params] = useSearchParams();
  const propertyParam = params.get('property') ?? '';
  const propertyId = properties.some((p) => p.id === propertyParam) ? propertyParam : '';
  const topicParam = params.get('topic');
  const topic = content.contact.topics.some((t) => t.value === topicParam) ? (topicParam ?? undefined) : undefined;
  useSeo({ title: 'Contact', description: content.contact.lead, path: '/contact' });
  const c = site.contact;
  return (
    <>
      <PageHero eyebrow="Contact" title={content.contact.title} lead={content.contact.lead} />
      <section className="section section--flush">
        <div className="container contact-grid">
          <div className="contact-card">
            <h2 className="h3">Visit or call</h2>
            <ul className="contact-list">
              <li>
                <Icon name="pin" />
                <span>{c.addressLines.join(', ')}</span>
              </li>
              <li>
                <Icon name="phone" />
                <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
              </li>
              <li>
                <Icon name="mail" />
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </li>
            </ul>
            <p className="muted">{c.hours}</p>
            <p className="muted">These contact details are fictional placeholders for the demo.</p>
          </div>
          <div>
            <InquiryForm propertyId={propertyId} topic={topic} />
          </div>
        </div>
      </section>
    </>
  );
}
