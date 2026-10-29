import { describe, expect, it } from 'vitest';
import {
  balanceAfterMonths, breakEvenSeries, computeBreakEven, computeCompound, computeLoan, loanPayment, monthlyRateFor,
  parseNumber, roundCents, validateBreakEven, validateCompound, validateLoan,
} from './finance';

describe('roundCents / parseNumber', () => {
  it('rounds half-up on the decimal representation', () => {
    expect(roundCents(1.005)).toBe(1.01);
    expect(roundCents(2.675)).toBe(2.68);
    expect(roundCents(-1.005)).toBe(-1.01);
    expect(roundCents(0.1 + 0.2)).toBe(0.3);
    expect(roundCents(1234.5)).toBe(1234.5);
    expect(roundCents(Number.NaN)).toBeNaN();
  });
  it('parses plain and formatted numbers and rejects junk', () => {
    expect(parseNumber('12,500.50')).toBe(12500.5);
    expect(parseNumber(' 4 ')).toBe(4);
    expect(parseNumber('-3')).toBe(-3);
    expect(parseNumber('.5')).toBe(0.5);
    for (const bad of ['', '   ', 'abc', '1e5', '1.2.3', '--1', 'Infinity', '12abc']) expect(parseNumber(bad)).toBeNull();
  });
});

describe('compound growth', () => {
  const base = { initial: 10000, monthly: 300, annualRate: 5, years: 20, frequency: 12 };

  it('matches the closed-form future value for monthly compounding', () => {
    const r = 0.05 / 12;
    const n = 240;
    const expected = 10000 * Math.pow(1 + r, n) + 300 * ((Math.pow(1 + r, n) - 1) / r);
    const res = computeCompound(base);
    expect(res.futureValue).toBeCloseTo(expected, 6);
    // Independent reference: month-by-month simulation run outside this code base (Python Decimal, 40 digits).
    expect(roundCents(res.futureValue)).toBe(150436.5);
    // …and an in-test simulation.
    let bal = 10000;
    for (let m = 0; m < 240; m++) bal = bal * (1 + 0.05 / 12) + 300;
    expect(res.futureValue).toBeCloseTo(bal, 6);
  });

  it('with zero interest the value is just the contributions', () => {
    const res = computeCompound({ ...base, annualRate: 0 });
    expect(res.futureValue).toBe(10000 + 300 * 240);
    expect(res.growth).toBe(0);
    expect(res.totalContributions).toBe(res.futureValue);
    expect(res.monthlyRate).toBe(0);
  });

  it('with zero contributions it is simple compounding of the starting amount', () => {
    const res = computeCompound({ initial: 1000, monthly: 0, annualRate: 12, years: 1, frequency: 12 });
    expect(res.futureValue).toBeCloseTo(1000 * Math.pow(1.01, 12), 8); // 1126.825…
    expect(roundCents(res.futureValue)).toBe(1126.83);
    expect(res.totalContributions).toBe(1000);
  });

  it('yearly compounding of a lump sum equals P(1+r)^t', () => {
    const res = computeCompound({ initial: 5000, monthly: 0, annualRate: 7, years: 10, frequency: 1 });
    expect(res.futureValue).toBeCloseTo(5000 * Math.pow(1.07, 10), 6);
  });

  it('higher compounding frequency never reduces the result', () => {
    const f = (frequency: number) => computeCompound({ ...base, frequency }).futureValue;
    expect(f(1)).toBeLessThan(f(2));
    expect(f(2)).toBeLessThan(f(4));
    expect(f(4)).toBeLessThan(f(12));
    expect(f(12)).toBeLessThan(f(365));
  });

  it('produces a series from year 0 to the horizon that ends at the future value', () => {
    const res = computeCompound(base);
    expect(res.series).toHaveLength(21);
    expect(res.series[0]).toMatchObject({ year: 0, balance: 10000, contributions: 10000 });
    expect(res.series[20].balance).toBe(res.futureValue);
    expect(res.series.every((p, i) => i === 0 || p.balance > res.series[i - 1].balance)).toBe(true);
    expect(res.growth).toBeCloseTo(res.futureValue - res.totalContributions, 8);
  });

  it('balanceAfterMonths handles month 0 and the zero-rate branch', () => {
    expect(balanceAfterMonths(500, 10, 0.01, 0)).toBe(500);
    expect(balanceAfterMonths(500, 10, 0, 6)).toBe(560);
  });

  it('monthly rate from nominal annual rate', () => {
    expect(monthlyRateFor(12, 12)).toBeCloseTo(0.01, 12);
    expect(monthlyRateFor(0, 4)).toBe(0);
    expect(monthlyRateFor(6, 1)).toBeCloseTo(Math.pow(1.06, 1 / 12) - 1, 12);
  });

  it('validates inputs: negatives, blanks, text, ranges, fractions', () => {
    const ok = { initial: '10000', monthly: '300', annualRate: '5', years: '20', frequency: '12' };
    expect(validateCompound(ok).ok).toBe(true);
    const bad = validateCompound({ initial: '-5', monthly: '', annualRate: '45', years: '2.5', frequency: 'abc' });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(Object.keys(bad.errors).sort()).toEqual(['annualRate', 'frequency', 'initial', 'monthly', 'years']);
    const zeroYears = validateCompound({ ...ok, years: '0' });
    expect(zeroYears.ok).toBe(false);
    const huge = validateCompound({ ...ok, initial: '5000000000' });
    expect(huge.ok).toBe(false);
    const comma = validateCompound({ ...ok, initial: '10,000.50' });
    expect(comma.ok && comma.value.initial).toBe(10000.5);
  });
});

