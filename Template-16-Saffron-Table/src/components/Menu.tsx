import { allergyWarning } from '../config/menu';
import type { MenuItem } from '../config/types';
import { allergenLabelFor, dietaryLabelFor } from '../lib/menu';
import { formatMoney } from '../lib/format';
import { Icon } from './Icon';
import { Img } from './Img';
import { Button } from './Button';
import { features } from '../config/features';
import { orderStore } from '../lib/orderStore';

export function DietaryBadges({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null;
  return (
    <ul className="badges" aria-label="Dietary indicators">
      {ids.map((id) => {
        const l = dietaryLabelFor(id);
        return (
          <li key={id} className="badge" title={l?.description}>
            <abbr title={l?.label} className="badge__short" aria-hidden="true">{l?.short ?? id}</abbr>
            <span>{l?.label ?? id}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function AllergyNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`allergy${compact ? ' allergy--compact' : ''}`} aria-label={allergyWarning.title}>
      <Icon name="warning" size={22} />
      <div>
        <h2 className="allergy__title">{allergyWarning.title}</h2>
        <p>{allergyWarning.text}</p>
      </div>
    </aside>
  );
}

export function MenuItemCard({ item, showAdd = features.orderBuilder }: { item: MenuItem; showAdd?: boolean }) {
  const allergens = item.allergens.map(allergenLabelFor);
  return (
    <article className={`dish${item.available ? '' : ' is-unavailable'}${item.image ? ' has-image' : ''}`} aria-labelledby={`dish-${item.id}`}>
      {item.image && (
        <div className="dish__image">
          <Img name={item.image} sizes="(min-width: 700px) 160px, 96px" />
        </div>
      )}
      <div className="dish__body">
        <div className="dish__top">
          <h3 id={`dish-${item.id}`} className="dish__name">
            {item.name}
            {item.spicy && <span className="dish__spicy" title="Spicy"> <Icon name="flame" size={15} label="Spicy" /></span>}
          </h3>
          <span className="dish__leader" aria-hidden="true" />
          <p className="dish__price">
            <span className="visually-hidden">Price: </span>
            {formatMoney(item.price)}
            {item.priceNote && <small> {item.priceNote}</small>}
          </p>
        </div>
        <p className="dish__desc">{item.description}</p>
        {item.courses && (
          <details className="dish__courses">
            <summary>{item.courses.length} courses</summary>
            <ol>
              {item.courses.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            {item.pairing && <p className="dish__pairing">{item.pairing.label}: +{formatMoney(item.pairing.price)} per person</p>}
          </details>
        )}
        <DietaryBadges ids={item.dietary} />
        <p className="dish__allergens">
          {allergens.length ? <>Contains: {allergens.join(', ')}</> : <>No allergens listed. Please confirm with the restaurant.</>}
        </p>
        <div className="dish__foot">
          {!item.available && <span className="tag tag--off">Unavailable{item.availabilityNote ? ` · ${item.availabilityNote}` : ''}</span>}
          {item.available && item.availabilityNote && <span className="tag">{item.availabilityNote}</span>}
          {showAdd && (
            <Button variant="ghost" size="sm" icon="plus" disabled={!item.available} onClick={() => orderStore.add(item.id)}>
              Add to demo order<span className="visually-hidden">: {item.name}</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
