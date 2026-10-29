import { useState } from 'react';
import Icon from './Icon';

export default function Accordion({ items, idPrefix = 'faq' }: { items: { q: string; a: string }[]; idPrefix?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="accordion">
      {items.map((it, i) => (
        <div key={it.q} className="accordion__item">
          <h3>
            <button type="button" id={`${idPrefix}-h-${i}`} aria-expanded={open === i} aria-controls={`${idPrefix}-p-${i}`} onClick={() => setOpen(open === i ? null : i)}>
              {it.q}
              <Icon name={open === i ? 'minus' : 'plus'} size={18} />
            </button>
          </h3>
          <div id={`${idPrefix}-p-${i}`} role="region" aria-labelledby={`${idPrefix}-h-${i}`} hidden={open !== i}>
            <p>{it.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
