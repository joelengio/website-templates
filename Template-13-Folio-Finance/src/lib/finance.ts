/**
 * Pure, dependency-free financial arithmetic used by the calculators. Everything here is deterministic and unit
 * tested (see finance.test.ts). Results are ESTIMATES derived from user-supplied assumptions.
 */
import { calculators } from '../config/calculators';

/** Rounds to 2 decimals using half-up on the decimal representation (1.005 → 1.01, -1.005 → -1.01). */
export function roundCents(value: number): number {
  if (!Number.isFinite(value)) return NaN;
  const sign = value < 0 ? -1 : 1;
  return (sign * Math.round((Math.abs(value) + Number.EPSILON) * 100)) / 100;
}

/** Parses user text such as "12,500.50" or " 4 " into a number. Returns null when it is not a plain number. */
export function parseNumber(raw: string | number | undefined | null): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  if (raw == null) return null;
  const cleaned = raw.trim().replace(/[,\s_]/g, '');
  if (cleaned === '' || !/^[-+]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export type FieldErrors<K extends string> = Partial<Record<K, string>>;
export type Validated<T, K extends string> = { ok: true; value: T } | { ok: false; errors: FieldErrors<K> };

function numberField(
  raw: string,
  label: string,
  opts: { min?: number; max?: number; integer?: boolean; exclusiveMin?: boolean; unit?: string },
): { value?: number; error?: string } {
  const n = parseNumber(raw);
  if (raw.trim() === '') return { error: `Enter ${label}.` };
  if (n === null) return { error: `${capitalise(label)} must be a number.` };
  if (opts.integer && !Number.isInteger(n)) return { error: `${capitalise(label)} must be a whole number.` };
  if (opts.min !== undefined) {
    if (opts.exclusiveMin ? n <= opts.min : n < opts.min) {
      return { error: opts.exclusiveMin ? `${capitalise(label)} must be greater than ${opts.min}.` : `${capitalise(label)} cannot be below ${opts.min}.` };
    }
  }
  if (opts.max !== undefined && n > opts.max) return { error: `${capitalise(label)} cannot exceed ${opts.max.toLocaleString('en-US')}${opts.unit ?? ''}.` };
  return { value: n };
}
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ------------------------------------------------------------------ */
/* 1. Savings & compound growth                                         */
/* ------------------------------------------------------------------ */

export interface CompoundInput {
  initial: number;
  monthly: number;
  /** Nominal annual rate in percent, e.g. 5 for 5%. */
  annualRate: number;
  years: number;
  /** Compounding periods per year (1, 2, 4, 12, 365 …). */
  frequency: number;
}

export interface CompoundPoint {
  year: number;
  balance: number;
  contributions: number;
  growth: number;
}

export interface CompoundResult {
  futureValue: number;
  totalContributions: number;
  growth: number;
  /** Equivalent monthly rate derived from the nominal annual rate and compounding frequency. */
  monthlyRate: number;
  effectiveAnnualRate: number;
  series: CompoundPoint[];
}

/** Equivalent monthly growth rate for a nominal annual rate (percent) compounded `frequency` times a year. */
export function monthlyRateFor(annualRatePercent: number, frequency: number): number {
  const r = annualRatePercent / 100;
  return Math.pow(1 + r / frequency, frequency / 12) - 1;
}

/** Balance after `months` months with end-of-month contributions. */
export function balanceAfterMonths(initial: number, monthly: number, monthlyRate: number, months: number): number {
  if (months <= 0) return initial;
  if (monthlyRate === 0) return initial + monthly * months;
  const growth = Math.pow(1 + monthlyRate, months);
  return initial * growth + monthly * ((growth - 1) / monthlyRate);
}

export function computeCompound(input: CompoundInput): CompoundResult {
  const rm = monthlyRateFor(input.annualRate, input.frequency);
  const series: CompoundPoint[] = [];
  for (let year = 0; year <= input.years; year++) {
    const balance = balanceAfterMonths(input.initial, input.monthly, rm, year * 12);
    const contributions = input.initial + input.monthly * 12 * year;
    series.push({ year, balance, contributions, growth: balance - contributions });
  }
  const last = series[series.length - 1];
  return {
    futureValue: last.balance,
    totalContributions: last.contributions,
    growth: last.growth,
    monthlyRate: rm,
    effectiveAnnualRate: Math.pow(1 + rm, 12) - 1,
    series,
  };
}

export type CompoundFields = 'initial' | 'monthly' | 'annualRate' | 'years' | 'frequency';

export function validateCompound(raw: Record<CompoundFields, string>): Validated<CompoundInput, CompoundFields> {
  const L = calculators.compound.limits;
  const errors: FieldErrors<CompoundFields> = {};
  const out: Partial<CompoundInput> = {};
  const checks: [CompoundFields, string, Parameters<typeof numberField>[2]][] = [
    ['initial', 'a starting amount', { min: 0, max: L.maxAmount }],
    ['monthly', 'a monthly contribution', { min: 0, max: L.maxAmount }],
    ['annualRate', 'an annual return assumption', { min: L.minRate, max: L.maxRate, unit: '%' }],
    ['years', 'the number of years', { min: L.minYears, max: L.maxYears, integer: true }],
    ['frequency', 'a compounding frequency', { min: 1, max: 365, integer: true }],
  ];
  for (const [key, label, opts] of checks) {
    const r = numberField(raw[key], label, opts);
    if (r.error) errors[key] = r.error;
    else out[key] = r.value;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: out as CompoundInput };
}

/* ------------------------------------------------------------------ */
/* 2. Loan payment & amortization                                       */
/* ------------------------------------------------------------------ */

export interface LoanInput {
  principal: number;
  /** Nominal annual rate in percent. */
  annualRate: number;
  termMonths: number;
}

export interface LoanRow {
  n: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface LoanYear {
  year: number;
  principal: number;
  interest: number;
  endBalance: number;
}

export interface LoanResult {
  /** Level payment, rounded to cents. The final scheduled payment may differ by a few cents. */
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  schedule: LoanRow[];
  yearly: LoanYear[];
}

/** Unrounded level payment: P·r / (1 − (1 + r)^−n), or P / n when the rate is zero. */
export function loanPayment(principal: number, annualRatePercent: number, termMonths: number): number {
  const r = annualRatePercent / 100 / 12;
  if (termMonths <= 0) return NaN;
  if (r === 0) return principal / termMonths;
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths));
}

