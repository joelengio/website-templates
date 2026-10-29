import { Link } from 'react-router-dom';
import { ButtonLink } from './Button';
import { Icon } from './Icon';
import { Img } from './Img';
import { Section, SectionHeading, DemoNotice } from './Section';
import { ArticleCard } from './ArticleCard';
import { awards, testimonials } from '../config/content';
import { homeContent as c } from '../config/home';
import { articles } from '../config/journal';
import { menuItems } from '../config/menu';
import { privateSpaces } from '../config/privateDining';
import { site } from '../config/site';
import type { HomeSectionId } from '../config/types';
import { formatMoney } from '../lib/format';

function Hero() {
  const h = c.hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Img name={h.image} className="hero__img" sizes="100vw" eager />
      <div className="hero__shade" aria-hidden="true" />
      <div className="container hero__content">
        <p className="eyebrow">{h.eyebrow}</p>
        <h1 id="hero-title" className="hero__title">{h.title}</h1>
        <p className="hero__lead">{h.lead}</p>
        <div className="hero__actions">
          <ButtonLink to={h.primaryCta.to} size="lg" icon="arrow">{h.primaryCta.label}</ButtonLink>
          <ButtonLink to={h.secondaryCta.to} variant="light" size="lg">{h.secondaryCta.label}</ButtonLink>
        </div>
        <ul className="hero__facts" aria-label="At a glance">
          {h.facts.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
    </section>
  );
}

function Concept() {
  const s = c.concept;
  return (
    <Section tone="soft" labelledBy="concept-title">
      <div className="split">
        <div>
          <SectionHeading id="concept-title" eyebrow={s.eyebrow} title={s.title} />
          {s.paragraphs.map((p) => <p key={p} className="prose">{p}</p>)}
          <dl className="stats">
            {s.stats.map((st) => (
              <div key={st.label}><dt>{st.label}</dt><dd>{st.value}</dd></div>
            ))}
          </dl>
          <ButtonLink to="/our-story" variant="text" icon="arrow">Read our story</ButtonLink>
        </div>
        <div className="split__media split__media--pair">
          <Img name={s.images[0]} sizes="(min-width: 900px) 30vw, 60vw" className="frame frame--tall" />
          <Img name={s.images[1]} sizes="(min-width: 900px) 24vw, 50vw" className="frame frame--offset" />
        </div>
      </div>
    </Section>
  );
}

