# AdSense Low-Value Content Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform SuaObraCerta from a client-rendered collection of calculators into a crawlable, evidence-backed construction reference that meets AdSense content-quality expectations.

**Architecture:** Keep React and Vite, but add deterministic build-time prerendering for every indexable route, a central route/SEO manifest, real 404 responses, and automated checks against thin or contradictory pages. Reduce the indexable surface before expanding it again; each calculator or article returns to the sitemap only after passing an editorial-quality gate.

**Tech Stack:** React 18, React Router 6, Vite 5, React Helmet Async, Node.js build scripts, Vitest, Playwright, Vercel static hosting.

**Spec:** This document contains the audit evidence and recovery specification.

## Global Constraints

- Do not request another AdSense review until every Phase 0-4 exit criterion passes in production.
- Do not invent author names, professional registrations, case studies, prices, statistics, or standards citations.
- Structural, electrical, hydraulic, accessibility, safety, and financial content must cite authoritative and current sources.
- A route may be in the sitemap only when it returns HTTP 200, self-canonical HTML, indexable metadata, and meaningful route-specific text without requiring JavaScript.
- Non-indexable tools remain usable but must emit `noindex, follow` and stay out of the sitemap.
- Advertising and affiliate elements remain disabled during remediation.
- The EEA advertising-consent path must use a Google-certified CMP before ads are activated.

---

## Audit Evidence — 24 August 2026

### Critical findings

1. All tested public routes return the same 2,642-byte static HTML shell.
2. The shell contains only 49 text characters and always declares the homepage canonical before JavaScript executes.
3. The sitemap contains 51 URLs, but the initial HTML does not contain route-specific content, title, description, canonical, or schema.
4. An arbitrary nonexistent URL returns HTTP 200, creating soft-404 behavior.
5. The site is a single large SPA bundle; the previous production build reported an application chunk close to 1.5 MB before gzip.
6. The blog contains 10 published article records, 142 lines with numerical/normative claims, and no editorial source URLs beyond external stock-image URLs.
7. Several schema definitions reference `/og-image.png`, while the public asset is `/og-image.jpg`.
8. The custom consent manager is useful for LGPD choice storage, but it is not evidence of a Google-certified CMP for EEA ad serving.

### Positive findings to preserve

- HTTPS, `www` canonical domain, robots.txt, sitemap.xml, ads.txt, privacy, terms, contact, and an editorial-method page exist.
- Affiliate product cards and ad placeholders are disabled by configuration.
- `/meu-orcamento` is excluded from the sitemap and intentionally blocked from search.
- Calculators have visible explanatory sections and can become strong pages once prerendered and editorially reviewed.

---

## Phase 0: Freeze monetization and define measurable gates

### Task 1: Add an AdSense readiness checklist and route inventory

**Files:**
- Create: `docs/adsense/readiness-checklist.md`
- Create: `src/config/indexableRoutes.ts`
- Modify: `src/App.tsx`
- Test: `scripts/audit-indexable-routes.mjs`

**Interfaces:**
- Produces: `INDEXABLE_ROUTES: readonly IndexableRoute[]`
- Produces: `IndexableRoute = { path: string; kind: "tool" | "article" | "institutional"; priority: "core" | "supporting" }`

- [ ] **Step 1: Create a single route manifest** containing only routes intended for Google and AdSense review. Start with the homepage, blog hub, institutional pages, all 10 articles, and the five strongest calculators: tinta, pisos, tijolos, concreto, and telhado.
- [ ] **Step 2: Mark all remaining calculator routes as remediation candidates** rather than silently treating every tool as index-ready.
- [ ] **Step 3: Write `scripts/audit-indexable-routes.mjs`** to fail when the sitemap and `INDEXABLE_ROUTES` differ, a blocked route appears in the sitemap, or a route is duplicated.
- [ ] **Step 4: Add the command** `"audit:routes": "node scripts/audit-indexable-routes.mjs"` to `package.json`.
- [ ] **Step 5: Run** `npm run audit:routes` and capture the initial failure showing the current manually maintained sitemap mismatch.
- [ ] **Step 6: Update the checklist** with binary gates: route-specific HTML, source coverage, no placeholder commerce, valid schema, real 404, mobile CWV, and production smoke.
- [ ] **Step 7: Commit** with `chore: define AdSense readiness gates`.

**Exit criterion:** The project has one authoritative list of indexable pages and a failing automated audit for any sitemap drift.

---

