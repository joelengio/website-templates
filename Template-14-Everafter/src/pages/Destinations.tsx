import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DestinationCard } from '../components/Cards';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { CtaBand, DemoBanner, EmptyState, PageHero } from '../components/ui';
import { destinationCategories, destinationContinents, destinations, img } from '../config';

export default function Destinations() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? '';
  const continent = params.get('region') ?? '';
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params);
    if (v) n.set(k, v);
    else n.delete(k);
    setParams(n, { replace: true });
  };
  const results = useMemo(() => destinations.filter((d) => (!category || d.category === category) && (!continent || d.continent === continent)), [category, continent]);
  const cats = destinationCategories.filter((c) => destinations.some((d) => d.category === c));

  return (
    <>
      <Seo title="Wedding Destinations" description="Demonstration wedding destinations across Italy, France, Scotland, Portugal, Bali, the Swiss Alps and more. Filter by category and region." />
      <PageHero eyebrow="Destinations" title="Where will you celebrate?" lead={`${destinations.length} demonstration destinations, each with venue styles, planning notes and a gallery.`} image={img('tuscany-vineyard')} />
      <section className="section section--tight" aria-label="Destinations">
        <div className="container">
          <div className="filters filters--pills" role="group" aria-label="Filter destinations">
            <div className="pillbar" role="group" aria-label="Category">
              <span className="pillbar__label">Category</span>
              <button type="button" aria-pressed={!category} onClick={() => set('category', '')}>All</button>
              {cats.map((c) => (<button type="button" key={c} aria-pressed={category === c} onClick={() => set('category', c)}>{c}</button>))}
            </div>
            <div className="pillbar" role="group" aria-label="Region">
              <span className="pillbar__label">Region</span>
              <button type="button" aria-pressed={!continent} onClick={() => set('region', '')}>All</button>
              {destinationContinents.map((c) => (<button type="button" key={c} aria-pressed={continent === c} onClick={() => set('region', c)}>{c}</button>))}
            </div>
          </div>
          <p className="filters__count" role="status" aria-live="polite">Showing {results.length} of {destinations.length} destinations</p>
          {results.length ? (
            <ul className="grid grid--destinations">
              {results.map((d, i) => (<Reveal as="li" key={d.slug} delay={(i % 3) * 70}><DestinationCard d={d} level="h2" /></Reveal>))}
            </ul>
          ) : (
            <EmptyState title="No destinations match" text="Try another category or region." action={<button type="button" className="btn btn--primary" onClick={() => setParams({}, { replace: true })}><span>Show all destinations</span></button>} />
          )}
          <DemoBanner>Destinations are demonstration listings. No venue is named, endorsed or verified, and photographs are illustrative stock images of real landscapes.</DemoBanner>
        </div>
      </section>
      <CtaBand title="Somewhere not listed?" body="We plan celebrations well beyond these destinations. Tell us where you are dreaming of." primary={{ label: 'Start your enquiry', to: '/plan' }} secondary={{ label: 'Contact the studio', to: '/contact' }} />
    </>
  );
}
