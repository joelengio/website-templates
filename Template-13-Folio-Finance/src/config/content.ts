import type { Cta, Testimonial } from './types';

/** Home page and shared marketing copy. Section order/visibility lives in layout.ts. */
export const home = {
  seo: {
    title: 'Considered financial advisory & accounting',
    description:
      'Folio Finance (fictional) demonstrates a premium advisory, accounting and planning website template with services, pricing plans, calculators, insights and demo booking.',
  },
  hero: {
    eyebrow: 'Advisory · Accounting · Planning',
    title: 'Money decisions, made with composure.',
    lead:
      'Folio Finance is a fictional advisory firm that shows how a premium professional-services website can look and work — from planning tools to a demo consultation booking.',
    primary: { label: 'Book a demo consultation', to: '/book' } as Cta,
    secondary: { label: 'Try the planning tools', to: '/tools' } as Cta,
    image: 'hero',
    panel: {
      label: 'Inside this template',
      items: [
        { value: '8', caption: 'service disciplines' },
        { value: '3', caption: 'working calculators' },
        { value: '7', caption: 'client segments' },
      ],
    },
  },
  stats: {
    label: 'Demonstration data — not real firm performance',
    items: [
      { value: '320+', label: 'Illustrative client relationships' },
      { value: '14 yrs', label: 'Fictional years in practice' },
      { value: '92%', label: 'Demo client retention' },
      { value: '6', label: 'Fictional advisers' },
    ],
  },
  services: {
    eyebrow: 'What we do',
    title: 'Eight disciplines. One considered approach.',
    lead: 'From a household’s first plan to a company’s transaction, each service follows the same pattern: listen, model, recommend and review.',
    featured: ['financial-planning', 'business-advisory', 'accounting-bookkeeping', 'tax-planning', 'wealth-planning', 'cash-flow-advisory', 'corporate-finance', 'startup-advisory'],
  },
  about: {
    eyebrow: 'The firm',
    title: 'Independent thinking, plainly explained.',
    paragraphs: [
      'Folio Finance is an invented firm created for this template. It is built around three habits: ask better questions, show the arithmetic and write advice down in language a client can pass to a colleague or a spouse.',
      'We keep teams small, communication regular and recommendations proportional to what you actually need.',
    ],
    image: 'office',
    cta: { label: 'About the firm', to: '/about' } as Cta,
    bullets: ['Fee transparency over product commissions', 'Written plans, reviewed regularly', 'Specialists who work with your other advisers'],
  },
  advisory: {
    eyebrow: 'Key advisory areas',
    title: 'Where clients ask for our help most.',
    areas: [
      { icon: 'compass', title: 'Planning', text: 'Clarify goals, map cash flow and build a plan that adapts.' },
      { icon: 'chart', title: 'Performance', text: 'Understand margins, pricing and what drives profit.' },
      { icon: 'shield', title: 'Resilience', text: 'Prepare for uneven income, shocks and seasonality.' },
      { icon: 'target', title: 'Growth', text: 'Fund, structure and time the next step with confidence.' },
    ] as { icon: 'compass' | 'chart' | 'shield' | 'target'; title: string; text: string }[],
  },
  segments: {
    eyebrow: 'Who we serve',
    title: 'Built around how you operate.',
    lead: 'Different clients ask different questions. Explore the segments we support most often.',
  },
  why: {
    eyebrow: 'Why choose us',
    title: 'Reasons clients stay.',
    reasons: [
      { icon: 'book', title: 'Plain-language advice', text: 'We explain assumptions, not just conclusions, so you can challenge them.' },
      { icon: 'users', title: 'One accountable adviser', text: 'A named lead coordinates specialists so you do not repeat yourself.' },
      { icon: 'calc', title: 'Show-your-working numbers', text: 'Models use explicit, adjustable assumptions rather than black boxes.' },
      { icon: 'shield', title: 'Careful with claims', text: 'We never promise returns and we say plainly what we do not know.' },
    ] as { icon: 'book' | 'users' | 'calc' | 'shield'; title: string; text: string }[],
  },
  process: {
    eyebrow: 'Financial planning process',
    title: 'From first conversation to ongoing review.',
    steps: [
      { title: 'Listen', text: 'A complimentary first conversation (demo) to understand your situation, priorities and constraints.' },
      { title: 'Map', text: 'We organise your numbers into a single baseline: income, spending, assets, liabilities and commitments.' },
      { title: 'Model', text: 'Scenarios compare options and show trade-offs using assumptions you can see and change.' },
      { title: 'Recommend', text: 'You receive a written plan with prioritised actions, owners and timing.' },
      { title: 'Review', text: 'Scheduled reviews keep the plan alive as life and markets evolve.' },
    ],
  },
  toolPreview: {
    eyebrow: 'Interactive preview',
    title: 'See how small changes compound.',
    lead: 'Adjust the sliders to explore a simple savings projection. It is an illustration, not a forecast.',
    cta: { label: 'Open all calculators', to: '/tools' } as Cta,
  },
  testimonials: {
    eyebrow: 'Client voices',
    title: 'What fictional clients say.',
    notice: 'Fictional testimonials written for this template. They are not from real clients.',
  },
  insights: {
    eyebrow: 'Insights',
    title: 'Notes from the journal.',
    lead: 'Educational pieces written to illustrate the template. They are not advice and do not describe current rules.',
  },
  cta: {
    eyebrow: 'Next step',
    title: 'Ready for a conversation about your numbers?',
    text: 'Reserve a demonstration consultation slot. It is stored only in your browser — a handy way to try the booking flow.',
    primary: { label: 'Book a demo consultation', to: '/book' } as Cta,
    secondary: { label: 'Send an enquiry', to: '/contact' } as Cta,
  },
};

