import { Link } from 'react-router-dom';
import { aboutContent as A } from '../config/about';
import { site } from '../config/site';
import { Seo } from '../components/Seo';
import { Breadcrumbs, SafeImg, SectionHeading } from '../components/ui';

export default function About() {
  return (
    <>
      <Seo title="About" description="The story, philosophy and values behind MERIDIAN STORE — a fictional demonstration brand." path="/about" image={A.hero.image} />
      <section className="about-hero">
        <SafeImg src={A.hero.image} alt={A.hero.alt} className="about-hero-img" width={2000} height={1000} eager />
        <div className="container about-hero-copy">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <p className="eyebrow">{A.hero.eyebrow}</p>
          <h1>{A.hero.title}</h1>
          <p className="lede">{A.hero.text}</p>
        </div>
      </section>
      <section className="section container split">
        <div className="split-copy">
          <h2 className="section-title">{A.story.title}</h2>
          {A.story.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div className="split-media"><SafeImg src={A.story.image} alt={A.story.alt} width={1200} height={1500} /></div>
      </section>
      <section className="section tone-cream">
        <div className="container narrow">
          <h2 className="section-title">{A.philosophy.title}</h2>
          <p className="lede">{A.philosophy.text}</p>
        </div>
      </section>
      <section className="section container" aria-labelledby="values-title">
        <SectionHeading id="values-title" eyebrow="What we believe" title="Our values" />
        <ul className="values-grid">{A.values.map((v) => <li key={v.title}><h3 className="h4">{v.title}</h3><p>{v.text}</p></li>)}</ul>
      </section>
      <section className="section container split is-reverse">
        <div className="split-media"><SafeImg src={A.sourcing.image} alt={A.sourcing.alt} width={1200} height={900} /></div>
        <div className="split-copy">
          <h2 className="section-title">{A.sourcing.title}</h2>
          {A.sourcing.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>
      <section className="newsletter-band" style={{ backgroundImage: `url(${site.newsletter.image})` }}>
        <div className="container center">
          <h2 className="section-title">{A.cta.title}</h2>
          <Link to={A.cta.href} className="btn">{A.cta.label}</Link>
        </div>
      </section>
    </>
  );
}
