import { useId, useState } from 'react';
import type { Faq } from '../config/types';
import { Icon } from './Icon';

/** FAQ accordion built from real buttons (keyboard accessible, aria-expanded). One item open at a time. */
export function Accordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();
  return (
    <div className="accordion">
      {items.map((it, i) => {
        const isOpen = open === i;
        const id = `${uid}-${i}`;
        return (
          <div className={`accordion__item${isOpen ? ' is-open' : ''}`} key={it.q}>
            <h3 className="accordion__heading">
              <button type="button" id={`${id}-b`} aria-expanded={isOpen} aria-controls={`${id}-p`} onClick={() => setOpen(isOpen ? null : i)}>
                <span>{it.q}</span>
                <Icon name={isOpen ? 'minus' : 'plus'} size={18} />
              </button>
            </h3>
            <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} hidden={!isOpen} className="accordion__panel">
              <p>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
