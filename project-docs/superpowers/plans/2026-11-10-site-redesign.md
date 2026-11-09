# Redesign maciej.czerpinski.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the look and homepage structure of the Eleventy site so Maciej reads as "Forward Deployed Engineer, trainer, consultant", with light and dark themes, an offer organised by client problem, FAQ pages and an after-training page.

**Architecture:** Keep Eleventy 2 + Nunjucks. One token-driven stylesheet (light tokens on `:root`, dark tokens under `prefers-color-scheme` and `[data-theme]`). One shared homepage partial rendered by `index.njk` (EN) and `pl/index.njk` (PL) so layouts cannot drift. All text lives in `site/_data/copy.js`; a Node script (`scripts/verify-build.mjs`) checks the built `docs/` output and is the "test" for every task.

**Tech Stack:** Eleventy 2, Nunjucks, plain CSS, self-hosted Inter (OFL), `sharp` for image variants (dev only), Node 22.

**Spec:** `project-docs/superpowers/specs/2026-11-08-site-redesign-design.md` (approved 2026-11-09, section 11 = FAQ and Calendly decision). Mockups of the approved look: `.superpowers/brainstorm/31379-1794128277/content/hero-light-dark.html` and `offer-v4.html`.

## Global Constraints

- Edit `site/` only. `docs/` is the published output (GitHub Pages, `CNAME` present): **work on branch `redesign`, never merge to `main` before Maciej approves the preview (spec section 9).**
- Light tokens: bg `#fbfbfd`, ink `#1d1d1f`, grey `#6e6e73`, sub `#515154`, line `#e5e5ea`, button bg `#1d1d1f` / text `#ffffff`.
- Dark tokens: bg `#0b0b0d`, ink `#f5f5f7`, grey `#8e8e93`, sub `#a1a1a6`, line `#2c2c2e`, button bg `#f5f5f7` / text `#1d1d1f`.
- Theme: default by `prefers-color-scheme`; manual toggle keeps `theme.js` + `localStorage("theme")`; no flash on load (inline script in `<head>` stays).
- Hero copy (PL): h1 "Wchodzę tam, gdzie boli najbardziej." + grey "Zostaję, aż zespół działa sam."; sub "Forward Deployed Engineer, trener i konsultant. 15+ lat w okopach IT."; buttons "Umów rozmowę" (Calendly) and "Zobacz szkolenia". EN h1 proposal: "I go in where it hurts most." + "I stay until the team runs on its own." (EN is a draft).
- Proof bar: `TRAINING_STATS.people` (302) "osoby przeszkolone", `.hours` (664) "godziny warsztatów", `.trainings` (43) "szkolenia", "15+" "lat w inżynierii oprogramowania". No PHP anywhere in hero or proof bar. No "23 opinie" counter. No Gallup line.
- Homepage order: Hero, Oferta (4 cards, 2x2), Dowody, O mnie, Blog (3 latest), Kontakt, FAQ (4-6 questions + link to all).
- Offer cards (question / title / steps) exactly as spec section 4 table. Section heading "Z czym do mnie przychodzą." + grey "Cztery problemy, cztery sposoby wejścia." Training card has quote "Dużo praktyki popartej realnymi przykładami." (take from `testimonials.js`; use the real entry, do not retype) and topics Event Storming, DDD, Clean Code, refaktoryzacja, SDLC z AI. AI card question contains "AI SDLC". Fractional CTO card: minimal, no promises beyond the three steps.
- Calendly: link from `CALENDLY` in `copy.js`, `target="_blank" rel="noopener"`, no embed. Secondary link "Wolisz napisać? Mail" uses existing `email.js` data attributes (address from `_data/email.js`, never a literal address in HTML).
- LinkedIn: `https://www.linkedin.com/in/maciejczerpinski/`.
- All pages and new sections in PL and EN, same layout. EN texts are drafts, flagged in `copy.js` comments `// EN-DRAFT`.
- Font: Inter, self-hosted, OFL. Remove Google Fonts (Archivo, JetBrains Mono) links.
- Accessibility: text contrast >= 4.5:1 both themes, visible focus, `prefers-reduced-motion`, `aria-current` on active nav. Motion: one hero entrance on load plus hover states only; no scroll-triggered reveals.
- Responsive check widths: 1440, 1024, 768, 390, 320 (no horizontal scroll).
- Existing URLs, `hreflang`, `sitemap.xml`, `redirects.js`, `llms.txt` must keep working.
- After-training pages: `noindex`, excluded from `sitemap.xml` and `llms.txt`. FAQ: `FAQPage` JSON-LD, in sitemap and `llms.txt`, no promise of rich results. No invented facts: no prices, durations, availability, clients.
- Image: new portrait is `/Users/maciejczerpinski/Documents/IMG_2496.jpg` (2316x3088), tight vertical crop 4:5, `object-position: 50% 30%`.

