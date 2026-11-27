# AI Benar Advisory website

A fast, accessible, cookieless one-page site for an independent AI and data compliance consultancy, based in London. Plain HTML, CSS and JavaScript: no build step, no framework, no external fonts.

## What the site offers
The site offers **compliance and governance services** (website checks, readiness assessments, policy packs, workshops and retainers) for organisations whose products or services reach people in these places, listed region first:

- **Europe:** European Union, United Kingdom
- **Asia (including ASEAN):** South Korea; and in ASEAN, Singapore, Malaysia, Indonesia, Thailand, Vietnam and the Philippines
- **Arab Gulf:** Qatar, the United Arab Emirates, Saudi Arabia

Every place listed has binding AI rules, a GDPR-style data protection law, or both. Places with only strategies and no binding AI or data protection duties are not listed.

**Not legal advice.** AI Benar Advisory is not a law firm. It provides compliance and governance support: explaining what rules say, mapping them to an organisation’s tools and processes, and helping put practical controls in place. Where a client needs a legal opinion, they should consult a qualified lawyer in the relevant country. The page, the footer and the AI rules check all say this.

**Languages of service:** English, Malay and Bahasa Indonesia.

**Independence:** AI Benar Advisory, and the EU AI Governance Tracker it links to, are not affiliated with or endorsed by the European Union, any government or any regulator. The page states this in the About section (footnote marked *) and in the footer. The EU flag is deliberately not used.

## Before every update: check for newer laws
Laws in the covered places change often (in 2026 alone, the EU delayed its high-risk AI duties, the UK replaced Article 22 of the UK GDPR, and Vietnam’s AI Law came into force). **For every update, and before changing any content, check whether there are more recent or new laws to consider, and update the site accordingly.** This applies to people and to AI assistants such as Muse by Meta.

1. For each covered place, check for new laws, amendments, commencement dates, delays, withdrawals and new regulator guidance. Prefer official sources: official journals, government legislation sites and regulators’ own pages.
2. Update the matching rules in `app.js` (see below): the title, the note and the status.
3. Update the **Deadlines** section in `index.html` if a date has changed, and its “Dates checked on” line.
4. Update `LAST REVIEWED` and `REVIEWED` in `app.js`.
5. If a place gains its first binding AI or data protection law, consider adding it; if a law is withdrawn, check whether the place still belongs.
6. Run the checks under **Testing**.

## Where things live
- `index.html`: the page. Sections: hero (with the coverage list and the AI rules check), Deadlines, Services, Free tools, About, Contact, footer.
- `styles.css`: the design. Colours and fonts are tokens at the top (`--paper`, `--ink`, `--ledger`, `--brass`, `--serif`, `--sans`), with dark-mode values under `prefers-color-scheme: dark`. The quiz styles are under “AI rules check: step-by-step quiz”.
- `app.js`: behaviour. Section **3. AI RULES CHECK** holds all of the quiz content as data, followed by the engine that builds the quiz from it.
- `privacy.html`: privacy and AI-use notice. `fonts/`: bundled fonts. `assets/`: images and tool logos.

## The AI rules check
The quiz has three steps (where, what the AI does, sector) and then shows results grouped by place. Everything is built from the data in `app.js`, so **edit the data, not the engine**:

- `PLACES`: regions, each with its countries (code and name in each language).
- `USES` and `SECTORS`: the answer options.
- `RULES`: one entry per rule, with:
  - `place`: the country code, such as `"MY"`.
  - `s`: the status: `"now"` (binding today), `"coming"` (passed or drafted, not yet in force), `"check"` (may apply, depending on the organisation) or `"guide"` (voluntary good practice).
  - `when`: when it applies, using the answers: `a.where.MY`, `a.use.chat`, `a.sector === "finance"`, or `a.any` for always.
  - `title` and `note`: plain, factual English. A note can be a function of the answers, as Vietnam’s is.

**To change a rule:** edit its `title`, `note` or `s`, then update the review dates.
**To add a country:** add it to the right region in `PLACES` with its names, add its rules to `RULES` (every place needs at least one rule), and add it to the coverage line in `index.html`, the page `<title>`, the meta description and `areaServed` in the structured data.

## Languages
The quiz can be shown in several languages. `LANGS` in `app.js` lists them; `STR` holds the interface text, and names in `PLACES`, `USES` and `SECTORS` have one entry per language.
- A language appears in the switcher **only when `ready: true`**, which must mean a qualified native speaker has reviewed every string for accuracy and accessibility.
- **Malay (`ms`) and Bahasa Indonesia (`id`) are drafted and switched off.** Preview them with `?lang=ms` or `?lang=id` on the page address; a banner marks the draft. After review, set `ready: true`.
- Rule summaries (`RULES`) stay in English until reviewed translations exist, and the quiz says so in other languages.
- Do not add machine translations for other languages. For a right-to-left language such as Arabic, add `dir: "rtl"` to its `LANGS` entry; the quiz switches direction automatically.

## Testing
After any change:
1. Open the page and run the quiz with several combinations, including every region, “Select all”, Back, “Change my answers” and “Start again”. Check that each chosen place shows at least one rule.
2. Check the page on a phone-sized screen, in light and dark mode, and with the keyboard only (Tab, Space to tick, Enter for Next).
3. Run an accessibility checker such as axe DevTools, and fix any contrast or labelling issues.
4. Check that no text reads “undefined” and that the email link fills in the answers.

## Navigation
Both pages have a header that stays at the top while scrolling (on AI Hakikat it includes a **Home** link), a **Back to top** button that appears in the bottom-right corner after about one screen of scrolling, and **Back to top** and home links in the footer. The button moves keyboard focus back to the top and respects reduced-motion settings.

## Privacy
No cookies. Anonymous visit counts only, and none when the browser sends Do Not Track or Global Privacy Control. Nothing chosen in the quiz leaves the browser, except what a visitor chooses to send by email.


## Addresses and the site map (December 2026)
The site lives at **https://aibenar.dev/AI-Benar-Advisory/**; old `suhaimizainalshah.github.io` links redirect there. Links to the other sites use short
addresses (`/ASEAN-AI-Governance-Tracker/`), which work anywhere under aibenar.dev.

**`robots.txt` has moved** to the home repository (`suhaimizainalshah.github.io`), because search engines only read it at the root of the domain;
the copy here was ignored. The site map for search engines (`aibenar.dev/sitemap.xml`) and for people (`aibenar.dev/sitemap/`) list this site's
pages; add any new page to the `PAGES` list in the home repository's `build.py`. The blog is on the home site, at `aibenar.dev/blog/`, linked from
this site's menu and footer.