export function computeLoan(input: LoanInput): LoanResult {
  const r = input.annualRate / 100 / 12;
  const payment = roundCents(loanPayment(input.principal, input.annualRate, input.termMonths));
  const schedule: LoanRow[] = [];
  let balance = roundCents(input.principal);
  for (let n = 1; n <= input.termMonths; n++) {
    const interest = roundCents(balance * r);
    const isLast = n === input.termMonths;
    const pay = isLast ? roundCents(balance + interest) : payment;
    const principalPart = roundCents(pay - interest);
    balance = isLast ? 0 : roundCents(balance - principalPart);
    schedule.push({ n, payment: pay, interest, principal: principalPart, balance });
  }
  const totalPayments = roundCents(schedule.reduce((s, row) => s + row.payment, 0));
  const totalInterest = roundCents(schedule.reduce((s, row) => s + row.interest, 0));
  const yearly: LoanYear[] = [];
  for (const row of schedule) {
    const year = Math.ceil(row.n / 12);
    let y = yearly[year - 1];
    if (!y) {
      y = { year, principal: 0, interest: 0, endBalance: row.balance };
      yearly.push(y);
    }
    y.principal = roundCents(y.principal + row.principal);
    y.interest = roundCents(y.interest + row.interest);
    y.endBalance = row.balance;
  }
  return { monthlyPayment: payment, totalPayments, totalInterest, schedule, yearly };
}

export type LoanFields = 'principal' | 'annualRate' | 'term';