## Review Focus

1. **JS disabled:** page must render in the system-preferred theme, and the mail link must still show a readable fallback text (not a dead `#`). Test: built HTML contains the fallback text inside the link.
2. **Narrow screens:** 320px, long Polish h1 and 4-column proof bar must not overflow. Test: Playwright at 320 asserts `scrollWidth <= innerWidth`.
3. **PL/EN drift:** a key added to one language only. Test: `copy.en` and `copy.pl` have identical key shapes.
4. **Stored theme vs system theme conflict:** `localStorage theme=light` while OS is dark. Test: Playwright with `colorScheme:'dark'` + stored light shows light bg.
5. **Old links and noindex leaks:** legacy URLs 404 or the after-training page leaks into sitemap/llms. Test: verify script checks both.

---

### Task 1: Branch, hygiene, verify script skeleton

**Files:**
- Modify: `.gitignore` (add `.superpowers/`)
- Create: `scripts/verify-build.mjs`
- Modify: `package.json` (scripts `verify`: `eleventy && node scripts/verify-build.mjs`)

**Interfaces:**
- Produces: `node scripts/verify-build.mjs` exits non-zero on any failed check; prints one line per check. Exposes `check(name, fn)` helper pattern that later tasks extend by adding checks to this file. Reads built files from `docs/`.

- [ ] **Step 1:** `git checkout -b redesign`; add `.superpowers/` to `.gitignore`.
- [ ] **Step 2: Write `scripts/verify-build.mjs`** with baseline checks run against the CURRENT build: every path in this list returns a file in `docs/`: `/`, `/pl/`, `/about/`, `/pl/about/`, `/training/`, `/pl/training/`, `/contact/`, `/pl/contact/`, `/blog/`, `/blog/remote-event-storming/`, `/remote-event-storming/`, `/tags/`, `/sitemap.xml`, `/llms.txt`, `/robots.txt`, `/CNAME`; each page with `altLangHref` has hreflang `en`, `pl`, `x-default`; `sitemap.xml` is well-formed and contains `/pl/`.
- [ ] **Step 3:** Run `npm run verify` on the untouched site. Expected: all baseline checks PASS (this is the regression net).
- [ ] **Step 4: Commit** `chore: add verify script and ignore brainstorm dir`.

### Task 2: Assets (font, portrait, og image)

**Files:**
- Create: `site/fonts/inter-variable.woff2` (from `@fontsource-variable/inter`, dev dependency, copy the latin and latin-ext woff2 files), `scripts/make-images.mjs`
- Create (generated, committed): `site/img/portrait-600.avif|webp|jpg`, `portrait-1200.avif|webp|jpg`, `og.jpg` (1200x630, portrait left, dark or light plain ground)
- Modify: `.eleventy.js` (passthrough `site/fonts`)

**Interfaces:**
- Produces: URLs `/fonts/inter-variable.woff2` (Task 3 `@font-face`), `/img/portrait-{600,1200}.{avif,webp,jpg}` (Task 5 `<picture>`), `/img/og.jpg` (Task 3 head). Portrait 4:5 crop, intrinsic size 1200x1500 and 600x750.