## Phase 1: Deliver route-specific HTML without JavaScript

### Task 2: Separate route definitions from the browser entry point

**Files:**
- Create: `src/routes/AppRoutes.tsx`
- Create: `src/routes/routeDefinitions.ts`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Test: `src/routes/routeDefinitions.test.ts`

**Interfaces:**
- Produces: `APP_ROUTE_DEFINITIONS: readonly AppRouteDefinition[]`
- Produces: `AppRouteDefinition = { path: string; element: ReactNode; indexable: boolean }`
- Produces: `<AppRoutes />`, reusable by browser and prerender entries.

- [ ] **Step 1: Add Vitest** and scripts `test` and `test:run` to `package.json`.
- [ ] **Step 2: Write a failing test** asserting every `INDEXABLE_ROUTES` path maps to exactly one application route.
- [ ] **Step 3: Move the current `<Routes>` tree** from `src/App.tsx` into `src/routes/AppRoutes.tsx` without changing user-visible behavior.
- [ ] **Step 4: Export route metadata** from `src/routes/routeDefinitions.ts` so build scripts do not parse TSX with regular expressions.
- [ ] **Step 5: Run** `npm run test:run` and confirm the route test passes.
- [ ] **Step 6: Run** `npm run build` and smoke-test `/`, `/calculadora-tinta`, `/blog`, and `/sobre`.
- [ ] **Step 7: Commit** with `refactor: centralize application routes`.

### Task 3: Implement deterministic static prerendering

**Files:**
- Create: `src/entry-server.tsx`
- Create: `scripts/prerender.mjs`
- Create: `scripts/html-template.mjs`
- Modify: `src/main.tsx`
- Modify: `package.json`
- Modify: `vite.config.ts`
- Test: `scripts/test-prerender-output.mjs`

**Interfaces:**
- Produces: `renderRoute(path: string): Promise<{ html: string; head: SeoHead }>`
- Produces: `SeoHead = { title: string; description: string; canonical: string; robots: string; jsonLd: string[] }`
- Produces: `dist/<route>/index.html` for every indexable route.

- [ ] **Step 1: Write the failing output test** that loads `dist/calculadora-tinta/index.html` and requires the route H1, a self-canonical URL, a unique title, a meta description, and at least 400 visible words.
- [ ] **Step 2: Create a server entry** using `StaticRouter`, `HelmetProvider`, and `renderToString`.
- [ ] **Step 3: Refactor providers that touch `window` or `localStorage`** so server rendering uses deterministic defaults and browser effects run only inside `useEffect`.
- [ ] **Step 4: Build `scripts/html-template.mjs`** to replace the root placeholder with rendered HTML and inject Helmet title, meta, canonical, and JSON-LD into `<head>`.
- [ ] **Step 5: Build `scripts/prerender.mjs`** to iterate over `INDEXABLE_ROUTES` and write route-specific HTML files.
- [ ] **Step 6: Change the production build** to `vite build && node scripts/prerender.mjs && node scripts/test-prerender-output.mjs`.
- [ ] **Step 7: Change `src/main.tsx`** to call `hydrateRoot` when prerendered markup exists and `createRoot` only as a development fallback.
- [ ] **Step 8: Run the full build** and confirm that homepage and calculator HTML hashes differ.
- [ ] **Step 9: Confirm with `curl`** that the built preview exposes route-specific text without executing JavaScript.
- [ ] **Step 10: Commit** with `feat: prerender indexable routes`.

**Exit criterion:** `curl` of every indexable production URL returns unique title, self-canonical, H1, description, route content, and schema in the initial response.

### Task 4: Return correct status codes and eliminate soft 404s

**Files:**
- Create: `public/404.html`
- Modify: `vercel.json`
- Modify: `src/pages/NotFound.tsx`
- Test: `scripts/test-production-status.mjs`

**Interfaces:**
- Produces: HTTP 404 for unknown routes.
- Consumes: generated static route directories from Task 3.

- [ ] **Step 1: Write a failing production-status test** requiring 200 for known routes and 404 for `/esta-url-nao-existe-auditoria`.
- [ ] **Step 2: Remove the catch-all rewrite** that maps every extensionless path to `/index.html` after prerender files exist.
- [ ] **Step 3: Configure Vercel** to serve `public/404.html` for unmatched paths while preserving static route files.
- [ ] **Step 4: Ensure the 404 document** includes `noindex, follow`, useful navigation, and no canonical to the homepage.
- [ ] **Step 5: Deploy to a preview URL** and run `node scripts/test-production-status.mjs <preview-url>`.
- [ ] **Step 6: Commit** with `fix: return real 404 responses`.

