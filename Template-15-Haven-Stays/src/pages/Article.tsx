import { useParams } from 'react-router-dom';
import { ArticleCard } from '../components/Cards';
import { LinkButton } from '../components/Button';
import Img from '../components/Img';
import Section, { Breadcrumb } from '../components/Section';
import { articles } from '../config/content';
import { useSeo } from '../hooks/useSeo';
import { formatDate } from '../lib/dates';
import NotFound from './NotFound';

export default function Article() {
  const { slug } = useParams();
  const a = articles.find((x) => x.slug === slug);
  useSeo({ title: a?.title ?? 'Not found', description: a?.excerpt ?? '', path: `/journal/${slug}`, image: a?.image.src, noindex: !a });
  if (!a) return <NotFound />;
  return (
    <Section tone="cream">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Journal', to: '/journal' }, { label: a.title }]} />
      <article className="article">
        <p className="kicker">{a.category} · {formatDate(a.date, { day: 'numeric', month: 'long', year: 'numeric' })} · {a.readMinutes} min read</p>
        <h1 className="display">{a.title}</h1>
        <p className="lead">{a.excerpt}</p>
        <Img src={a.image.src} alt={a.image.alt} priority ratio={[16, 9]} />
        {a.body.map((p) => <p key={p}>{p}</p>)}
        <p className="note">This is fictional demonstration content for the Haven Stays template.</p>
        <LinkButton to="/booking" arrow>Plan your stay</LinkButton>
      </article>
      <h2 className="display display--sm">Keep reading</h2>
      <div className="grid grid--3">{articles.filter((x) => x.slug !== a.slug).slice(0, 3).map((x) => <ArticleCard key={x.slug} a={x} />)}</div>
    </Section>
  );
}
