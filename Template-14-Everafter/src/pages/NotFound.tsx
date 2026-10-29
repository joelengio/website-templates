import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Button, Ornament } from '../components/ui';
import { site } from '../config';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you are looking for could not be found." noindex />
      <section className="section notfound">
        <div className="container container--narrow center">
          <Ornament />
          <p className="eyebrow">Error 404</p>
          <h1 className="h-display">This page has wandered off</h1>
          <p className="lead">The page you were looking for does not exist, or has moved. Let us help you find your way back.</p>
          <div className="notfound__actions">
            <Button to="/">Return home</Button>
            <Button to="/weddings" variant="outline">View weddings</Button>
            <Button to="/contact" variant="outline">Contact us</Button>
          </div>
          <ul className="link-inline" aria-label="Popular pages">
            {site.nav.slice(0, 5).map((n) => (<li key={n.to}><Link to={n.to}>{n.label}</Link></li>))}
          </ul>
        </div>
      </section>
    </>
  );
}