export function validateLoan(raw: Record<LoanFields, string>, unit: 'years' | 'months'): Validated<LoanInput, LoanFields> {
  const L = calculators.loan.limits;
  const errors: FieldErrors<LoanFields> = {};
  const principal = numberField(raw.principal, 'a loan amount', { min: 0, exclusiveMin: true, max: L.maxPrincipal });
  const rate = numberField(raw.annualRate, 'an annual interest rate', { min: L.minRate, max: L.maxRate, unit: '%' });
  const term = numberField(raw.term, 'a loan term', { min: 0, exclusiveMin: true, integer: true });
  if (principal.error) errors.principal = principal.error;
  if (rate.error) errors.annualRate = rate.error;
  if (term.error) errors.term = term.error;
  else if (term.value !== undefined) {
    const months = unit === 'years' ? term.value * 12 : term.value;
    if (months > L.maxMonths) errors.term = `Loan term cannot exceed ${L.maxMonths / 12} years (${L.maxMonths} months).`;
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  const months = unit === 'years' ? term.value! * 12 : term.value!;
  return { ok: true, value: { principal: principal.value!, annualRate: rate.value!, termMonths: months } };
}

/* ------------------------------------------------------------------ */
/* 3. Break-even                                                        */
/* ------------------------------------------------------------------ */

export interface BreakEvenInput {
  fixedCosts: number;
  price: number;
  variableCost: number;
  /** Optional profit target; 0 for pure break-even. */
  targetProfit: number;
}

export type BreakEvenResult =
  | {
      status: 'ok';
      contributionMargin: number;
      marginRatio: number;
      /** Exact (fractional) break-even volume. */
      unitsExact: number;
      /** Whole units needed, rounded up. */
      units: number;
      /** Revenue at the exact break-even volume (= fixed costs ÷ margin ratio). */
      revenue: number;
      /** Units (rounded up) needed to reach the target profit. */
      targetUnits: number;
      targetRevenue: number;
    }
  | { status: 'impossible'; contributionMargin: number; reason: string };

export function computeBreakEven(input: BreakEvenInput): BreakEvenResult {
  const cm = input.price - input.variableCost;
  if (cm <= 0) {
    return {
      status: 'impossible',
      contributionMargin: cm,
      reason:
        cm === 0
          ? 'Each unit earns no contribution (price equals variable cost), so fixed costs can never be recovered.'
          : 'Variable cost per unit is higher than the selling price, so every sale increases the loss.',
    };
  }
  const unitsExact = input.fixedCosts / cm;
  const targetUnitsExact = (input.fixedCosts + input.targetProfit) / cm;
  return {
    status: 'ok',
    contributionMargin: cm,
    marginRatio: cm / input.price,
    unitsExact,
    units: Math.max(0, Math.ceil(unitsExact - 1e-9)),
    revenue: unitsExact * input.price,
    targetUnits: Math.max(0, Math.ceil(targetUnitsExact - 1e-9)),
    targetRevenue: targetUnitsExact * input.price,
  };
}

export interface BreakEvenPoint {
  units: number;
  revenue: number;
  totalCost: number;
  profit: number;
}

/** Sample revenue and total-cost lines from 0 to `maxUnits` for charting. */
export function breakEvenSeries(input: BreakEvenInput, maxUnits: number, steps = 24): BreakEvenPoint[] {
  const pts: BreakEvenPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const units = (maxUnits * i) / steps;
    const revenue = units * input.price;
    const totalCost = input.fixedCosts + units * input.variableCost;
    pts.push({ units, revenue, totalCost, profit: revenue - totalCost });
  }
  return pts;
}

export type BreakEvenFields = 'fixedCosts' | 'price' | 'variableCost' | 'targetProfit';

export function validateBreakEven(raw: Record<BreakEvenFields, string>): Validated<BreakEvenInput, BreakEvenFields> {
  const max = calculators.breakEven.limits.maxValue;
  const errors: FieldErrors<BreakEvenFields> = {};
  const out: Partial<BreakEvenInput> = {};
  const checks: [BreakEvenFields, string, Parameters<typeof numberField>[2]][] = [
    ['fixedCosts', 'fixed costs', { min: 0, max }],
    ['price', 'a selling price per unit', { min: 0, exclusiveMin: true, max }],
    ['variableCost', 'a variable cost per unit', { min: 0, max }],
    ['targetProfit', 'a target profit (or 0)', { min: 0, max }],
  ];
  for (const [key, label, opts] of checks) {
    const r = numberField(raw[key], label, opts);
    if (r.error) errors[key] = r.error;
    else out[key] = r.value;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: out as BreakEvenInput };
}