describe('loan payment & amortization', () => {
  it('matches a known payment: 250,000 at 6.5% over 25 years (reference computed independently)', () => {
    const p = loanPayment(250000, 6.5, 300);
    expect(roundCents(p)).toBe(1688.02);
  });

  it('matches the standard 200,000 / 5% / 30y = 1,073.64', () => {
    const res = computeLoan({ principal: 200000, annualRate: 5, termMonths: 360 });
    expect(res.monthlyPayment).toBe(1073.64);
    expect(res.schedule).toHaveLength(360);
    expect(res.schedule[0].interest).toBe(833.33);
    expect(res.schedule[0].principal).toBe(240.31);
  });

  it('amortizes to exactly zero and principal repaid equals the loan amount', () => {
    for (const [principal, annualRate, termMonths] of [[200000, 5, 360], [12345.67, 8.25, 48], [1000, 0.5, 7], [90000, 12, 120]] as const) {
      const res = computeLoan({ principal, annualRate, termMonths });
      const last = res.schedule[res.schedule.length - 1];
      expect(last.balance).toBe(0);
      expect(roundCents(res.schedule.reduce((s, r) => s + r.principal, 0))).toBe(principal);
      expect(res.totalPayments).toBe(roundCents(principal + res.totalInterest));
      expect(Math.abs(last.payment - res.monthlyPayment)).toBeLessThan(termMonths * 0.01 + 1);
    }
  });

  it('zero interest splits the principal evenly', () => {
    const res = computeLoan({ principal: 12000, annualRate: 0, termMonths: 12 });
    expect(res.monthlyPayment).toBe(1000);
    expect(res.totalInterest).toBe(0);
    expect(res.totalPayments).toBe(12000);
  });

  it('handles a one-month term (single payment of principal + one month interest)', () => {
    const res = computeLoan({ principal: 1000, annualRate: 12, termMonths: 1 });
    expect(res.schedule).toHaveLength(1);
    expect(res.monthlyPayment).toBe(1010);
    expect(res.totalInterest).toBe(10);
    expect(res.yearly).toHaveLength(1);
  });

  it('rejects a zero or negative term in the raw payment formula', () => {
    expect(loanPayment(1000, 5, 0)).toBeNaN();
    expect(loanPayment(1000, 5, -3)).toBeNaN();
  });

  it('builds yearly totals that add up to the schedule', () => {
    const res = computeLoan({ principal: 50000, annualRate: 7, termMonths: 30 });
    expect(res.yearly).toHaveLength(3);
    expect(roundCents(res.yearly.reduce((s, y) => s + y.interest, 0))).toBe(res.totalInterest);
    expect(res.yearly[2].endBalance).toBe(0);
  });

  it('interest share declines and principal share rises over time', () => {
    const res = computeLoan({ principal: 200000, annualRate: 5, termMonths: 360 });
    expect(res.schedule[0].interest).toBeGreaterThan(res.schedule[359].interest);
    expect(res.schedule[0].principal).toBeLessThan(res.schedule[359].principal);
  });

  it('validates principal, rate and term; converts years to months', () => {
    expect(validateLoan({ principal: '250000', annualRate: '6.5', term: '25' }, 'years')).toEqual({ ok: true, value: { principal: 250000, annualRate: 6.5, termMonths: 300 } });
    expect(validateLoan({ principal: '1000', annualRate: '5', term: '18' }, 'months').ok).toBe(true);
    const bad = validateLoan({ principal: '0', annualRate: '-1', term: '0' }, 'years');
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(Object.keys(bad.errors).sort()).toEqual(['annualRate', 'principal', 'term']);
    expect(validateLoan({ principal: '1000', annualRate: '5', term: '2.5' }, 'years').ok).toBe(false);
    expect(validateLoan({ principal: '1000', annualRate: '5', term: '51' }, 'years').ok).toBe(false);
    expect(validateLoan({ principal: '1000', annualRate: '5', term: '601' }, 'months').ok).toBe(false);
    expect(validateLoan({ principal: 'abc', annualRate: '', term: '' }, 'years').ok).toBe(false);
  });
});

