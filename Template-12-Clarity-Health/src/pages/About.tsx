import { Link } from 'react-router-dom';
import { about } from '../config/about';
import { doctors } from '../config/doctors';
import { facilities } from '../config/facilities';
import { site } from '../config/site';
import { DoctorCard, FacilityCard } from '../components/Cards';
import { Icon, isIconName } from '../components/Icon';
import { Seo } from '../components/Seo';
import { Img, LinkButton, Notice, PageHero, SectionHeader } from '../components/ui';

export default function About() {
  return (
    <>
      <Seo title="About" description="The fictional story, values, mission and patient-care philosophy of CLARITY HEALTH, a demonstration clinic for a website template." />
      <PageHero eyebrow={about.hero.eyebrow} title={about.hero.title} lead={about.hero.lead} image={about.hero.image} />
      <section className="section-tight">
        <div className="container two-col">
          <div>
            <h2>{about.story.title}</h2>
            {about.story.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div className="stack">
            <div className="panel"><h2 className="h3">{about.mission.title}</h2><p>{about.mission.text}</p></div>
            <div className="panel"><h2 className="h3">{about.philosophy.title}</h2><p>{about.philosophy.text}</p>
              <ul className="tag-list">{about.philosophy.points.map((p) => <li key={p}>{p}</li>)}</ul></div>
          </div>
        </div>
      </section>
      <section className="section tint" aria-labelledby="values-title">
        <div className="container">
          <SectionHeader title="Our values" id="values-title" center />
          <ul className="grid grid-4 feature-grid">
            {about.values.map((v) => (
              <li key={v.title} className="feature">
                <span className="chip-icon">{isIconName(v.icon) && <Icon name={v.icon} size={24} />}</span>
                <h3>{v.title}</h3><p>{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section" aria-labelledby="commit-title">
        <div className="container split">
          <div>
            <h2 id="commit-title">{about.commitments.title}</h2>
            <Notice title="No accreditations claimed">{about.commitments.intro}</Notice>
            <ul className="check-list">{about.commitments.items.map((i) => <li key={i}><Icon name="check" size={18} /> {i}</li>)}</ul>
          </div>
          <div className="split-media"><Img name="about-care" className="rounded-img" sizes="(min-width: 900px) 45vw, 90vw" /></div>
        </div>
      </section>
      <section className="section tint" aria-labelledby="team-title">
        <div className="container">
          <SectionHeader title={about.team.title} id="team-title" lead={about.team.text} />
          <div className="grid grid-4">{doctors.slice(0, 4).map((d) => <DoctorCard key={d.id} d={d} />)}</div>
          <div className="section-cta"><LinkButton to="/doctors" variant="secondary">Meet all {doctors.length} fictional clinicians</LinkButton></div>
        </div>
      </section>
      <section className="section" id="facilities" aria-labelledby="fac-title">
        <div className="container">
          <SectionHeader title={about.facilities.title} id="fac-title" lead={about.facilities.text} />
          <div className="grid grid-3">{facilities.map((f) => <FacilityCard key={f.id} f={f} />)}</div>
          <p className="muted small">Locations and hours are on the <Link to="/contact">contact page</Link>. {site.publisher.notice}</p>
        </div>
      </section>
    </>
  );
}
