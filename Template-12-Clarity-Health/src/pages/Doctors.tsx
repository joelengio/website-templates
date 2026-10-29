import { useSearchParams } from 'react-router-dom';
import { booking } from '../config/booking';
import { doctors } from '../config/doctors';
import { specialties } from '../config/specialties';
import { DoctorCard } from '../components/Cards';
import { Seo } from '../components/Seo';
import { Button, EmptyState, Notice, PageHero } from '../components/ui';
import { site } from '../config/site';
import { matchesQuery } from '../lib/search';
import { specialtyById } from '../lib/catalog';

const DAYS = [
  { v: '1', l: 'Monday' }, { v: '2', l: 'Tuesday' }, { v: '3', l: 'Wednesday' }, { v: '4', l: 'Thursday' },
  { v: '5', l: 'Friday' }, { v: '6', l: 'Saturday' }
];
const languages = [...new Set(doctors.flatMap((d) => d.languages))].sort();

export default function Doctors() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const specialty = params.get('specialty') ?? 'all';
  const language = params.get('language') ?? 'all';
  const day = params.get('day') ?? 'all';
  const newOnly = params.get('new') === '1';
  const video = params.get('video') === '1';

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = doctors.filter(
    (d) =>
      (specialty === 'all' || d.specialtyId === specialty) &&
      (language === 'all' || d.languages.includes(language)) &&
      (day === 'all' || d.workingDays.includes(Number(day))) &&
      (!newOnly || d.acceptingNewPatients) &&
      (!video || d.modes.includes('video')) &&
      matchesQuery(q, d.name, d.title, specialtyById(d.specialtyId)?.name, d.languages, d.interests, d.summary)
  );
  const filtered = q !== '' || specialty !== 'all' || language !== 'all' || day !== 'all' || newOnly || video;
  const clear = () => setParams({}, { replace: true });

  return (
    <>
      <Seo title="Doctors" description="Meet the fictional demonstration clinicians of CLARITY HEALTH. Filter by specialty, language and availability and start a demo booking." />
      <PageHero eyebrow="Our clinicians" title="Meet the team (fictional)" lead="Ten invented clinicians across eight specialties. Search, then filter by specialty, language and availability.">
        <Notice title="Fictional profiles">{site.notices.doctor}</Notice>
      </PageHero>
      <section className="section-tight">
        <div className="container">
          <form className="filter-bar" role="search" aria-label="Search and filter doctors" onSubmit={(e) => e.preventDefault()}>
            <div className="filter-field grow">
              <label htmlFor="doc-q">Search doctors</label>
              <input id="doc-q" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Name, specialty or interest" autoComplete="off" />
            </div>
            <div className="filter-field">
              <label htmlFor="doc-spec">Specialty</label>
              <select id="doc-spec" value={specialty} onChange={(e) => set('specialty', e.target.value)}>
                <option value="all">All specialties</option>
                {specialties.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="filter-field">
              <label htmlFor="doc-lang">Language</label>
              <select id="doc-lang" value={language} onChange={(e) => set('language', e.target.value)}>
                <option value="all">Any language</option>
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="filter-field">
              <label htmlFor="doc-day">Available on</label>
              <select id="doc-day" value={day} onChange={(e) => set('day', e.target.value)}>
                <option value="all">Any day</option>
                {DAYS.map((d) => <option key={d.v} value={d.v}>{d.l}</option>)}
              </select>
            </div>
            <fieldset className="filter-checks">
              <legend>Availability</legend>
              <label className="check"><input type="checkbox" checked={newOnly} onChange={(e) => set('new', e.target.checked ? '1' : '')} /> Accepting new patients</label>
              {booking.modeLabels.video && <label className="check"><input type="checkbox" checked={video} onChange={(e) => set('video', e.target.checked ? '1' : '')} /> Offers video consultations</label>}
            </fieldset>
            {filtered && <Button variant="ghost" onClick={clear}>Clear filters</Button>}
          </form>
          <p className="result-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'doctor' : 'doctors'} shown</p>
          {results.length ? (
            <div className="grid grid-4">{results.map((d) => <DoctorCard key={d.id} d={d} />)}</div>
          ) : (
            <EmptyState title="No doctors match these filters" action={<Button variant="secondary" onClick={clear}>Clear all filters</Button>}>
              Try removing a filter, or search by a different name or specialty.
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
