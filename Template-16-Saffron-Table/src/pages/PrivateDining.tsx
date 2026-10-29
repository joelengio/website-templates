import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { PrivateInquiryForm } from '../components/Forms';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { DemoNotice, PageHero, SectionHeading } from '../components/Section';
import { privateDiningIntro, privateMenus, privatePackages, privateSpaces } from '../config/privateDining';
import { useSeo } from '../hooks/useSeo';
import { formatMoney } from '../lib/format';
import { pageSeo } from '../lib/seo';

export default function PrivateDining() {
  useSeo({ ...pageSeo('/private-dining'), path: '/private-dining' });
  const [pkg, setPkg] = useState<string | undefined>();
  const [formKey, setFormKey] = useState(0);
  const choose = (id: string) => {
    setPkg(id);
    setFormKey((k) => k + 1);
    document.getElementById('inquiry')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    requestAnimationFrame(() => document.getElementById('inquiry-title')?.focus({ preventScroll: true }));
  };
  return (
    <>
      <PageHero {...privateDiningIntro} image="dining-teal" />
      <section className="section section--dark" aria-labelledby="spaces-title">
        <div className="container">
          <SectionHeading id="spaces-title" eyebrow="Event spaces" title="Three rooms, three moods" />
          <ul className="space-grid">
            {privateSpaces.map((s) => (
              <li key={s.id} className="space">
                <Img name={s.image} sizes="(min-width: 900px) 33vw, 100vw" />
                <div className="space__body">
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <dl className="space__cap">
                    <div><dt>Seated</dt><dd>{s.seated}</dd></div>
                    <div><dt>Standing</dt><dd>{s.standing}</dd></div>
                  </dl>
                  <ul className="tags">{s.features.map((f) => <li key={f} className="tag">{f}</li>)}</ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section--soft" aria-labelledby="packages-title">
        <div className="container">
          <SectionHeading id="packages-title" eyebrow="Packages" title="Start with a package" lead="Packages are demonstration configurations. Prices exclude tax and service charge." />
          <ul className="package-grid">
            {privatePackages.map((p) => (
              <li key={p.id} className="package">
                <h3>{p.name}</h3>
                <p className="package__price">From {formatMoney(p.priceFrom)} <small>{p.priceNote}</small></p>
                <p>{p.summary}</p>
                <p className="package__guests"><Icon name="users" size={16} /> {p.minGuests}–{p.maxGuests} guests</p>
                <ul className="ticks">{p.includes.map((i) => <li key={i}><Icon name="check" size={16} /> {i}</li>)}</ul>
                <Button variant="ghost" icon="arrow" onClick={() => choose(p.id)}>Enquire about {p.name}</Button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section--dark" aria-labelledby="menus-title">
        <div className="container">
          <SectionHeading id="menus-title" eyebrow="Example menus" title="Menus we write for groups" lead="Every menu is adapted to your guests. Dietary needs are handled by arrangement; please tell us early." />
          <ul className="pmenu-grid">
            {privateMenus.map((m) => (
              <li key={m.id} className="pmenu">
                <h3>{m.name}</h3>
                <p className="pmenu__price">{formatMoney(m.price)} <small>{m.priceNote}</small></p>
                <ol>{m.courses.map((c) => <li key={c}>{c}</li>)}</ol>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section--light" id="inquiry" aria-labelledby="inquiry-title">
        <div className="container container--narrow">
          <SectionHeading id="inquiry-title" eyebrow="Group dining enquiry" title="Tell us about your event" lead="Share a date, guest count and requirements." />
          <DemoNotice>Demonstration form. Nothing is sent to a restaurant. See also the <Link to="/contact">contact page</Link>.</DemoNotice>
          <PrivateInquiryForm key={formKey} presetPackage={pkg} />
        </div>
      </section>
    </>
  );
}
