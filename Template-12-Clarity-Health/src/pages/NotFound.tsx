import { Seo } from '../components/Seo';
import { LinkButton } from '../components/ui';

export default function NotFound({ what }: { what?: string }) {
  return (
    <section className="section notfound">
      <Seo title="Page not found" description="The page you are looking for does not exist." noindex />
      <div className="container narrow">
        <p className="eyebrow">Error 404</p>
        <h1>{what ? `We couldn’t find that ${what}` : 'We couldn’t find that page'}</h1>
        <p className="lead">The link may be out of date, or the {what ?? 'page'} may have been removed from this demonstration. Try one of these instead.</p>
        <div className="btn-row">
          <LinkButton to="/">Back to home</LinkButton>
          <LinkButton to="/specialties" variant="secondary">Specialties</LinkButton>
          <LinkButton to="/doctors" variant="secondary">Doctors</LinkButton>
          <LinkButton to="/services" variant="secondary">Services</LinkButton>
        </div>
      </div>
    </section>
  );
}
