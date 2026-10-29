/** Case- and accent-insensitive text matching shared by the specialty, doctor, service and article searches. */
export const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .toLowerCase();

/** True when every whitespace-separated term in `query` appears somewhere in the haystack strings. */
export function matchesQuery(query: string, ...haystack: (string | (string | undefined)[] | undefined)[]): boolean {
  const terms = norm(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const text = norm(haystack.flat().filter(Boolean).join(' '));
  return terms.every((t) => text.includes(t));
}
