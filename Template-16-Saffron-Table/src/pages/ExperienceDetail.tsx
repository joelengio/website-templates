import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, ButtonLink } from '../components/Button';
import { ExperienceInquiryForm } from '../components/Forms';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { Modal } from '../components/Modal';
import { DemoNotice, PageHero } from '../components/Section';
import { experiences } from '../config/experiences';
import { useSeo } from '../hooks/useSeo';
import { formatMoney } from '../lib/format';
import NotFound from './NotFound';

export default function ExperienceDetail() {
  const { slug } = useParams();
  const exp = experiences.find((e) => e.slug === slug);
  const [open, setOpen] = useState(false);
  useSeo({
    title: exp?.title ?? 'Experience not found',
    description: exp ? `${exp.tagline}. ${exp.summary}` : 'This experience could not be found.',
    path: `/experiences/${slug ?? ''}`,
    image: exp ? `/images/${exp.image}.jpg` : undefined,
    noindex: !exp,
  });
  if (!exp) return <NotFound />;
  const others = experiences.filter((e) => e.slug !== exp.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={`Experience · ${exp.category}`} title={exp.title} lead={exp.tagline} image={exp.image}>
        <div className="hero__actions">
          <Button size="lg" icon="arrow" onClick={() => setOpen(true)}>Enquire about this experience</Button>
          <ButtonLink to="/reserve" variant="light" size="lg">Reserve a table</ButtonLink>
        </div>
      </PageHero>
      <section className="section section--dark">
        <div className="container detail">
          <div className="detail__main">
            {exp.description.map((p) => <p key={p} className="prose">{p}</p>)}
            <h2 className="h3">What’s included</h2>
            <ul className="ticks">{exp.includes.map((i) => <li key={i}><Icon name="check" size={18} /> {i}</li>)}</ul>
            <h2 className="h3">Good to know</h2>
            <ul className="plain">{exp.goodToKnow.map((i) => <li key={i}>{i}</li>)}</ul>
            <ul className="detail__gallery">
              {exp.gallery.map((g) => <li key={g}><Img name={g} sizes="(min-width: 900px) 20vw, 33vw" /></li>)}
            </ul>
          </div>
          <aside className="detail__aside" aria-label="Experience summary">
            <p className="detail__price">From {formatMoney(exp.priceFrom)} <small>{exp.priceNote}</small></p>
            <dl className="summary summary--compact">
              <div><dt>Duration</dt><dd>{exp.duration}</dd></div>
              <div><dt>Guests</dt><dd>{exp.guests}</dd></div>
            </dl>
            <Button icon="arrow" onClick={() => setOpen(true)}>Enquire now</Button>
            <p className="aside__demo">Demo prices and details. Enquiries are validated locally and never sent.</p>
          </aside>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <h2 className="h3">More experiences</h2>
          <ul className="more-list">
            {others.map((o) => <li key={o.slug}><Link to={`/experiences/${o.slug}`}>{o.title}</Link><span>{o.tagline}</span></li>)}
          </ul>
        </div>
      </section>
      <Modal open={open} onClose={() => setOpen(false)} title={`Enquire: ${exp.title}`}>
        <DemoNotice>Demonstration form. Nothing is sent to a restaurant.</DemoNotice>
        <ExperienceInquiryForm experience={exp} onDone={() => setOpen(false)} />
      </Modal>
    </>
  );
}
