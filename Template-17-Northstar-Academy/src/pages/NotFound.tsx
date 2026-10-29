import { LinkButton } from '../components/Button';
import { useSeo } from '../hooks/useSeo';
import { Section } from '../components/ui';

export default function NotFound() {
  useSeo({ title: 'Page not found', noindex: true });
  return (
    <Section>
      <div className="notfound">
        <p className="eyebrow">Error 404</p>
        <h1 data-page-heading tabIndex={-1}>This page took a different path</h1>
        <p className="section-intro">We could not find what you were looking for. Try the course catalogue or return home.</p>
        <div className="hero__actions">
          <LinkButton to="/courses" arrow>Browse courses</LinkButton>
          <LinkButton to="/" variant="ghost">Go home</LinkButton>
        </div>
      </div>
    </Section>
  );
}
