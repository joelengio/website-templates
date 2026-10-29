import { LinkButton } from '../components/Button';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'The page you were looking for could not be found.', noindex: true });
  return (
    <section className="not-found">
      <div className="container">
        <p className="eyebrow">Error 404</p>
        <h1>This page could not be found.</h1>
        <p>The link may be broken, or the page may have moved. Try one of these instead.</p>
        <div className="not-found__actions">
          <LinkButton to="/" variant="primary" arrow>Back to home</LinkButton>
          <LinkButton to="/services" variant="secondary">Browse services</LinkButton>
          <LinkButton to="/contact" variant="ghost">Contact us</LinkButton>
        </div>
      </div>
    </section>
  );
}
