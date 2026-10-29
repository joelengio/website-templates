import { Link, useParams } from 'react-router-dom';
import { Accordion } from '../components/Accordion';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { Breadcrumb, Button, CtaBand } from '../components/ui';
import { getService, services, weddings } from '../config';
import { WeddingCard } from '../components/Cards';
import NotFound from './NotFound';

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = getService(slug);
  if (!s) return <NotFound />;
  const examples = weddings.filter((w) => w.services.includes(s.title)).slice(0, 3);
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <>
      <Seo title={s.title} description={s.summary} image={s.image.src} />
      <header className="page-hero page-hero--split">
        <div className="container page-hero--split__grid">
          <div className="page-hero__inner">
            <Breadcrumb items={[{ label: 'Services', to: '/services' }, { label: s.title }]} />
            <p className="eyebrow">Service</p>
            <h1 className="h-display">{s.title}</h1>
            <p className="lead">{s.tagline}</p>
            <p className="price-tag"><span>{s.priceLabel}</span><small>Illustrative starting price</small></p>
            <div className="page-hero__actions">
              <Button to={`/plan?service=${s.questionnaireId}`}>Enquire about this service</Button>
              <Button to="/packages" variant="outline">View packages</Button>
            </div>
          </div>
          <div className="page-hero__split-media arch"><Photo image={s.image} priority sizes="(min-width: 900px) 40vw, 90vw" /></div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container container--narrow service-intro">
          <Reveal>
            {s.description.map((p) => (<p key={p} className="lead-p">{p}</p>))}
            <p className="ideal"><strong>Ideal for:</strong> {s.idealFor}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="stages-title">
        <div className="container">
          <Reveal className="section-head"><div><p className="eyebrow">How it unfolds</p><h2 className="h-display" id="stages-title">Planning stages</h2></div></Reveal>
          <ol className="stages">
            {s.stages.map((st, i) => (
              <Reveal as="li" key={st.title} delay={i * 60}>
                <span className="stages__n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="inc-title">
        <div className="container split">
          <Reveal>
            <p className="eyebrow">What is included</p>
            <h2 className="h-display" id="inc-title">Inclusions</h2>
            <ul className="checklist">
              {s.inclusions.map((x) => (<li key={x}><Icon name="check" size={18} />{x}</li>))}
            </ul>
          </Reveal>
          <Reveal as="aside" className="price-card">
            <p className="eyebrow">Investment</p>
            <p className="price-card__price">{s.priceLabel}</p>
            <p>Every celebration is quoted individually. This figure is an illustrative starting point for a demonstration studio.</p>
            <Button to={`/plan?service=${s.questionnaireId}`}>Request a proposal</Button>
          </Reveal>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="faq-title">
        <div className="container container--narrow">
          <Reveal className="section-head section-head--center"><div><p className="eyebrow">Questions</p><h2 className="h-display" id="faq-title">Frequently asked</h2></div></Reveal>
          <Accordion items={s.faqs} />
        </div>
      </section>

      {examples.length > 0 && (
        <section className="section" aria-labelledby="ex-title">
          <div className="container">
            <Reveal className="section-head"><div><p className="eyebrow">In practice</p><h2 className="h-display" id="ex-title">Weddings using this service</h2></div></Reveal>
            <ul className="grid grid--weddings">{examples.map((w) => (<li key={w.slug}><WeddingCard w={w} /></li>))}</ul>
          </div>
        </section>
      )}

      <section className="section section--cream section--tight" aria-labelledby="other-title">
        <div className="container">
          <Reveal className="section-head"><div><p className="eyebrow">Also from the studio</p><h2 className="h-display" id="other-title">Other services</h2></div><Link to="/services" className="link-arrow">All services <Icon name="arrow" size={18} /></Link></Reveal>
          <ul className="link-list">
            {others.map((o) => (<li key={o.slug}><Link to={`/services/${o.slug}`}><span>{o.title}</span><Icon name="arrow" size={18} /></Link></li>))}
          </ul>
        </div>
      </section>

      <CtaBand eyebrow="Consultation" title={`Talk to us about ${s.title.toLowerCase()}`} body="A relaxed 45-minute conversation, with no obligation." primary={{ label: 'Start your enquiry', to: `/plan?service=${s.questionnaireId}` }} secondary={{ label: 'Contact the studio', to: '/contact' }} />
    </>
  );
}