- [ ] **Step 1: Add checks** to verify script: those files exist; each portrait jpg < 250 KB at 1200 and < 90 KB at 600; `og.jpg` is 1200x630.
- [ ] **Step 2:** Run verify. Expected: new checks FAIL.
- [ ] **Step 3: Implement `scripts/make-images.mjs`** (`sharp`, devDependency): crop source to 4:5 around the face, emit the variants above and `og.jpg`. Copy the font file. Run it, commit generated files.
- [ ] **Step 4:** Run verify. Expected: PASS.
- [ ] **Step 5: Commit** `feat: self-hosted font and optimized portrait`.

### Task 3: Design system and base layout

**Files:**
- Modify: `site/css/style.css` (rewrite; keep selector names only where templates outside this plan still use them), `site/_includes/base.njk`, `site/js/theme.js` (only if toggle markup changes)
- Create: `site/css/` tokens stay in the one file, section-commented (tokens, base, header/footer, components, home, inner pages)

**Interfaces:**
- Produces CSS tokens: `--bg --ink --grey --sub --line --btn-bg --btn-ink --radius-photo`; classes used by later tasks: `.wrap` (max width + 16px gutter, `padding-inline: max(16px, 4cqw)`-style, equal left/right), `.btn` (pill, primary), `.link-more`, `.section`, `.section__h2` with `.section__h2 .grey`, `.card` (thick top border), `.steps` / `.step`, `.proof`, `.faq` (`details/summary`).
- Produces `base.njk` blocks: `og:image` -> `/img/og.jpg`; preload of the font; no Google Fonts; skip link text localized from `copy[lang].common.skip`; `lang` attr; `<html data-theme>` handling unchanged.

- [ ] **Step 1: Add checks:** built HTML contains no `fonts.googleapis.com`; `og:image` is `/img/og.jpg`; `style.css` defines both token sets (light values and dark values from Global Constraints appear under `prefers-color-scheme: dark` selector guarded by `:root:not([data-theme="light"])` and under `:root[data-theme="dark"]`); contrast of `--grey` on `--bg` >= 4.5 in both sets (compute in script).
- [ ] **Step 2:** Run verify. Expected: FAIL.
- [ ] **Step 3: Implement** tokens, Inter `@font-face` (`font-display: swap`), type scale with negative tracking for h1/h2, header (name left, nav + lang + theme toggle right, `aria-current` styled), footer, focus ring (`:focus-visible`), `@media (prefers-reduced-motion: reduce)` disabling the hero entrance. Hero entrance: single CSS animation on `.hero [data-enter]`, once.
- [ ] **Step 4:** Run verify and `npm run build`; open `docs/index.html` via local serve and confirm no console errors. Expected: PASS.
- [ ] **Step 5: Commit** `feat: design tokens, dark/light themes, base layout`.

### Task 4: Copy data

**Files:**
- Modify: `site/_data/copy.js`
- Test: `scripts/verify-build.mjs` (add parity check by `require`-ing `site/_data/copy.js`)

**Interfaces:**
- Produces, for both `copy.en` and `copy.pl` (identical shape):
  - `hero: { h1, h1Grey, sub, ctaLabel, ctaHref, secondaryLabel, secondaryHref, photoAlt }`
  - `proof: [{ value: string, label: string }]` (4 items; values built from `TRAINING_STATS`, fourth is `"15+"`)
  - `offer: { h2, h2Grey, cards: [{ id: 'legacy'|'ai'|'cto'|'training', need, title, desc, steps: [{ name, note }], ctaLabel, ctaHref, topics?: string[], quote?: boolean }] }`
  - `evidence: { heading, count: 3 }` (quotes still come from `testimonials.js`, see Task 5)
  - `contact: { h2, text, ctaLabel, ctaHref, mailLabel }` (mailLabel "Wolisz napisać? Mail")
  - `faq: { h2, linkLabel, items: [{ q, a }] }` where items 1-4 are the home subset flagged by `home: true`; full list >= 6
  - `afterTraining: { title, h1, text, linkedinLabel, linkedinHref, feedbackLabel, feedbackSubject }`
  - `common: { skip, newTabHint }` extended.
