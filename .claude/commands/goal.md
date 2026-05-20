---
description: Replace Peel's mock data with live study-abroad data in three phases.
---

# /goal — make Peel real

Peel runs on 100% mock data. Replace it with live sources in 3 phases. Commit per phase. Discovery was verified by Playwright — don't re-discover.

## Phase 1 — live HMC via VIA-TRM

`GET https://api.via-trm.com/api/visitor/client_programs/668?v2=true` — public, CORS `*`. HMC=668 (64 programs). CMC=456 but list is empty — leave CMC mock, set its `SCHOOLS` note to "snapshot — public list gated".

`data[i].attributes` fields: `program_name`, `organization_name`, `locations`, `background_large`/`background_xl`, `program_term_{dates,start_dates,end_dates}`, `program_subject_areas`, `program_housing_types`, `program_contact`, `instructional_languages`, `types`, `term_details[]`, `application_template[]`.

Do:
1. `src/data/viaTrm.js` exports `fetchVIAPrograms(orgId)` that normalizes to `{ city, country, desc, highlight, grad, clim, photo, term, startDate, endDate, subjects, housing, contact, language }`. Split `locations` on last `,`. `photo=background_xl||background_large`. `grad`=hash(city)→key of `G`. `clim`=country→`ukmar|cont|med|arctic|easia|trop|shemi|alt|latam|pat|natemp` (small map, default `cont`).
2. Cache per orgId in `sessionStorage`.
3. `src/data/programs.js` exposes async `loadPrograms(schoolId)`. In `App.jsx` replace `SRC = school ? DATA[school] : CMC` with `useEffect`-populated state. Show "Loading approved programs…" on destinations step.
4. UI expects `SRC[vibe][continent]`. Derive: continent via `COUNTRY_CONTINENT` map in `src/data/regions.js`; vibe by scoring `program_name+organization_name+subjects` against `SCORE_MAP`. Multi-bucket if a second vibe scores within 20% of best.
5. Delete `UNSPLASH_KEY` and the Unsplash fetch in `Photo.jsx`. Render `photo` if present, else gradient.
6. HMC note: "Live data from HMC Study Abroad portal".

Accept: HMC shows 60+ live programs with real photos; others untouched; no Unsplash; build passes.

## Phase 2 — Pomona, Pitzer, Scripps via Terra Dotta

Portals: `pomona-sa.terradotta.com` (~44), `pitzer-sa.terradotta.com` (~32), `scrippscollege-sa.terradotta.com` (~109 "SAGE"). CMC stays mock.

Terra Dotta is CORS-blocked → proxy required. One ~30-line edge function (Cloudflare Worker OR `api/terradotta.js` on Vercel):
- Accepts `?subdomain=`. Fetches `https://{subdomain}.terradotta.com/index.cfm?FuseAction=Programs.SearchResults&Order=asc&Sort=Program_City&program_active=1&program_type_id=1&requiredminimumtofindismeet=0`.
- Parses HTML rows: `<a href="?FuseAction=Programs.ViewProgram&Program_ID=NNN">Name</a>` + city/country/term cells.
- Returns JSON with `Access-Control-Allow-Origin: *` and `Cache-Control: public, max-age=86400`.

`src/data/terradotta.js` exposes `fetchTerraDottaPrograms(subdomain)`. Replace `POMONA`/`PITZER`/`SCRIPPS` like Phase 1 did HMC. Photos fall through to Phase 3.

Accept: all 5 schools from real sources (CMC labeled snapshot); proxy is one reviewable file.

## Phase 3 — climate, photos, honesty

- Climate (Open-Meteo): geocode `https://geocoding-api.open-meteo.com/v1/search?name=&count=1`; normals `https://climate-api.open-meteo.com/v1/climate?latitude=&longitude=&start_date=2020-01-01&end_date=2024-12-31&models=EC_Earth3P_HR&daily=temperature_2m_max,temperature_2m_min,precipitation_sum`. Cache in `sessionStorage`. Map into the existing `CLIM` shape. Keep hardcoded `CLIM` as sync fallback.
- Photos: `https://en.wikipedia.org/api/rest_v1/page/summary/{City}` → `thumbnail.source`. CORS-open. Cache.
- Honesty pass: rewrite footer + per-school notes to reflect actual sources. Course-credit and visa stay as honest framework — do not invent rulings.

Accept: no Unsplash; Tokyo/Edinburgh/Buenos Aires climate within ~3°C of Open-Meteo; every card has a real image or tasteful gradient.

## Rules

Keep step flow intact. Direct fetch where CORS allows; one edge function for Terra Dotta. Verify in `npm run dev`. If a premise breaks, stop and ask.
