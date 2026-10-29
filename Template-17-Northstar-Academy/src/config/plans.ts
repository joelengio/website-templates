import type { Faq, Plan } from './types';

/** Demonstration plans. No payments are processed anywhere in this template. */
export const plans: Plan[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    audience: 'Try the academy for free',
    monthly: 0,
    annualMonthly: 0,
    cta: 'Start free demo',
    features: ['Free courses', 'Lesson reading and quizzes', 'Local progress tracking', 'Community journal'],
    includes: ['free-courses', 'quizzes', 'progress', 'journal'],
  },
  {
    id: 'learner',
    name: 'Learner',
    audience: 'For individuals building a skill',
    monthly: 24,
    annualMonthly: 19,
    highlighted: true,
    cta: 'Ask about Learner',
    features: ['Everything in Explorer', 'All paid courses', 'Learning paths', 'Printable certificate previews', 'Monthly live Q&A'],
    includes: ['free-courses', 'quizzes', 'progress', 'journal', 'all-courses', 'paths', 'certificates', 'live-qa'],
  },
  {
    id: 'pro',
    name: 'Pro',
    audience: 'For career changers and freelancers',
    monthly: 49,
    annualMonthly: 39,
    cta: 'Ask about Pro',
    features: ['Everything in Learner', 'Mentor feedback on projects', 'Career portfolio reviews', 'Priority support', 'Early access to new courses'],
    includes: ['free-courses', 'quizzes', 'progress', 'journal', 'all-courses', 'paths', 'certificates', 'live-qa', 'mentor', 'portfolio', 'priority', 'early-access'],
  },
  {
    id: 'teams',
    name: 'Teams',
    audience: 'For companies training groups',
    monthly: 89,
    annualMonthly: 72,
    cta: 'Talk to us about Teams',
    features: ['Everything in Pro', 'Per-seat pricing from 5 learners', 'Team progress reporting', 'Custom learning paths', 'Dedicated success manager'],
    includes: ['free-courses', 'quizzes', 'progress', 'journal', 'all-courses', 'paths', 'certificates', 'live-qa', 'mentor', 'portfolio', 'priority', 'early-access', 'team-reports', 'custom-paths'],
  },
];

export const comparisonRows: { key: string; label: string }[] = [
  { key: 'free-courses', label: 'Free courses' },
  { key: 'quizzes', label: 'Quizzes & progress tracking' },
  { key: 'all-courses', label: 'Full paid course catalogue' },
  { key: 'paths', label: 'Guided learning paths' },
  { key: 'certificates', label: 'Certificate previews' },
  { key: 'live-qa', label: 'Monthly live Q&A' },
  { key: 'mentor', label: 'Mentor project feedback' },
  { key: 'portfolio', label: 'Portfolio reviews' },
  { key: 'team-reports', label: 'Team progress reports' },
  { key: 'custom-paths', label: 'Custom learning paths' },
];

/** Percentage saved by paying annually, rounded to a whole number. */
export function annualSavingPercent(plan: Plan): number {
  if (plan.monthly <= 0) return 0;
  return Math.round(((plan.monthly - plan.annualMonthly) / plan.monthly) * 100);
}

export const planFaqs: Faq[] = [
  { q: 'Can I really sign up for a plan here?', a: 'No. This is a template demonstration. No accounts exist, no payment is requested and no subscription is created. The enquiry form simply shows how a real inquiry flow would behave.' },
  { q: 'What happens if I choose annual billing?', a: 'In this demo the toggle only changes the displayed price so you can see how annual savings are presented. Nothing is charged.' },
  { q: 'Is the free Explorer plan limited?', a: 'Explorer unlocks the three free demo courses and local progress tracking in your browser. Paid courses can still be previewed.' },
  { q: 'Can teams get custom learning paths?', a: 'In a real deployment, yes — the Teams plan describes how custom paths and reporting would be offered. Here it is illustrative copy.' },
  { q: 'Where can I change these prices?', a: 'Edit src/config/plans.ts. Prices, features and the comparison table are all configuration.' },
];
