import { properties } from '../config/properties';
import { useShortlist } from '../hooks/useShortlist';
import { useSeo } from '../hooks/useSeo';
import { LinkButton } from '../components/Button';
import { PropertyCard } from '../components/PropertyCard';
import { PageHero } from '../components/Section';

export default function Favorites() {
  const { favorites } = useShortlist();
  useSeo({ title: 'Saved homes', description: 'Your saved homes, stored in this browser.', path: '/favorites', noindex: true });
  const list = favorites.map((id) => properties.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <>
      <PageHero title="Saved homes" lead="Saved homes are stored only in this browser (local storage) — they are never sent to a server." />
      <section className="section section--flush">
        <div className="container">
          {list.length ? (
            <div className="card-grid">
              {list.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2 className="h3">No saved homes yet</h2>
              <p>Tap the heart on any property to save it here.</p>
              <LinkButton to="/properties">Browse properties</LinkButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
