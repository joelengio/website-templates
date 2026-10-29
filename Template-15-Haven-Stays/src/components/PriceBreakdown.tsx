import { formatDate } from '../lib/dates';
import { cents } from '../lib/format';
import type { Quote } from '../lib/pricing';

/** Transparent nightly price breakdown with fees, discount, taxes and total. */
export default function PriceBreakdown({ quote, compact = false }: { quote: Quote; compact?: boolean }) {
  const grouped = quote.nightly;
  return (
    <div className="pricing" aria-label="Price breakdown">
      <details open={!compact && grouped.length <= 7}>
        <summary>{quote.nights} {quote.nights === 1 ? 'night' : 'nights'} · {quote.planName}</summary>
        <div className="table-wrap">
          <table className="price-table">
            <caption className="sr-only">Nightly rates</caption>
            <thead>
              <tr><th scope="col">Night</th><th scope="col">Season</th><th scope="col" className="num">Rate</th></tr>
            </thead>
            <tbody>
              {grouped.map((n) => (
                <tr key={n.date}>
                  <th scope="row">{formatDate(n.date, { weekday: 'short', day: 'numeric', month: 'short' })}</th>
                  <td>{n.season}{n.weekend ? ' · weekend' : ''}</td>
                  <td className="num">{cents(n.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <dl className="totals">
        <div><dt>Room charge</dt><dd>{cents(quote.roomSubtotal)}</dd></div>
        {quote.addons.map((a) => <div key={a.id}><dt>{a.label}</dt><dd>{cents(a.amount)}</dd></div>)}
        {quote.discount && <div className="totals__discount"><dt>{quote.discount.label}{quote.discount.code ? ` (${quote.discount.code})` : ''}</dt><dd>−{cents(quote.discount.amount)}</dd></div>}
        {quote.fees.map((f) => <div key={f.id}><dt>{f.label}</dt><dd>{cents(f.amount)}</dd></div>)}
        {quote.taxes.map((t) => <div key={t.id}><dt>{t.label}</dt><dd>{cents(t.amount)}</dd></div>)}
        <div className="totals__total"><dt>Total (demonstration)</dt><dd>{cents(quote.total)}</dd></div>
      </dl>
    </div>
  );
}
