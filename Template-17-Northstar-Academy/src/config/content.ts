import type { Faq, Testimonial } from './types';
import type { Article } from './types';

export const home = {
  hero: {
    eyebrow: 'Demonstration academy · Fictional brand',
    title: 'Learn with direction.',
    accent: 'Finish with proof.',
    text: 'Short, structured courses with quizzes, learning paths and a progress dashboard that remembers where you left off. Open the demo and learn something in the next ten minutes.',
    primary: { label: 'Browse courses', to: '/courses' },
    secondary: { label: 'Open demo dashboard', to: '/learn' },
    popular: ['Python', 'Spreadsheets', 'Design', 'Spanish', 'AI prompts'],
  },
  outcomes: {
    title: 'What you leave with',
    intro: 'Every course is built around something you can do, not just something you have watched.',
    items: [
      { title: 'A finished project', text: 'Each course ends with a small, shareable result you can describe in an interview.' },
      { title: 'Skills you can check', text: 'Short quizzes after every module show what has stuck and what needs another look.' },
      { title: 'A clear next step', text: 'Learning paths link courses together so you always know what to study next.' },
      { title: 'A habit that sticks', text: 'Bite-sized lessons of 8–12 minutes make steady progress easy to protect.' },
    ],
  },
  why: {
    title: 'Why learn with Northstar',
    items: [
      { title: 'Original, concise lessons', text: 'Written for adults with limited time: one idea, one example, one practice prompt.' },
      { title: 'Honest assessment', text: 'Quizzes explain the right answer. A course is complete only when every lesson and quiz is done.' },
      { title: 'Practical instructors', text: 'Demo instructors come from design, engineering, data and teaching backgrounds (all fictional).' },
      { title: 'Learn anywhere', text: 'The reading experience works on a phone as comfortably as on a desktop.' },
    ],
  },
  experience: {
    title: 'A lesson experience built for focus',
    text: 'The lesson viewer keeps the course outline beside you, remembers your place and asks for a quick check at the end of every module.',
    bullets: ['Module outline with progress', 'Bookmark any lesson', 'Keyboard-friendly navigation', 'Quizzes with explanations'],
  },
  dashboard: {
    title: 'Your learning, at a glance',
    text: 'The demo dashboard stores progress in your browser, so you can enrol, finish lessons, pass quizzes and even print a certificate preview — without creating an account.',
    cta: { label: 'Try the learner dashboard', to: '/learn' },
  },
  cta: {
    title: 'Ready to start learning?',
    text: 'Open the demo, pick a free course and complete your first lesson in minutes. No sign-up, no payment.',
    primary: { label: 'Enrol in a free course', to: '/courses?price=free' },
    secondary: { label: 'See plans', to: '/plans' },
  },
};

export const testimonials: Testimonial[] = [
  { name: 'Jordan Ellis', role: 'Marketing coordinator (fictional)', quote: 'The lessons were short enough to finish on my commute, and the quizzes made me actually remember the material.', course: 'Lifecycle Email Marketing' },
  { name: 'Mei-Ling Zhao', role: 'Junior analyst (fictional)', quote: 'I cleaned my first real dataset after module one. The clear structure made spreadsheets less intimidating.', course: 'Analytical Spreadsheets' },
  { name: 'Carlos Duarte', role: 'Career changer (fictional)', quote: 'Learning paths took the guesswork out of what to study next. I felt guided without feeling rushed.', course: 'Web Builder path' },
  { name: 'Aisha Rahman', role: 'Team lead (fictional)', quote: 'The presenting course gave me a simple structure I now use for every update. My team noticed.', course: 'Presenting with Clarity' },
  { name: 'Lukas Brandt', role: 'Freelance designer (fictional)', quote: 'The critique format in the hierarchy course changed how I explain design decisions to clients.', course: 'Visual Hierarchy & Layout' },
  { name: 'Nia Thompson', role: 'Operations manager (fictional)', quote: 'I automated a weekly report in an afternoon. The error-handling lesson saved me from silent failures.', course: 'No-Code Workflow Automation' },
];

export const homeFaqs: Faq[] = [
  { q: 'Is Northstar Academy a real school?', a: 'No. It is a fictional brand used to demonstrate a premium education website template by OneStop Infinite.' },
  { q: 'Do I need an account?', a: 'No. The demo dashboard works instantly and keeps your progress in this browser only.' },
  { q: 'Are the certificates official?', a: 'No. Certificate previews are clearly labelled "Demonstration — Not accredited".' },
];

