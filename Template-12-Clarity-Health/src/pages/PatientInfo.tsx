import { useState } from 'react';
import { faqs, patientInfo as p } from '../config/patient-info';
import { site } from '../config/site';
import { Icon } from '../components/Icon';
import { Seo } from '../components/Seo';
import { LinkButton, Notice, PageHero, SectionHeader } from '../components/ui';
import { formatTime } from '../lib/format';

export default function PatientInfo() {
  const groups = [...new Set(faqs.map((f) => f.group))];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <Seo title="Patient information" description="First-visit guide, demonstration opening hours, appointment preparation, FAQs, payment placeholders, policies and emergency information for CLARITY HEALTH (fictional)." />
      <PageHero eyebrow={p.hero.eyebrow} title={p.hero.title} lead={p.hero.lead}>
        <Notice tone="emergency" title="Emergency information" role="alert">{site.notices.emergency}</Notice>
      </PageHero>

      <section className="section-tight" id="first-visit" aria-labelledby="fv-title">
        <div className="container">
          <SectionHeader title={p.firstVisit.title} id="fv-title" />
          <ol className="steps steps-light">
            {p.firstVisit.steps.map((s, i) => (
              <li key={s.title}><span className="step-num" aria-hidden="true">{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section tint" id="preparation" aria-labelledby="prep-title">
        <div className="container two-col">
          <div>
            <h2 id="prep-title">{p.preparation.title}</h2>
            <ul className="check-list">{p.preparation.items.map((i) => <li key={i}><Icon name="check" size={18} /> {i}</li>)}</ul>
          </div>
          <div className="panel" id="hours">
            <h2 className="h3">{p.hours.title}</h2>
            <table className="hours-table">
              <caption className="sr-only">Opening hours of the {site.locations[0].name}</caption>
              <thead><tr><th scope="col">Day</th><th scope="col">Hours</th></tr></thead>
              <tbody>
                {[...site.hours].sort((a, b) => ((a.day + 6) % 7) - ((b.day + 6) % 7)).map((h) => (
                  <tr key={h.day}><th scope="row">{h.label}</th><td>{h.open && h.close ? `${formatTime(h.open)} – ${formatTime(h.close)}` : 'Closed'}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="muted small">{site.hoursNote} {p.hours.note}</p>
          </div>
        </div>
      </section>

      <section className="section-tight" id="payment" aria-labelledby="pay-title">
        <div className="container">
          <SectionHeader title={p.payment.title} id="pay-title" lead={p.payment.intro} />
          <ul className="grid grid-4 info-grid">
            {p.payment.items.map((i) => <li key={i.title} className="panel"><h3>{i.title}</h3><p>{i.text}</p></li>)}
          </ul>
        </div>
      </section>

      <section className="section tint" id="policies" aria-labelledby="pol-title">
        <div className="container">
          <SectionHeader title={p.policies.title} id="pol-title" />
          <dl className="policy-list">
            {p.policies.items.map((i) => <div key={i.title}><dt>{i.title}</dt><dd>{i.text}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section-tight" id="faqs" aria-labelledby="faq-title">
        <div className="container narrow-wide">
          <SectionHeader title="Frequently asked questions" id="faq-title" />
          {groups.map((g) => (
            <div key={g} className="faq-group">
              <h3>{g}</h3>
              {faqs.filter((f) => f.group === g).map((f) => {
                const isOpen = open === f.id;
                return (
                  <div key={f.id} className={`faq ${isOpen ? 'is-open' : ''}`}>
                    <h4>
                      <button type="button" aria-expanded={isOpen} aria-controls={`faq-${f.id}`} id={`faq-btn-${f.id}`} onClick={() => setOpen(isOpen ? null : f.id)}>
                        <span>{f.question}</span><Icon name="chevron-down" size={20} />
                      </button>
                    </h4>
                    <div id={`faq-${f.id}`} role="region" aria-labelledby={`faq-btn-${f.id}`} hidden={!isOpen}><p>{f.answer}</p></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="section tint" id="emergency" aria-labelledby="em-title">
        <div className="container narrow-wide">
          <Notice tone="emergency" title={p.emergency.title}><p>{p.emergency.text}</p></Notice>
          <h2 id="em-title" className="h3 spaced-top">{p.disclaimer.title}</h2>
          <p>{p.disclaimer.text}</p>
          <div className="btn-row">
            <LinkButton to="/book" icon="calendar">Try the booking demo</LinkButton>
            <LinkButton to="/contact" variant="secondary">Contact (demo)</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
