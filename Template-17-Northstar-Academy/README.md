# Northstar Academy — OneStop Infinite Template 17

A premium, resellable website template for online education businesses: course academies, professional training providers, coding
bootcamps, language schools, corporate trainers, coaches and certification-prep companies.

It combines an editorial public website with a **fully working local demo learning dashboard** (enroll → read lessons → mark complete →
take quizzes → track progress → review completed courses → certificate preview → reset), built with React, Vite, TypeScript and React Router.

> **Demonstration brand.** "Northstar Academy", its courses, instructors, ratings, testimonials, prices and certificates are fictional sample data.
> Template owner: **OneStop Infinite** (credited separately from the demo brand — see `site.owner`).

## What's included

**Public pages:** Home (13 configurable sections) · Courses (search, category/difficulty/free-paid filters, sorting, empty states) · Course detail
(overview, curriculum accordion, sample lessons, requirements, instructor, related courses, enroll CTA) · Instructors + profiles · Learning paths ·
Plans (monthly/annual toggle, comparison table, FAQs, inquiry form) · About · Journal + articles (search, categories, related reading) · Contact · 404.

**Demo learning dashboard (`/learn`)** — no login, no account:
- Sample learner dashboard with stats, continue-learning, weekly goal, quiz-score chart, 7-day activity chart
- Enroll (with an explanatory confirmation dialog), leave course
- Lesson viewer: module accordion sidebar (drawer on mobile), reading layout, key points, practice prompt, optional local demo video with captions + transcript
- Mark lessons complete / incomplete, previous/next navigation, bookmarks for courses and lessons
- Module quizzes: multiple choice, configurable pass marks, answer validation, explanations, unlimited retries, best/last scores
- Completion only when **every lesson is complete and every quiz is passed**
- Completed-course review and a printable certificate preview labelled **DEMONSTRATION — NOT ACCREDITED**
- "Load sample progress" and "Reset demo progress"
- Persistent demo-limitation notices (see below)

## Quick start

```bash
npm ci
npm run dev        # http://localhost:5173
npm run check      # lint + typecheck + unit tests + production build
npm run test:e2e   # Playwright E2E + axe accessibility (builds and serves the site itself)
npm run review     # regenerates review/ contact sheets (needs a running preview server + ImageMagick)
npm run package    # builds handoff/OneStop-Infinite-Template-17-Northstar-Academy.zip (+ .sha256)
```

Requires Node 20+. If Playwright cannot find its browser, install one (`npx playwright install chromium`) or point
`PW_CHROMIUM_PATH` at an existing Chromium/Chrome binary.

## Demonstration limitations (also shown in the UI)

- Learning progress is stored **locally in the browser** (`localStorage`); there is no real user account, login or server-side learning record.
- Enrollments are demonstrations; **no payments** are processed and no subscriptions are created. Prices are illustrative.
- Certificates are **not accredited** and carry no external recognition.
- Data can disappear if browser storage is cleared (or in private browsing). The dashboard warns if storage is unavailable.
- Contact and plan-inquiry forms validate input but **send nothing** unless you configure `VITE_FORM_ENDPOINT`.
- Ratings, review counts, testimonials, instructor identities and credentials are fictional and labelled as such.
- There is no live video streaming and no tutoring integration; the one included video is a short silent local sample clip.

## Project structure

```
src/config/        ← everything you customise (see CUSTOMIZATION_GUIDE.md)
  site.ts            brand, contact, social, SEO, owner credit, storage prefix
  theme.ts           colours, fonts, radii (→ CSS variables)
  layout.ts          page toggles, home section order/visibility
  navigation.ts      header + footer navigation
  learning.ts        quiz default pass mark, demo learner, sample progress, certificate text
  categories.ts  instructors.ts  paths.ts  plans.ts  images.ts  content.ts
  courses/           course catalogue (helpers.ts documents the authoring format)
src/lib/           pure logic: progress.ts, quiz.ts, learner.ts (state + persistence), filters.ts, validation.ts, seo.ts
src/hooks/         useLearner (context), useSeo, useDialog (focus trap)
src/components/    UI building blocks (CourseCard, ModuleList, LessonShell, CourseCover, Portrait, …)
src/pages/         public pages;  src/pages/learn/ dashboard, course home, lesson, quiz, library, certificate
e2e/               Playwright specs (site, accessibility)
scripts/           generate-seo.ts, contact-sheets.ts, package-release.ts
review/            labelled desktop + mobile contact sheets
```

## Deployment

Build with `npm run build` (this also regenerates `sitemap.xml` and `robots.txt` from your config) and deploy `dist/`.

**Firebase Hosting:** `firebase.json` already serves `dist` and rewrites every route to `/index.html` (single-page app), so deep links
such as `/courses/web-foundations` or `/learn/web-foundations/lesson/m1-l1` work. Copy `.firebaserc.example` to `.firebaserc`, set your project id and run `firebase deploy`.
(Not deployed from this environment — no project or credentials were available.)

**Other hosts:** configure a catch-all rewrite to `index.html` (Netlify `/* /index.html 200`, Nginx `try_files $uri /index.html`, etc.).

Set your real domain before launch: `VITE_SITE_URL=https://example.com npm run build` (or edit `site.url`). It drives canonical tags, Open Graph URLs, the sitemap and robots.txt.

## SEO

Each route sets its own `<title>`, description, canonical URL, Open Graph and Twitter tags (`src/lib/seo.ts`). The demo dashboard (`/learn/*`),
certificate preview and 404 pages use `noindex, nofollow` and are disallowed in `robots.txt` and left out of `sitemap.xml`.
This is a client-rendered SPA — per-route tags are applied in the browser. For maximum SEO, add prerendering or SSR in a production build.

## More documentation

- `CUSTOMIZATION_GUIDE.md` — exact configuration map, course/lesson/quiz authoring, theming, forms, deployment tips
- `VERIFICATION.md` — what was tested and the actual results
- `ASSET_LICENSES.md` — sources and licences of every asset
- `CHANGELOG.md`, `LICENSE`