export const about = {
  title: 'A small academy with a clear point of view',
  intro: 'Northstar Academy is a fictional academy created to show how an education business can present courses, paths and a learner experience in one coherent website.',
  story: [
    'The brand began as an idea: what if online courses felt more like a well-edited magazine than a warehouse of videos? Every page in this template is designed around that question.',
    'The demo catalogue is small on purpose. Seventeen courses and six paths let you explore every feature quickly — then replace the content with your own programme.',
  ],
  philosophy: [
    { title: 'Short beats sprawling', text: 'Lessons are 8–12 minutes. One idea at a time, followed by something to try.' },
    { title: 'Check understanding', text: 'Assessment is a learning tool. Every module ends with a short quiz that explains the answers.' },
    { title: 'Respect the learner', text: 'No dark patterns, no fake urgency. The demo says clearly what it is and is not.' },
  ],
  methodology: [
    { step: '01', title: 'Orient', text: 'Each course opens with outcomes, requirements and a map of what is ahead.' },
    { step: '02', title: 'Learn', text: 'Concise reading lessons introduce an idea with an example.' },
    { step: '03', title: 'Practise', text: 'Every lesson ends with a short practice prompt you can do in minutes.' },
    { step: '04', title: 'Check', text: 'Module quizzes confirm understanding and highlight gaps.' },
    { step: '05', title: 'Complete', text: 'Finish all lessons and quizzes to complete a course and preview a certificate.' },
  ],
  mission: 'To make good learning feel clear, calm and achievable — and to give education businesses a template that does the same.',
  team: [
    { name: 'Iris Calloway', role: 'Academic director (fictional)' },
    { name: 'Rahul Menon', role: 'Head of learning design (fictional)' },
    { name: 'Camille Duval', role: 'Learner success lead (fictional)' },
    { name: 'Ben Okafor', role: 'Platform engineer (fictional)' },
  ],
};

export const contactFaqs: Faq[] = [
  { q: 'How quickly do you reply?', a: 'In this demo nothing is sent. A real deployment would state your actual response time here.' },
  { q: 'Can I request a corporate training quote?', a: 'Choose "Teams" as the topic. The form validates your answers but does not transmit them in demo mode.' },
  { q: 'Do you offer refunds?', a: 'Replace this answer with your own refund policy. No payments are taken in the demo.' },
  { q: 'Where is the academy based?', a: 'The address shown is fictional. Edit src/config/site.ts to use your own.' },
];

