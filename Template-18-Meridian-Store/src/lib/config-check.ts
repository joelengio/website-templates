import { commerce } from '../config/commerce';
import { categories, collections } from '../config/collections';
import { productInputs } from '../config/products';
import type { CommerceConfig, ProductInput } from '../config/types';

export interface ConfigIssue {
  severity: 'error' | 'warning';
  where: string;
  message: string;
}

/**
 * Validates the editable configuration and reports problems (duplicate IDs, missing categories, negative prices, bad stock, broken variant matrices…).
 * Run in development (see main.tsx) and by the unit tests. Runtime calculations additionally clamp invalid numbers so bad config can never produce negative totals.
 */
export function checkConfig(products: ProductInput[] = productInputs, cfg: CommerceConfig = commerce): ConfigIssue[] {
  const issues: ConfigIssue[] = [];
  const add = (severity: ConfigIssue['severity'], where: string, message: string) => issues.push({ severity, where, message });
  const dup = (label: string, values: string[]) => values.filter((v, i) => values.indexOf(v) !== i).forEach((v) => add('error', label, `Duplicate value "${v}".`));
  dup('product.id', products.map((p) => p.id)); dup('product.slug', products.map((p) => p.slug)); dup('product.sku', products.map((p) => p.sku));

  for (const p of products) {
    const w = `product ${p.slug}`;
    if (!Number.isFinite(p.price) || p.price < 0) add('error', w, `Invalid price ${p.price}.`);
    if (p.compareAtPrice !== undefined && p.compareAtPrice <= p.price) add('warning', w, 'compareAtPrice is not higher than price, so no sale is shown.');
    if (!categories.some((c) => c.id === p.category)) add('error', w, `Unknown category "${p.category}".`);
    if (p.currency && p.currency !== cfg.currency.code) add('error', w, `Currency ${p.currency} differs from the store currency ${cfg.currency.code}; multi-currency catalogues are not supported.`);
    if (!p.images.length) add('error', w, 'At least one image is required.');
    if (p.images.some((i) => !i.alt.trim())) add('error', w, 'Every image needs alt text.');
    if (!p.variants.length) add('error', w, 'At least one variant is required.');
    const seen = new Set<string>();
    for (const v of p.variants) {
      if (!Number.isInteger(v.stock) || v.stock < 0) add('error', w, `Invalid stock ${v.stock}.`);
      if (v.price !== undefined && (!Number.isFinite(v.price) || v.price < 0)) add('error', w, `Invalid variant price ${v.price}.`);
      const key = p.options.map((o) => v.options[o.name]).join('|');
      if (seen.has(key)) add('error', w, `Duplicate variant for ${key}.`);
      seen.add(key);
      for (const o of p.options) if (!o.values.some((x) => x.value === v.options[o.name])) add('error', w, `Variant uses unknown ${o.name} value "${v.options[o.name]}".`);
    }
    if (p.imageOption && !p.options.some((o) => o.name === p.imageOption)) add('error', w, `imageOption "${p.imageOption}" is not an option.`);
  }
  for (const c of collections) for (const s of c.products) if (!products.some((p) => p.slug === s)) add('error', `collection ${c.slug}`, `Unknown product slug "${s}".`);

  for (const z of cfg.shipping.zones) for (const m of z.methods) {
    if (!Number.isFinite(m.price) || m.price < 0) add('error', `shipping ${z.id}/${m.id}`, `Invalid price ${m.price}.`);
    if (m.freeOver !== undefined && (!Number.isFinite(m.freeOver) || m.freeOver < 0)) add('error', `shipping ${z.id}/${m.id}`, `Invalid freeOver ${m.freeOver}.`);
  }
  for (const r of cfg.tax.rates) if (!Number.isFinite(r.ratePct) || r.ratePct < 0 || r.ratePct > 100) add('error', `tax ${r.country}${r.region ? `/${r.region}` : ''}`, `Invalid rate ${r.ratePct}.`);
  for (const pr of cfg.promos) {
    if (pr.type === 'percent' && (pr.value <= 0 || pr.value > 100)) add('error', `promo ${pr.code}`, 'Percent value must be between 0 and 100.');
    if (pr.type === 'fixed' && !(pr.value > 0)) add('error', `promo ${pr.code}`, 'Fixed value must be positive.');
  }
  dup('promo.code', cfg.promos.map((p) => p.code.toUpperCase()));
  if (!cfg.shipping.zones.some((z) => z.countries.includes(cfg.defaultCountry))) add('error', 'commerce.defaultCountry', 'No shipping zone covers the default country.');
  return issues;
}
