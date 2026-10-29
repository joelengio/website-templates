import { useSyncExternalStore } from 'react';
import { orderSettings } from '../config/features';
import { addLine, removeLine, setLineQty, type OrderLine } from './order';
import { readJson, writeJson } from './storage';

export const ORDER_KEY = 'saffron-table:order:v1';

const sanitize = (raw: unknown): OrderLine[] =>
  Array.isArray(raw)
    ? raw.filter((l): l is OrderLine => !!l && typeof l.itemId === 'string' && Number.isInteger(l.qty) && l.qty > 0)
    : [];

let lines: OrderLine[] = sanitize(readJson<unknown>(ORDER_KEY, []));
const listeners = new Set<() => void>();
const commit = (next: OrderLine[]) => {
  lines = next;
  writeJson(ORDER_KEY, lines);
  listeners.forEach((l) => l());
};

export const orderStore = {
  getSnapshot: () => lines,
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  add: (itemId: string) => commit(addLine(lines, itemId, orderSettings.maxQuantity)),
  setQty: (itemId: string, qty: number) => commit(setLineQty(lines, itemId, qty, orderSettings.maxQuantity)),
  remove: (itemId: string) => commit(removeLine(lines, itemId)),
  clear: () => commit([]),
};

export const useOrderLines = (): OrderLine[] => useSyncExternalStore(orderStore.subscribe, orderStore.getSnapshot, orderStore.getSnapshot);
