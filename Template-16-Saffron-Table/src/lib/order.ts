import type { MenuItem } from '../config/types';

export interface OrderSettings {
  taxRate: number;
  serviceChargeRate: number;
  taxAppliesToServiceCharge: boolean;
  maxQuantity: number;
}
export interface OrderLine {
  itemId: string;
  qty: number;
}
export interface PricedLine {
  item: MenuItem;
  qty: number;
  lineCents: number;
}
export interface OrderTotals {
  lines: PricedLine[];
  itemCount: number;
  subtotalCents: number;
  serviceCents: number;
  taxCents: number;
  totalCents: number;
}

export const toCents = (price: number): number => Math.round(price * 100);

export const clampQty = (qty: number, max: number): number => Math.max(0, Math.min(max, Math.floor(Number.isFinite(qty) ? qty : 0)));

export function calculateOrder(lines: OrderLine[], items: MenuItem[], s: OrderSettings): OrderTotals {
  const priced: PricedLine[] = [];
  for (const line of lines) {
    const item = items.find((i) => i.id === line.itemId);
    const qty = clampQty(line.qty, s.maxQuantity);
    if (!item || !item.available || qty === 0) continue;
    priced.push({ item, qty, lineCents: toCents(item.price) * qty });
  }
  const subtotalCents = priced.reduce((sum, l) => sum + l.lineCents, 0);
  const serviceCents = Math.round(subtotalCents * s.serviceChargeRate);
  const taxBase = s.taxAppliesToServiceCharge ? subtotalCents + serviceCents : subtotalCents;
  const taxCents = Math.round(taxBase * s.taxRate);
  return {
    lines: priced,
    itemCount: priced.reduce((n, l) => n + l.qty, 0),
    subtotalCents,
    serviceCents,
    taxCents,
    totalCents: subtotalCents + serviceCents + taxCents,
  };
}

export function addLine(lines: OrderLine[], itemId: string, max: number, by = 1): OrderLine[] {
  const existing = lines.find((l) => l.itemId === itemId);
  if (existing) return lines.map((l) => (l.itemId === itemId ? { ...l, qty: clampQty(l.qty + by, max) } : l)).filter((l) => l.qty > 0);
  return clampQty(by, max) > 0 ? [...lines, { itemId, qty: clampQty(by, max) }] : lines;
}

export const setLineQty = (lines: OrderLine[], itemId: string, qty: number, max: number): OrderLine[] =>
  lines.map((l) => (l.itemId === itemId ? { ...l, qty: clampQty(qty, max) } : l)).filter((l) => l.qty > 0);

export const removeLine = (lines: OrderLine[], itemId: string): OrderLine[] => lines.filter((l) => l.itemId !== itemId);