describe('break-even', () => {
  const input = { fixedCosts: 18000, price: 45, variableCost: 21, targetProfit: 0 };

  it('computes contribution margin, units and revenue', () => {
    const r = computeBreakEven(input);
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    expect(r.contributionMargin).toBe(24);
    expect(r.unitsExact).toBe(750);
    expect(r.units).toBe(750);
    expect(r.revenue).toBe(33750);
    expect(r.marginRatio).toBeCloseTo(24 / 45, 12);
    expect(r.revenue).toBeCloseTo(18000 / r.marginRatio, 8);
  });

  it('rounds break-even units up to a whole unit', () => {
    const r = computeBreakEven({ fixedCosts: 1000, price: 10, variableCost: 3, targetProfit: 0 });
    expect(r.status === 'ok' && r.unitsExact).toBeCloseTo(142.857, 3);
    expect(r.status === 'ok' && r.units).toBe(143);
    expect(r.status === 'ok' && r.revenue).toBeCloseTo(1428.57, 2);
  });

  it('supports a profit target', () => {
    const r = computeBreakEven({ ...input, targetProfit: 6000 });
    expect(r.status === 'ok' && r.targetUnits).toBe(1000);
    expect(r.status === 'ok' && r.targetRevenue).toBe(45000);
  });

  it('zero fixed costs break even at zero units', () => {
    const r = computeBreakEven({ ...input, fixedCosts: 0 });
    expect(r.status === 'ok' && r.units).toBe(0);
    expect(r.status === 'ok' && r.revenue).toBe(0);
  });

  it('flags impossible scenarios: price below or equal to variable cost', () => {
    const below = computeBreakEven({ ...input, price: 10, variableCost: 12 });
    expect(below.status).toBe('impossible');
    expect(below.status === 'impossible' && below.contributionMargin).toBe(-2);
    const equal = computeBreakEven({ ...input, price: 12, variableCost: 12 });
    expect(equal.status).toBe('impossible');
    expect(equal.status === 'impossible' && equal.reason).toMatch(/no contribution/);
  });

  it('series revenue and cost cross at the break-even volume', () => {
    const pts = breakEvenSeries(input, 1500, 20);
    expect(pts).toHaveLength(21);
    expect(pts[0]).toMatchObject({ units: 0, revenue: 0, totalCost: 18000 });
    const at = pts.find((p) => p.units === 750)!;
    expect(at.profit).toBe(0);
    expect(pts[pts.length - 1].profit).toBeGreaterThan(0);
  });

  it('validates numeric fields', () => {
    expect(validateBreakEven({ fixedCosts: '18000', price: '45', variableCost: '21', targetProfit: '0' }).ok).toBe(true);
    const bad = validateBreakEven({ fixedCosts: '-1', price: '0', variableCost: 'x', targetProfit: '' });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(Object.keys(bad.errors).sort()).toEqual(['fixedCosts', 'price', 'targetProfit', 'variableCost']);
  });
});
