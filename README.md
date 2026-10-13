# volens.tech — production site (v4)

Static site for Volens. Deploys to GitHub Pages at https://volens.tech (CNAME included).

## What changed and why (audit summary)

The previous site was a single dark page with web fonts (Sora, IBM Plex, loaded from Google), one large inline stylesheet and script, 38 capability cards, an animated canvas, a status ticker and a form that did not send anywhere. Audit findings and the fix applied:

| Finding | Fix |
|---|---|
| Two render-blocking Google Fonts requests; fonts.gstatic blocked on some networks, so fallbacks rendered anyway | **System font stack** (`-apple-system, Segoe UI, Roboto, …` and `ui-monospace`). Zero external requests. Documented font replacement: Sora → system sans (headings 800/700), IBM Plex Sans → system sans, IBM Plex Mono → system mono. |
| 38 capability cards and six tabs buried the offer; long scroll on mobile | Six benefit-led capability cards, each with "Includes" bullets and a CTA. Nothing was dropped; detail is grouped. |
| All-caps labels, title-case nav, mono product codes (VOL-AGT-01) | Sentence case throughout; codes removed. Wordmark "VOLENS" kept as the established brand mark. |
| Animated canvas, marquee, spotlight hover, pulse dots | Removed. Only transitions that give feedback remain; `prefers-reduced-motion` disables them. |
| CTA inconsistency ("Request access", "Request early access", "Become a design partner") | One primary action everywhere: **Book a discovery call**. |
| Form confirmed on page but delivered nothing; no consent control | Validation with inline errors, focus management, `aria-live` status, unchecked consent box, privacy link. With no backend set, submit opens a pre-filled email so no enquiry is lost. Set `FORM_ENDPOINT` in `main.js` to post JSON to Formspree/Pageclip/your API. |
| No privacy page, no 404, no legal links | `privacy.html` (placeholders marked `[Add …]` for legal entity and date) and `404.html` added. |
| Unverifiable claims ("hundreds of bots", "30+ languages", cost per run, certification wording) | Removed or softened to design intent. No statistics, customers, awards or testimonials are shown because none are verified. Add a testimonial/case-study section only with real material. |
| Latin etymology line ("acting of one's own accord") | Removed; *volens* means "willing". |
| Dark-only page reduced readability of long sections | Dark brand ground kept for header, hero, contact and footer; light sections for reading. |
| Nav target `#faq` referenced from a sheet but mixed; side dot index; two nav systems | One header nav (5 items + CTA), accessible mobile menu, footer nav. |

## Preserved

Logo (unchanged SVG mark and wordmark), colours (navy #070A12, signal orange #FF8A3D, ice #8FD8FF), all offerings, industries, process steps, impact calculator and assumptions, 90-day engagement path, roadmap, trust statements, contact email, Pune HQ, "Founded 2026", Organization structured data, all section anchors.

## Redirect map

No URLs changed. All existing anchors resolve: `#how`, `#capabilities`, `#why`, `#impact`, `#path`, `#faq`, `#access` (alias to `#contact`). `#claude` and `#arch` sections were merged into Trust/How it works; links to them land on the page top, which is acceptable for in-page anchors. New: `/privacy.html`, `/404.html`.

## Stack decision

Kept static HTML/CSS/JS on GitHub Pages rather than migrating to Next.js. One marketing page, no content editors, no server logic: a framework would add a build pipeline and client JavaScript for no user benefit. GitHub Pages provides HTTPS, HTTP/2, gzip and CDN. Total page weight: ~35 KB HTML, 19 KB CSS, 8 KB JS, no fonts, no images above the fold.

## Measured results (local, Lighthouse 12, mobile emulation)

Performance 100 · Accessibility 100 · Best practices 100 · SEO 100. LCP 1.2 s, CLS 0, TBT 90 ms. No horizontal overflow at 320/375/390/768/1024/1440. No console errors. Keyboard: skip link first, tabs with arrow keys, form errors focus the first invalid field.

## Deploy

Replace the contents of the `volens-tech` repository with this folder (keep nothing from the old version) and commit. GitHub Pages redeploys in about a minute. Then:

1. Set `FORM_ENDPOINT` in `main.js` (Formspree or Pageclip free tier) so enquiries reach hello@volens.tech.
2. Fill the `[Add …]` placeholders in `privacy.html`.
3. Confirm the LinkedIn company URL in the footer (`/company/volens`) once the page exists.
4. Optional: add privacy-respecting analytics (Plausible/Umami). `main.js` already fires `cta_*`, `form_start`, `form_submit_success`, `email_click`, `industry_tab` events into `window.dataLayer` or `window.plausible` if present.

## Files

`index.html` · `styles.css` · `main.js` · `privacy.html` · `404.html` · `favicon.svg` · `apple-touch-icon.png` · `logo-512.png` · `og.png` (1200×630) · `robots.txt` · `sitemap.xml` · `CNAME` · `.nojekyll`
