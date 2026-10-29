import { Seo } from '../components/Seo';
import { PageHero } from '../components/ui';
import { img, photoCredits } from '../config';

export default function Credits() {
  return (
    <>
      <Seo title="Photo Credits" description="Credits and licences for the photographs used on this demonstration website." />
      <PageHero eyebrow="Credits" title="Photo credits" lead="Every photograph on this demonstration site is shared under a licence that permits reuse. Thank you to the photographers below." />
      <section className="section section--tight">
        <div className="container">
          <p className="fineprint">Photographs come from Wikimedia Commons under CC0, public-domain or Creative Commons Attribution (CC BY) licences, resized for the web. They are illustrative and do not depict the fictional weddings they accompany. Licence details were recorded from each Commons file page when the template was assembled.</p>
          <ul className="credits">
            {photoCredits.map((c) => (
              <li key={c.file}>
                <img src={img(c.file as Parameters<typeof img>[0]).small} alt="" loading="lazy" width="96" height="72" />
                <div>
                  <p className="credits__title">{c.title}</p>
                  <p>By {c.author}</p>
                  <p>
                    {c.licenseUrl ? <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">{c.license}<span className="sr-only"> (opens in a new tab)</span></a> : c.license}
                    {' · '}
                    <a href={c.source} target="_blank" rel="noopener noreferrer">Source<span className="sr-only"> of {c.title} (opens in a new tab)</span></a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
