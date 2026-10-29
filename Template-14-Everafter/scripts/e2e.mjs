// Real-browser end-to-end checks against the production build served by `vite preview`.
// Usage: npm run build && npm run test:e2e   (set CHROMIUM_PATH if Chromium is not auto-detected)
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { launch, open, routesFromConfig, startServer } from './lib.mjs';

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? ' — ' + detail : ''}`);
};

const { base: BASE, stop } = await startServer(4179);
const browser = await launch();
const routes = await routesFromConfig();
console.log(`Discovered ${routes.length} routes from sitemap.xml`);
const widths = [360, 390, 768, 1024, 1440];
const quick = !!process.env.E2E_QUICK; // skip the long per-route sweeps while iterating

// 1. Every route at every breakpoint: direct URL access, console errors, broken images, overflow, headings, alt text, targets
await Promise.all((quick ? [] : widths).map(async (w) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  const errors = [], failed = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => failed.push(r.url()));
  page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  const bad = [];
  for (const r of routes) {
    await open(page, BASE, r);
    const info = await page.evaluate(() => {
      const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => +h.tagName[1]);
      let skip = 0;
      heads.forEach((l, i) => { if (i > 0 && l - heads[i - 1] > 1) skip++; });
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
        h1: document.querySelectorAll('h1').length,
        headingSkips: skip,
        noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
        titleOk: document.title.length > 8 && document.title !== 'EVERAFTER',
        desc: !!document.querySelector('meta[name=description]')?.content,
        canonical: !!document.querySelector('link[rel=canonical]')?.href,
        small: [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea')].filter((e) => {
          const b = e.getBoundingClientRect();
          const cs = getComputedStyle(e);
          return b.width > 0 && b.height > 0 && (b.height < 24 || b.width < 24) && !e.closest('.sr-only') && cs.position !== 'absolute' && cs.opacity !== '0' && !['radio', 'checkbox'].includes(e.type) && !e.classList.contains('skip-link') && !(cs.display === 'inline' && e.parentElement.textContent.trim().length > e.textContent.trim().length + 2);
        }).map((e) => e.outerHTML.slice(0, 90))
      };
    });
    if (info.overflow > 0 || info.broken.length || info.h1 !== 1 || info.headingSkips || info.noAlt || !info.titleOk || !info.desc || !info.canonical || info.small.length) bad.push({ r, ...info });
  }
  check(`[${w}px] ${routes.length} routes: direct access, no overflow, no broken images, one h1, heading order, alt text, SEO tags, touch targets`, bad.length === 0, JSON.stringify(bad).slice(0, 600));
  check(`[${w}px] no console errors or failed requests`, errors.length === 0 && failed.length === 0, JSON.stringify({ errors, failed }).slice(0, 400));
  await ctx.close();
}));

// 2. axe-core accessibility audit: routes plus significant states
const axeSrc = readFileSync(path.resolve('node_modules/axe-core/axe.min.js'), 'utf8');
const runAxe = async (p) => {
  await p.addScriptTag({ content: axeSrc });
  return p.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.filter((x) => ['serious', 'critical', 'moderate'].includes(x.impact)).map((x) => `${x.id}[${x.impact}](${x.nodes.length}): ${x.nodes[0].target}`));
};
if (!quick) {
  const actx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const ap = await actx.newPage();
  const found = [];
  for (const r of routes) {
    await open(ap, BASE, r);
    const v = await runAxe(ap);
    if (v.length) found.push({ r, v });
  }
  check(`axe-core WCAG 2.1 A/AA (desktop): no violations on all ${routes.length} routes`, found.length === 0, JSON.stringify(found).slice(0, 1200));
  await actx.close();
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mctx.newPage();
  const foundM = [];
  for (const r of ['/', '/weddings', '/packages', '/plan', '/contact', '/journal', '/destinations', '/weddings/villa-serena-lake-como']) {
    await open(mp, BASE, r);
    const v = await runAxe(mp);
    if (v.length) foundM.push({ r, v });
  }
  check('axe-core WCAG 2.1 A/AA (mobile 390px): no violations on key routes', foundM.length === 0, JSON.stringify(foundM).slice(0, 800));
  await mctx.close();
}

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const page = await ctx.newPage();

// 3. Unknown route renders the in-app 404
await page.goto(BASE + '/definitely-missing', { waitUntil: 'networkidle' });
check('Unknown URL renders the custom 404 with noindex', (await page.locator('h1').innerText()).includes('wandered') && (await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));
await page.goto(BASE + '/weddings/not-a-real-wedding', { waitUntil: 'networkidle' });
check('Unknown wedding slug renders 404 inside the layout', (await page.locator('h1').innerText()).includes('wandered'));

// 4. Static SEO assets
for (const f of ['/robots.txt', '/sitemap.xml', '/favicon.svg', '/logo.svg', '/images/og-image.jpg']) {
  const r = await fetch(BASE + f);
  check(`${f} is served`, r.ok && !(await r.clone().text()).includes('<div id="root">'));
}
const sm = await (await fetch(BASE + '/sitemap.xml')).text();
check('sitemap lists wedding, service, destination and article URLs', ['/weddings/villa-serena-lake-como', '/services/destination-weddings', '/destinations/lake-como', '/journal/planning-for-weather'].every((u) => sm.includes(u)));
const html = await (await fetch(BASE + '/')).text();
check('index.html has description, canonical and Open Graph tags', /name="description"/.test(html) && /rel="canonical"/.test(html) && /property="og:image"/.test(html));
const fb = JSON.parse(readFileSync('firebase.json', 'utf8'));
check('firebase.json has SPA rewrite to /index.html', fb.hosting.rewrites.some((x) => x.source === '**' && x.destination === '/index.html'));

// 5. Mobile menu
await open(page, BASE, '/');
await page.getByRole('button', { name: 'Open menu' }).click();
check('Mobile menu opens (aria-expanded=true)', (await page.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded')) === 'true');
await page.keyboard.press('Escape');
check('Escape closes mobile menu and returns focus to the toggle', await page.getByRole('button', { name: 'Open menu' }).isVisible() && (await page.evaluate(() => document.activeElement?.className)) === 'menu-toggle');
await page.getByRole('button', { name: 'Open menu' }).click();
await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Weddings' }).click();
await page.waitForURL('**/weddings');
await page.getByRole('heading', { name: 'Weddings & celebrations' }).waitFor();
check('Mobile menu navigates and closes', await page.getByRole('button', { name: 'Open menu' }).isVisible());
check('Active nav item is marked aria-current on the new route', (await page.locator('.site-nav a[aria-current=page]').innerText()) === 'Weddings');

// 6. Portfolio filtering (location, style, event type, combination, empty, clear, URL state)
const cards = async () => { await page.waitForTimeout(150); return page.locator('.grid--weddings .wcard').count(); };
await open(page, BASE, '/weddings');
check('Portfolio lists at least 12 weddings', (await cards()) >= 12, String(await cards()));
await page.getByLabel('Location').selectOption('Italy');
check('Location filter: Italy shows 3', (await cards()) === 3, String(await cards()));
check('Filter state is stored in the URL', page.url().includes('location=Italy'));
await page.getByLabel('Wedding style').selectOption('Coastal Elegance');
check('Location + style filter: Italy and Coastal Elegance shows 1', (await cards()) === 1, String(await cards()));
await page.getByLabel('Event type').selectOption('Elopement');
check('Impossible combination shows the empty state', (await page.getByText('No celebrations match those filters').count()) === 1);
await page.getByRole('button', { name: 'Clear filters' }).last().click();
check('Clear filters restores all weddings', (await cards()) >= 12);
await page.getByLabel('Event type').selectOption('Elopement');
check('Event type filter: Elopement shows 1', (await cards()) === 1);
await page.goto(BASE + '/weddings?location=France&type=Wedding', { waitUntil: 'networkidle' });
check('Filters initialise from URL on direct load', (await cards()) === 1 && (await page.getByLabel('Location').inputValue()) === 'France');

// 7. Wedding detail: required fields + gallery lightbox (mouse, keyboard, thumbnails, focus)
await open(page, BASE, '/weddings/villa-serena-lake-como');
check('Detail shows story, facts, services and gallery', (await page.getByRole('heading', { name: 'The story' }).count()) === 1 && (await page.locator('.project-facts dt').count()) >= 6 && (await page.locator('.mosaic__item').count()) >= 4);
const opener = page.locator('.mosaic__item button').nth(1);
await opener.focus();
await page.keyboard.press('Enter');
check('Lightbox opens from keyboard', await page.getByRole('dialog').isVisible());
check('Lightbox shows the chosen photo (2 / n)', (await page.locator('.lightbox__count').innerText()).replace(/\s+/g, ' ').includes('2 /'));
check('Lightbox focus starts on the close button and is inside the dialog', await page.evaluate(() => document.querySelector('.lightbox').contains(document.activeElement)));
await page.keyboard.press('ArrowRight');
check('ArrowRight advances', (await page.locator('.lightbox__count').innerText()).includes('3 /'));
await page.keyboard.press('ArrowLeft');
check('ArrowLeft goes back', (await page.locator('.lightbox__count').innerText()).includes('2 /'));
await page.keyboard.press('End');
const total = (await page.locator('.lightbox__thumbs li').count());
check('End jumps to the last photo', (await page.locator('.lightbox__count').innerText()).includes(`${total} /`));
await page.keyboard.press('ArrowRight');
check('Navigation wraps around to the first photo', (await page.locator('.lightbox__count').innerText()).includes('1 /'));
await page.locator('.lightbox__thumbs button').nth(2).click();
check('Thumbnail click selects that photo', (await page.locator('.lightbox__count').innerText()).includes('3 /'));
for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
check('Tab key stays trapped inside the lightbox', await page.evaluate(() => document.querySelector('.lightbox').contains(document.activeElement)));
check('Page behind the lightbox is scroll-locked', (await page.evaluate(() => document.body.style.overflow)) === 'hidden');
await page.getByRole('button', { name: 'Next photo' }).click();
check('Next button works on mobile viewport', (await page.locator('.lightbox__count').innerText()).includes('4 /'));
{
  const v = await runAxe(page);
  check('axe: lightbox open has no violations', v.length === 0, JSON.stringify(v));
}
await page.keyboard.press('Escape');
check('Escape closes lightbox, restores scroll and returns focus to the thumbnail', !(await page.getByRole('dialog').count()) && (await page.evaluate(() => document.body.style.overflow)) === '' && (await page.evaluate(() => document.activeElement === document.querySelectorAll('.mosaic__item button')[1])));
// swipe via real touch input (Chrome DevTools Protocol)
await page.locator('.mosaic__item button').first().click();
const box = await page.locator('.lightbox__stage').boundingBox();
const cdp = await ctx.newCDPSession(page);
const y = Math.round(box.y + box.height / 2);
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: Math.round(box.x + box.width - 30), y }] });
await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: Math.round(box.x + box.width / 2), y }] });
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await page.waitForTimeout(200);
check('Swipe left advances the lightbox on touch devices', (await page.locator('.lightbox__count').innerText()).includes('2 /'));
await page.getByRole('button', { name: 'Close gallery' }).click();

// 8. Services
await open(page, BASE, '/services');
check('Services index lists 8 services', (await page.locator('.scard').count()) === 8);
for (const slug of ['full-wedding-planning', 'partial-planning', 'wedding-day-coordination', 'destination-weddings', 'venue-styling', 'floral-and-event-design', 'private-celebrations', 'corporate-events']) {
  await page.goto(BASE + '/services/' + slug, { waitUntil: 'networkidle' });
  const ok = (await page.getByRole('heading', { name: 'Planning stages' }).count()) === 1 && (await page.getByRole('heading', { name: 'Inclusions' }).count()) === 1 && (await page.locator('.accordion button').count()) >= 2 && (await page.locator('.price-tag span').count()) === 1;
  if (!ok) check(`Service page ${slug} has stages, inclusions, price and FAQs`, false);
}
check('All 8 service pages have stages, inclusions, price label and FAQs', !results.some((r) => !r.ok && r.name.startsWith('Service page')));
await page.goto(BASE + '/services/venue-styling', { waitUntil: 'networkidle' });
const q = page.locator('.accordion button').first();
await q.click();
check('FAQ accordion expands with aria-expanded', (await q.getAttribute('aria-expanded')) === 'true');
await q.click();
check('FAQ accordion collapses', (await q.getAttribute('aria-expanded')) === 'false');
await page.getByRole('link', { name: 'Enquire about this service' }).click();
await page.waitForURL('**/plan?service=styling');
await page.getByRole('radio', { name: /^Wedding/ }).check();
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('radio', { name: 'Not decided yet' }).check();
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('radio', { name: /Open to ideas|suggestions/ }).check();
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByLabel('Estimated number of guests').fill('80');
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('checkbox', { name: /Romantic garden/ }).check();
await page.getByRole('button', { name: 'Continue' }).click();
check('Service CTA pre-selects the chosen service in the questionnaire', await page.getByRole('checkbox', { name: /Venue styling/ }).isChecked());

// 9. Packages: comparison, add-ons, estimate, inquiry hand-off
await open(page, BASE, '/packages');
check('Package comparison table lists three tiers with a caption', (await page.locator('.compare thead th').count()) === 4 && (await page.locator('.compare caption').count()) === 1);
check('At least three packages with starting prices', (await page.locator('.package__price').count()) >= 3);
const before = await page.locator('.estimate__total dd').innerText();
await page.getByLabel(/Floral installation/).check();
const after = await page.locator('.estimate__total dd').innerText();
check('Selecting an add-on updates the indicative total', before !== after, `${before} -> ${after}`);
await page.getByRole('button', { name: 'Enquire about Destination' }).click();
await page.waitForURL(/\/plan\?package=destination&addons=floral-installation/);
check('Package inquiry carries package and add-ons into the questionnaire', (await page.getByText(/Enquiring about the/).innerText()).includes('Destination') && (await page.getByText(/Enquiring about the/).innerText()).includes('Floral installation'));

// 10. Destinations: category + region filters, detail page + lightbox
await open(page, BASE, '/destinations');
const dcount = async () => { await page.waitForTimeout(150); return page.locator('.dcard').count(); };
check('Destinations lists 13', (await dcount()) === 13);
await page.getByRole('button', { name: 'Coastal', exact: true }).click();
check('Category filter: Coastal shows 3', (await dcount()) === 3, String(await dcount()));
await page.getByRole('button', { name: 'Asia', exact: true }).click();
await page.getByText('No destinations match').waitFor();
check('Coastal + Asia shows the empty state', (await page.getByText('No destinations match').count()) === 1);
await page.getByRole('button', { name: 'Show all destinations' }).click();
check('Show all restores every destination', (await dcount()) === 13);
await page.getByRole('button', { name: 'Asia', exact: true }).click();
check('Region filter: Asia shows 1 (Bali)', (await dcount()) === 1);
await page.getByRole('link', { name: /Bali/ }).first().click();
await page.waitForURL('**/destinations/bali');
await page.getByRole('heading', { level: 1, name: 'Bali' }).waitFor();
check('Destination page shows planning information and gallery', (await page.locator('.project-facts dt').count()) === 4 && (await page.locator('.mosaic__item').count()) >= 4);
check('Destination page discloses that venues are not verified', (await page.getByText(/not named or verified/i).count()) >= 1);

// 11. Questionnaire
await open(page, BASE, '/plan');
check('Questionnaire discloses it is not sent to a planner', (await page.getByText(/not sent to a planner/i).count()) >= 1);
check('Progress shows Step 1 of 9', (await page.locator('.progress__text').innerText()).includes('Step 1 of 9'));
await page.getByRole('button', { name: 'Continue' }).click();
check('Step 1 validation error appears', (await page.getByText('Please choose the type of event.').count()) >= 1);
await page.getByRole('radio', { name: /^Corporate event/ }).check();
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('radio', { name: 'We have a date' }).check();
await page.getByRole('button', { name: 'Continue' }).click();
check('Date step requires a date', (await page.getByText('Please choose your preferred date.').count()) >= 1);
await page.getByLabel('Preferred date').fill('2020-01-01');
await page.getByRole('button', { name: 'Continue' }).click();
check('Past dates are rejected', (await page.getByText('Please choose a date in the future.').count()) >= 1);
await page.getByRole('radio', { name: 'We have a season' }).check();
check('Conditional: season and year fields appear for "we have a season"', (await page.getByLabel('Season', { exact: true }).count()) === 1 && (await page.getByLabel('Year', { exact: true }).count()) === 1);
await page.getByLabel('Season', { exact: true }).selectOption('autumn');
const years = await page.getByLabel('Year', { exact: true }).locator('option').allInnerTexts();
await page.getByLabel('Year', { exact: true }).selectOption(years[years.length - 1]);
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('radio', { name: /Somewhere else/ }).check();
check('Conditional: custom destination field appears for "Somewhere else"', (await page.getByLabel('Where are you thinking of?').count()) === 1);
await page.getByRole('button', { name: 'Continue' }).click();
check('Custom destination is required', (await page.getByText('Please tell us where you are thinking of.').count()) >= 1);
await page.getByLabel('Where are you thinking of?').fill('Lisbon');
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByLabel('Estimated number of guests').fill('1');
await page.getByRole('button', { name: 'Continue' }).click();
check('Guest minimum enforced', (await page.getByText(/at least 2 guests/).count()) >= 1);
await page.getByLabel('Estimated number of guests').fill('');
await page.getByLabel('Estimated number of guests').pressSequentially('abc');
check('Guest field is numeric (non-numeric typing is rejected by the browser)', (await page.getByLabel('Estimated number of guests').inputValue()) === '');
await page.getByLabel('Estimated number of guests').fill('300');
check('Large-event note appears for 300 guests', (await page.getByText(/extra production and permits/).count()) === 1);
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('button', { name: 'Continue' }).click();
check('Style step requires a selection', (await page.getByText(/choose at least one style/i).count()) >= 1);
await page.getByRole('checkbox', { name: /Modern classic/ }).check();
await page.getByRole('button', { name: 'Continue' }).click();
check('Conditional: corporate event hides wedding-only services and shows corporate ones', (await page.getByRole('checkbox', { name: /Full planning/ }).count()) === 0 && (await page.getByRole('checkbox', { name: /Corporate event production/ }).count()) === 1);
await page.getByRole('button', { name: 'Continue' }).click();
check('Services step requires a selection', (await page.getByText('Please choose at least one service.').count()) >= 1);
await page.getByRole('checkbox', { name: /Corporate event production/ }).check();
await page.getByRole('button', { name: 'Continue' }).click();
check('Budget step is optional and the button reads Skip', (await page.getByRole('button', { name: 'Skip' }).count()) === 1);
await page.getByRole('button', { name: 'Skip' }).click();
check('Conditional: corporate shows company field, not partner field', (await page.getByLabel('Company or organisation').count()) === 1 && (await page.getByLabel('Your partner’s name').count()) === 0);
await page.getByRole('button', { name: 'Continue' }).click();
check('Contact step shows name, email and company errors', (await page.locator('.field__error').count()) >= 3);
await page.getByLabel('Your name').fill('Taylor Reed');
await page.getByLabel('Email address').fill('not-an-email');
await page.getByLabel('Company or organisation').fill('Example Co');
await page.getByRole('button', { name: 'Continue' }).click();
check('Invalid email is rejected with a clear message', (await page.getByText(/valid email address/).count()) >= 1);
await page.getByLabel('Email address').fill('taylor@example.com');
await page.getByLabel('Preferred way to be contacted').selectOption('phone');
await page.getByRole('button', { name: 'Continue' }).click();
check('Choosing phone as contact method makes phone required', (await page.getByText('Please enter a phone number.').count()) >= 1);
await page.getByLabel('Phone').fill('+1 555 010 0100');
await page.getByRole('button', { name: 'Continue' }).click();
check('Review step lists the answers', (await page.locator('.review dd').allInnerTexts()).join(' ').includes('Taylor Reed'));
await page.getByRole('button', { name: /Edit Destination/ }).click();
check('Review "Edit" jumps back to that step', (await page.locator('.progress__text').innerText()).includes('Step 3 of 9'));
await page.getByLabel('Where are you thinking of?').fill('Porto');
for (let i = 0; i < 6; i++) { await page.getByRole('button', { name: /Continue|Skip/ }).click(); }
check('Returning to the review keeps edited answers', (await page.locator('.review dd').allInnerTexts()).join(' ').includes('Porto'));
await page.getByRole('button', { name: 'Complete preview' }).click();
check('Completion requires acknowledging the demonstration', (await page.getByText(/confirm that you understand this enquiry is a demonstration/).count()) >= 1);
await page.getByRole('checkbox', { name: /I understand this enquiry is a demonstration/ }).check();
await page.getByRole('button', { name: 'Complete preview' }).click();
await page.getByRole('heading', { name: /nothing was sent/ }).waitFor();
check('Completion screen clearly states nothing was sent and no booking was made', (await page.getByText(/not delivered to any planner/i).count()) === 1 && (await page.getByText(/No booking, reservation or appointment/).count()) === 1);
check('Completion shows a clearly demo-labelled reference', /DEMO-[A-Z0-9]{6}/.test(await page.locator('.demo-ref').innerText()));
const dl = page.waitForEvent('download');
await page.getByRole('button', { name: /Download summary/ }).click();
check('Summary download works', (await dl).suggestedFilename() === 'everafter-demo-enquiry.txt');
{
  const v = await runAxe(page);
  check('axe: questionnaire completion screen has no violations', v.length === 0, JSON.stringify(v));
}

// 12. Questionnaire draft persistence + keyboard focus
await open(page, BASE, '/plan');
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('radio', { name: /^Wedding/ }).check();
check('Nothing is stored before the visitor opts in', (await page.evaluate(() => localStorage.getItem('everafter.inquiry-draft.v1'))) === null);
await page.getByRole('checkbox', { name: /Save my progress/ }).check();
await page.getByRole('button', { name: 'Continue' }).click();
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('everafter.inquiry-draft.v1')));
check('Opt-in draft is stored locally with the current step', saved.answers.eventType === 'wedding' && saved.step === 1);
check('Focus moves to the new step heading', await page.evaluate(() => document.activeElement?.tagName === 'H2'));
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Resume draft' }).click();
check('Saved draft can be resumed at the saved step', (await page.locator('.progress__text').innerText()).includes('Step 2 of 9'));
await page.getByRole('checkbox', { name: /Save my progress/ }).uncheck();
check('Unticking save deletes the stored draft', (await page.evaluate(() => localStorage.getItem('everafter.inquiry-draft.v1'))) === null);

// 13. Journal: search, category, article, related
await open(page, BASE, '/journal');
const jcount = async () => { await page.waitForTimeout(150); return page.locator('.grid--journal-all .acard').count(); };
check('Journal lists 9 articles', (await jcount()) === 9);
await page.getByRole('button', { name: 'Design', exact: true }).click();
check('Journal category filter works', (await jcount()) === 2, String(await jcount()));
await page.getByRole('button', { name: 'All', exact: true }).click();
await page.getByRole('searchbox').fill('tulip');
check('Journal search finds matching articles', (await jcount()) >= 1 && (await jcount()) < 9);
await page.getByRole('searchbox').fill('zzzzqqq');
check('Journal search with no results shows the empty state', (await page.getByText('No articles found').count()) === 1);
await page.getByRole('button', { name: 'Show all articles' }).click();
await page.locator('.acard__link').first().click();
await page.locator('.article-body').waitFor();
check('Article page shows heading, body and related content', (await page.locator('h1').count()) === 1 && (await page.locator('.article-body p').count()) >= 3 && (await page.locator('#rel-title').count()) === 1 && (await page.locator('.grid--journal .acard').count()) === 3);

// 14. Contact form
await open(page, BASE, '/contact');
await page.getByRole('button', { name: 'Preview message' }).click();
check('Contact form shows an error summary and inline errors when empty', (await page.locator('.error-summary').count()) === 1 && (await page.locator('.field__error').count()) >= 4);
await page.getByLabel('Your name').fill('Sam Lee');
await page.getByLabel('Email address').fill('sam@example.com');
await page.getByLabel('What is this about?').selectOption('Wedding planning');
await page.getByLabel('Your message').fill('We are planning a wedding for next summer.');
await page.getByRole('button', { name: 'Preview message' }).click();
check('Contact form requires demo acknowledgement', (await page.getByText(/confirm that you understand this is a demonstration/).count()) >= 1);
await page.getByRole('checkbox', { name: /I understand this is a demonstration/ }).check();
await page.getByRole('button', { name: 'Preview message' }).click();
await page.getByRole('heading', { name: /nothing was sent/ }).waitFor();
check('Contact result never claims delivery', (await page.getByText(/not delivered to any planner/i).count()) === 1 && (await page.getByText(/nobody will reply/i).count()) === 1);
check('Contact page shows opening hours, office and social links', await open(page, BASE, '/contact').then(async () => (await page.locator('.hours tr').count()) === 3 && (await page.getByText('Fictional address').count()) === 1 && (await page.locator('a[target=_blank][rel*=noopener]').count()) >= 3));

// 15. Footer newsletter form is honest
await page.locator('.newsletter input').fill('bad');
await page.locator('.newsletter button').click();
check('Newsletter form validates email', (await page.locator('.newsletter__msg.is-error').count()) === 1);
await page.locator('.newsletter input').fill('ok@example.com');
await page.locator('.newsletter button').click();
check('Newsletter form says nothing was subscribed', (await page.getByText(/no subscription was created/).count()) === 1);

// 16. Keyboard: skip link
await open(page, BASE, '/');
await page.keyboard.press('Tab');
check('Skip link is the first focusable element', (await page.evaluate(() => document.activeElement?.textContent)) === 'Skip to content');

// 17. Home sections render in configured order and every internal link resolves
const order = await page.evaluate(() => [...document.querySelectorAll('[data-section]')].map((e) => e.getAttribute('data-section')));
check('Home sections render (intro first, cta last)', order[0] === 'intro' && order[order.length - 1] === 'cta' && order.length === 10, order.join(','));
{
  const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split('?')[0]))]);
  const bad = [];
  const probe = await ctx.newPage();
  for (const h of hrefs) {
    await probe.goto(BASE + h, { waitUntil: 'domcontentloaded' });
    if ((await probe.locator('h1').first().innerText().catch(() => '')).includes('wandered')) bad.push(h);
  }
  check(`All ${hrefs.length} internal links on the home page resolve to real pages`, bad.length === 0, bad.join(', '));
  await probe.close();
}

// 18. Reduced motion
const rm = await browser.newContext({ viewport: { width: 1024, height: 800 }, reducedMotion: 'reduce' });
const rp = await rm.newPage();
await rp.goto(BASE + '/', { waitUntil: 'networkidle' });
check('Reduced motion: reveal content is visible immediately without animation', await rp.evaluate(() => [...document.querySelectorAll('.reveal')].every((e) => getComputedStyle(e).opacity === '1' && getComputedStyle(e).transform === 'none')));
await rm.close();

await browser.close();
stop();
const failedChecks = results.filter((r) => !r.ok);
console.log(`\n${results.length - failedChecks.length}/${results.length} browser checks passed`);
process.exit(failedChecks.length ? 1 : 0);