function Signature() {
  const s = c.signature;
  const items = s.itemIds.map((id) => menuItems.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m);
  return (
    <Section labelledBy="signature-title">
      <SectionHeading id="signature-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <ul className="signature-grid">
        {items.map((m, i) => (
          <li key={m.id} className={`signature signature--${i % 2 ? 'b' : 'a'}`}>
            {m.image && <Img name={m.image} sizes="(min-width: 900px) 25vw, 50vw" />}
            <div className="signature__body">
              <h3>{m.name}</h3>
              <p>{m.description}</p>
              <p className="signature__price">{formatMoney(m.price)}{m.priceNote ? ` ${m.priceNote}` : ''}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="section__cta"><ButtonLink to="/menus" variant="ghost" icon="arrow">See the full menus</ButtonLink></div>
    </Section>
  );
}

function Philosophy() {
  const s = c.philosophy;
  return (
    <Section tone="light" labelledBy="philosophy-title">
      <div className="split split--reverse">
        <div className="split__media">
          <Img name={s.image} sizes="(min-width: 900px) 40vw, 100vw" className="frame frame--portrait" />
        </div>
        <div>
          <SectionHeading id="philosophy-title" eyebrow={s.eyebrow} title={s.title} />
          <blockquote className="pullquote">
            <p>“{s.quote}”</p>
            <footer>{s.cite}</footer>
          </blockquote>
          <ul className="points">
            {s.points.map((p) => (
              <li key={p.title}><h3>{p.title}</h3><p>{p.text}</p></li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Menus() {
  const s = c.menus;
  const sets = menuItems.filter((m) => m.category === 'tasting');
  return (
    <Section tone="soft" labelledBy="menus-title">
      <SectionHeading id="menus-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <ul className="menu-cards">
        {sets.map((m) => (
          <li key={m.id} className="menu-card">
            {m.image && <Img name={m.image} sizes="(min-width: 900px) 30vw, 100vw" />}
            <div className="menu-card__body">
              <h3>{m.name}</h3>
              <p className="menu-card__price">{formatMoney(m.price)} <small>{m.priceNote}</small></p>
              <p>{m.description}</p>
              {m.courses && <p className="menu-card__courses">{m.courses.length} courses{m.pairing ? ` · ${m.pairing.label.toLowerCase()} +${formatMoney(m.pairing.price)}` : ''}</p>}
              {m.availabilityNote && <p className="tag">{m.availabilityNote}</p>}
            </div>
          </li>
        ))}
      </ul>
      <div className="section__cta"><ButtonLink to="/menus" icon="arrow">Explore all menus</ButtonLink></div>
    </Section>
  );
}

function Atmosphere() {
  const s = c.atmosphere;
  return (
    <Section labelledBy="atmosphere-title">
      <SectionHeading id="atmosphere-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <ul className="mosaic">
        {s.images.map((k, i) => (
          <li key={k} className={`mosaic__item mosaic__item--${i + 1}`}><Img name={k} sizes="(min-width: 900px) 30vw, 50vw" /></li>
        ))}
      </ul>
      <div className="section__cta"><ButtonLink to="/gallery" variant="ghost" icon="arrow">Open the gallery</ButtonLink></div>
    </Section>
  );
}

function PrivateDining() {
  const s = c.privateDining;
  return (
    <Section tone="soft" labelledBy="private-title">
      <div className="split">
        <div>
          <SectionHeading id="private-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
          <ul className="space-list">
            {privateSpaces.map((p) => (
              <li key={p.id}><strong>{p.name}</strong><span>Seats {p.seated} · Standing {p.standing}</span></li>
            ))}
          </ul>
          <ButtonLink to="/private-dining" icon="arrow">Plan an event</ButtonLink>
        </div>
        <div className="split__media split__media--pair">
          <Img name={s.images[0]} sizes="(min-width: 900px) 30vw, 60vw" className="frame frame--tall" />
          <Img name={s.images[1]} sizes="(min-width: 900px) 24vw, 50vw" className="frame frame--offset" />
        </div>
      </div>
    </Section>
  );
}

function Awards() {
  const s = c.awards;
  return (
    <Section labelledBy="awards-title">
      <SectionHeading id="awards-title" eyebrow={s.eyebrow} title={s.title} align="center" />
      <DemoNotice tone="warn">{s.disclaimer}</DemoNotice>
      <ul className="awards">
        {awards.map((a) => (
          <li key={a.title}>
            <Icon name="star" size={22} />
            <h3>{a.title}</h3>
            <p>{a.issuer} · {a.year}</p>
            <span className="tag">Fictional</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Testimonials() {
  const s = c.testimonials;
  return (
    <Section tone="light" labelledBy="testimonials-title">
      <SectionHeading id="testimonials-title" eyebrow={s.eyebrow} title={s.title} align="center" />
      <ul className="quotes">
        {testimonials.map((t) => (
          <li key={t.author}>
            <blockquote>
              <p>“{t.quote}”</p>
              <footer><strong>{t.author}</strong><span>{t.context}</span></footer>
            </blockquote>
          </li>
        ))}
      </ul>
      <p className="quotes__note">{s.disclaimer}</p>
    </Section>
  );
}

function JournalPreview() {
  const s = c.journal;
  const list = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, s.count);
  return (
    <Section labelledBy="journal-title">
      <SectionHeading id="journal-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <div className="article-grid">{list.map((a) => <ArticleCard key={a.slug} article={a} />)}</div>
      <div className="section__cta"><ButtonLink to="/journal" variant="ghost" icon="arrow">Read the journal</ButtonLink></div>
    </Section>
  );
}

function ReserveCta() {
  const s = c.reserveCta;
  return (
    <section className="cta-band" aria-labelledby="reserve-cta-title">
      <Img name={s.image} className="cta-band__img" sizes="100vw" />
      <div className="cta-band__shade" aria-hidden="true" />
      <div className="container cta-band__inner">
        <p className="eyebrow">{s.eyebrow}</p>
        <h2 id="reserve-cta-title" className="cta-band__title">{s.title}</h2>
        <p>{s.text}</p>
        <div className="hero__actions">
          <ButtonLink to={s.cta.to} size="lg" icon="arrow">{s.cta.label}</ButtonLink>
          <ButtonLink to={s.secondary.to} variant="light" size="lg">{s.secondary.label}</ButtonLink>
        </div>
        <p className="cta-band__contact"><Link to="/contact">{site.contact.phone}</Link> · {site.contact.address.line1}, {site.contact.address.city} (fictional)</p>
      </div>
    </section>
  );
}

export const homeSectionComponents: Record<HomeSectionId, () => JSX.Element> = {
  hero: Hero,
  concept: Concept,
  signature: Signature,
  philosophy: Philosophy,
  menus: Menus,
  atmosphere: Atmosphere,
  privateDining: PrivateDining,
  awards: Awards,
  testimonials: Testimonials,
  journal: JournalPreview,
  reserveCta: ReserveCta,
};