- Consumes: existing `CALENDLY`, `TRAINING_STATS`.

- [ ] **Step 1: Write checks:** (a) `copy.en` and `copy.pl` have identical recursive key sets (Review Focus 3); (b) `offer.cards.length === 4`, ids in the order above, each has exactly 3 steps; (c) PL `hero.h1` equals "Wchodzę tam, gdzie boli najbardziej."; (d) no string in either language contains "PHP" inside `hero`/`proof`; (e) `faq.items` contains no digit-bearing price/duration claims (regex for `PLN|zł|\$|€|dni|days|hours`) except the TRAINING_STATS derived entries; (f) every `// EN-DRAFT` block exists.
- [ ] **Step 2:** Run verify. Expected: FAIL.
- [ ] **Step 3: Implement** the copy. PL strings come from spec sections 4 and 10 verbatim; descriptions for legacy/AI/CTO cards use the mockup `offer-v4.html` wording (they are drafts: mark `// DRAFT-PENDING-APPROVAL`). FAQ drafts: what is a Forward Deployed Engineer; how fractional CTO differs from a full-time CTO; are trainings on-site or online ("u klienta lub online"); how a collaboration runs (Rozpoznanie, Działanie, Oddanie). Write no pricing/duration/availability questions.
- [ ] **Step 4:** Run verify. Expected: PASS.
- [ ] **Step 5: Commit** `feat: homepage, FAQ and after-training copy (PL/EN)`.

### Task 5: Homepage (shared partial)

**Files:**
- Create: `site/_includes/home.njk` (macro or include taking `lang`), `site/_includes/offer-card.njk`
- Modify: `site/index.njk`, `site/pl/index.njk` (front matter kept; body becomes `{% set L = copy.en %}{% include "home.njk" %}`; update `description`, JSON-LD `jobTitle` to "Forward Deployed Engineer, trainer and consultant")

**Interfaces:**
- Consumes: Task 3 classes; Task 4 `copy[lang].*`; `testimonials[lang]`; `collections.post`.
- Produces section ids in this order: `hero`, `offer`, `proof`, `about`, `blog`, `contact`, `faq`. `proof` section contains the stat bar; quotes: first 3 testimonials whose text contains practice wording. Builder selection rule: pick 3 entries from `testimonials[lang]` that mention practice (`prakty` in PL, `practic` in EN), fall back to first 3. Hero image is `<picture>` (avif, webp, jpg, `width=1200 height=1500`, `fetchpriority="high"`, no lazy).

- [ ] **Step 1: Write checks** against built `/` and `/pl/`: section ids appear in the exact order above; hero contains h1 text, sub text, a `.btn` whose `href` equals the Calendly URL with `target="_blank"`; no element with class containing `talents`; hero text lacks "PHP"; 4 `.card` in `#offer`; `#proof` has 4 stats; `#faq` has 4 to 6 `<details>`; mail link in `#contact` has `data-email-user` and fallback text "hello [at] czerpinski.com"; EN and PL pages have the same count of each section id and each `.card`.
- [ ] **Step 2:** Run verify. Expected: FAIL.
- [ ] **Step 3: Implement** `home.njk` per the mockups (hero grid: text 1.2fr / portrait 0.8fr, stacked on <= 768 with portrait after the sub and buttons staying above the fold at 390). Cards: need, title, desc, optional quote, steps list, link. Card CTAs point to Calendly except training card -> `/training/` (`/pl/training/`). FAQ block renders 4-6 items plus link to `/faq/` (`/pl/faq/`; page created in Task 7).
- [ ] **Step 4:** Run verify. Then serve `docs/` locally and screenshot `/` and `/pl/` at 1440 and 390 in light and dark; check first screen shows h1, sub, button, face (spec section 7). Expected: PASS.
- [ ] **Step 5: Commit** `feat: new homepage (hero, offer, proof, about, blog, contact, FAQ teaser)`.

