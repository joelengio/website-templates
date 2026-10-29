import { Link } from 'react-router-dom';
import { categories, collections } from '../config/collections';
import { homeContent, homeSections } from '../config/home';
import { articles } from '../config/journal';
import { testimonials } from '../config/testimonials';
import { site } from '../config/site';
import { getProducts, getProductBySlug } from '../lib/catalog';
import { NewsletterForm } from '../components/Newsletter';
import { ProductGrid } from '../components/ProductCard';
import { Seo } from '../components/Seo';
import { ArrowLink, SafeImg, SectionHeading } from '../components/ui';
import type { Product } from '../config/types';

const H = homeContent;

function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{H.hero.eyebrow}</p>
        <h1 id="hero-title">{H.hero.title}</h1>
        <p className="lede">{H.hero.text}</p>
        <div className="hero-actions">
          <Link to={H.hero.primaryCta.href} className="btn">{H.hero.primaryCta.label}</Link>
          <Link to={H.hero.secondaryCta.href} className="btn btn-outline">{H.hero.secondaryCta.label}</Link>
        </div>
      </div>
      <div className="hero-media">
        <SafeImg src={H.hero.image} alt={H.hero.alt} className="hero-img" width={2000} height={1200} eager />
      </div>
      <ul className="hero-tiles">
        {H.hero.sideImages.map((s) => (
          <li key={s.href}>
            <Link to={s.href}><SafeImg src={s.image} alt={s.alt} width={500} height={625} eager /><span>{s.label}</span></Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Categories() {
  return (
    <section className="section container" aria-labelledby="cat-title">
      <SectionHeading id="cat-title" eyebrow={H.categories.eyebrow} title={H.categories.title} />
      <ul className="category-grid">
        {categories.map((c) => (
          <li key={c.id}>
            <Link to={`/shop?category=${c.id}`} className="category-tile">
              <SafeImg src={c.image} alt={`${c.name}: ${c.description}`} width={800} height={1000} />
              <span className="category-label"><strong>{c.name}</strong><small>{c.description}</small></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProductSection({ cfg, items, id, tone }: { cfg: { eyebrow: string; title: string; cta: { label: string; href: string } }; items: Product[]; id: string; tone?: 'cream' }) {
  return (
    <section className={`section${tone ? ` tone-${tone}` : ''}`} aria-labelledby={id}>
      <div className="container">
        <SectionHeading id={id} eyebrow={cfg.eyebrow} title={cfg.title} action={<ArrowLink to={cfg.cta.href}>{cfg.cta.label}</ArrowLink>} />
        <ProductGrid products={items} />
      </div>
    </section>
  );
}

function FeaturedCollections() {
  const list = H.collections.slugs.map((s) => collections.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  return (
    <section className="section container" aria-labelledby="col-title">
      <SectionHeading id="col-title" eyebrow={H.collections.eyebrow} title={H.collections.title} action={<ArrowLink to={H.collections.cta.href}>{H.collections.cta.label}</ArrowLink>} />
      <ul className="collection-grid">
        {list.map((c, i) => (
          <li key={c.slug} className={i === 0 ? 'is-lead' : ''}>
            <Link to={`/collections/${c.slug}`} className="collection-tile">
              <SafeImg src={c.heroImage} alt={c.heroAlt} width={1600} height={1000} />
              <span className="collection-label"><strong>{c.name}</strong><small>{c.tagline}</small></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Story() {
  return (
    <section className="section tone-cream" aria-labelledby="story-title">
      <div className="container split">
        <div className="split-media"><SafeImg src={H.story.image} alt={H.story.alt} width={1200} height={1500} /></div>
        <div className="split-copy">
          <p className="eyebrow">{H.story.eyebrow}</p>
          <h2 id="story-title" className="section-title">{H.story.title}</h2>
          <p className="lede">{H.story.text}</p>
          <ul className="ticks">{H.story.points.map((p) => <li key={p}>{p}</li>)}</ul>
          <ArrowLink to={H.story.cta.href}>{H.story.cta.label}</ArrowLink>
        </div>
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className="section container" aria-label="Editorial">
      <ul className="editorial-grid">
        {H.editorial.map((e) => (
          <li key={e.title}>
            <Link to={e.href} className="editorial-card">
              <SafeImg src={e.image} alt={e.alt} width={1200} height={900} />
              <span className="editorial-text"><span className="eyebrow">{e.eyebrow}</span><strong>{e.title}</strong><span>{e.text}</span><em>{e.cta} →</em></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section container" aria-labelledby="testi-title">
      <SectionHeading id="testi-title" eyebrow={H.testimonials.eyebrow} title={H.testimonials.title} />
      <ul className="testimonials">
        {testimonials.map((t) => (
          <li key={t.name}>
            <figure>
              <blockquote><p>“{t.quote}”</p></blockquote>
              <figcaption><strong>{t.name}</strong>, {t.location}{t.product && <span> · {t.product}</span>}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="fine center">{H.testimonials.note}</p>
    </section>
  );
}

function JournalPreview() {
  return (
    <section className="section container" aria-labelledby="journal-title">
      <SectionHeading id="journal-title" eyebrow={H.journal.eyebrow} title={H.journal.title} action={<ArrowLink to={H.journal.cta.href}>{H.journal.cta.label}</ArrowLink>} />
      <ul className="article-grid">
        {articles.slice(0, H.journal.count).map((a) => (
          <li key={a.slug}>
            <Link to={`/journal/${a.slug}`} className="article-card">
              <SafeImg src={a.image} alt={a.alt} width={1200} height={800} />
              <span className="article-meta">{a.category} · {a.readMinutes} min read</span>
              <strong>{a.title}</strong>
              <span className="article-excerpt">{a.excerpt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NewsletterBand() {
  return (
    <section className="newsletter-band" aria-labelledby="nl-title" style={{ backgroundImage: `url(${site.newsletter.image})` }}>
      <div className="container newsletter-inner">
        <div>
          <h2 id="nl-title" className="section-title">{site.newsletter.title}</h2>
          <p>{site.newsletter.text}</p>
        </div>
        <NewsletterForm id="home-newsletter" />
      </div>
    </section>
  );
}

export default function Home() {
  const products = getProducts();
  const newArrivals = [...products].filter((p) => p.isNew).sort((a, b) => b.addedOn.localeCompare(a.addedOn)).slice(0, H.newArrivals.count);
  const best = [...products].filter((p) => p.bestseller).sort((a, b) => (a.bestseller ?? 0) - (b.bestseller ?? 0)).filter((p) => getProductBySlug(p.slug)).slice(0, H.bestSellers.count);
  const render = (id: (typeof homeSections)[number]['id']) => {
    switch (id) {
      case 'hero': return <Hero key={id} />;
      case 'categories': return <Categories key={id} />;
      case 'new-arrivals': return <ProductSection key={id} id="new-title" cfg={H.newArrivals} items={newArrivals} />;
      case 'collections': return <FeaturedCollections key={id} />;
      case 'story': return <Story key={id} />;
      case 'best-sellers': return <ProductSection key={id} id="best-title" cfg={H.bestSellers} items={best} tone="cream" />;
      case 'editorial': return <Editorial key={id} />;
      case 'testimonials': return <Testimonials key={id} />;
      case 'journal': return <JournalPreview key={id} />;
      case 'newsletter': return <NewsletterBand key={id} />;
    }
  };
  return (
    <>
      <Seo path="/" />
      {homeSections.filter((s) => s.enabled).map((s) => render(s.id))}
    </>
  );
}
