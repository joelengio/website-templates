import { LinkButton } from '../components/Button';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/Section';

export default function NotFound() {
  useSeo({ title: 'Page not found' });
  return (
    <PageHero eyebrow="404" title="We couldn’t find that page." lead="The page may have moved, or the link may be mistyped.">
      <div className="hero__ctas">
        <LinkButton to="/" variant="primary">
          Back to home
        </LinkButton>
        <LinkButton to="/properties" variant="ghost">
          Browse properties
        </LinkButton>
      </div>
    </PageHero>
  );
}
