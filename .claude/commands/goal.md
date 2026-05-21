---
description: Replace the fake match % and hardcoded MAJOR_FIT with real fit signals from Terra Dotta / VIA-TRM.
---

# /goal — make Peel's match score real

Today `matchScore` in `src/App.jsx:202` is `(stringHash % 17) + tinyMajorBonus`, and `MAJOR_FIT` in `src/App.jsx:186` is eight hardcoded city arrays. The UI shows these as confident "92% match" pills. This is the single biggest honesty gap. Fix it using data we already pull (and don't use) plus one new scrape mode.

5C scope only. Five phases. Commit per phase. If a premise breaks, stop and ask.

---

## What's actually possible

| Signal | Source | Notes |
|---|---|---|
| Subject-area → major fit | VIA-TRM `program_subject_areas` (captured, unused in `src/data/viaTrm.js:105`); Terra Dotta program **detail** pages (new scrape) | Highest leverage |
| Language of instruction | VIA-TRM `instructional_languages` (captured, unused); Terra Dotta detail pages | Needs user proficiency input |
| Term availability | VIA-TRM `program_term_names` (captured, unused); Terra Dotta detail pages | Needs user term input |
| GPA prereq | Terra Dotta detail pages; sometimes VIA-TRM `program_minimum_gpa` | Needs user GPA input |
| Class-standing prereq | Terra Dotta detail pages | Sophomore/Junior/Senior |
| Past credit determinations | Existing `COURSE_CREDIT` in `src/data/country.js:80` | Confidence boost when a real ruling exists for (program, school, major) |
| Alumni count | Not exposed by either platform | **Skip** — would need internal school data |

---

## Phase 1 — Terra Dotta program **detail** scraper

The current proxy (`api/terradotta.js`) only parses the search-results table. Detail fields live on per-program pages.

1. Extend `api/terradotta.js` with a new mode: `GET /api/terradotta?subdomain=X&program=NNN`. Fetches `https://{sub}.terradotta.com/index.cfm?FuseAction=Programs.ViewProgram&Program_ID=NNN`. Parse the key/value block — fields appear as `<label>Key:</label>Value` or in a `dl` / table layout. Extract:
   - `subjectAreas: string[]` (split on `,` or `;`)
   - `language: string` (Language of Instruction)
   - `terms: string[]` (Terms: Fall, Spring, Summer, Year, Academic Year)
   - `minGpa: number | null`
   - `classLevel: string[]` (e.g. `["Sophomore","Junior","Senior"]`)
   - `programType: string` (Exchange / Direct / Provider / Faculty-led)
2. Add a **batch hydrate** endpoint: `GET /api/terradotta?subdomain=X&hydrate=true`. Server-side it walks the listing, fetches each detail page with concurrency=6, returns the listing rows plus the detail fields above. Cache the merged result 24h via `Cache-Control: public, max-age=86400, s-maxage=86400`. Don't break the existing `?subdomain=X` mode.
3. Update `src/data/terradotta.js` `normalize()` to carry the new fields through into the program shape used by the UI. Default to `hydrate=true` for the live fetch in `loadPrograms`.

**Accept:** A spot-check of three Pomona programs (e.g. Edinburgh, Kyoto, Berlin) shows real subject areas, language, terms, and GPA — verify in the browser network tab.

---

## Phase 2 — Subject taxonomy → major mapping

Replace the city-based `MAJOR_FIT` with subject-string matching.

1. Inspect the actual subject strings Terra Dotta and VIA-TRM return for the 5C portals. Don't guess — read 30–50 real records and write down the strings used.
2. New file `src/data/majorSubjects.js`. Export `MAJOR_SUBJECTS: Record<majorId, { include: RegExp[], exclude?: RegExp[] }>`. Example shape:
   ```js
   business: { include: [/economic/i, /\bfinance\b/i, /business/i, /accounting/i, /management/i] }
   cs:       { include: [/computer science/i, /\bcs\b/i, /data science/i, /software/i, /informatics/i] }
   ```
3. Export `matchSubjects(program, majorId) → { score: 0..1, matched: string[] }` — proportion of program subjects that hit any regex for the major. Return matched subject strings so the UI can show them.
4. **Delete** `MAJOR_FIT` and `majorBonus` from `src/App.jsx`.

**Accept:** A CS major asking for Berlin sees programs with "Computer Science" / "Informatics" subjects ranked above generic exchange programs in Berlin.

---

## Phase 3 — Collect the missing user inputs

Two new screens (or one combined "Profile" panel between `major` and `continent`):

1. **GPA**: numeric input, optional, default null. Store as `gpa: number | null`.
2. **Term preference**: Fall / Spring / Summer / Academic Year / "no preference". Reuse `SEMS` style from `src/data/options.js:54`.
3. **Language proficiency**: a small repeatable row `{ language: "Spanish", level: "none|basic|intermediate|advanced|native" }`. Keep the UI simple — three rows max, optional. Store as `lang: { [language]: level }`.

Wire all three through `App.jsx` state and into the URL hash (`p.set("gpa", ...)`, etc.) so deep links survive. Don't gate progress on them — they're optional refinements.

**Accept:** Skipping all three still works end-to-end; filling them in changes the ranking.

---

## Phase 4 — Real `matchScore`

Replace the hash in `src/App.jsx:202` with a transparent weighted sum. Each component returns `{ score, reason }` so the UI can explain the number.

```
fit(program, user) =
  subjectMatch  *  40    // matchSubjects(program, user.major)
+ languageMatch *  20    // language ok = 1, basic-required-but-have-none = 0
+ termMatch     *  15    // user.term ∈ program.terms = 1; "no pref" = 1
+ vibeMatch     *  10    // already in this bucket
+ creditHistory *  15    // COURSE_CREDIT has a ruling for (program, school, major)

minus hard eligibility gates (rendered as muted card with reason, not hidden):
  user.gpa < program.minGpa            → "GPA below program minimum"
  user.classLevel ∉ program.classLevel → "Class standing not eligible"
```

Cap at 99, floor at 30. Two programs with the same total break ties on subjectMatch.

In `DestinationsStep.jsx` replace the bare percentage pill with a breakdown chip: a row of small icons for subject ✓ / language ✓ / term ✓ / credit-confirmed ✓ — clicking the pill reveals the reasons. For ineligible programs, render the card muted with the gate reason instead of dropping it.

**Accept:** Clicking the match pill on any card lists the exact components that produced the number. No program shows a number it can't justify.

---

## Phase 5 — Honesty pass

- Update the footer + per-step microcopy: the match % is now derived from `{subject, language, term, vibe, credit-history}` — say that.
- Where a program is missing a field (e.g. Terra Dotta detail scrape failed), the corresponding signal contributes 0 and the breakdown chip shows it as `—` not `✓`. Never silently treat missing data as a pass.
- Leave `COURSE_CREDIT` mechanics alone — keep the "go email your advisor" fallback for everything that isn't a confirmed ruling.

**Accept:** A program with no scraped detail data still shows up, with a lower score and an explicit "we couldn't read this program's details" note rather than a fake high score.

---

## Rules

- 5C only. CMC stays Terra Dotta-live, others stay as configured.
- Don't add a database. All new data is scraped + cached in `sessionStorage` (client) and Vercel edge cache (server).
- Don't invent subject taxonomies — read real strings from the live API before writing regex.
- Detail-page parser is the most fragile new thing — write 3–5 sample HTML fixtures into a tiny inline test you can re-run when the portal changes.
- Verify each phase in `npm run dev` before moving to the next.
