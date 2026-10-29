import { portrait } from './images';
import type { TeamMember } from './types';

/**
 * FICTIONAL team. Names, photographs and credentials are demonstration content; the photographs are stock
 * portraits of models, not real advisers. Credentials are deliberately generic and prefixed "Demo:" —
 * replace them with verified qualifications only.
 */
export const team: TeamMember[] = [
  {
    slug: 'elena-marchetti',
    name: 'Elena Marchetti',
    role: 'Founding Partner',
    specialization: 'Financial & wealth planning',
    image: portrait('team-elena-marchetti', 'Portrait of a smiling adviser with short curly hair in a striped jacket'),
    summary: 'Leads the firm’s planning practice and believes a plan should fit on a few clear pages.',
    bio: [
      'Elena founded Folio Finance (a fictional firm) around a simple idea: financial advice works best when it is explained plainly and revisited often.',
      'She leads client planning engagements and mentors the advisory team. Outside the office she chairs a fictional local mentoring circle.',
    ],
    credentials: ['Demo: Senior Planner designation (fictional body)', 'Demo: 18 years’ experience (illustrative)'],
    services: ['financial-planning', 'wealth-planning', 'tax-planning'],
    focus: ['Household planning', 'Legacy conversations', 'Career transitions'],
  },
  {
    slug: 'daniel-okafor',
    name: 'Daniel Okafor',
    role: 'Partner, Business Advisory',
    specialization: 'Growth strategy & unit economics',
    image: portrait('team-daniel-okafor', 'Portrait of an adviser with glasses wearing a navy blazer'),
    summary: 'Helps owners turn margin and pricing insight into practical operating decisions.',
    bio: [
      'Daniel works with owner-managed and mid-sized companies on profitability, pricing and operating rhythm.',
      'He enjoys whiteboard sessions and believes every dashboard should answer one question per screen.',
    ],
    credentials: ['Demo: Management Advisory Fellow (fictional body)', 'Demo: Former operating finance lead (illustrative)'],
    services: ['business-advisory', 'cash-flow-advisory', 'startup-advisory'],
    focus: ['Pricing & margin', 'Management reporting', 'Operating cadence'],
  },
  {
    slug: 'priya-raman',
    name: 'Priya Raman',
    role: 'Director, Accounting & Reporting',
    specialization: 'Accounting, bookkeeping & reporting',
    image: portrait('team-priya-raman', 'Portrait of a smiling accountant in a grey blazer standing near a window'),
    summary: 'Runs the firm’s accounting team and designs reporting that business owners genuinely read.',
    bio: [
      'Priya leads the month-end process for the accounting practice and champions tidy, well-documented books.',
      'She is passionate about replacing manual spreadsheets with sensible, auditable routines.',
    ],
    credentials: ['Demo: Practice Accountant status (fictional body)', 'Demo: Reporting systems specialist (illustrative)'],
    services: ['accounting-bookkeeping', 'tax-planning', 'cash-flow-advisory'],
    focus: ['Month-end routines', 'Software setup', 'Management accounts'],
  },
  {
    slug: 'harold-bright',
    name: 'Harold Bright',
    role: 'Senior Adviser, Tax Planning',
    specialization: 'Tax planning & structuring',
    image: portrait('team-harold-bright', 'Portrait of an older adviser with glasses and a dark green polo shirt'),
    summary: 'Brings calm, long-range thinking to tax calendars and major financial decisions.',
    bio: [
      'Harold has spent his career helping people understand the timing of financial decisions. He prefers a planned year to a rushed one.',
      'He works closely with clients’ other specialists so advice stays joined-up.',
    ],
    credentials: ['Demo: Tax Planning Associate (fictional body)', 'Demo: Over three decades of practice (illustrative)'],
    services: ['tax-planning', 'wealth-planning', 'financial-planning'],
    focus: ['Annual tax calendars', 'Business owners', 'Retirement transitions'],
  },
  {
    slug: 'james-whitfield',
    name: 'James Whitfield',
    role: 'Associate Partner, Corporate Finance',
    specialization: 'Transactions & financial modelling',
    image: portrait('team-james-whitfield', 'Portrait of an adviser in a dark suit with arms folded'),
    summary: 'Builds transaction models and keeps financing and acquisition processes on schedule.',
    bio: [
      'James supports management teams through financings, acquisitions and exits, with a focus on preparation and clear materials.',
      'He is happiest when a model stands up to hard questions.',
    ],
    credentials: ['Demo: Corporate Finance Specialist (fictional body)', 'Demo: Transaction modelling lead (illustrative)'],
    services: ['corporate-finance', 'business-advisory', 'startup-advisory'],
    focus: ['Financial modelling', 'Exit planning', 'Investor materials'],
  },
  {
    slug: 'marco-silva',
    name: 'Marco Silva',
    role: 'Adviser, Startups & Technology',
    specialization: 'Startup finance & runway planning',
    image: portrait('team-marco-silva', 'Portrait of a friendly adviser in a grey sweater over a blue collared shirt'),
    summary: 'Helps founders build lightweight, investor-ready finance habits from day one.',
    bio: [
      'Marco works with early-stage technology teams on runway, burn and board reporting.',
      'He previously ran finance for a fictional start-up studio and still writes monthly updates for fun.',
    ],
    credentials: ['Demo: Venture Finance Associate (fictional body)', 'Demo: Founder-in-residence alumnus (illustrative)'],
    services: ['startup-advisory', 'cash-flow-advisory', 'accounting-bookkeeping'],
    focus: ['Runway models', 'Fundraising readiness', 'Board packs'],
  },
];

export const teamDisclosure =
  'The people, photographs and credentials shown here are fictional demonstration content. Photographs are stock portraits of models.';
