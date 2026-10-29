import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/ui';
import { site } from '../config';

export default function DemoNotice() {
  return (
    <>
      <Seo title="Demo Notice" description="What is and is not real on this demonstration wedding planning website template." />
      <PageHero eyebrow="Demo notice" title="This is a demonstration website" lead={`${site.brand.name} is a fictional studio created to showcase a website template.`} />
      <section className="section">
        <div className="container container--narrow prose">
          <h2>What is fictional</h2>
          <ul>
            <li>The studio, team, couples, testimonials, journal articles and prices.</li>
            <li>Every wedding and celebration in the portfolio. Photographs are illustrative stock images of real landscapes and details; they do not depict these events.</li>
            <li>The destinations and venue styles. No venue is named, verified or endorsed, and nothing here is a statement about a real business.</li>
            <li>The office address, phone number and email address.</li>
          </ul>
          <h2>What does not happen</h2>
          <ul>
            <li>The enquiry questionnaire, package enquiry, contact form and newsletter form are <strong>not sent anywhere</strong>. There is no backend.</li>
            <li>No booking, reservation, quote or appointment is created, and no planner will contact you.</li>
            <li>Nothing you type is transmitted. If you choose to save a questionnaire draft, it is stored only in your own browser and can be deleted at any time.</li>
          </ul>
          <h2>Using the template</h2>
          <p>Business owners can replace all content and connect forms to a backend. See <code>CUSTOMIZATION_GUIDE.md</code> in the project for exact steps.</p>
          <p><Link to="/plan" className="link-arrow">Try the questionnaire</Link> · <Link to="/contact" className="link-arrow">Visit contact</Link></p>
          {site.publisher.show && <p className="fineprint">{site.publisher.note} {site.publisher.templateName}.</p>}
        </div>
      </section>
    </>
  );
}
