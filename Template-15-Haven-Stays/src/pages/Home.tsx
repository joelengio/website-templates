import { Link } from 'react-router-dom';
import Img from '../components/Img';
import BookingWidget from '../components/BookingWidget';
import { LinkButton } from '../components/Button';
import { ArticleCard, ExperienceCard, OfferCard, ReviewCard } from '../components/Cards';
import Icon from '../components/Icon';
import RoomCard from '../components/RoomCard';
import Section, { SectionHeader } from '../components/Section';
import { amenities } from '../config/amenities';
import { articles, destination, attractions, intro, wellness } from '../config/content';
import { venues } from '../config/dining';
import { experiences } from '../config/experiences';
import { hero, homeSections, pages } from '../config/layout';
import { offers } from '../config/offers';
import { reviews } from '../config/reviews';
import { rooms } from '../config/rooms';
import { seoRoutes } from '../config/seo';
import { site } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { offerSample } from '../lib/offers';

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Img src={hero.image.src} alt="" priority ratio={[16, 9]} className="hero__bg" />
      <div className="hero__shade" />
      <div className="container hero__inner">
        <p className="kicker kicker--light">{hero.kicker}</p>
        <h1 id="hero-title" className="display display--xl">{hero.title}</h1>
        <p className="lead lead--light">{hero.text}</p>
        <div className="hero__cta">
          <LinkButton to="/rooms" variant="light" arrow>Explore rooms</LinkButton>
          <LinkButton to="/dining" variant="ghost">Dining & wellness</LinkButton>
        </div>
        {hero.showBookingWidget && pages.booking && (
          <div className="hero__widget">
            <BookingWidget variant="hero" idPrefix="hero" />
            <p className="hero__note">{site.demoNotice}</p>
          </div>
        )}
      </div>
    </section>
  );
}

