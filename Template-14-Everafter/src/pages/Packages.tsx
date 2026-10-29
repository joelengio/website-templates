import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { Accordion } from '../components/Accordion';
import { CtaBand, DemoBanner, PageHero } from '../components/ui';
import { addOns, generalFaqs, img, packageFeatures, packages } from '../config';
import { formatPrice } from '../lib/format';

export default function Packages() {
  const nav = useNavigate();
  const [picked, setPicked] = useState<string>(packages.find((p) => p.featured)?.id ?? packages[0].id);
  const [chosenAddOns, setChosenAddOns] = useState<string[]>([]);
  const pkg = packages.find((p) => p.id === picked)!;
  const addTotal = useMemo(() => addOns.filter((a) => chosenAddOns.includes(a.id)).reduce((s, a) => s + a.price, 0), [chosenAddOns]);
  const toggle = (id: string) => setChosenAddOns((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const groups = [...new Set(packageFeatures.map((f) => f.group))];
  const inquire = (id: string, withAddOns = true) => {
    const q = new URLSearchParams({ package: id });
    if (withAddOns && chosenAddOns.length) q.set('addons', chosenAddOns.join(','));
    nav(`/plan?${q.toString()}`);
  };

  return (
    <>
      <Seo title="Planning Packages" description="Compare EVERAFTER's Essential, Signature and Destination wedding planning packages, add optional extras and start an enquiry." />
      <PageHero eyebrow="Packages" title="Planning packages" lead="Three ways to work together, with optional extras. Starting prices are illustrative and fully configurable." image={img('arch-lakeside')} />

      <section className="section" aria-labelledby="pkg-title">
        <div className="container">
          <h2 className="sr-only" id="pkg-title">Choose a package</h2>
          <ul className="packages">
            {packages.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 80} className={`package${p.featured ? ' package--featured' : ''}${picked === p.id ? ' is-picked' : ''}`}>
                <div className="package__media"><Photo image={p.image} small /></div>
                <div className="package__body">
                  {p.featured && <p className="package__flag">Most popular</p>}
                  <h3 className="package__name">{p.name}</h3>
                  <p className="package__tag">{p.tagline}</p>
                  <p className="package__price"><span>from</span> {formatPrice(p.startingPrice)}</p>
                  <p className="package__note">{p.priceNote}</p>
                  <p>{p.description}</p>
                  <ul className="package__list">
                    {packageFeatures.filter((f) => p.includes.includes(f.id)).slice(0, 6).map((f) => (<li key={f.id}><Icon name="check" size={16} />{f.label}</li>))}
                  </ul>
                  <div className="package__actions">
                    <button type="button" className="btn btn--primary" onClick={() => inquire(p.id)}><span>Enquire about {p.name}</span></button>
                    <button type="button" className="btn btn--ghost-dark" aria-pressed={picked === p.id} onClick={() => setPicked(p.id)}><span>{picked === p.id ? 'Selected for estimate' : 'Use for estimate'}</span></button>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="compare-title">
        <div className="container">
          <Reveal className="section-head"><div><p className="eyebrow">Compare</p><h2 className="h-display" id="compare-title">Package comparison</h2></div></Reveal>
          <div className="table-wrap" tabIndex={0} role="region" aria-labelledby="compare-title">
            <table className="compare">
              <caption className="sr-only">What is included in each planning package</caption>
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Feature</span></th>
                  {packages.map((p) => (<th scope="col" key={p.id} className={p.featured ? 'is-featured' : ''}>{p.name}<small>{formatPrice(p.startingPrice)}+</small></th>))}
                </tr>
              </thead>
              {groups.map((g) => (
                <tbody key={g}>
                  <tr className="compare__group"><th scope="rowgroup" colSpan={packages.length + 1}>{g}</th></tr>
                  {packageFeatures.filter((f) => f.group === g).map((f) => (
                    <tr key={f.id}>
                      <th scope="row">{f.label}</th>
                      {packages.map((p) => {
                        const has = p.includes.includes(f.id);
                        const v = f.values?.[p.id];
                        return (
                          <td key={p.id} className={p.featured ? 'is-featured' : ''}>
                            {v ? v : has ? (<><Icon name="check" size={18} /><span className="sr-only">Included</span></>) : (<><span aria-hidden="true">—</span><span className="sr-only">Not included</span></>)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="addons-title">
        <div className="container split split--top">
          <div>
            <Reveal><p className="eyebrow">Optional extras</p><h2 className="h-display" id="addons-title">Add-ons</h2><p className="lead">Select any extras to include in your enquiry and estimate.</p></Reveal>
            <fieldset className="addons">
              <legend className="sr-only">Optional add-ons</legend>
              {addOns.map((a) => (
                <label key={a.id} className={`addon${chosenAddOns.includes(a.id) ? ' is-on' : ''}`}>
                  <input type="checkbox" checked={chosenAddOns.includes(a.id)} onChange={() => toggle(a.id)} />
                  <span className="addon__box" aria-hidden="true"><Icon name="check" size={14} /></span>
                  <span className="addon__text"><strong>{a.label}</strong><small>{a.description}</small></span>
                  <span className="addon__price">{formatPrice(a.price)}<small>{a.unit}</small></span>
                </label>
              ))}
            </fieldset>
          </div>
          <aside className="estimate" aria-labelledby="est-title">
            <p className="eyebrow">Illustrative estimate</p>
            <h3 id="est-title">{pkg.name} package</h3>
            <dl>
              <div><dt>Starting price</dt><dd>{formatPrice(pkg.startingPrice)}</dd></div>
              <div><dt>Add-ons ({chosenAddOns.length})</dt><dd>{formatPrice(addTotal)}</dd></div>
              <div className="estimate__total"><dt>Indicative total</dt><dd aria-live="polite">{formatPrice(pkg.startingPrice + addTotal)}</dd></div>
            </dl>
            <p className="fineprint">A starting-point figure only. Real quotes depend on guest count, destination and scope.</p>
            <button type="button" className="btn btn--primary" onClick={() => inquire(pkg.id)}><span>Enquire with this selection</span></button>
            {chosenAddOns.length > 0 && (<button type="button" className="btn btn--ghost-dark" onClick={() => setChosenAddOns([])}><span>Clear add-ons</span></button>)}
          </aside>
        </div>
        <div className="container"><DemoBanner>The enquiry flow is a demonstration: without a backend your selections are previewed on screen and are not sent to a planner.</DemoBanner></div>
      </section>

      <section className="section section--cream" aria-labelledby="pf-title">
        <div className="container container--narrow">
          <Reveal className="section-head section-head--center"><div><p className="eyebrow">Questions</p><h2 className="h-display" id="pf-title">About our packages</h2></div></Reveal>
          <Accordion items={generalFaqs} />
          <p className="center"><Link to="/contact" className="link-arrow">More questions? Contact the studio <Icon name="arrow" size={18} /></Link></p>
        </div>
      </section>
      <CtaBand title="Find your fit" body="Not sure which package is right? The enquiry takes about five minutes." primary={{ label: 'Start your enquiry', to: '/plan' }} secondary={{ label: 'Book a consultation', to: '/contact' }} />
    </>
  );
}
