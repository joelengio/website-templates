import { Seo } from '../components/Seo';
import { PageHero } from '../components/ui';
import { bookingSettings } from '../config/booking';
import { site } from '../config/site';

export default function DemoNoticePage() {
  return (
    <>
      <Seo title="Demo notice" description={`What is fictional or demonstration-only in the ${site.brand.name} template.`} />
      <PageHero eyebrow="Please read" title="Demo notice" intro={site.legal.demoDisclaimer} />
      <section className="section section--tight">
        <div className="container prose">
          <h2>What is a demonstration</h2>
          <ul>
            <li><b>Class booking:</b> {bookingSettings.demoExplainer}</li>
            <li><b>Membership signup:</b> validates your details but never charges a card, creates an account or activates a membership.</li>
            <li><b>Contact forms:</b> {site.forms.endpoint ? 'are sent to the configured form endpoint.' : 'validate your message but do not send it anywhere (no backend is configured).'}</li>
            <li><b>Business details:</b> the address, phone number, email address, trainers, qualifications, testimonials and prices are fictional.</li>
            <li><b>Images:</b> licensed stock photographs (Unsplash License) used for demonstration only — they do not show a real {site.brand.name} venue, and some show people who are not {site.brand.name} members or trainers. Trainer cards are monogram placeholders.</li>
          </ul>
          <h2>Health information</h2>
          <p>{site.legal.healthDisclaimer}</p>
          <h2>Template credit</h2>
          <p>{site.template.productName} is a website template by {site.template.ownerName}. {site.brand.name} is a fictional business and is not affiliated with the template owner.</p>
        </div>
      </section>
    </>
  );
}
