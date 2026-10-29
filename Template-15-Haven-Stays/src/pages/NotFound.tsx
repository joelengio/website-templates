import { LinkButton } from '../components/Button';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'The page you were looking for could not be found.', path: '/404', noindex: true });
  return (
    <section className="section section--cream notfound">
      <div className="container narrow">
        <p className="kicker">Error 404</p>
        <h1 className="display">This page has wandered off</h1>
        <p className="lead">The page you are looking for does not exist or may have moved. Let us help you find your way back.</p>
        <div className="form__actions">
          <LinkButton to="/" arrow>Back to home</LinkButton>
          <LinkButton to="/rooms" variant="secondary">Browse rooms</LinkButton>
          <LinkButton to="/contact" variant="text">Contact us</LinkButton>
        </div>
      </div>
    </section>
  );
}
