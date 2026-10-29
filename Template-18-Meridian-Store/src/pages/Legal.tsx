import { useParams } from 'react-router-dom';
import { legalPages } from '../config/legal';
import { Seo } from '../components/Seo';
import { Breadcrumbs, PageHeader } from '../components/ui';
import { ResetDemoButton } from './Orders';
import NotFound from './NotFound';

export default function Legal() {
  const { slug } = useParams();
  const page = legalPages.find((p) => p.slug === slug);
  if (!page) return <NotFound />;
  return (
    <>
      <Seo title={page.title} description={page.intro} path={`/legal/${page.slug}`} />
      <PageHeader eyebrow="Legal" title={page.title} text={page.intro}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: page.title }]} />
      </PageHeader>
      <div className="container narrow prose section-tight">
        <p className="muted">Last updated {page.updated}. Placeholder text for a demonstration — not legal advice.</p>
        {page.sections.map((s) => <section key={s.heading}><h2 className="h3">{s.heading}</h2>{s.paragraphs.map((p) => <p key={p}>{p}</p>)}</section>)}
        {page.slug === 'privacy' && <div className="order-tools"><ResetDemoButton className="btn" /></div>}
      </div>
    </>
  );
}
