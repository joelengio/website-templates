import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { LinkButton } from '../components/ui';
import { navigation } from '../config/navigation';

export default function NotFound({ what }: { what?: string }) {
  return (
    <section className="section not-found">
      <Seo title="Page not found" noindex />
      <div className="container narrow">
        <p className="eyebrow">Error 404</p>
        <h1 className="h-mega">{what ? `That ${what} isn’t here.` : 'Off the programme.'}</h1>
        <p className="lead">{what ? `We couldn’t find that ${what}. It may have been renamed or removed.` : 'The page you were looking for does not exist or has moved.'} Try one of these instead:</p>
        <ul className="link-list link-list--inline">
          {navigation.slice(0, 5).map((n) => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}
        </ul>
        <LinkButton to="/">Back to home</LinkButton>
      </div>
    </section>
  );
}