export const testimonials: Testimonial[] = [
  { id: 't1', quote: 'The plan fit on four pages and I finally understood why each decision was on the list. It made conversations at home far calmer.', name: 'Amara L. (fictional)', role: 'Product designer', segment: 'Household planning' },
  { id: 't2', quote: 'Our monthly pack went from a spreadsheet nobody trusted to one page we discuss every Monday.', name: 'Rhys T. (fictional)', role: 'Founder, a small distribution company', segment: 'Small & medium business' },
  { id: 't3', quote: 'They showed me the cash gap eight weeks before it would have hurt. That alone changed how I plan hiring.', name: 'Noor S. (fictional)', role: 'Owner, an online homeware shop', segment: 'Retail & e-commerce' },
  { id: 't4', quote: 'Clear, careful and never pushy. They were as keen to tell me what we did not need as what we did.', name: 'Callum R. (fictional)', role: 'Independent consultant', segment: 'Professional services' },
];

export const aboutPage = {
  seo: {
    title: 'About the firm',
    description: 'The story, philosophy, values and working approach of Folio Finance — a fictional advisory firm used to demonstrate this template.',
  },
  hero: { eyebrow: 'About Folio Finance', title: 'A fictional firm with a real point of view.', lead: 'We exist to show how a thoughtful advisory brand can communicate: with composure, plain language and visible working.', image: 'office' },
  story: [
    'Folio Finance was “founded” in the fictional city of Harbour Square by a group of advisers who were tired of jargon-heavy proposals and generic product pitches. Their idea was simple: treat every client engagement like a short, well-edited book — a clear beginning, a defined middle and an agreed next chapter.',
    'The firm grew by referral — in this story — and by the quality of its written plans. None of this history is real: it is example copy for the template, written so you can replace it with your own.',
  ],
  philosophy: {
    title: 'Philosophy',
    text: 'Good advice is proportionate, transparent and reversible. We favour decisions that preserve options, explain their assumptions and leave clients better able to decide next time.',
  },
  values: [
    { icon: 'book', title: 'Clarity first', text: 'If we cannot explain it simply, we have not finished the work.' },
    { icon: 'shield', title: 'Care over cleverness', text: 'We choose robust approaches over fashionable ones.' },
    { icon: 'users', title: 'Partnership', text: 'We work alongside your other advisers, never around them.' },
    { icon: 'target', title: 'Accountability', text: 'We agree actions, owners and dates — then check back.' },
  ] as { icon: 'book' | 'shield' | 'users' | 'target'; title: string; text: string }[],
  approach: [
    { title: 'Small teams', text: 'Every client has a lead adviser and a supporting specialist, so context stays in one place.' },
    { title: 'Written outputs', text: 'Plans, models and meeting notes are documented in plain language.' },
    { title: 'Regular rhythm', text: 'Reviews are scheduled, not left to chance.' },
    { title: 'Honest limits', text: 'We state our assumptions and what we do not know.' },
  ],
  experience: [
    { title: 'Before we begin', text: 'An introductory call (demo) clarifies fit, scope and expectations.' },
    { title: 'During the work', text: 'You receive plain-language updates and a single point of contact.' },
    { title: 'After delivery', text: 'A follow-up review confirms what has changed and what to adjust.' },
  ],
  processTitle: 'Consulting process',
  image2: 'boardroom',
};

export const toolsPage = {
  seo: { title: 'Financial tools & calculators', description: 'Interactive savings growth, loan payment and business break-even calculators with charts, validation and plain-language explanations.' },
  hero: { eyebrow: 'Financial tools', title: 'Three calculators. Visible assumptions.', lead: 'Work through savings growth, loan repayments and break-even points. Every result is calculated from your inputs and labelled as an estimate.' },
};

export const bookingPage = {
  seo: { title: 'Book a demo consultation', description: 'Try the Folio Finance demonstration consultation booking flow. Bookings are saved only in your browser and are not sent to any firm.' },
};

export const contactPage = {
  seo: { title: 'Contact', description: 'Contact details, office hours and a validated enquiry form for Folio Finance — a fictional firm used to demonstrate a website template.' },
  hero: { eyebrow: 'Contact', title: 'Start a conversation.', lead: 'Use the form below to draft an enquiry. In this template no message is delivered unless the site owner connects an endpoint.' },
};

export const insightsPage = {
  seo: { title: 'Insights & journal', description: 'Educational demonstration articles on planning, cash flow, small-business finance and decision-making. Illustrative content only.' },
  hero: { eyebrow: 'Insights', title: 'The journal.', lead: 'Educational pieces written for the template. Illustrative only — not advice and not current rules.' },
  disclaimer: 'Articles are demonstration content. They do not describe current tax laws, regulations, market returns or official policy, and dates are illustrative.',
};