---

## Phase 2: Reduce the index to pages that deserve approval

### Task 5: Introduce a quality gate for calculator pages

**Files:**
- Create: `src/content/toolQuality.ts`
- Create: `src/components/ToolMethodology.tsx`
- Modify: `src/components/SEO.tsx`
- Modify: all calculator pages as they are reviewed
- Test: `src/content/toolQuality.test.ts`

**Interfaces:**
- Produces: `ToolQualityRecord = { path: string; reviewedAt: string; reviewer: string; sources: Source[]; assumptions: string[]; limitations: string[]; indexable: boolean }`
- Produces: `Source = { label: string; url: string; publisher: string; accessedAt: string }`

- [ ] **Step 1: Write tests** requiring at least two relevant sources, one limitations entry, one assumptions entry, a review date, and an accountable reviewer label for every `indexable: true` tool.
- [ ] **Step 2: Add `ToolMethodology`** to render formula, assumptions, limitations, source links, and last review date below each calculator.
- [ ] **Step 3: Update `SEO`** so remediation routes receive `noindex, follow` and are excluded from sitemap generation.
- [ ] **Step 4: Review the five core calculators first**: tinta, pisos, tijolos, concreto, and telhado.
- [ ] **Step 5: Remove unsourced precision claims** such as universal yield, price, safety, or standards claims; replace them with sourced ranges and manufacturer/project caveats.
- [ ] **Step 6: Run route and quality audits** before restoring any additional calculator to the index.
- [ ] **Step 7: Commit each reviewed calculator separately** using `content: substantiate <calculator-name> methodology`.

**Quality gate per calculator:**

- At least 700 useful visible words excluding navigation and footer.
- Formula and worked example using realistic inputs.
- Explicit assumptions and failure cases.
- At least two current primary/authoritative sources.
- Clear statement that the estimate does not replace a technical project.
- No commercial CTA above the methodology or result explanation.
- Unique title, description, H1, canonical, and SoftwareApplication schema.

### Task 6: Generate the sitemap from approved content only

**Files:**
- Create: `scripts/generate-sitemap.mjs`
- Modify: `package.json`
- Replace generated file: `public/sitemap.xml`
- Test: `scripts/test-sitemap.mjs`

**Interfaces:**
- Consumes: `INDEXABLE_ROUTES` and article/tool review dates.
- Produces: canonical `public/sitemap.xml`.

- [ ] **Step 1: Write a failing test** rejecting blocked, redirected, noindex, duplicate, nonexistent, or non-canonical sitemap URLs.
- [ ] **Step 2: Generate `<lastmod>`** from real content review dates rather than assigning the same arbitrary date to many pages.
- [ ] **Step 3: Remove `changefreq` and `priority`** because they do not compensate for quality and are not needed for this site.
- [ ] **Step 4: Add sitemap generation before Vite build** so deploys cannot ship stale routes.
- [ ] **Step 5: Run** `npm run audit:routes && node scripts/test-sitemap.mjs`.
- [ ] **Step 6: Commit** with `build: generate sitemap from approved routes`.

---

## Phase 3: Rebuild editorial trust

### Task 7: Add a real editorial evidence model

**Files:**
- Modify: `src/types/blog.ts`
- Modify: `src/data/blogPosts.ts`
- Create: `src/components/ArticleSources.tsx`
- Modify: `src/pages/BlogPost.tsx`
- Modify: `src/utils/schemas.ts`
- Test: `src/data/blogPosts.test.ts`

**Interfaces:**
- Extends `BlogPost` with `reviewedAt`, `reviewedBy`, `sources`, and `factCheckNotes`.
- Produces: Organization author schema unless a real, publicly verifiable person is supplied.

- [ ] **Step 1: Write tests** requiring source URLs for every article containing prices, percentages, laws, standards, safety guidance, or market comparisons.
- [ ] **Step 2: Add a visible sources section** with publisher, document title, access date, and external-link labeling.
- [ ] **Step 3: Add “Como este conteúdo foi produzido”** with research and review method.
- [ ] **Step 4: Use Organization as author** until a real identified author and credentials can be published and verified.
- [ ] **Step 5: Update Article schema** with accurate `datePublished`, `dateModified`, author, publisher, and mainEntityOfPage.
- [ ] **Step 6: Fix every `/og-image.png` reference** to the real `/og-image.jpg`, or generate the missing PNG intentionally.
- [ ] **Step 7: Commit** with `content: add verifiable editorial evidence`.

