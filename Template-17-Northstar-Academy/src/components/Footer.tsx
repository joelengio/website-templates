import { Link } from 'react-router-dom';
import { footerColumns } from '../config/navigation';
import { pages } from '../config/layout';
import { site } from '../config/site';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo light />
          <p>{site.tagline} Short courses, honest quizzes and a learning dashboard that remembers your place.</p>
          <ul className="social" aria-label="Social links">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer noopener">
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="site-footer__title">{col.title}</h2>
            <ul>
              {col.links
                .filter((l) => pages[l.page])
                .map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className="site-footer__title">Contact</h2>
          <address>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            <br />
            {site.contact.phone}
            <br />
            <span className="muted-light">{site.contact.hours}</span>
          </address>
        </div>
      </div>
      <div className="container site-footer__legal">
        <p className="site-footer__disclosure">{site.disclosure}</p>
        <p>
          © {year} {site.name} (demonstration brand).
          {site.owner.showCredit && (
            <>
              {' '}
              <a href={site.owner.url} target="_blank" rel="noreferrer noopener" className="owner-credit">
                {site.owner.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
