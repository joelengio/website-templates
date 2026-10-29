import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export default function NotFound() {
  return (
    <section className="section container not-found">
      <Seo title="Page not found" noindex />
      <p className="eyebrow">Error 404</p>
      <h1>We couldn’t find that page</h1>
      <p className="lede">The link may be broken, or the product may have been removed. Try one of these instead.</p>
      <div className="hero-actions">
        <Link to="/shop" className="btn">Shop all products</Link>
        <Link to="/collections" className="btn btn-outline">Browse collections</Link>
        <Link to="/" className="btn btn-outline">Back to home</Link>
      </div>
    </section>
  );
}
