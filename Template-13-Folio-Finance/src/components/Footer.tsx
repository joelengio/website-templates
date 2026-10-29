import { Link } from 'react-router-dom';
import { footerNav, site } from '../config/site';
import { pages } from '../config/layout';
import { Icon } from './Icon';
import { Logo } from './Logo';

const hidden = new Set<string>(
  Object.entries({ '/services': pages.services, '/industries': pages.industries, '/pricing': pages.pricing, '/tools': pages.tools, '/about': pages.about, '/team': pages.team, '/insights': pages.insights, '/contact': pages.contact, '/book': pages.booking, '/disclaimer': pages.disclaimer })
    .filter(([, on]) => !on)
    .map(([to]) => to),
);

export function Footer() {
  const { contact, offices, hours, legal, owner } = site;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Logo inverse />
            <p>{site.brand.tagline}</p>
            <p className="site-footer__demo">{legal.demoNotice}</p>
            <ul className="social" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`}>
                    <Icon name={s.icon} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {footerNav.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="site-footer__heading">{col.heading}</h2>
              <ul>
                {col.links.filter((l) => !hidden.has(l.to)).map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="site-footer__heading">Contact</h2>
            <ul className="site-footer__contact">
              <li>
                <Icon name="mail" size={16} /> <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <Icon name="phone" size={16} /> <a href={`tel:${contact.phoneHref}`}>{contact.phone}</a>
              </li>
              <li>
                <Icon name="pin" size={16} /> <span>{offices[0]?.address.slice(0, 2).join(', ')}</span>
              </li>
              <li>
                <Icon name="clock" size={16} /> <span>{hours[0]?.label} {hours[0]?.open}–{hours[0]?.close}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__legal">
          <p>{legal.generalDisclaimer}</p>
          <p>{legal.regulatoryNote}</p>
        </div>
        <div className="site-footer__bottom">
          <p>
            © {new Date().getFullYear()} {site.brand.name}. {legal.copyright}
          </p>
          {owner.showCredit && (
            <p className="site-footer__credit">
              Website template by <strong>{owner.name}</strong> · {owner.templateName}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
