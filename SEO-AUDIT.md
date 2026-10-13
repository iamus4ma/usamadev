# SEO audit — 13 October 2026

Production: https://usamahassan.vercel.app/

## Findings and changes

| Area | Finding | Change |
| --- | --- | --- |
| Crawl access | Homepage, About, Projects, Experience, robots.txt and sitemap returned HTTP 200 during the audit; no blocking response header was observed. | Kept crawling enabled. |
| Initial HTML | Homepage was an empty React shell; primary pages contained only a short description. | Build now generates readable homepage, About, Projects, Experience and experiments-index content. Projects and employment history come from the same JSON data used by React. |
| Metadata | Homepage identity signals were updated in earlier work; experiments index inherited the homepage description. | Preserved Software Engineer, Full Stack Developer and iamus4ma signals; added distinct experiments-index metadata. |
| Canonicals | Homepage canonical required JavaScript; direct .html variants could be accessed. | Generated HTML includes a canonical for each primary page. Vercel redirects .html variants to clean URLs. Experiment details use a separate shell to avoid inheriting the homepage canonical. |
| Internal links | Experiment cards were buttons. | Cards now have real href links while preserving the conversation interaction and opening in another tab. |
| Sitemap | A manually maintained list could drift from page configuration. | Production sitemap is generated from the primary page registry. It excludes fullscreen embeds and unknown paths. |
| Invalid/duplicate pages | Unknown routes could appear indexable; fullscreen noindex depended on JavaScript. | Unknown client routes get noindex; fullscreen experiment URLs also receive an HTTP noindex header. |
| Branding | Web-app manifest retained Create React App names. | Updated application names to Usama Hassan Portfolio / usamaDev. |

## Scope and limits

- This is build-time readable HTML followed by the existing client-rendered conversation, not full React server rendering. Detailed experiment players still load with JavaScript.
- Google has already confirmed the homepage is indexed. Rankings, displayed site names, and indexing of additional pages remain Google's decisions.
- This audit does not have access to private Search Console reports, Vercel firewall configuration, real-user Core Web Vitals, or backlink data. No numerical performance or ranking score is claimed.
- Live checks apply to the previously deployed version. The changes in this audit require a new deployment.
- Source-map and outdated Browserslist warnings are dependency-maintenance items, not evidence of an indexing block.

## After deployment

1. Check `/`, `/about`, `/projects`, `/experience`, `/experiments`, and `/sitemap.xml` on production.
2. In Search Console, inspect the new pages and review Google's selected canonical, rendered content, and indexing reason.
3. Confirm the sitemap reports Success. Request recrawling after the deployment if needed; repeated requests do not guarantee ranking.
4. Use Performance reports to track actual impressions for Usama Hassan, software engineer, full stack developer, and iamus4ma.

## Validation

- 39 React interaction tests and 9 routing/content tests passed.
- Production build succeeded with the existing Mediapipe source-map warning.
- All five generated primary pages contain readable HTML, valid JSON-LD, one canonical, and one description.
- Browser checks confirmed About content and metadata load correctly. Navigating from an unknown experiment to Projects changes robots from noindex to index and updates the canonical without duplicating the description.

Reference: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
