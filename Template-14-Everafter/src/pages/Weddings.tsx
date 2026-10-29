import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WeddingCard } from '../components/Cards';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { CtaBand, EmptyState, PageHero } from '../components/ui';
import { weddingFilterOrder, weddings } from '../config';

const KEYS = ['location', 'style', 'type'] as const;

export default function Weddings() {
  const [params, setParams] = useSearchParams();
  const sel = { location: params.get('location') ?? '', style: params.get('style') ?? '', type: params.get('type') ?? '' };

  const set = (k: (typeof KEYS)[number], v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };
  const reset = () => setParams({}, { replace: true });

  const results = useMemo(
    () => weddings.filter((w) => (!sel.location || w.region === sel.location) && (!sel.style || w.style === sel.style) && (!sel.type || w.eventType === sel.type)),
    [sel.location, sel.style, sel.type]
  );
  const active = KEYS.filter((k) => sel[k]);

  const options = (key: 'region' | 'style' | 'eventType') => weddingFilterOrder[key].filter((v) => weddings.some((w) => w[key] === v));

  return (
    <>
      <Seo title="Weddings & Portfolio" description="Browse our fictional portfolio of weddings, elopements and celebrations across Italy, France, Scotland, Portugal, Bali and beyond. Filter by location, style and event type." />
      <PageHero eyebrow="Portfolio" title="Weddings & celebrations" lead={`${weddings.length} fictional celebrations, each designed around its place. Filter by location, style or event type.`} />
      <section className="section section--tight" aria-label="Portfolio">
        <div className="container">
          <form className="filters" role="search" aria-label="Filter weddings" onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              <label htmlFor="f-location">Location</label>
              <select id="f-location" value={sel.location} onChange={(e) => set('location', e.target.value)}>
                <option value="">All locations</option>
                {options('region').map((v) => (<option key={v}>{v}</option>))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-style">Wedding style</label>
              <select id="f-style" value={sel.style} onChange={(e) => set('style', e.target.value)}>
                <option value="">All styles</option>
                {options('style').map((v) => (<option key={v}>{v}</option>))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-type">Event type</label>
              <select id="f-type" value={sel.type} onChange={(e) => set('type', e.target.value)}>
                <option value="">All event types</option>
                {options('eventType').map((v) => (<option key={v}>{v}</option>))}
              </select>
            </div>
            <button type="button" className="btn btn--outline btn--sm filters__reset" onClick={reset} disabled={!active.length}><span>Clear filters</span></button>
          </form>
          <p className="filters__count" role="status" aria-live="polite">
            Showing {results.length} of {weddings.length} {results.length === 1 ? 'celebration' : 'celebrations'}
            {active.length > 0 && ` · ${active.map((k) => sel[k]).join(' · ')}`}
          </p>
          {results.length ? (
            <ul className="grid grid--weddings" aria-label="Weddings">
              {results.map((w, i) => (
                <Reveal as="li" key={w.slug} delay={(i % 3) * 70}><WeddingCard w={w} level="h2" /></Reveal>
              ))}
            </ul>
          ) : (
            <EmptyState title="No celebrations match those filters" text="Try a different combination, or clear the filters to see everything." action={<button type="button" className="btn btn--primary" onClick={reset}><span>Clear filters</span></button>} />
          )}
          <p className="fineprint">All couples, venues and stories are fictional. Photography is illustrative stock and does not depict these events.</p>
        </div>
      </section>
      <CtaBand title="Imagining something like this?" body="Tell us about your day and we will suggest where to begin." primary={{ label: 'Start your enquiry', to: '/plan' }} secondary={{ label: 'Our packages', to: '/packages' }} />
    </>
  );
}
