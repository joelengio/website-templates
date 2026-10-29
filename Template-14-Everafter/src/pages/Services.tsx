import { ServiceCard } from '../components/Cards';
import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { CtaBand, PageHero } from '../components/ui';
import { img, services } from '../config';

export default function Services() {
  return (
    <>
      <Seo title="Wedding & Event Planning Services" description="Full wedding planning, partial planning, day-of coordination, destination weddings, venue styling, floral design, private celebrations and corporate events." />
      <PageHero eyebrow="Services" title="Planning, design and delivery" lead="Eight ways of working with the studio — from a complete planning partnership to a calm team on the day." image={img('table-white', { position: '50% 50%' })} />
      <section className="section" aria-label="All services">
        <div className="container">
          <ul className="grid grid--services grid--services-all">
            {services.map((s, i) => (<Reveal as="li" key={s.slug} delay={(i % 4) * 70}><ServiceCard s={s} level="h2" /></Reveal>))}
          </ul>
          <p className="fineprint">Prices are illustrative “from” figures for a demonstration studio and are fully configurable in <code>src/config/services.ts</code>.</p>
        </div>
      </section>
      <CtaBand title="Not sure which service fits?" body="Answer a few questions and we will point you toward the right level of support." primary={{ label: 'Start your enquiry', to: '/plan' }} secondary={{ label: 'Compare packages', to: '/packages' }} />
    </>
  );
}
