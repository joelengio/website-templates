# Customization Guide

Everything a client normally changes lives in `src/config/`. You should rarely need to touch components.
After editing, run `npm run check` — the test-suite includes catalogue-integrity tests that catch broken references (missing instructor,
quiz answer index out of range, unknown path course, missing image file…).

## Configuration map

| What you want to change | File → key | Notes |
| --- | --- | --- |
| Brand name, tagline, short name | `config/site.ts` → `name`, `shortName`, `tagline` | Logo wordmark uses `shortName` + "Academy" (edit `components/Logo.tsx` for a different lock-up) |
| Logo | `components/Logo.tsx` (`LogoMark` SVG) | Replace the SVG or swap in an `<img>` |
| Favicon / touch icon / OG image | `public/favicon.svg`, `public/apple-touch-icon.png`, `public/images/og-cover.png`; paths in `site.favicon`, `site.seo.ogImage`, `index.html` | OG image should be 1200×630 |
| Site URL (canonical, sitemap) | `site.url` or `VITE_SITE_URL` | Set before building for production |
| Currency / locale | `site.currency`, `site.locale` | Used by `lib/format.ts` |
| Contact details | `site.contact` (`email`, `phone`, `address[]`, `hours`) | Shown on Contact and in the footer |
| Real form delivery | `VITE_FORM_ENDPOINT` env var (see `.env.example`) | Empty = clearly labelled demo mode, nothing is sent |
| Social links | `site.social[]` | |
| SEO defaults | `site.seo` (`titleTemplate`, `defaultTitle`, `description`, `ogImage`) | Per-page tags are set in each page via `useSeo` |
| Owner credit | `site.owner` (`name`, `url`, `label`, `showCredit`) | Separate from the demo brand; remove only where your agreement allows |
| Demo disclosure text | `site.disclosure`; dashboard notice text in `components/ui.tsx` → `DemoNotice` | Keep it truthful for your deployment |
| Colours, fonts, radius | `config/theme.ts` | Injected as CSS variables (`--c-*`, `--font-*`, `--r-*`). Fonts are imported in `src/main.tsx` |
| Pages on/off | `config/layout.ts` → `pages` | A disabled page loses its route, nav entry and sitemap URLs |
| Home section order / visibility | `config/layout.ts` → `homeSections` | Array order = render order; `visible: false` hides |
| Header / footer navigation | `config/navigation.ts` | `navigation`, `headerCta`, `footerColumns` |
| Homepage copy, CTAs | `config/content.ts` → `home` (hero, outcomes, why, experience, dashboard, cta), `homeFaqs` | Hero stats are computed from your data |
| About page | `config/content.ts` → `about` | |
| Testimonials | `config/content.ts` → `testimonials[]` | Label them fictional unless they are real, consented quotes |
| Journal articles | `config/content.ts` → `articles[]`, `articleCategories` | `body` is an array of paragraphs |
| Contact FAQs | `config/content.ts` → `contactFaqs` | |
| Photography | `config/images.ts` + files in `public/images/` | Keep a 1600 px master and 800 px thumbnail; always supply alt text |
| Categories | `config/categories.ts` | `motif` chooses the generated cover illustration |
| Instructors | `config/instructors.ts` | `portrait` controls the illustrated avatar; swap in real photos by editing `components/Portrait.tsx` / `InstructorCard.tsx` |
| Courses, modules, lessons, quizzes | `config/courses/*.ts`, registered in `config/courses/index.ts` | See authoring below |
| Learning paths | `config/paths.ts` | `courseSlugs` order = sequence; duration and progress are computed |
| Pricing plans, comparison, FAQs | `config/plans.ts` | `monthly`, `annualMonthly` (per-month price when billed yearly), `includes` keys feed the comparison table |
| Quiz default pass mark, reveal answers | `config/learning.ts` → `defaultPassMark`, `revealAnswers`; per quiz `passMark` | |
| Demo learner & sample progress | `config/learning.ts` → `learner`, `weeklyGoalMinutes`, `sampleEnrollments` | "Load sample progress" uses these |
| Certificate wording | `config/learning.ts` → `certificate` | Keep the not-accredited statement unless you really are accredited |
| localStorage namespace | `site.storagePrefix` | Change per client |

## Authoring a course

Create a file (or add to an existing one) in `src/config/courses/` using `buildCourse` from `./helpers`, then add the result to the
`courses` array in `src/config/courses/index.ts` (array order = "Recommended" order).

