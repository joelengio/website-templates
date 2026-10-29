import type { ComparisonRow, Faq, MembershipPlan } from './types';

/** Currency used for every price on the site. */
export const currency = { code: 'USD', locale: 'en-US' };

export const membershipCopy = {
  eyebrow: 'Membership',
  title: 'Choose how you train',
  intro: 'Three plans, no lock-in gimmicks. Switch billing between monthly and annual to compare. All prices are fictional demonstration figures.',
  annualNote: 'Annual billing shown as a monthly equivalent.',
  disclaimer:
    'Demonstration only: choosing a plan never charges a card, creates an account or activates a membership. The signup flow validates your details and saves a demo enquiry in this browser.'
};

/** Add or remove plans here. `id` is used by the comparison table and the signup form. */
export const plans: MembershipPlan[] = [
  {
    id: 'floor',
    name: 'Floor',
    tagline: 'Open-gym access for self-directed training.',
    monthly: 49,
    annualMonthly: 41,
    joiningFee: 0,
    benefits: ['Full gym floor access during opening hours', 'Strength, cardio and functional zones', 'Induction session with a coach', 'Online timetable and demo booking'],
    cta: 'Choose Floor'
  },
  {
    id: 'club',
    name: 'Club',
    tagline: 'Everything in Floor, plus unlimited coached classes.',
    monthly: 89,
    annualMonthly: 74,
    joiningFee: 0,
    highlight: true,
    badge: 'Most popular',
    benefits: ['Unlimited group classes', 'Priority class booking window', 'Recovery room access', 'One guest pass each month', 'Quarterly progress check-in'],
    cta: 'Choose Club'
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'Club benefits with one-to-one coaching built in.',
    monthly: 149,
    annualMonthly: 125,
    joiningFee: 0,
    badge: 'Coaching included',
    benefits: ['Everything in Club', 'Two personal training sessions each month', 'Personal programme design', 'Cold-plunge and sauna priority', 'Two guest passes each month'],
    cta: 'Choose Elite'
  }
];

export const comparison: ComparisonRow[] = [
  { group: 'Access', label: 'Gym floor access', values: { floor: true, club: true, elite: true } },
  { group: 'Access', label: 'Opening-hours access', values: { floor: 'All hours', club: 'All hours', elite: 'All hours' } },
  { group: 'Access', label: 'Recovery room', values: { floor: false, club: true, elite: true } },
  { group: 'Access', label: 'Cold plunge & sauna priority', values: { floor: false, club: false, elite: true } },
  { group: 'Classes', label: 'Group classes', values: { floor: 'Pay per class', club: 'Unlimited', elite: 'Unlimited' } },
  { group: 'Classes', label: 'Booking window', values: { floor: '7 days', club: '21 days', elite: '21 days' } },
  { group: 'Coaching', label: 'Induction session', values: { floor: true, club: true, elite: true } },
  { group: 'Coaching', label: 'Personal training sessions', values: { floor: false, club: false, elite: '2 per month' } },
  { group: 'Coaching', label: 'Progress check-ins', values: { floor: false, club: 'Quarterly', elite: 'Monthly' } },
  { group: 'Extras', label: 'Guest passes', values: { floor: false, club: '1 per month', elite: '2 per month' } },
  { group: 'Extras', label: 'Joining fee', values: { floor: 'None', club: 'None', elite: 'None' } }
];

export const faqs: Faq[] = [
  { q: 'Is this a real membership?', a: 'No. VIGOR CLUB is a fictional demonstration. No payment is taken and no membership is created by the signup form.' },
  { q: 'Can I switch between monthly and annual billing?', a: 'In a live club you would be able to. The toggle on this page shows how both prices compare so you can configure your own offer.' },
  { q: 'Do I need experience to join?', a: 'No. Every plan includes guidance, and most classes offer scalable options for beginners.' },
  { q: 'Can I freeze or cancel?', a: 'Terms are set by the business using this template. Replace this answer with your real freeze and cancellation policy.' },
  { q: 'Can I bring a friend?', a: 'Club and Elite members receive monthly guest passes. Floor members can arrange a visit through the front desk.' },
  { q: 'What should I do if I have a medical condition?', a: 'Speak with a qualified health professional before starting a new exercise programme, and tell your coach about anything relevant.' }
];
