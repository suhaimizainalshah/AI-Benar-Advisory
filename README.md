# Compliscope Advisory website

A fast, accessible, cookieless one-page site for an AI compliance consultancy. Plain HTML, CSS and JavaScript: no build step, no framework, no external fonts.

## Before you publish
1. **Booking link:** the free call uses `https://calendly.com/suhaimizainalshah/20-minute-meeting` (the button with id `book` in `index.html`). The paid 30-minute walkthrough link (`/30min`) is deliberately not on the site: send it to clients only after they pay.
2. **Domain:** done — the `canonical` tag now points at the live GitHub Pages address (`https://suhaimizainalshah.github.io/Compliscope-Advisory/`). Update it if the site moves to a custom domain.
3. **Counter name:** in `app.js`, change `ANALYTICS.namespace` to a name only you use.
4. **Public visitor count:** it stays hidden until visits reach `ANALYTICS.showVisitsFrom` (1,000). Change or set `on: false` to switch counting off.
5. **Tech For Good Institute article:** once “From Rulebooks to Responses” is published, add it to the “AI policy research” strand in the About section, with a link.
6. **Dates and prices:** the deadline timeline and prices are as of 19 November 2026. Review them every quarter.

## Publish on GitHub Pages
Upload these files to a repository, then Settings → Pages → Deploy from branch → `main` / root. Add a custom domain in the same screen.

## Motion
- **Opening section:** a faint field of 0s and 1s settles within about a second, then stops.
- **"Book a call" band:** when it scrolls into view, the digits settle into a brass section sign (§), once.
- **The rules check:** results appear one after another when someone presses "Show my rules".
Everything is still for visitors who ask their device to reduce motion. The animation is plain canvas code in `app.js` (section 5), with no libraries.

## See your numbers
Add `#stats` to your site address. You’ll see visits, checks completed and clicks on each call to action. Counts are anonymous totals; browsers sending Do Not Track or Global Privacy Control are never counted.

## What’s inside
- `index.html`: the page, with semantic landmarks, a skip link and labelled form controls
- `styles.css`: design tokens, layout and components; light and dark mode; reduced motion respected
- `app.js`: mobile menu, timeline marker, the AI rules check and the anonymous counter
- `privacy.html`: privacy notice and AI use statement
- `fonts/`: Source Serif 4 and Public Sans (SIL Open Font License), self-hosted so no data goes to font services
- `logo.svg`, `assets/sloptical.svg`: logos
- `assets/suhaimi.jpg` and `.webp`: About portrait (4:5); `assets/suhaimi-square.jpg`: square version for LinkedIn or profiles

The AI rules check gives a first indication only. It is not legal advice, and the wording on the page says so.
