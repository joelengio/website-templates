import { Link } from 'react-router-dom';
import { faqGroups } from '../config/faq';
import { site } from '../config/site';
import { Seo } from '../components/Seo';
import { Breadcrumbs, PageHeader } from '../components/ui';
import { Icon } from '../components/Icon';

export default function Faq() {
  return (
    <>
      <Seo title="FAQ & support" description="Shipping, returns, exchanges, payment information and how the MERIDIAN STORE demonstration orders work." path="/faq" />
      <PageHeader eyebrow="Support" title="Help & frequently asked questions" text="Answers on shipping, returns, exchanges, payment and how the demonstration works.">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
      </PageHeader>
      <div className="container faq-layout section-tight">
        <nav aria-label="FAQ sections" className="faq-nav">
          <ul>{faqGroups.map((g) => <li key={g.id}><a href={`#${g.id}`}>{g.title}</a></li>)}</ul>
        </nav>
        <div className="faq-groups">
          {faqGroups.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="faq-group">
              <h2 id={`${g.id}-h`} className="h3">{g.title}</h2>
              {g.items.map((it) => <details key={it.q} className="faq-item"><summary>{it.q}</summary><p>{it.a}</p></details>)}
            </section>
          ))}
          <section className="contact-card" aria-labelledby="help-contact">
            <h2 id="help-contact" className="h3">Still need help?</h2>
            <ul className="contact-list">
              <li><Icon name="mail" /> <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
              <li><Icon name="phone" /> {site.contact.phone}</li>
              <li><Icon name="clock" /> {site.contact.hours}</li>
            </ul>
            <p>{site.contact.responseTime} <Link to="/contact">Use the contact form</Link> (demonstration).</p>
          </section>
        </div>
      </div>
    </>
  );
}
