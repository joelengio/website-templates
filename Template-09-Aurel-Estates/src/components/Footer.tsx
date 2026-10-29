import { Link } from 'react-router-dom';
import { footer } from '../config/navigation';
import { pages } from '../config/layout';
import { site } from '../config/site';
import { Logo } from './Logo';

export function Footer() {
  const { contact, owner, demo } = site;
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo inverse />
          <p>{footer.blurb}</p>
          <address>
            {contact.addressLines.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`tel:${contact.phoneHref}`}>{contact.phone}</a>
            <span>{contact.hours}</span>
          </address>
        </div>
        {footer.columns.map((col) => {
          const links = col.links.filter((l) => !l.page || pages[l.page]);
          if (!links.length) return null;
          return (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="site-footer__title">{col.title}</h2>
              <ul>
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
        {site.social.length > 0 && (
          <nav aria-label="Social">
            <h2 className="site-footer__title">Follow</h2>
            <ul>
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="container site-footer__legal">
        <p className="site-footer__disclaimer">{demo.footerDisclaimer}</p>
        <div className="site-footer__bottom">
          <span>
            © {new Date().getFullYear()} {site.brand.name} (fictional demo brand)
          </span>
          {footer.legalLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
          {owner.showCredit && (
            <span className="site-footer__credit">
              Website template by{' '}
              {owner.url ? (
                <a href={owner.url} rel="noopener noreferrer" target="_blank">
                  {owner.name}
                </a>
              ) : (
                <strong>{owner.name}</strong>
              )}
              <span className="sr-only"> — {owner.product}</span>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
