import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { annualSavingPercent, articles, categories, courses, getCategory, getCourse, home, homeFaqs, images, instructors, pages, paths, plans, site, testimonials } from '../config';
import { visibleSections } from '../lib/sections';
import { courseProgress, pathProgress } from '../lib/progress';
import { sampleState } from '../lib/learner';
import { money } from '../lib/format';
import { useSeo } from '../hooks/useSeo';
import { ArticleCard } from '../components/ArticleCard';
import { LinkButton } from '../components/Button';
import { CourseCard } from '../components/CourseCard';
import { CourseCover } from '../components/CourseCover';
import { Icon } from '../components/Icon';
import { InstructorCard } from '../components/InstructorCard';
import { Section, SectionHeader, ProgressBar, ProgressRing, FaqList } from '../components/ui';
import { Portrait } from '../components/Portrait';
import type { HomeSectionId } from '../config/layout';

function Hero() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const featured = courses.find((c) => c.featured && c.price === 0) ?? courses[0];
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/courses?q=${encodeURIComponent(q.trim())}` : '/courses');
  };
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--pill">{home.hero.eyebrow}</p>
          <h1 data-page-heading tabIndex={-1}>
            {home.hero.title} <span className="hero__accent">{home.hero.accent}</span>
          </h1>
          <p className="hero__text">{home.hero.text}</p>
          <form className="hero__search" role="search" aria-label="Search courses" onSubmit={submit}>
            <label htmlFor="hero-q" className="sr-only">Search courses</label>
            <Icon name="search" size={22} />
            <input id="hero-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses, e.g. “SQL” or “Spanish”" autoComplete="off" />
            <button type="submit" className="btn btn--primary btn--sm">Search</button>
          </form>
          <p className="hero__popular">
            <span>Popular:</span>
            {home.hero.popular.map((t) => (
              <Link key={t} to={`/courses?q=${encodeURIComponent(t)}`}>{t}</Link>
            ))}
          </p>
          <div className="hero__actions">
            <LinkButton to={home.hero.primary.to} arrow>{home.hero.primary.label}</LinkButton>
            {pages.learn && <LinkButton to={home.hero.secondary.to} variant="ghost">{home.hero.secondary.label}</LinkButton>}
          </div>
          <dl className="hero__stats">
            <div><dt>Demo courses</dt><dd>{courses.length}</dd></div>
            <div><dt>Fictional instructors</dt><dd>{instructors.length}</dd></div>
            <div><dt>Learning paths</dt><dd>{paths.length}</dd></div>
          </dl>
        </div>
        <div className="hero__visual" aria-hidden="false">
          <div className="hero__photo">
            <img src={images.hero.src} srcSet={`${images.hero.thumb} 800w, ${images.hero.src} 1600w`} sizes="(min-width: 1024px) 560px, 92vw" width={images.hero.width} height={images.hero.height} alt={images.hero.alt} fetchPriority="high" />
          </div>
          <div className="hero__tile hero__tile--course">
            <CourseCover motif={getCategory(featured.categoryId)!.motif} palette={featured.palette} seed={featured.slug} />
            <div className="hero__tile-text">
              <span className="chip chip--free">Free</span>
              <strong>{featured.title}</strong>
              <span>{featured.hours} h · {featured.difficulty}</span>
            </div>
          </div>
          <div className="hero__tile hero__tile--progress" role="group" aria-label="Sample progress card">
            <ProgressRing percent={68} size={64} />
            <div>
              <strong>Module 2 in progress</strong>
              <span>Sample learner · demo data</span>
            </div>
          </div>
          <div className="hero__badge">
            <Icon name="sparkle" size={18} /> New: certificate preview
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <Section>
      <SectionHeader eyebrow="Explore" title="Find your subject" intro="Eight categories, each with short courses you can finish." action={{ label: 'All courses', to: '/courses' }} />
      <ul className="category-grid">
        {categories.map((c, i) => {
          const n = courses.filter((x) => x.categoryId === c.id).length;
          const sample = courses.find((x) => x.categoryId === c.id)!;
          return (
            <li key={c.id}>
              <Link to={`/courses?category=${c.id}`} className={`category-tile category-tile--${i % 4}`}>
                <span className="category-tile__art" aria-hidden="true">
                  <CourseCover motif={c.motif} palette={sample.palette} seed={c.id} />
                </span>
                <span className="category-tile__name">{c.name}</span>
                <span className="category-tile__blurb">{c.blurb}</span>
                <span className="category-tile__count">{n} course{n === 1 ? '' : 's'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Featured() {
  const list = courses.filter((c) => c.featured).slice(0, 4);
  return (
    <Section tone="soft">
      <SectionHeader eyebrow="Featured" title="Start with a course people finish" intro="Featured demo courses balance free starters with deeper programmes." action={{ label: 'Browse the catalogue', to: '/courses' }} />
      <div className="featured-grid">
        {list.map((c, i) => (
          <CourseCard key={c.slug} course={c} variant={i === 0 ? 'feature' : 'default'} />
        ))}
      </div>
    </Section>
  );
}

function Outcomes() {
  return (
    <Section>
      <div className="split">
        <div>
          <p className="eyebrow">Outcomes</p>
          <h2 className="section-title">{home.outcomes.title}</h2>
          <p className="section-intro">{home.outcomes.intro}</p>
        </div>
        <ol className="outcome-list">
          {home.outcomes.items.map((o, i) => (
            <li key={o.title}>
              <span className="outcome-list__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function InstructorsSection() {
  return (
    <Section tone="soft">
      <SectionHeader eyebrow="Instructors" title="Learn from practitioners" intro="Nine fictional instructors from design, engineering, data and teaching. Identities and credentials are demonstration data." action={{ label: 'Meet the instructors', to: '/instructors' }} />
      <ul className="instructor-strip">
        {instructors.slice(0, 4).map((i) => (
          <li key={i.slug}>
            <InstructorCard instructor={i} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Why() {
  return (
    <Section tone="ink">
      <div className="split split--why">
        <div>
          <p className="eyebrow eyebrow--light">Why Northstar</p>
          <h2 className="section-title">{home.why.title}</h2>
          <p className="section-intro">An academy template designed around attention: small lessons, honest checks and a clear sense of progress.</p>
        </div>
        <ul className="why-grid">
          {home.why.items.map((w) => (
            <li key={w.title}>
              <Icon name="sparkle" size={22} />
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Experience() {
  const demo = courses[0];
  return (
    <Section>
      <div className="experience">
        <div className="experience__copy">
          <p className="eyebrow">Learning experience</p>
          <h2 className="section-title">{home.experience.title}</h2>
          <p className="section-intro">{home.experience.text}</p>
          <ul className="check-list">
            {home.experience.bullets.map((b) => (
              <li key={b}><Icon name="check" size={18} /> {b}</li>
            ))}
          </ul>
          {pages.learn && <LinkButton to={`/learn/${demo.slug}`} arrow variant="ink">Try a lesson</LinkButton>}
        </div>
        <div className="experience__preview" role="img" aria-label="Preview of the lesson viewer: course outline on the left, lesson reading on the right">
          <div className="mock">
            <div className="mock__bar"><i /><i /><i /><span>{demo.title}</span></div>
            <div className="mock__body">
              <div className="mock__side">
                <b>Module 1</b>
                <span className="is-done">What happens when you open a page</span>
                <span className="is-current">Your first semantic page</span>
                <span>Developer tools in ten minutes</span>
                <span className="quiz">Quiz · Pass 70%</span>
              </div>
              <div className="mock__main">
                <small>Lesson 2 · 12 min</small>
                <strong>Your first semantic page</strong>
                <p>Semantic elements say what content is, not how it looks…</p>
                <i /><i /><i className="short" />
                <div className="mock__prog"><span style={{ width: '38%' }} /></div>
              </div>
            </div>
          </div>
          <img className="experience__photo" src={images.experience.thumb} width={800} height={534} loading="lazy" alt={images.experience.alt} />
        </div>
      </div>
    </Section>
  );
}

function PathsSection() {
  return (
    <Section tone="soft">
      <SectionHeader eyebrow="Learning paths" title="Courses that lead somewhere" intro="Paths combine courses into themed journeys with a clear order and outcome." action={{ label: 'All learning paths', to: '/paths' }} />
      <ul className="path-preview">
        {paths.slice(0, 3).map((p) => {
          const list = p.courseSlugs.map((s) => getCourse(s)!).filter(Boolean);
          const hours = list.reduce((a, c) => a + c.hours, 0);
          return (
            <li key={p.slug} className="path-card">
              <p className="path-card__meta">{p.difficulty} · {list.length} courses · {hours} h</p>
              <h3><Link to={`/paths#${p.slug}`}>{p.title}</Link></h3>
              <p>{p.tagline}</p>
              <ol className="path-card__steps">
                {list.map((c) => <li key={c.slug}>{c.title}</li>)}
              </ol>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section>
      <SectionHeader eyebrow="Student voices" title="What learners say" intro="All testimonials are fictional demonstration content." />
      <ul className="quote-grid">
        {testimonials.slice(0, 3).map((t, i) => (
          <li key={t.name} className={`quote quote--${i}`}>
            <blockquote>“{t.quote}”</blockquote>
            <p className="quote__who"><strong>{t.name}</strong><span>{t.role}</span><em>{t.course}</em></p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function DashboardPreview() {
  const { items, avg } = useMemo(() => {
    const s = sampleState();
    const items = Object.keys(s.enrollments).map((slug) => {
      const c = getCourse(slug)!;
      return { c, p: courseProgress(c, s) };
    });
    const first = items.slice(0, 3).map((i) => i.c);
    return { items, avg: pathProgress(first, s).percent };
  }, []);
  return (
    <Section tone="cobalt">
      <div className="dash-preview">
        <div className="dash-preview__copy">
          <p className="eyebrow eyebrow--light">Learning dashboard</p>
          <h2 className="section-title">{home.dashboard.title}</h2>
          <p className="section-intro">{home.dashboard.text}</p>
          {pages.learn && <LinkButton to={home.dashboard.cta.to} variant="light" arrow>{home.dashboard.cta.label}</LinkButton>}
        </div>
        <div className="dash-preview__card" role="group" aria-label="Sample dashboard preview (demo data)">
          <div className="dash-preview__head">
            <ProgressRing percent={avg} size={84} />
            <div>
              <strong>Sam’s learning week</strong>
              <span>Sample data preview</span>
            </div>
          </div>
          <ul>
            {items.map(({ c, p }) => (
              <li key={c.slug}>
                <span>{c.title}</span>
                <ProgressBar percent={p.percent} label={`${c.title} sample progress`} tone="teal" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function PlansPreview() {
  return (
    <Section>
      <SectionHeader eyebrow="Plans" title="Simple, honest pricing" intro="Demonstration plans — no payment is ever requested." action={{ label: 'Compare plans', to: '/plans' }} />
      <ul className="plan-preview">
        {plans.slice(0, 3).map((p) => (
          <li key={p.id} className={`plan-mini${p.highlighted ? ' is-highlighted' : ''}`}>
            <h3>{p.name}</h3>
            <p className="plan-mini__price">{p.monthly === 0 ? 'Free' : <>{money(p.monthly)}<small>/mo</small></>}</p>
            <p>{p.audience}</p>
            {p.monthly > 0 && <p className="plan-mini__save">Save {annualSavingPercent(p)}% billed annually (demo)</p>}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function JournalPreview() {
  return (
    <Section tone="soft">
      <SectionHeader eyebrow="Journal" title="Ideas for better learning" action={{ label: 'Read the journal', to: '/journal' }} />
      <div className="article-grid">
        {articles.slice(0, 3).map((a) => <ArticleCard key={a.slug} article={a} />)}
      </div>
    </Section>
  );
}

function Cta() {
  return (
    <Section>
      <div className="cta-band">
        <div>
          <h2>{home.cta.title}</h2>
          <p>{home.cta.text}</p>
        </div>
        <div className="cta-band__actions">
          <LinkButton to={home.cta.primary.to} variant="primary" arrow>{home.cta.primary.label}</LinkButton>
          {pages.plans && <LinkButton to={home.cta.secondary.to} variant="light">{home.cta.secondary.label}</LinkButton>}
        </div>
        <Portrait person={instructors[2]} label={false} className="cta-band__avatar" />
      </div>
      <details className="home-faq-wrap">
        <summary>Quick questions about this demo</summary>
        <FaqList items={homeFaqs} />
      </details>
    </Section>
  );
}

const registry: Record<HomeSectionId, () => JSX.Element> = {
  hero: Hero,
  categories: Categories,
  featured: Featured,
  outcomes: Outcomes,
  instructors: InstructorsSection,
  why: Why,
  experience: Experience,
  paths: PathsSection,
  testimonials: Testimonials,
  dashboard: DashboardPreview,
  plans: PlansPreview,
  journal: JournalPreview,
  cta: Cta,
};

export default function Home() {
  useSeo({ title: undefined, path: '/', description: site.seo.description });
  const ids = visibleSections();
  const hasHero = ids.includes('hero');
  return (
    <>
      {!hasHero && <h1 className="sr-only" data-page-heading tabIndex={-1}>{site.name}</h1>}
      {ids.map((id) => {
        const C = registry[id];
        return C ? <C key={id} /> : null;
      })}
    </>
  );
}
