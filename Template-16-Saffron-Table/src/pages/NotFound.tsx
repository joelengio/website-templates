import { ButtonLink } from '../components/Button';
import { Img } from '../components/Img';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'The page you are looking for could not be found.', path: '/404', noindex: true });
  return (
    <section className="notfound">
      <Img name="dining-dark" className="notfound__img" sizes="100vw" eager />
      <div className="notfound__shade" aria-hidden="true" />
      <div className="container notfound__inner">
        <p className="eyebrow">Error 404</p>
        <h1>This table isn’t set</h1>
        <p>The page you’re looking for has moved or never existed. Let’s get you back to the dining room.</p>
        <div className="hero__actions">
          <ButtonLink to="/" size="lg" icon="arrow">Back to home</ButtonLink>
          <ButtonLink to="/menus" variant="light" size="lg">View menus</ButtonLink>
          <ButtonLink to="/reserve" variant="light" size="lg">Reserve a table</ButtonLink>
        </div>
      </div>
    </section>
  );
}
