import type { ReactNode } from 'react';
import { formatMoney } from '../lib/money';
import type { Totals } from '../lib/pricing';

interface Row { label: string; value: string; strong?: boolean; tone?: 'discount' | 'muted'; note?: string }

/** Totals table used by the bag, checkout, confirmation and order history so every screen shows identical numbers. */
export function TotalsTable({ totals, currency, shippingLabel, totalLabel = 'Estimated total', extra }: { totals: Pick<Totals, 'subtotalMinor' | 'discountMinor' | 'shippingMinor' | 'taxMinor' | 'taxLabel' | 'taxInclusive' | 'totalMinor'> & { promo?: { code: string } | undefined }; currency?: string; shippingLabel?: string; totalLabel?: string; extra?: ReactNode }) {
  const f = (n: number) => formatMoney(n, { currency });
  const rows: Row[] = [{ label: 'Subtotal', value: f(totals.subtotalMinor) }];
  if (totals.discountMinor > 0) rows.push({ label: `Discount${totals.promo ? ` (${totals.promo.code})` : ''}`, value: `−${f(totals.discountMinor)}`, tone: 'discount' });
  rows.push({ label: shippingLabel ?? 'Shipping', value: totals.shippingMinor === 0 ? 'Free' : f(totals.shippingMinor) });
  rows.push({ label: totals.taxInclusive ? `${totals.taxLabel}` : totals.taxLabel, value: totals.taxInclusive ? `${f(totals.taxMinor)} included` : f(totals.taxMinor), tone: 'muted' });
  return (
    <div className="totals">
      <dl>
        {rows.map((r) => (
          <div key={r.label} className={`totals-row${r.tone ? ` is-${r.tone}` : ''}`}><dt>{r.label}</dt><dd>{r.value}</dd></div>
        ))}
        <div className="totals-row is-total"><dt>{totalLabel}</dt><dd>{f(totals.totalMinor)}</dd></div>
      </dl>
      {extra}
    </div>
  );
}
