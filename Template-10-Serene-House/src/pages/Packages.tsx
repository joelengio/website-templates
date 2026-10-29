import { useState } from 'react';
import { packages, packageCategories, packageComparisonRows, packageSavings } from '../config/packages';
import { ctas } from '../config/navigation';
import { site } from '../config/site';
import { formatPrice } from '../lib/format';
import { Seo } from '../components/Seo';
import { Icon } from '../components/Icon';
import { Img, LinkButton, Reveal, SectionHeading } from '../components/ui';

export default function Packages() {
  const [cat, setCat] = useState('all');
  const shown = packages.filter((p) => cat === 'all' || p.category === cat);
  return (
    <>
      <Seo title={site.pages.packages.title} description={site.pages.packages.description} />
      <section className="page-hero">
        <div className="container">
          <SectionHeading as="h1" eyebrow="Packages & offers" title="Journeys of restoration" text="Thoughtfully combined treatments at transparent prices. See exactly what is included and what you save." />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container">
          <div className="chips" role="group" aria-label="Filter packages by category">
            {[{ id: 'all', name: 'All packages' }, ...packageCategories].map((c) => (
              <button key={c.id} type="button" className={`chip ${cat === c.id ? 'is-active' : ''}`} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.name}</button>
            ))}
          </div>
          <p className="result-count" role="status" aria-live="polite">{shown.length} {shown.length === 1 ? 'package' : 'packages'} shown</p>
          <div className="package-list">
            {shown.map((p) => {
              const total = p.items.reduce((s, i) => s + i.value, 0);
              const saving = packageSavings(p);
              return (
                <Reveal key={p.slug}>
                  <article id={p.slug} className={`package-row ${p.highlight ? 'is-highlight' : ''}`} aria-labelledby={`${p.slug}-t`}>
                    <div className="package-media"><Img image={p.image} sizes="(min-width: 900px) 40vw, 100vw" />{p.highlight && <span className="badge">Most loved</span>}</div>
                    <div className="package-info">
                      <p className="eyebrow">{packageCategories.find((c) => c.id === p.category)?.name} · {p.duration} · {p.guests > 1 ? `${p.guests} guests` : `up to ${p.maxGuests} guests`}</p>
                      <h2 id={`${p.slug}-t`} className="h-display">{p.name}</h2>
                      <p className="lead">{p.description}</p>
                      {p.validUntil && <p className="validity">{p.validUntil}</p>}
                      <table className="breakdown">
                        <caption className="sr-only">Price breakdown for {p.name}</caption>
                        <thead><tr><th scope="col">Included</th><th scope="col">Value</th></tr></thead>
                        <tbody>{p.items.map((i) => <tr key={i.label}><td>{i.label}</td><td>{formatPrice(i.value)}</td></tr>)}</tbody>
                        <tfoot>
                          <tr><th scope="row">Total value</th><td>{formatPrice(total)}</td></tr>
                          <tr className="breakdown-price"><th scope="row">Package price <small>{p.priceNote}</small></th><td>{formatPrice(p.price)}</td></tr>
                          {saving > 0 && <tr className="breakdown-save"><th scope="row">You save</th><td>{formatPrice(saving)}</td></tr>}
                        </tfoot>
                      </table>
                      <LinkButton to={`/booking?package=${p.slug}`}>{ctas.bookPackage}</LinkButton>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section section--cream" aria-labelledby="compare-title">
        <div className="container">
          <SectionHeading eyebrow="Compare" title={<span id="compare-title">Which package is right for you?</span>} text="A side-by-side look at what each package includes." />
          <div className="table-scroll" role="region" aria-label="Package comparison table" tabIndex={0}>
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Feature</span></th>
                  {packages.map((p) => <th key={p.slug} scope="col">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">Price</th>{packages.map((p) => <td key={p.slug}>{formatPrice(p.price)}<small> {p.priceNote}</small></td>)}</tr>
                <tr><th scope="row">Duration</th>{packages.map((p) => <td key={p.slug}>{p.duration}</td>)}</tr>
                {packageComparisonRows.map((r) => (
                  <tr key={r.id}>
                    <th scope="row">{r.label}</th>
                    {packages.map((p) => (
                      <td key={p.slug}>{p.features.includes(r.id) ? <><Icon name="check" size={18} /><span className="sr-only">Included</span></> : <span aria-label="Not included">—</span>}</td>
                    ))}
                  </tr>
                ))}
                <tr><th scope="row"><span className="sr-only">Book</span></th>{packages.map((p) => <td key={p.slug}><LinkButton to={`/booking?package=${p.slug}`} variant="outline" arrow={false} className="btn--sm">Book<span className="sr-only"> {p.name}</span></LinkButton></td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
