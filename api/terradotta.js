// Terra Dotta proxy + parser. Lives as a single file used in two places:
//   1. Vercel Edge Function — default export below
//   2. Vite dev middleware — see vite.config.js (imports handleTerraDotta)
//
// Why a proxy: Terra Dotta search pages return HTML and don't send CORS
// headers, so the browser can't fetch them directly. This proxy fetches
// server-side and returns JSON with CORS=* and a 24h cache.
//
// Modes:
//   ?subdomain=X                  → program listing (city/country only)
//   ?subdomain=X&program=NNN      → one program's structured detail
//   ?subdomain=X&hydrate=true     → listing + detail merged for every program
//
// The hydrate mode is what the UI uses. Detail data comes from a stable
// Angular REST endpoint we discovered on the brochure SPA — see DETAIL_NOTES.

const SOURCES = {
  "pomona-sa": "https://pomona-sa.terradotta.com",
  "pitzer-sa": "https://pitzer-sa.terradotta.com",
  "scrippscollege-sa": "https://scrippscollege-sa.terradotta.com",
  "cmc-ge": "https://globaleducation.cmc.edu",
};

// Hydrate concurrency. Terra Dotta brochure endpoints are ~20KB each and the
// upstream is slow; six in flight keeps a full 100-program school under ~10s
// while staying gentle on the origin.
const HYDRATE_CONCURRENCY = 6;

function stripTags(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&").replace(/&ndash;/g, "–").replace(/&#x3a;/g, ":")
    .replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function parseListing(html) {
  const out = [];
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let m;
  while ((m = rowRe.exec(html))) {
    const row = m[1];
    const link = row.match(/href="[^"]*Program_ID=(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    if (!link) continue;
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => stripTags(c[1]));
    if (cells.length < 4) continue;
    const id = link[1];
    if (id === "0") continue; // header/sentinel row
    const name = stripTags(link[2]);
    const city = cells[1];
    const country = cells[2];
    const region = cells[3];
    if (!country || country.toLowerCase() === "country") continue;
    out.push({ id, name, city, country, region });
  }
  return out;
}

async function fetchListing(origin) {
  const url = `${origin}/index.cfm?FuseAction=Programs.SearchResults&Order=asc&Sort=Program_City&program_active=1&program_type_id=1&requiredminimumtofindismeet=0`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`upstream listing ${r.status}`);
  const html = await r.text();
  return parseListing(html);
}

// Pull a single value from the brochure's "information sheet" parameters list.
// Parameter names are stable across schools (Pomona/Pitzer/Scripps/CMC all
// share the same Terra Dotta brochure template). Match by case-insensitive
// exact-name so a school's custom prefix label can't accidentally collide.
function paramValues(parameters, name) {
  const want = name.toLowerCase();
  const p = (parameters || []).find((x) => (x.parameterName || "").toLowerCase() === want);
  return p && Array.isArray(p.assignedValues) ? p.assignedValues : [];
}

// "1 - Second Semester Sophomore" → "Second Semester Sophomore"
// "2 - Junior" → "Junior"
function cleanClassStanding(v) {
  return String(v).replace(/^\d+\s*-\s*/, "").trim();
}

function parseGpa(v) {
  if (v == null) return null;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

async function fetchProgramDetail(origin, programId) {
  // Two endpoints: /program gives us the canonical TERMS, /program/brochure
  // gives the structured parameter sheet (subjects, GPA, language, ...).
  // Fetch in parallel — both endpoints respond independently.
  const [progRes, brochRes] = await Promise.all([
    fetch(`${origin}/models/services/REST/index.cfm?endpoint=/program&id=${programId}`),
    fetch(`${origin}/models/services/REST/index.cfm?endpoint=/program/brochure&programId=${programId}`),
  ]);

  let terms = [];
  if (progRes.ok) {
    try {
      const j = await progRes.json();
      if (Array.isArray(j.TERMS)) terms = j.TERMS.map((t) => String(t).trim()).filter(Boolean);
    } catch { /* ignore — keep []  */ }
  }

  let parameters = [];
  if (brochRes.ok) {
    try {
      const j = await brochRes.json();
      const sections = j.current && j.current.sections;
      if (Array.isArray(sections)) {
        for (const sec of sections) {
          for (const w of (sec.sectionWidgets || [])) {
            if (w.contentType === "information sheet") {
              const cis = w.contentInformationSheet;
              if (cis && Array.isArray(cis.parameters)) parameters.push(...cis.parameters);
            }
          }
        }
      }
    } catch { /* ignore — keep [] */ }
  }

  // Both fetches dead = we have nothing useful for this program.
  if (!progRes.ok && !brochRes.ok) {
    return { detailOk: false };
  }

  const subjectAreas = paramValues(parameters, "Areas of study");
  const language = paramValues(parameters, "Language of instruction");
  const classLevel = paramValues(parameters, "Class standing").map(cleanClassStanding);
  const programType = paramValues(parameters, "Program type");
  const housing = paramValues(parameters, "Housing options");
  const languageLevel = paramValues(parameters, "Language level");
  const gpaRaw = paramValues(parameters, "GPA");
  const minGpa = gpaRaw.length ? parseGpa(gpaRaw[0]) : null;

  return {
    detailOk: true,
    terms,
    subjectAreas,
    language,
    classLevel,
    programType,
    housing,
    languageLevel,
    minGpa,
  };
}

// Promise-pool with concurrency limit. Returns results in input order.
async function pool(items, limit, worker) {
  const out = new Array(items.length);
  let next = 0;
  const runners = Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      try { out[i] = await worker(items[i], i); }
      catch (e) { out[i] = { __err: e && e.message || String(e) }; }
    }
  });
  await Promise.all(runners);
  return out;
}

export async function handleTerraDotta(searchParams) {
  const sub = searchParams.get("subdomain");
  const origin = SOURCES[sub];
  if (!origin) return { status: 400, body: { error: "unknown subdomain", allowed: Object.keys(SOURCES) } };

  // Single-program detail mode.
  const programId = searchParams.get("program");
  if (programId) {
    try {
      const detail = await fetchProgramDetail(origin, programId);
      return { status: 200, body: { subdomain: sub, programId, ...detail } };
    } catch (e) {
      return { status: 502, body: { error: "upstream detail", message: String(e) } };
    }
  }

  // Listing (with optional hydrate).
  let programs;
  try { programs = await fetchListing(origin); }
  catch (e) { return { status: 502, body: { error: "upstream", message: String(e) } }; }

  if (searchParams.get("hydrate") === "true") {
    const details = await pool(programs, HYDRATE_CONCURRENCY,
      (p) => fetchProgramDetail(origin, p.id));
    for (let i = 0; i < programs.length; i++) {
      const d = details[i];
      if (d && !d.__err && d.detailOk) {
        programs[i] = { ...programs[i], ...d };
      } else {
        programs[i] = { ...programs[i], detailOk: false };
      }
    }
  }

  return { status: 200, body: { subdomain: sub, count: programs.length, programs } };
}

// Vercel Edge Function entry
export default async function (req) {
  const u = new URL(req.url);
  const res = await handleTerraDotta(u.searchParams);
  return new Response(JSON.stringify(res.body), {
    status: res.status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

export const config = { runtime: "nodejs" };
