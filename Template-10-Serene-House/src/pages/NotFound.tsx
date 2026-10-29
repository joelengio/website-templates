import { site } from '../config/site';
import { Seo } from '../components/Seo';
import { LinkButton } from '../components/ui';

export default function NotFound({ what }: { what?: string }) {
  return (
    <>
      <Seo title={site.pages.notFound.title} description={site.pages.notFound.description} noindex />
      <section className="page-hero not-found">
        <div className="container narrow">
          <p className="eyebrow">404</p>
          <h1 className="h-display">{what ? `We couldn’t find that ${what}` : 'This page has wandered off'}</h1>
          <p className="lead">The link may be out of date, or the page may have moved. Let’s get you back to somewhere calm.</p>
          <div className="btn-row">
            <LinkButton to="/">Back to home</LinkButton>
            <LinkButton to="/treatments" variant="outline" arrow={false}>Browse treatments</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