### Task 6: Inner pages restyle

**Files:**
- Modify: `site/about.njk`, `site/pl/about.njk`, `site/training.njk`, `site/pl/training.njk`, `site/contact.njk`, `site/pl/contact.njk`, `site/blog/index.njk`, `site/_includes/post.njk`, `site/404.njk`

**Interfaces:**
- Consumes: Task 3 classes only. Keeps all URLs, permalinks and front matter; contact page gets the Calendly button plus the mail link (no form).

- [ ] **Step 1: Checks:** every page above builds, uses `.wrap`, has exactly one `<h1>`, contact pages contain the Calendly URL and the mail link; blog post page ends with a next step (link to `/contact/` or Calendly) so it is not a dead end; `training` pages still contain `#testimonials` anchor.
- [ ] **Step 2:** Run verify. Expected: FAIL.
- [ ] **Step 3: Implement** by swapping markup to the new classes; text unchanged except `15+` consistency and removal of any PHP-first phrasing in headline positions.
- [ ] **Step 4:** Run verify; screenshot each page at 390 and 1440 in both themes. Expected: PASS, no horizontal scroll.
- [ ] **Step 5: Commit** `feat: restyle inner pages and blog`.

### Task 7: FAQ pages and structured data

**Files:**
- Create: `site/faq.njk` (`/faq/`), `site/pl/faq.njk` (`/pl/faq/`), `site/_includes/faq-jsonld.njk`
- Modify: `site/_includes/home.njk` (add JSON-LD for the home subset)

**Interfaces:**
- Consumes: `copy[lang].faq.items`.
- Produces: `faq-jsonld.njk` taking a list of items and printing `<script type="application/ld+json">` with `@type: FAQPage`, `mainEntity` of `Question`/`acceptedAnswer`; strings escaped with Nunjucks `dump`.

- [ ] **Step 1: Checks:** `/faq/` and `/pl/faq/` exist with `altLangHref` pair and hreflang; each contains valid JSON-LD (parse it) whose `mainEntity.length` equals the number of visible `<details>`/question blocks; homepage JSON-LD length equals visible home FAQ count; both FAQ pages are in `sitemap.xml`.
- [ ] **Step 2:** Run verify. Expected: FAIL.
- [ ] **Step 3: Implement** pages and partial. Page descriptions state what the page answers; no rich-result claims in copy.
- [ ] **Step 4:** Run verify. Expected: PASS.
- [ ] **Step 5: Commit** `feat: FAQ pages with FAQPage JSON-LD`.

### Task 8: After-training page and QR alias

**Files:**
- Create: `site/after-training.njk` (`/after-training/`), `site/pl/po-szkoleniu.njk` (`/pl/po-szkoleniu/`)
- Modify: `site/_data/redirects.js` (add `{ from: "/po/", to: "/pl/po-szkoleniu/" }`; target language is my call: participants are mostly Polish, flag in the code comment)

**Interfaces:**
- Consumes: `copy[lang].afterTraining`. Front matter on both pages: `noindex: true`, `eleventyExcludeFromCollections: true`, `altLangHref` pair.
- Produces: page with thank-you text, large LinkedIn button (`.btn`, new tab), feedback `mailto` via `data-email-*` attributes with subject from copy, no materials block, no form.

- [ ] **Step 1: Checks:** both pages exist; contain `<meta name="robots" content="noindex">`; contain the LinkedIn URL; absent from `sitemap.xml` and `llms.txt`; `/po/` stub exists and its `to` is `/pl/po-szkoleniu/`; page has no `<form>`.
- [ ] **Step 2:** Run verify. Expected: FAIL.
- [ ] **Step 3: Implement** pages and redirect entry.
- [ ] **Step 4:** Run verify. At 390 width the LinkedIn button is visible without scrolling. Expected: PASS.
- [ ] **Step 5: Commit** `feat: after-training page with QR alias`.

