import { useMemo, useState } from 'react';
import { calculators } from '../../config/calculators';
import { site } from '../../config/site';
import { breakEvenSeries, computeBreakEven, validateBreakEven, type BreakEvenFields } from '../../lib/finance';
import { currencySymbol, formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from '../../lib/format';
import { Button } from '../Button';
import { Chart } from '../Chart';
import { Icon } from '../Icon';
import { NumberField } from './NumberField';
import { Notice } from '../DemoNotice';

const d = calculators.breakEven.defaults;
const initial = (): Record<BreakEvenFields, string> => ({
  fixedCosts: String(d.fixedCosts),
  price: String(d.price),
  variableCost: String(d.variableCost),
  targetProfit: String(d.targetProfit),
});

export function BreakEvenCalculator() {
  const [raw, setRaw] = useState(initial);
  const set = (k: BreakEvenFields) => (v: string) => setRaw((r) => ({ ...r, [k]: v }));
  const validated = useMemo(() => validateBreakEven(raw), [raw]);
  const result = useMemo(() => (validated.ok ? computeBreakEven(validated.value) : null), [validated]);
  const errors = validated.ok ? {} : validated.errors;
  const sym = currencySymbol();

  const chart = useMemo(() => {
    if (!validated.ok || !result || result.status !== 'ok') return null;
    const maxUnits = Math.max(10, Math.ceil(Math.max(result.units, result.targetUnits) * 1.6));
    const pts = breakEvenSeries(validated.value, maxUnits, 24);
    return { pts, maxUnits };
  }, [validated, result]);

  return (
    <div className="calc">
      <form className="calc__inputs" onSubmit={(e) => e.preventDefault()} aria-label="Break-even inputs" noValidate>
        <NumberField name="fixedCosts" label="Fixed costs" prefix={sym} value={raw.fixedCosts} onChange={set('fixedCosts')} error={errors.fixedCosts} hint="Costs that do not change with volume (rent, salaries, subscriptions)." />
        <NumberField name="price" label="Selling price per unit" prefix={sym} value={raw.price} onChange={set('price')} error={errors.price} />
        <NumberField name="variableCost" label="Variable cost per unit" prefix={sym} value={raw.variableCost} onChange={set('variableCost')} error={errors.variableCost} hint="Materials, fulfilment, fees and anything that scales per unit." />
        <NumberField name="targetProfit" label="Target profit (optional)" prefix={sym} value={raw.targetProfit} onChange={set('targetProfit')} error={errors.targetProfit} hint="Leave at 0 for a pure break-even." />
        <Button variant="secondary" onClick={() => setRaw(initial())}>
          <Icon name="reset" size={16} /> Reset to defaults
        </Button>
      </form>

      <div className="calc__output">
        {!validated.ok && (
          <Notice tone="warn" title="Check your inputs">
            Fix the highlighted fields to see your break-even point.
          </Notice>
        )}
        {result?.status === 'impossible' && (
          <Notice tone="error" title="This scenario cannot break even">
            {result.reason} Contribution margin is {formatCurrency(result.contributionMargin, { cents: true })} per unit — raise the price or reduce variable cost.
          </Notice>
        )}
        {validated.ok && result?.status === 'ok' && chart && (
          <>
            <div className="results results--4" role="group" aria-label="Break-even results">
              <div className="result result--primary">
                <span className="result__label">Break-even units</span>
                <strong className="result__value" aria-live="polite" data-testid="be-units">{formatNumber(result.units)}</strong>
                <span className="result__note">{result.units === 0 ? 'No fixed costs to recover' : `Exact: ${formatNumber(result.unitsExact, 2)} (rounded up)`}</span>
              </div>
              <div className="result">
                <span className="result__label">Break-even revenue</span>
                <strong className="result__value" data-testid="be-revenue">{formatCurrency(result.revenue, { cents: true })}</strong>
                <span className="result__note">Fixed costs ÷ margin ratio</span>
              </div>
              <div className="result">
                <span className="result__label">Contribution margin</span>
                <strong className="result__value" data-testid="be-cm">{formatCurrency(result.contributionMargin, { cents: true })}</strong>
                <span className="result__note">{formatPercent(result.marginRatio)} of price, per unit</span>
              </div>
              {validated.value.targetProfit > 0 && (
                <div className="result">
                  <span className="result__label">Units for target profit</span>
                  <strong className="result__value" data-testid="be-target">{formatNumber(result.targetUnits)}</strong>
                  <span className="result__note">Revenue {formatCurrency(result.targetRevenue)}</span>
                </div>
              )}
            </div>
            <Chart
              kind="lines"
              xs={chart.pts.map((p) => p.units)}
              series={[
                { name: 'Revenue', values: chart.pts.map((p) => p.revenue), color: 'var(--c-bronze)' },
                { name: 'Total cost', values: chart.pts.map((p) => p.totalCost), color: 'var(--c-navy3)' },
              ]}
              xFormat={(u) => formatNumber(u, 0)}
              yFormat={formatCompactCurrency}
              valueFormat={(v) => formatCurrency(v)}
              xTitle="Units sold"
              ariaLabel="Revenue and total cost by units sold, crossing at the break-even point"
              markers={[{ x: result.unitsExact, label: `Break-even ≈ ${formatNumber(result.unitsExact, 0)} units` }]}
            />
          </>
        )}
        <div className="explainer">
          <h3>How this is calculated</h3>
          <p>
            Contribution margin = price − variable cost per unit. Break-even units = fixed costs ÷ contribution margin (rounded up to a whole unit).
            Break-even revenue = break-even units (unrounded) × price. A target profit simply adds to the fixed costs to be recovered.
          </p>
          <ul>
            {calculators.breakEven.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p className="explainer__disclaimer">{site.legal.calculatorDisclaimer}</p>
        </div>
      </div>
    </div>
  );
}
