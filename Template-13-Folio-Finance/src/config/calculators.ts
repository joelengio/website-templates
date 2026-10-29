/**
 * Calculator defaults, input limits and wording. Change the numbers to re-seed the calculators;
 * limits are enforced by the validators in src/lib/finance.ts. Defaults are illustrations, not recommendations.
 */
export const calculators = {
  compound: {
    defaults: { initial: 10000, monthly: 300, annualRate: 5, years: 20, frequency: 12 },
    limits: { maxAmount: 1_000_000_000, minRate: 0, maxRate: 30, minYears: 1, maxYears: 60 },
    frequencies: [
      { value: 1, label: 'Annually' },
      { value: 2, label: 'Semi-annually' },
      { value: 4, label: 'Quarterly' },
      { value: 12, label: 'Monthly' },
      { value: 365, label: 'Daily' },
    ],
    assumptions: [
      'Contributions are made at the end of each month.',
      'The annual rate is nominal and compounded at the frequency you choose; it is then converted to an equivalent monthly rate.',
      'The rate is constant. Real returns vary and may be negative; taxes, fees and inflation are not modelled.',
    ],
  },
  loan: {
    defaults: { principal: 250000, annualRate: 6.5, term: 25, termUnit: 'years' as 'years' | 'months' },
    limits: { maxPrincipal: 1_000_000_000, minRate: 0, maxRate: 40, maxMonths: 600 },
    assumptions: [
      'A fixed rate and a level monthly payment are assumed, with interest accruing monthly (annual rate ÷ 12).',
      'Payment is rounded to the nearest cent; the final payment is adjusted to clear the balance.',
      'Fees, insurance, taxes, rate changes and early repayments are not modelled.',
    ],
  },
  breakEven: {
    defaults: { fixedCosts: 18000, price: 45, variableCost: 21, targetProfit: 0 },
    limits: { maxValue: 1_000_000_000 },
    assumptions: [
      'Price and variable cost per unit are constant at every volume.',
      'Fixed costs are treated as constant across the range shown.',
      'Break-even units are rounded up to the next whole unit because you cannot sell part of a unit.',
    ],
  },
  homePreview: {
    defaults: { initial: 5000, monthly: 200, annualRate: 5, years: 15 },
  },
};
