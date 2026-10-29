import { readJson, writeJson } from './storage';

export const INQUIRIES_KEY = 'saffron-table:inquiries:v1';

export interface SavedInquiry {
  ref: string;
  kind: 'private-dining' | 'experience' | 'contact';
  subject: string;
  createdAt: string;
  summary: Record<string, string>;
}

/** Stores a demo inquiry locally only. Nothing is transmitted anywhere. */
export function saveInquiry(kind: SavedInquiry['kind'], subject: string, summary: Record<string, string>, now = new Date()): SavedInquiry {
  const ref = `DEMO-${Math.floor(Math.random() * 1e6).toString(36).toUpperCase().padStart(4, '0')}`;
  const record: SavedInquiry = { ref, kind, subject, createdAt: now.toISOString(), summary };
  const list = readJson<SavedInquiry[]>(INQUIRIES_KEY, []);
  writeJson(INQUIRIES_KEY, [record, ...(Array.isArray(list) ? list : [])].slice(0, 20));
  return record;
}