### Task 8: Audit or withdraw the current 10 articles

**Files:**
- Modify: `src/data/blogPosts.ts`
- Modify: `src/config/indexableRoutes.ts`
- Generated: `public/sitemap.xml`
- Test: `src/data/blogPosts.test.ts`

- [ ] **Step 1: Review each article line by line** and classify every numerical, normative, legal, price, and safety claim as sourced, softened, removed, or updated.
- [ ] **Step 2: Prioritize the five evergreen articles**: choosing materials, budgeting, renovation mistakes, hiring professionals, and construction scheduling.
- [ ] **Step 3: Temporarily noindex articles** whose claims cannot be substantiated within the remediation cycle, especially the 2026 price comparison and standards/safety pages.
- [ ] **Step 4: Remove clickbait formulations** such as “O #3 custa muito caro” and unsupported superlatives such as “guia definitivo”.
- [ ] **Step 5: Add original value** to each retained article: a worked scenario, downloadable checklist, comparison table with cited inputs, or calculator walkthrough.
- [ ] **Step 6: Check every internal link** and add contextual links to the relevant calculator and cluster hub.
- [ ] **Step 7: Run article-quality tests** and regenerate the sitemap.
- [ ] **Step 8: Commit each article review separately** using `content: substantiate <article-slug>`.

**Quality gate per article:**

- One clear search intent and no keyword cannibalization.
- Original example, checklist, dataset, or decision framework.
- Claims linked to primary sources near the relevant section.
- Accurate dates and a visible last-reviewed date.
- No stock claims of professional experience the publisher cannot prove.
- At least two contextual internal links and one link back from a relevant tool.

### Task 9: Build four topical clusters instead of unrelated posts

**Files:**
- Create: `src/content/topicClusters.ts`
- Modify: `src/pages/Blog.tsx`
- Modify: `src/pages/Index.tsx`
- Modify: relevant calculator and article pages
- Test: `src/content/topicClusters.test.ts`

**Interfaces:**
- Produces: `TopicCluster = { slug: string; label: string; hub: string; tools: string[]; articles: string[] }`

- [ ] **Step 1: Define four clusters**: planejamento/orçamento, estrutura/alvenaria, acabamento, and instalações/segurança.
- [ ] **Step 2: Assign every indexable page** to one primary cluster.
- [ ] **Step 3: Add cluster navigation** to blog and tool pages using descriptive anchors.
- [ ] **Step 4: Add tests** ensuring every indexable tool has at least one article link and every article has at least one relevant tool link.
- [ ] **Step 5: Commit** with `feat: connect content into topical clusters`.

---

## Phase 4: Performance, metadata, and consent compliance

### Task 10: Split the SPA bundle by route

**Files:**
- Modify: `src/routes/routeDefinitions.ts`
- Modify: `src/routes/AppRoutes.tsx`
- Modify: `vite.config.ts`
- Test: `scripts/check-bundle-budget.mjs`

**Interfaces:**
- Produces lazy route components via `React.lazy`.
- Produces bundle budget: initial application JavaScript below 250 KB gzip.

- [ ] **Step 1: Write a failing bundle-budget script** that reads Vite manifest output and rejects an initial gzip total above 250 KB.
- [ ] **Step 2: Convert calculator and blog routes** to dynamic imports with route-level Suspense boundaries.
- [ ] **Step 3: Separate Markdown, charts, forms, and rarely used UI libraries** into on-demand chunks.
- [ ] **Step 4: Remove unused dependencies and the production `lovable-tagger` path.
- [ ] **Step 5: Run mobile Lighthouse three times** on home, a core calculator, and an article; use the median result.
- [ ] **Step 6: Require LCP ≤ 2.5 s, CLS ≤ 0.1, INP lab proxy/TBT acceptable, and no console/network errors before exit.
- [ ] **Step 7: Commit** with `perf: lazy load route bundles`.

### Task 11: Validate metadata and structured data

**Files:**
- Modify: `src/components/SEO.tsx`
- Modify: `src/utils/schemas.ts`
- Create: `scripts/audit-rendered-seo.mjs`

