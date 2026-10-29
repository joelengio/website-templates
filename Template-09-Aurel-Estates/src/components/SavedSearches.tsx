import { useEffect, useRef, useState, type FormEvent } from 'react';
import { activeFilterCount, type Filters } from '../lib/filters';
import { describeFilters, filtersFromSaved, MAX_SAVED_SEARCHES, readSavedSearches, searchQuery, writeSavedSearches, type SavedSearch } from '../lib/savedSearches';
import { Button } from './Button';
import { Icon } from './Icon';

interface Props {
  filters: Filters;
  onApply: (next: Filters) => void;
}

/** Save the current filter combination in this browser and re-apply it later. No account or alerts: it is local only. */
export function SavedSearches({ filters, onApply }: Props) {
  const [saved, setSaved] = useState<SavedSearch[]>(() => readSavedSearches());
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const wasNaming = useRef(false);
  const count = activeFilterCount(filters);

  // Move focus into the name field when it opens and back to the Save button when it closes.
  useEffect(() => {
    if (naming) nameRef.current?.select();
    else if (wasNaming.current) saveRef.current?.focus();
    wasNaming.current = naming;
  }, [naming]);
  const query = searchQuery(filters);

  const persist = (next: SavedSearch[]) => {
    setSaved(next);
    writeSavedSearches(next);
  };

  const startSaving = () => {
    const existing = saved.find((s) => s.query === query);
    if (existing) return setMessage(`This search is already saved as “${existing.name}”.`);
    if (saved.length >= MAX_SAVED_SEARCHES) return setMessage(`You can keep up to ${MAX_SAVED_SEARCHES} saved searches. Remove one to save another.`);
    setName(describeFilters(filters));
    setMessage('');
    setNaming(true);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setMessage('Please give this search a name.');
    persist([{ id: `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name: trimmed.slice(0, 60), query, savedAt: new Date().toISOString() }, ...saved]);
    setNaming(false);
    setMessage(`Saved “${trimmed.slice(0, 60)}”.`);
  };

  const remove = (s: SavedSearch) => {
    persist(saved.filter((x) => x.id !== s.id));
    setMessage(`Removed “${s.name}”.`);
  };

  return (
    <section className="saved-searches" aria-labelledby="saved-searches-title">
      <div className="saved-searches__bar">
        <h2 id="saved-searches-title" className="saved-searches__title">Saved searches{saved.length ? ` (${saved.length})` : ''}</h2>
        {!naming && (
          <Button ref={saveRef} variant="ghost" className="btn--sm" onClick={startSaving} disabled={count === 0}>
            <Icon name="filter" size={16} /> Save this search
          </Button>
        )}
        {count === 0 && !naming && <span className="saved-searches__hint">Choose at least one filter to save it.</span>}
      </div>

      {naming && (
        <form className="saved-searches__form" onSubmit={submit}>
          <label htmlFor="saved-search-name" className="sr-only">Name for this search</label>
          <input id="saved-search-name" type="text" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} ref={nameRef} />
          <Button type="submit" className="btn--sm">Save</Button>
          <Button variant="ghost" className="btn--sm" onClick={() => setNaming(false)}>Cancel</Button>
        </form>
      )}

      {saved.length > 0 && (
        <ul className="saved-searches__list">
          {saved.map((s) => (
            <li key={s.id}>
              <button type="button" className="chip" onClick={() => { onApply(filtersFromSaved(s)); setMessage(`Applied “${s.name}”.`); }}>
                {s.name}
              </button>
              <button type="button" className="chip chip--removable saved-searches__remove" onClick={() => remove(s)} aria-label={`Delete saved search: ${s.name}`}>
                <Icon name="close" size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="saved-searches__note" role="status" aria-live="polite">
        {message}
      </p>
      {saved.length > 0 && <p className="saved-searches__hint">Stored in this browser only. No email alerts are sent in this template.</p>}
    </section>
  );
}
