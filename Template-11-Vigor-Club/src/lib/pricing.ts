import type { MembershipPlan } from '../config/types';

export type Billing = 'monthly' | 'annual';

/** Price per month for the chosen billing period. */
export const priceFor = (plan: MembershipPlan, billing: Billing) => (billing === 'annual' ? plan.annualMonthly : plan.monthly);

/** Yearly saving of annual billing versus paying monthly. */
export const annualSaving = (plan: MembershipPlan) => (plan.monthly - plan.annualMonthly) * 12;

/** Total billed per year with annual billing. */
export const annualTotal = (plan: MembershipPlan) => plan.annualMonthly * 12;