- [ ] **Step 1: Audit every prerendered page** for exactly one title, description, canonical, robots tag, and H1.
- [ ] **Step 2: Reject duplicate titles/descriptions** and canonicals that point to another route.
- [ ] **Step 3: Validate SoftwareApplication, Article, Organization, and BreadcrumbList JSON-LD** against Schema.org shape and Google Rich Results Test.
- [ ] **Step 4: Remove FAQ schema** from pages where FAQ content is not fully visible or eligible.
- [ ] **Step 5: Add `og:image:width`, `og:image:height`, and image alt metadata** for the real social image.
- [ ] **Step 6: Commit** with `fix: validate rendered SEO metadata`.

### Task 12: Replace the custom ad consent path with a certified CMP

**Files:**
- Modify or remove: `src/components/ConsentManager.tsx`
- Modify: `src/pages/PoliticaPrivacidade.tsx`
- Modify: `src/components/Footer.tsx`
- Add configuration according to the selected Google-certified CMP.

- [ ] **Step 1: Select Google Funding Choices or another Google-certified CMP** that supports TCF for EEA/UK and LGPD choices for Brazil.
- [ ] **Step 2: Configure equal prominence** for accept and reject choices and granular preference reopening.
- [ ] **Step 3: Keep AdSense and Analytics blocked** until the CMP supplies the applicable consent signal.
- [ ] **Step 4: Verify consent transitions** for accept all, reject all, analytics only, ads only, revoke, and a returning visitor.
- [ ] **Step 5: Update the privacy policy** with controller identity, purposes, legal bases, processors, retention, rights, and preference-change instructions.
- [ ] **Step 6: Capture network evidence** showing no nonessential Google requests before consent.
- [ ] **Step 7: Commit** with `compliance: integrate certified consent platform`.

---

## Phase 5: Production validation and AdSense resubmission

### Task 13: Run a complete production acceptance audit

**Files:**
- Create: `scripts/verify-production-seo.mjs`
- Create: `docs/adsense/review-evidence.md`

**Interfaces:**
- Consumes: production base URL.
- Produces: machine-readable pass/fail report and human evidence checklist.

- [ ] **Step 1: Verify every sitemap URL** returns 200 directly with no redirect.
- [ ] **Step 2: Verify every initial HTML response** contains unique route-specific text, self-canonical, title, description, robots, H1, and valid JSON-LD.
- [ ] **Step 3: Verify unknown URLs return 404** and remediation routes return `noindex, follow` and are absent from the sitemap.
- [ ] **Step 4: Crawl internal links** and require zero broken links, redirect chains, or orphaned indexable pages.
- [ ] **Step 5: Verify robots.txt, sitemap.xml, ads.txt, privacy, terms, contact, about/method, and consent-preference controls.
- [ ] **Step 6: Run mobile browser smoke tests** for home, five core calculators, five retained articles, contact, and privacy.
- [ ] **Step 7: Record median Lighthouse results** and attach screenshots/log excerpts to `docs/adsense/review-evidence.md`.
- [ ] **Step 8: Inspect Search Console URL Inspection** for home, one calculator, and one article; require “URL is on Google” or successful live-test eligibility.
- [ ] **Step 9: Wait for the new HTML and sitemap to be crawled** rather than requesting review immediately after deployment.
- [ ] **Step 10: Submit a new AdSense review only after all gates pass** and the production site has no “under construction”, placeholder, fake-author, or unsupported-claim signals.

## Recommended execution order and duration

1. **Week 1 — Technical foundation:** Tasks 1-4.
2. **Week 2 — Core calculator quality:** Tasks 5-6, starting with five tools.
3. **Weeks 3-4 — Editorial remediation:** Tasks 7-9, retaining only substantiated articles.
4. **Week 5 — Performance, schema, CMP:** Tasks 10-12.
5. **Week 6 — Crawl observation and review:** Task 13.

The schedule assumes one developer plus access to a real subject-matter reviewer. Without a qualified reviewer, structural, electrical, safety, accessibility, and financial pages should remain noindex rather than being represented as authoritative.

## Final resubmission gate

Do not tick “Confirmo que corrigi os problemas” until all statements below are true:

- Initial HTML is unique and useful on every sitemap URL.
- Unknown URLs return 404.
- Every indexed calculator has methodology, assumptions, limitations, sources, and a real review date.
- Every indexed article has original value and citations for material claims.
- Thin/unreviewed pages are noindex and absent from the sitemap.
- Ad/affiliate presentation remains secondary to content.
- Consent is handled by a certified CMP where Google requires it.
- Mobile performance and navigation pass production checks.
- Search Console live inspection sees the rendered canonical content.