const sections: Record<string, () => JSX.Element | null> = {
  intro: () => (
    <Section tone="cream" labelledBy="intro-h">
      <div className="intro">
        <div className="intro__text">
          <header className="section-head reveal">
            <div>
              <p className="kicker">{intro.kicker}</p>
              <h2 id="intro-h" className="display">{intro.title}</h2>
            </div>
          </header>
          {intro.paragraphs.map((p) => <p key={p} className="reveal">{p}</p>)}
          <dl className="stats reveal">{intro.stats.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
          <LinkButton to="/about" variant="text" arrow>Our story</LinkButton>
        </div>
        <div className="intro__images reveal">
          <Img src={intro.images[0].src} alt={intro.images[0].alt} ratio={[4, 5]} className="intro__img intro__img--a" />
          <Img src={intro.images[1].src} alt={intro.images[1].alt} ratio={[1, 1]} className="intro__img intro__img--b" />
        </div>
      </div>
    </Section>
  ),
  rooms: () => (
    <Section tone="limestone" labelledBy="rooms-h">
      <SectionHeader kicker="Accommodation" title="Rooms, suites & villas" text="Ten room types, from garden kings to a private pool villa." action={{ label: 'View all accommodation', to: '/rooms' }} />
      <div className="grid grid--3">{rooms.filter((r) => r.featured).map((r) => <RoomCard key={r.id} room={r} />)}</div>
    </Section>
  ),
  experiences: () => (
    <Section tone="cream">
      <SectionHeader kicker="Signature experiences" title="Days shaped by the place" action={{ label: 'All experiences', to: '/experiences' }} />
      <div className="grid grid--3">{experiences.filter((e) => e.featured).map((e) => <ExperienceCard key={e.slug} e={e} />)}</div>
    </Section>
  ),
  amenities: () => (
    <Section tone="olive">
      <SectionHeader kicker="Amenities" title="Everything within a short walk" text="Each facility is configured in src/config/amenities.ts." />
      <ul className="amenity-grid">
        {amenities.filter((a) => a.property).map((a) => (
          <li key={a.id} className="reveal">
            <Icon name={a.icon} size={26} />
            <h3>{a.label}</h3>
            <p>{a.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  ),
  dining: () => (
    <Section tone="cream">
      <SectionHeader kicker="Dining" title="Fire, garden and sea" text="Two restaurants, a bronze bar and private dining — all cooked from the kitchen garden and the morning catch." action={{ label: 'Menus & hours', to: '/dining' }} />
      <div className="grid grid--2">
        {venues.slice(0, 2).map((v) => (
          <article key={v.slug} className="feature reveal">
            <Link to={`/dining/${v.slug}`} className="feature__media" tabIndex={-1} aria-hidden="true"><Img src={v.images[0].src} alt="" ratio={[3, 2]} /></Link>
            <div className="feature__body">
              <p className="kicker">{v.kind}</p>
              <h3><Link to={`/dining/${v.slug}`}>{v.name}</Link></h3>
              <p>{v.tagline}</p>
              <p className="muted">{v.hours.map((h) => `${h.label} ${h.time}`).join(' · ')}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  ),
  wellness: () => (
    <section className="split">
      <Img src={wellness.image.src} alt={wellness.image.alt} ratio={[4, 3]} className="split__img" />
      <div className="split__body">
        <div>
          <p className="kicker kicker--light">{wellness.kicker}</p>
          <h2 className="display">{wellness.title}</h2>
          <p>{wellness.text}</p>
          <ul className="checks">{wellness.points.map((p) => <li key={p}><Icon name="check" size={18} /> {p}</li>)}</ul>
          <LinkButton to={wellness.cta.to} variant="light" arrow>{wellness.cta.label}</LinkButton>
        </div>
      </div>
    </section>
  ),
  destination: () => (
    <Section tone="limestone">
      <SectionHeader kicker={destination.kicker} title={destination.title} text={destination.text} action={{ label: 'Explore the coast', to: '/explore' }} />
      <div className="grid grid--3">
        {attractions.slice(0, 3).map((a) => (
          <article key={a.slug} className="tile reveal">
            <Img src={a.image.src} alt={a.image.alt} ratio={[4, 5]} />
            <div className="tile__label"><p className="kicker kicker--light">{a.type} · {a.distance}</p><h3>{a.name}</h3></div>
          </article>
        ))}
      </div>
    </Section>
  ),
  offers: () => (
    <Section tone="cream">
      <SectionHeader kicker="Offers" title="Seasonal offers & packages" action={{ label: 'All offers', to: '/offers' }} />
      <div className="grid grid--3">{offers.slice(0, 3).map((o) => <OfferCard key={o.slug} o={o} sample={offerSample(o)} />)}</div>
    </Section>
  ),
  reviews: () => (
    <Section tone="limestone">
      <SectionHeader kicker="Guest words" title="Kind words from (fictional) guests" text="These testimonials are invented for the template and are clearly marked as fictional." />
      <div className="grid grid--2">{reviews.map((r) => <ReviewCard key={r.name} r={r} />)}</div>
    </Section>
  ),
  journal: () => (
    <Section tone="cream">
      <SectionHeader kicker="Journal" title="Stories from Haven" action={{ label: 'Read the journal', to: '/journal' }} />
      <div className="grid grid--3">{articles.slice(0, 3).map((a) => <ArticleCard key={a.slug} a={a} />)}</div>
    </Section>
  ),
  cta: () => (
    <section className="cta-band">
      <div className="container cta-band__inner reveal">
        <div>
          <p className="kicker kicker--light">Plan your stay</p>
          <h2 className="display">Questions before you book?</h2>
          <p>Our reservations team can help with room choice, celebrations, transfers and special requests.</p>
        </div>
        <div className="cta-band__actions">
          <LinkButton to="/contact" variant="light" arrow>Contact us</LinkButton>
          <LinkButton to="/booking" variant="ghost">Reserve a stay</LinkButton>
        </div>
      </div>
    </section>
  ),
};

export default function Home() {
  const ref = useReveal<HTMLDivElement>();
  useSeo({ ...seoRoutes['/'], path: '/' });
  return (
    <div ref={ref}>
      <Hero />
      {homeSections.filter((s) => s.enabled).map((s) => {
        const R = sections[s.id];
        return R ? <div key={s.id}>{R()}</div> : null;
      })}
    </div>
  );
}
