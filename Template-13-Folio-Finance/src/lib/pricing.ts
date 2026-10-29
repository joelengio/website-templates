import { addOns as defaultAddOns, pricing as pricingConfig } from '../config/plans';
import type { AddOn, Plan } from '../config/types';
import { roundCents } from './finance';

export type BillingCycle = 'monthly' | 'annual';

export interface PlanQuote {
  cycle: BillingCycle;
  discountPercent: number;
  /** Plan + add-ons per month at the monthly (undiscounted) rate. */
  monthlyBase: number;
  /** Amount charged per billing period (one month, or one year when annual). */
  periodTotal: number;
  /** Plan alone per billing period. */
  planPeriod: number;
  /** Add-ons per billing period. */
  addOnsPeriod: number;
  /** Average monthly cost: the period total divided by 1 or 12. */
  effectiveMonthly: number;
  /** Saving versus paying monthly for a year (0 on monthly billing). */
  annualSaving: number;
  periodLabel: 'month' | 'year';
}

export function discountFor(plan: Plan, fallback = pricingConfig.annualDiscountPercent): number {
  const d = plan.annualDiscountPercent ?? fallback;
  return Math.min(100, Math.max(0, d));
}

/** Computes plan pricing for a billing cycle. Annual = monthly × 12 × (1 − discount%), rounded to cents. */
export function quotePlan(plan: Plan, cycle: BillingCycle, selectedAddOnIds: string[] = [], addOns: AddOn[] = defaultAddOns): PlanQuote {
  const discountPercent = cycle === 'annual' ? discountFor(plan) : 0;
  const addOnMonthly = addOns.filter((a) => selectedAddOnIds.includes(a.id)).reduce((s, a) => s + a.monthly, 0);
  const monthlyBase = plan.monthly + addOnMonthly;
  const factor = cycle === 'annual' ? 12 * (1 - discountPercent / 100) : 1;
  const planPeriod = roundCents(plan.monthly * factor);
  const addOnsPeriod = roundCents(addOnMonthly * factor);
  const periodTotal = roundCents(monthlyBase * factor);
  return {
    cycle,
    discountPercent,
    monthlyBase,
    periodTotal,
    planPeriod,
    addOnsPeriod,
    effectiveMonthly: roundCents(cycle === 'annual' ? periodTotal / 12 : periodTotal),
    annualSaving: cycle === 'annual' ? roundCents(monthlyBase * 12 - periodTotal) : 0,
    periodLabel: cycle === 'annual' ? 'year' : 'month',
  };
}

