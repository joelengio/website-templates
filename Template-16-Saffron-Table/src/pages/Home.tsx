import { homeSectionComponents } from '../components/HomeSections';
import { homeSections } from '../config/home';
import { useSeo } from '../hooks/useSeo';
import { resolveHomeSections } from '../lib/sections';
import { pageSeo, restaurantJsonLd } from '../lib/seo';

const jsonLd = restaurantJsonLd();

export default function Home() {
  useSeo({ ...pageSeo('/'), path: '/', jsonLd });
  const ids = resolveHomeSections(homeSections);
  return (
    <>
      {ids.map((id) => {
        const C = homeSectionComponents[id];
        return <C key={id} />;
      })}
    </>
  );
}
