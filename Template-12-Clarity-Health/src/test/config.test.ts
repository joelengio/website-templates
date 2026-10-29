import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { articles } from '../config/articles';
import { doctors } from '../config/doctors';
import { facilities } from '../config/facilities';
import { home, homeSections } from '../config/home';
import { images } from '../config/images';
import { navigation, footerGroups } from '../config/navigation';
import { serviceCategories, services } from '../config/services';
import { site } from '../config/site';
import { specialties } from '../config/specialties';
import { testimonials } from '../config/testimonials';
import { isIconName } from '../components/icon-paths';

const publicDir = path.resolve(__dirname, '../../public');

describe('content requirements', () => {
  it('has at least eight specialties, eight doctors and a rich service catalog', () => {
    expect(specialties.length).toBeGreaterThanOrEqual(8);
    expect(doctors.length).toBeGreaterThanOrEqual(8);
    expect(services.length).toBeGreaterThanOrEqual(25);
    for (const c of serviceCategories) expect(services.some((s) => s.category === c.id), c.id).toBe(true);
  });
  it('links every doctor, service and article to existing entities', () => {
    const ids = new Set(specialties.map((s) => s.id));
    for (const d of doctors) expect(ids.has(d.specialtyId), d.id).toBe(true);
    for (const s of services) for (const id of s.specialtyIds) expect(ids.has(id), s.id).toBe(true);
    for (const a of articles) if (a.relatedSpecialty) expect(ids.has(a.relatedSpecialty)).toBe(true);
    for (const s of specialties) expect(doctors.some((d) => d.specialtyId === s.id), s.id).toBe(true);
    for (const s of specialties) expect(services.some((x) => x.specialtyIds.includes(s.id)), s.id).toBe(true);
  });
  it('references only registered images that exist on disk', () => {
    const used = [
      ...specialties.map((s) => s.image), ...doctors.map((d) => d.image), ...facilities.map((f) => f.image), ...articles.map((a) => a.image),
      ...serviceCategories.map((c) => c.image), ...site.locations.map((l) => l.image), home.hero.image, home.hero.floatingImage, home.intro.image, home.contact.image
    ];
    for (const key of used) {
      expect(images[key], key).toBeDefined();
      expect(existsSync(path.join(publicDir, images[key].src)), images[key]?.src).toBe(true);
    }
    for (const a of Object.values(images)) expect(a.alt.length).toBeGreaterThan(10);
    expect(existsSync(path.join(publicDir, site.seo.ogImage))).toBe(true);
    expect(existsSync(path.join(publicDir, site.brand.favicon))).toBe(true);
    expect(existsSync(path.join(publicDir, site.brand.logo))).toBe(true);
  });
  it('labels doctors, testimonials and the clinic as fictional', () => {
    for (const d of doctors) expect(d.qualifications.join(' ')).toMatch(/fictional/i);
    for (const t of testimonials) expect(t.context).toMatch(/fictional/i);
    expect(site.contact.email.endsWith('.example')).toBe(true);
    expect(site.notices.emergency).toMatch(/emergency/i);
    expect(site.notices.privacy).toMatch(/not sent|Nothing is sent/i);
  });
  it('uses valid icon names and navigation targets', () => {
    for (const s of specialties) expect(isIconName(s.icon)).toBe(true);
    for (const n of navigation) expect(n.to.startsWith('/')).toBe(true);
    expect(footerGroups.length).toBeGreaterThan(0);
  });
  it('has an unambiguous home section list', () => {
    const ids = homeSections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('never claims accreditation, certification or regulatory compliance', () => {
    const text = JSON.stringify({ about: articles, site: site.notices }).toLowerCase();
    expect(text).not.toMatch(/hipaa[- ]compliant|gdpr[- ]compliant|accredited by|award-winning|clinically proven/);
  });
});