```ts
import { buildCourse } from './helpers';

export const myCourse = buildCourse({
  slug: 'my-course',                 // URL id: /courses/my-course (unique, lowercase, hyphens)
  title: 'My Course',
  tagline: 'One-line promise shown on cards.',
  description: 'Longer description for the course page.',
  categoryId: 'software',            // must exist in categories.ts
  instructorId: 'amara-lindqvist',   // must exist in instructors.ts
  difficulty: 'Beginner',            // Beginner | Intermediate | Advanced
  hours: 12,                         // hours of the FULL course
  catalogLessons: 40,                // lesson count of the FULL course (the demo edition ships fewer)
  price: 0,                          // 0 = free
  rating: 4.7, ratingCount: 120,     // fictional demo values — label real ones accordingly
  featured: true,                    // eligible for the home "Featured" section (first 4 are used)
  palette: ['#2748e8', '#0e9f94', '#ff6b57'],  // cover illustration colours
  tags: ['keywords', 'for', 'search'],
  objectives: ['…', '…', '…'],
  requirements: ['…'],
  clip: { src: '/media/my-clip.webm', caption: '…', transcript: '…' },   // optional, attached to lesson 1
  modules: [
    {
      title: 'Module title',
      summary: 'One sentence.',
      lessons: [
        // [title, minutes, summary, bodyParagraphs[], keyPoints[], practicePrompt]
        ['Lesson title', 9, 'Short summary.', ['Paragraph one.', 'Paragraph two.'], ['Point A', 'Point B'], 'Try this.'],
      ],
      quiz: {
        title: 'Module 1 check',
        passMark: 70,                // optional; defaults to learning.defaultPassMark
        questions: [
          // [prompt, options[], correctIndex (0-based), explanation]
          ['Which is right?', ['A', 'B', 'C', 'D'], 1, 'B is right because…'],
        ],
      },
    },
  ],
});
```

Rules and behaviour
- Ids are generated by position (`m1`, `m1-l1`, `m1-quiz`, `m1-q1`). **Re-ordering or removing lessons changes ids**; learners' saved progress for removed ids is discarded safely on load.
- Every module has exactly one quiz. Required steps = every lesson + every module quiz. A course completes only when **all lessons are marked complete and all quizzes are passed**.
- Progress % = completed steps ÷ total steps (rounded; never 100% before completion, never 0% once something is done).
- Pass test: `correct / total × 100 ≥ passMark` evaluated on the exact ratio (so 66.7% never rounds up past a 67% mark). Unanswered questions count as wrong; the UI requires all questions to be answered. A failed retry never un-passes a quiz; best and latest scores are kept.
- Tests enforce: ≥2 modules, ≥3 lessons per module, ≥3 questions per quiz, valid `correct` index, no duplicate options, real category/instructor.
- Don't embed material you don't have rights to. Lessons here are original demonstration text.

### Lesson video
Add a local file under `public/media/` (WebM/MP4) and a `.vtt` captions file with the same basename, then set `clip` on the course (it attaches to the first lesson). Provide a transcript. The player shows no streaming claims — it is a plain local `<video>`.

## Learning-paths
`config/paths.ts` entries list `courseSlugs`. Path progress is the average of course progress; "Start learning" enrolls (locally) in the first incomplete course and opens its resume step. Paths may reuse a course in several paths.

## Instructors
Add an entry to `config/instructors.ts` and reference its `slug` from courses. Keep credentials clearly marked "Demo credential … (fictional)" unless they are real and verified.

## Theming
Edit `config/theme.ts`; `lib/theme.ts` writes the tokens to `<html>` at start-up. Contrast was checked with axe for the shipped palette — re-run `npm run test:e2e` after changing colours. Component-level styling is in `src/styles/main.css` (one file, sectioned).

## Forms
`components/ContactForm.tsx` validates (`lib/validation.ts`) and, with `VITE_FORM_ENDPOINT` set, POSTs JSON `{name,email,topic,message,consent}` and reports success only on a 2xx response. Without an endpoint it shows "nothing was sent".

## Replacing demo data for a real launch
1. Brand, contact, URL, social, owner credit (`site.ts`).
2. Replace photos and OG image; update `ASSET_LICENSES.md`.
3. Replace courses, instructors, testimonials, articles, plans with real, rights-cleared content; remove "fictional" labels only where the content is real.
4. If you add real accounts/payments you must build them — this template intentionally has none, and the demo notices (`DemoNotice`, certificate wording, plan FAQs) must then be rewritten.

## Deployment checklist
`npm ci && npm run check && npm run test:e2e` → set `VITE_SITE_URL` → `npm run build` → deploy `dist/` with an SPA catch-all rewrite (Firebase config included).
