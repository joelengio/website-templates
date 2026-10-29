import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/Button';
import { Icon } from '../components/Icon';
import { Img } from '../components/Img';
import { PageHero } from '../components/Section';
import { experiences, experiencesIntro } from '../config/experiences';
import { useSeo } from '../hooks/useSeo';
import { formatMoney } from '../lib/format';
import { pageSeo } from '../lib/seo';

export default function Experiences() {
  useSeo({ ...pageSeo('/experiences'), path: '/experiences' });
  return (
    <>
      <PageHero {...experiencesIntro} image="chef-plating" />
      <section className="section section--dark">
        <div className="container">
          <ul className="exp-list">
            {experiences.map((e, i) => (
              <li key={e.slug} className={`exp${i % 2 ? ' exp--reverse' : ''}`}>
                <Link to={`/experiences/${e.slug}`} className="exp__img" tabIndex={-1} aria-hidden="true">
                  <Img name={e.image} sizes="(min-width: 900px) 50vw, 100vw" />
                </Link>
                <div className="exp__body">
                  <p className="eyebrow">{e.category}{e.seasonal ? ' · Seasonal' : ''}</p>
                  <h2><Link to={`/experiences/${e.slug}`}>{e.title}</Link></h2>
                  <p className="exp__tag">{e.tagline}</p>
                  <p>{e.summary}</p>
                  <ul className="exp__facts">
                    <li><Icon name="clock" size={16} /> {e.duration}</li>
                    <li><Icon name="users" size={16} /> {e.guests}</li>
                    <li>From {formatMoney(e.priceFrom)} {e.priceNote}</li>
                  </ul>
                  <ButtonLink to={`/experiences/${e.slug}`} variant="ghost" icon="arrow">View details<span className="visually-hidden">: {e.title}</span></ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
