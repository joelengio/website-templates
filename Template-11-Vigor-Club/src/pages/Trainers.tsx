import { Seo } from '../components/Seo';
import { PageHero, Reveal } from '../components/ui';
import { TrainerCard } from '../components/Cards';
import { credentialNote, trainers } from '../config/trainers';
import { ctas } from '../config/navigation';
import { LinkButton } from '../components/ui';

export default function Trainers() {
  return (
    <>
      <Seo title="Trainers" description="Meet six fictional VIGOR CLUB coaches: strength, boxing, mobility, performance, functional and personal training specialists." />
      <PageHero eyebrow="Coaches" title={<>The people <span className="accent">behind</span> the work.</>} intro="Six coaches with different specialities and one shared standard of coaching.">
        <p className="note note--inline">{credentialNote}</p>
      </PageHero>
      <section className="section section--tight">
        <div className="container">
          <div className="grid grid--trainers">
            {trainers.map((t) => <Reveal key={t.slug}><TrainerCard trainer={t} /></Reveal>)}
          </div>
          <div className="center-cta">
            <p className="lead">Not sure who to train with? Tell us your goals and we will suggest a coach.</p>
            <LinkButton to={ctas.trainerInquiry.to}>{ctas.trainerInquiry.label}</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
