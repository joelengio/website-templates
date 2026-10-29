import { useState } from 'react';
import { Link } from 'react-router-dom';
import { navigation } from '../config/layout';
import { site } from '../config/site';
import Button from './Button';
import Icon from './Icon';
import Logo from './Logo';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) setState('done');
    else setState('error');
  };
  return (
    <form onSubmit={submit} className="newsletter" noValidate aria-label="Newsletter demonstration">
      <label htmlFor="nl-email" className="newsletter__label">Journal letters</label>
      <div className="newsletter__row">
        <input id="nl-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} aria-invalid={state === 'error'} aria-describedby="nl-msg" onChange={(e) => { setEmail(e.target.value); setState('idle'); }} />
        <Button type="submit" variant="light">Subscribe</Button>
      </div>
      <p id="nl-msg" className="newsletter__msg" role="status">
        {state === 'error' && 'Please enter a valid email address.'}
        {state === 'done' && 'Demonstration only — nothing was subscribed or stored.'}
      </p>
    </form>
  );
}

export default function Footer() {
  const { contact, footer, social, publisher } = site;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo inverted />
          <p>{footer.blurb}</p>
          <address>
            {contact.address.map((l) => <span key={l}>{l}</span>)}
            <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}><Icon name="phone" size={16} /> {contact.phone}</a>
            <a href={`mailto:${contact.email}`}><Icon name="mail" size={16} /> {contact.email}</a>
          </address>
        </div>
        {navigation.footerColumns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="footer-title">{c.title}</h2>
            <ul>{c.links.map((l) => <li key={l.label}><Link to={l.to}>{l.label}</Link></li>)}</ul>
          </nav>
        ))}
        <div>
          <h2 className="footer-title">Stay in touch</h2>
          {footer.newsletter && <Newsletter />}
          <ul className="social">{social.map((s) => <li key={s.label}><a href={s.url} rel="noopener noreferrer" target="_blank">{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>
        </div>
      </div>
      <div className="container footer-legal">
        <p>{footer.legal}</p>
        <p className="footer-demo">{site.demoNotice}</p>
        {footer.showPublisherCredit && <p>Template by <a href={publisher.url} rel="noopener noreferrer" target="_blank">{publisher.name}</a> · {publisher.templateName}</p>}
      </div>
    </footer>
  );
}