### Task 9: SEO files

**Files:**
- Modify: `site/llms.txt`, `site/sitemap.njk` (only if needed), `site/_includes/base.njk` default description

**Interfaces:** none new.

- [ ] **Step 1: Checks:** `llms.txt` mentions FAQ URLs and "Forward Deployed Engineer", does not mention `/po` or `/after-training/`; default `<meta name="description">` no longer says "Tech Lead & Trainer" only; all sitemap `<loc>` URLs have a built file.
- [ ] **Step 2:** Run verify. Expected: FAIL.
- [ ] **Step 3: Implement** edits. Keep wording factual from existing `llms.txt`; add the new positioning and FAQ links.
- [ ] **Step 4:** Run verify. Expected: PASS.
- [ ] **Step 5: Commit** `feat: update llms.txt and meta for new positioning`.

### Task 10: QA gate and preview (no publish)

**Files:**
- Create: `scripts/qa-browser.mjs` (Playwright) , `project-docs/superpowers/plans/qa-2026-11-10.md` (results)

**Interfaces:** consumes the built site served from `docs/` on localhost.

- [ ] **Step 1: Write `qa-browser.mjs`** covering Review Focus 1, 2, 4: for `/`, `/pl/`, `/faq/`, `/pl/po-szkoleniu/` at widths 1440, 1024, 768, 390, 320: `scrollWidth <= innerWidth`; no console errors; theme tests (system dark + stored light => light background; system dark, nothing stored => dark; toggle flips and persists); JS disabled run renders content and fallback mail text; keyboard Tab order reaches skip link, nav, primary button with visible focus outline; computed contrast of grey text >= 4.5 in both themes.
- [ ] **Step 2:** Run it. Fix failures in CSS/templates (surgically, one commit per fix). Expected: all PASS.
- [ ] **Step 3:** Run the taste-skill check pipeline (`taste-skill:design-taste-frontend`, run its `gate.mjs`/`consistency.mjs` per its SKILL.md section 4 steps 1 and 6) against the built homepage. Record output in the QA file. Where the skill's rules contradict the spec (e.g. photo-led "place" kinds, effect rules), the spec wins; note each override in the QA file.
- [ ] **Step 4:** Image/performance check: homepage transferred size, LCP image has `fetchpriority`, no render-blocking third-party requests (assert none to `googleapis`/`gstatic`).
- [ ] **Step 5:** Push branch, build preview for Maciej (local `npm run serve` URL or Netlify/Pages preview he already uses; ask which). Present: the list of draft texts awaiting his approval (EN versions, card descriptions, FAQ answers, mail address in contact). **Stop here. Merge to `main` only after Maciej approves in the preview.**
- [ ] **Step 6: Commit** `docs: QA results for redesign`.

---

## Self-review

- **Spec coverage:** goals/hero (T3, T4, T5), offer 4 cards (T4, T5), proof (T5), about/blog/contact (T5, T6), both themes (T3, T10), font/images (T2), after-training + alias (T8), FAQ x2 + JSON-LD + sitemap + llms (T7, T9), Calendly + mail (T4, T5, T6), SEO safety (T1 baseline, T9), critique leftovers (favicon: not covered, see below), publish gate (T10).
- **Gap to settle before T3:** spec section 6 asks to re-check the 2026-07-30 critique items (favicon, OG tags, active nav, dead-end blog post). Active nav (T3), OG (T2/T3), blog dead end (T6) covered; **favicon has no task**. Builder: read `../.impeccable/critique/`, and if favicon is still missing, add `site/img/favicon.svg` + `<link rel="icon">` inside T3.
- **Type consistency:** `copy[lang]` shape defined once in T4 and consumed in T5, T7, T8; section ids defined once in T5.
- **Open items for Maciej (not code):** limit visible Calendly slots; confirm mail address (existing `hello@czerpinski.com` reused); approve EN and card/FAQ drafts; provide post-training materials later.