export const articles: Article[] = [
  {
    slug: 'how-to-build-a-study-habit',
    title: 'How to build a study habit that survives a busy week',
    excerpt: 'Ten minutes a day beats a three-hour weekend marathon. Here is how to make the small thing stick.',
    category: 'Learning Skills', author: 'Sofía Marchetti', date: '2026-09-18', readMinutes: 5, palette: ['#2748e8', '#0e9f94', '#f5b942'],
    tags: ['habits', 'study', 'productivity'],
    body: [
      'Most people fail at learning because the plan is too big. A habit that fits into a busy week is small, specific and attached to something you already do.',
      'Pick a trigger — your morning coffee, your commute — and decide what you will do afterwards: one lesson, or ten minutes of reading. Write it down. The point is not to make progress each day; the point is to make starting automatic.',
      'Protect the streak without worshipping it. If you miss a day, do the smallest possible version the next day. Two missed days in a row is where habits quietly end.',
      'Finally, make progress visible. Seeing a percentage rise is motivating, which is why every course in this template shows it.',
    ],
  },
  {
    slug: 'why-quizzes-help-you-remember',
    title: 'Why short quizzes help you remember more',
    excerpt: 'Retrieval practice is one of the best-supported techniques in learning science. Here is how we use it.',
    category: 'Learning Skills', author: 'Hannah Weiss', date: '2026-09-02', readMinutes: 4, palette: ['#ff6b57', '#f5b942', '#0f1e3d'],
    tags: ['quizzes', 'memory', 'learning science'],
    body: [
      'Trying to recall something strengthens memory more than rereading it. This effect, often called retrieval practice, is why quizzes are more than assessment.',
      'The best quizzes are short, spaced out and followed by feedback that explains why an answer is right. Wrong answers are useful when you learn from them.',
      'In Northstar, every module ends with a three-question check. You can retry as often as you like; the goal is understanding, not a perfect first score.',
    ],
  },
  {
    slug: 'choosing-your-first-programming-language',
    title: 'Choosing your first programming language',
    excerpt: 'Python or JavaScript? The honest answer depends on what you want to build in your first month.',
    category: 'Careers', author: 'Daniel Osei', date: '2026-08-21', readMinutes: 6, palette: ['#0f1e3d', '#2748e8', '#ff6b57'],
    tags: ['programming', 'python', 'javascript'],
    body: [
      'Both languages are excellent first choices. Python reads close to plain English and is popular for automation and data work. JavaScript runs in every browser, so you see results immediately.',
      'If you want to automate chores or analyse data, start with Python. If you want to build web pages and interfaces, start with HTML, CSS and JavaScript.',
      'Whichever you pick, commit to it for three months. The skills transfer far more than beginners expect.',
    ],
  },
  {
    slug: 'portfolio-projects-that-get-noticed',
    title: 'Portfolio projects that actually get noticed',
    excerpt: 'Three small, well-explained projects beat ten unfinished ones. What to include in each.',
    category: 'Careers', author: 'Priya Raman', date: '2026-08-05', readMinutes: 6, palette: ['#0e9f94', '#0f1e3d', '#f5b942'],
    tags: ['portfolio', 'careers', 'design'],
    body: [
      'Hiring managers rarely have time to explore. A portfolio project should answer quickly: what was the problem, what did you do and what was the result?',
      'Show your thinking, not just the final screen. A sketch, a rejected option and a short reflection tell a richer story.',
      'Finish fewer things, but finish them. A small project with a clear write-up is more convincing than a sprawling one nobody can follow.',
    ],
  },
  {
    slug: 'using-ai-tools-for-study',
    title: 'Using AI tools for study without cheating yourself',
    excerpt: 'AI can be a patient tutor or a shortcut that robs you of learning. The difference is how you ask.',
    category: 'AI & Technology', author: 'Leila Haddad', date: '2026-07-24', readMinutes: 5, palette: ['#2748e8', '#ff6b57', '#0e9f94'],
    tags: ['ai', 'study', 'ethics'],
    body: [
      'Ask an AI assistant to explain a concept in simpler words, to quiz you or to give an example. Do not ask it to do the exercise for you; the struggle is where learning happens.',
      'Always check what it tells you against your course material or another source. Fluent answers can still be wrong.',
      'Respect your course and employer policies on AI use. When in doubt, ask.',
    ],
  },
  {
    slug: 'learning-a-language-as-an-adult',
    title: 'Learning a language as an adult: what actually works',
    excerpt: 'Speak early, learn phrases rather than word lists and accept being wrong in public.',
    category: 'Languages', author: 'Sofía Marchetti', date: '2026-07-10', readMinutes: 5, palette: ['#ff6b57', '#2748e8', '#f5b942'],
    tags: ['language', 'speaking', 'adult learners'],
    body: [
      'Adults have advantages: discipline, context and clear goals. Use them. Decide what you want to do in the language — order food, join meetings — and learn the phrases for that first.',
      'Speak from day one, even if it is just to yourself. Recording your voice and listening back is surprisingly effective.',
      'Expect to make mistakes. Native speakers are usually delighted by the effort.',
    ],
  },
  {
    slug: 'presenting-data-without-boring-people',
    title: 'Presenting data without boring people',
    excerpt: 'Lead with the insight, show one chart and tell people what to do next.',
    category: 'Workplace Skills', author: 'Kenji Mori', date: '2026-06-28', readMinutes: 4, palette: ['#0e9f94', '#1a34b8', '#ff6b57'],
    tags: ['data', 'presentation', 'charts'],
    body: [
      'Most data presentations fail because they start with the method. Start with the finding: what changed, how much, and why it matters.',
      'Show one chart per idea and title it with the conclusion. Remove gridlines, extra colours and anything that does not help the point.',
      'End with a recommended action. People remember decisions more than decimals.',
    ],
  },
  {
    slug: 'running-your-first-team-project',
    title: 'Running your first team project: a one-page plan',
    excerpt: 'Scope, owners, milestones and risks — the one-page plan that keeps small projects calm.',
    category: 'Workplace Skills', author: 'Marcus Bell', date: '2026-06-12', readMinutes: 5, palette: ['#0f1e3d', '#0e9f94', '#f5b942'],
    tags: ['project', 'leadership', 'planning'],
    body: [
      'A one-page plan beats a fifty-page document nobody reads. Include the goal, what is out of scope, three milestones, owners and the top three risks.',
      'Share it at the start and revisit it weekly. The act of updating it is a conversation starter more than an administrative task.',
      'When something changes, update the plan and say so. Invisible changes are where trust is lost.',
    ],
  },
];

export const articleCategories = ['Learning Skills', 'Careers', 'AI & Technology', 'Languages', 'Workplace Skills'];
