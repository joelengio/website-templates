import { useMemo, useState } from 'react';
import { calculators } from '../../config/calculators';
import { site } from '../../config/site';
import { computeCompound, validateCompound, type CompoundFields } from '../../lib/finance';
import { currencySymbol, formatCompactCurrency, formatCurrency, formatPercent } from '../../lib/format';
import { Button } from '../Button';
import { Chart } from '../Chart';
import { Icon } from '../Icon';
import { NumberField } from './NumberField';
import { Notice } from '../DemoNotice';

const d = calculators.compound.defaults;
const initial = (): Record<CompoundFields, string> => ({
  initial: String(d.initial),
  monthly: String(d.monthly),
  annualRate: String(d.annualRate),
  years: String(d.years),
  frequency: String(d.frequency),
});

export function CompoundCalculator() {
  const [raw, setRaw] = useState(initial);
  const set = (k: CompoundFields) => (v: string) => setRaw((r) => ({ ...r, [k]: v }));
  const validated = useMemo(() => validateCompound(raw), [raw]);
  const result = useMemo(() => (validated.ok ? computeCompound(validated.value) : null), [validated]);
  const errors = validated.ok ? {} : validated.errors;
  const sym = currencySymbol();

  return (
    <div className="calc">
      <form className="calc__inputs" onSubmit={(e) => e.preventDefault()} aria-label="Savings and compound growth inputs" noValidate>
        <NumberField name="initial" label="Starting amount" prefix={sym} value={raw.initial} onChange={set('initial')} error={errors.initial} />
        <NumberField name="monthly" label="Monthly contribution" prefix={sym} value={raw.monthly} onChange={set('monthly')} error={errors.monthly} hint="Added at the end of each month." />
        <NumberField name="annualRate" label="Annual return assumption" suffix="% / year" value={raw.annualRate} onChange={set('annualRate')} error={errors.annualRate} hint="An assumption you choose — not a prediction." />
        <NumberField name="years" label="Time horizon" suffix="years" inputMode="numeric" value={raw.years} onChange={set('years')} error={errors.years} />
        <div className="field">
          <label htmlFor="frequency">Compounding frequency</label>
          <select id="frequency" value={raw.frequency} onChange={(e) => set('frequency')(e.target.value)}>
            {calculators.compound.frequencies.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <Button variant="secondary" onClick={() => setRaw(initial())}>
          <Icon name="reset" size={16} /> Reset to defaults
        </Button>
      </form>

      <div className="calc__output">
        {result ? (
          <>
            <div className="results" role="group" aria-label="Savings projection results">
              <div className="result result--primary">
                <span className="result__label">Estimated future value</span>
                <strong className="result__value" aria-live="polite" data-testid="compound-fv">{formatCurrency(result.futureValue, { cents: true })}</strong>
                <span className="result__note">After {validated.ok && validated.value.years} years — an estimate</span>
              </div>
              <div className="result">
                <span className="result__label">Total contributions</span>
                <strong className="result__value" data-testid="compound-contrib">{formatCurrency(result.totalContributions, { cents: true })}</strong>
                <span className="result__note">Starting amount + monthly deposits</span>
              </div>
              <div className="result">
                <span className="result__label">Estimated growth</span>
                <strong className="result__value" data-testid="compound-growth">{formatCurrency(result.growth, { cents: true })}</strong>
                <span className="result__note">Effective annual rate {formatPercent(result.effectiveAnnualRate, 2)}</span>
              </div>
            </div>
            <Chart
              kind="stackedArea"
              xs={result.series.map((p) => p.year)}
              series={[
                { name: 'Your contributions', values: result.series.map((p) => p.contributions), color: 'var(--c-navy3)' },
                { name: 'Estimated growth', values: result.series.map((p) => Math.max(0, p.growth)), color: 'var(--c-bronze)' },
              ]}
              xFormat={(y) => `Year ${y}`}
              yFormat={formatCompactCurrency}
              valueFormat={(v) => formatCurrency(v)}
              xTitle="Year"
              ariaLabel="Projected balance by year, split between contributions and estimated growth"
              showTotal
              totalLabel="Estimated balance"
            />
          </>
        ) : (
          <Notice tone="warn" title="Check your inputs">
            Fix the highlighted fields to see your estimate. Every field needs a valid number within the stated limits.
          </Notice>
        )}
        <Explainer />
      </div>
    </div>
  );
}

function Explainer() {
  return (
    <div className="explainer">
      <h3>How this is calculated</h3>
      <p>
        The nominal annual rate is converted to an equivalent monthly rate <code>r = (1 + rate ÷ n)^(n ÷ 12) − 1</code>, where <em>n</em> is the compounding frequency.
        The balance after <em>m</em> months is <code>P·(1+r)^m + C·((1+r)^m − 1) ÷ r</code> for a starting amount <em>P</em> and monthly contribution <em>C</em>
        (or <code>P + C·m</code> when the rate is zero).
      </p>
      <ul>
        {calculators.compound.assumptions.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <p className="explainer__disclaimer">{site.legal.calculatorDisclaimer}</p>
    </div>
  );
}
