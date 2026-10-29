import { useMemo, useState } from 'react';
import { calculators } from '../../config/calculators';
import { site } from '../../config/site';
import { computeLoan, validateLoan, type LoanFields } from '../../lib/finance';
import { currencySymbol, formatCompactCurrency, formatCurrency } from '../../lib/format';
import { Button } from '../Button';
import { Chart } from '../Chart';
import { Icon } from '../Icon';
import { NumberField } from './NumberField';
import { Notice } from '../DemoNotice';

const d = calculators.loan.defaults;
const initial = (): Record<LoanFields, string> => ({ principal: String(d.principal), annualRate: String(d.annualRate), term: String(d.term) });

export function LoanCalculator() {
  const [raw, setRaw] = useState(initial);
  const [unit, setUnit] = useState<'years' | 'months'>(d.termUnit);
  const [showMonthly, setShowMonthly] = useState(false);
  const set = (k: LoanFields) => (v: string) => setRaw((r) => ({ ...r, [k]: v }));
  const validated = useMemo(() => validateLoan(raw, unit), [raw, unit]);
  const result = useMemo(() => (validated.ok ? computeLoan(validated.value) : null), [validated]);
  const errors = validated.ok ? {} : validated.errors;
  const sym = currencySymbol();

  return (
    <div className="calc">
      <form className="calc__inputs" onSubmit={(e) => e.preventDefault()} aria-label="Loan payment inputs" noValidate>
        <NumberField name="principal" label="Loan amount" prefix={sym} value={raw.principal} onChange={set('principal')} error={errors.principal} />
        <NumberField name="annualRate" label="Annual interest rate" suffix="% / year" value={raw.annualRate} onChange={set('annualRate')} error={errors.annualRate} hint="Nominal rate; interest accrues monthly." />
        <div className="field-row">
          <NumberField name="term" label="Loan term" inputMode="numeric" value={raw.term} onChange={set('term')} error={errors.term} />
          <div className="field">
            <label htmlFor="term-unit">Term unit</label>
            <select id="term-unit" value={unit} onChange={(e) => setUnit(e.target.value as 'years' | 'months')}>
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
        <Button variant="secondary" onClick={() => { setRaw(initial()); setUnit(d.termUnit); }}>
          <Icon name="reset" size={16} /> Reset to defaults
        </Button>
      </form>

      <div className="calc__output">
        {result && validated.ok ? (
          <>
            <div className="results" role="group" aria-label="Loan payment results">
              <div className="result result--primary">
                <span className="result__label">Estimated monthly payment</span>
                <strong className="result__value" aria-live="polite" data-testid="loan-payment">{formatCurrency(result.monthlyPayment, { cents: true })}</strong>
                <span className="result__note">{validated.value.termMonths} monthly payments</span>
              </div>
              <div className="result">
                <span className="result__label">Total interest</span>
                <strong className="result__value" data-testid="loan-interest">{formatCurrency(result.totalInterest, { cents: true })}</strong>
                <span className="result__note">Over the full term</span>
              </div>
              <div className="result">
                <span className="result__label">Total payments</span>
                <strong className="result__value" data-testid="loan-total">{formatCurrency(result.totalPayments, { cents: true })}</strong>
                <span className="result__note">Principal + interest</span>
              </div>
            </div>
            <Chart
              kind="stackedBars"
              xs={result.yearly.map((y) => y.year)}
              series={[
                { name: 'Principal repaid', values: result.yearly.map((y) => y.principal), color: 'var(--c-navy3)' },
                { name: 'Interest paid', values: result.yearly.map((y) => y.interest), color: 'var(--c-bronze)' },
              ]}
              xFormat={(y) => `Year ${y}`}
              yFormat={formatCompactCurrency}
              valueFormat={(v) => formatCurrency(v)}
              xTitle="Year of loan"
              ariaLabel="Yearly split of loan payments between principal and interest"
              showTotal
              totalLabel="Paid in year"
            />
            <div className="schedule">
              <div className="schedule__head">
                <h3>Amortization schedule</h3>
                <Button variant="ghost" aria-expanded={showMonthly} onClick={() => setShowMonthly((v) => !v)}>
                  {showMonthly ? 'Show yearly summary' : 'Show every monthly payment'}
                </Button>
              </div>
              <div className="table-scroll table-scroll--tall" role="region" aria-label="Amortization schedule" tabIndex={0}>
                <table>
                  <caption className="sr-only">{showMonthly ? 'Monthly amortization schedule' : 'Yearly amortization summary'}</caption>
                  <thead>
                    <tr>
                      <th scope="col">{showMonthly ? 'Payment #' : 'Year'}</th>
                      <th scope="col">Principal</th>
                      <th scope="col">Interest</th>
                      <th scope="col">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showMonthly
                      ? result.schedule.map((r) => (
                          <tr key={r.n}>
                            <th scope="row">{r.n}</th>
                            <td>{formatCurrency(r.principal, { cents: true })}</td>
                            <td>{formatCurrency(r.interest, { cents: true })}</td>
                            <td>{formatCurrency(r.balance, { cents: true })}</td>
                          </tr>
                        ))
                      : result.yearly.map((y) => (
                          <tr key={y.year}>
                            <th scope="row">{y.year}</th>
                            <td>{formatCurrency(y.principal, { cents: true })}</td>
                            <td>{formatCurrency(y.interest, { cents: true })}</td>
                            <td>{formatCurrency(y.endBalance, { cents: true })}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <Notice tone="warn" title="Check your inputs">
            Fix the highlighted fields to see your payment estimate. The loan amount and term must be greater than zero.
          </Notice>
        )}
        <div className="explainer">
          <h3>How this is calculated</h3>
          <p>
            With monthly rate <code>r = annual rate ÷ 12</code> and <em>n</em> payments, the level payment is <code>P·r ÷ (1 − (1 + r)^−n)</code> (or <code>P ÷ n</code> at 0%).
            Each month, interest = balance × r and the rest of the payment reduces principal.
          </p>
          <ul>
            {calculators.loan.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p className="explainer__disclaimer">{site.legal.calculatorDisclaimer}</p>
        </div>
      </div>
    </div>
  );
}
