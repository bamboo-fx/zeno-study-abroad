// Live program fetcher for VIA-TRM-hosted schools.
// Public, unauthenticated, CORS-open. No key, no proxy.
import { G } from "../theme/gradients.js";
import { climOf, continentOf } from "./regions.js";
import { SCORE_MAP } from "./options.js";

// Org IDs verified by Playwright probe (Mar 2026).
export const VIA_ORG_IDS = { "harvey-mudd": 668 };

// Endpoint shape:
//   GET https://api.via-trm.com/api/visitor/client_programs/{orgId}?v2=true
// → { data: [ { id, type, attributes: { ... } }, ... ] }
async function rawFetch(orgId) {
  const key = `viatrm:${orgId}`;
  const cached = sessionStorage.getItem(key);
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  const r = await fetch(`https://api.via-trm.com/api/visitor/client_programs/${orgId}?v2=true`);
  if (!r.ok) throw new Error(`VIA-TRM ${orgId}: HTTP ${r.status}`);
  const j = await r.json();
  try { sessionStorage.setItem(key, JSON.stringify(j)); } catch {}
  return j;
}

// city → preferred vibe seed for famous cities (mock data's editorial choices).
// Used as a bonus on top of SCORE_MAP scoring so vibe groupings feel right.
const CITY_VIBE_SEED = {
  "Tokyo":"neon","Seoul":"neon","Shanghai":"neon","Taipei":"neon","Beijing":"neon",
  "Berlin":"neon","London":"neon","Hong Kong":"neon","São Paulo":"neon","Sao Paulo":"neon",
  "Kyoto":"cobble","Edinburgh":"cobble","Prague":"cobble","Rome":"cobble","Athens":"cobble",
  "Siena":"cobble","Salamanca":"cobble","Granada":"cobble","Florence":"cobble","Cusco":"cobble",
  "St Andrews":"cobble","Oxford":"campus","Cambridge":"campus","Buenos Aires":"cobble",
  "Mérida":"cobble","Merida":"cobble","Bologna":"campus","Bath":"cobble","Córdoba":"cobble","Cordoba":"cobble",
  "Paris":"cafe","Vienna":"cafe","Lisbon":"cafe","Madrid":"cafe","Bordeaux":"cafe","Nantes":"cafe",
  "Wellington":"cafe","Sorrento":"cafe","Reims":"cafe","Hue":"cafe","Ho Chi Minh City":"cafe",
  "Barcelona":"beach","Sydney":"beach","Bali":"beach","Cape Town":"beach","Cairns":"beach",
  "Townsville":"beach","Havana":"beach","Bahia":"beach","San José":"beach","Apia":"beach",
  "Copenhagen":"nordic","Stockholm":"nordic","Reykjavik":"nordic","Reykjavík":"nordic",
  "Helsinki":"nordic","Amsterdam":"nordic","Freiburg":"nordic","Heidelberg":"nordic",
  "Tilburg":"nordic","Lüneburg":"nordic","Luneburg":"nordic","Västerås":"nordic","Vasteras":"nordic",
  "Geneva":"alpine","Kathmandu":"alpine","Quito":"alpine","Ushuaia":"alpine","Christchurch":"alpine",
  "Bhutan":"alpine","Thimphu":"alpine","Puerto Natales":"alpine","Veli Lošinj":"alpine",
  "Galápagos":"alpine","Galapagos":"alpine","Dharamsala":"alpine",
  "Budapest":"market","Seville":"market","Accra":"market","Amman":"market","Stone Town":"market",
  "Legon":"market","Oaxaca":"market","Yaoundé":"market","Yaounde":"market","Rabat":"market",
  "Auckland":"campus","Melbourne":"campus","Brisbane":"campus","Dublin":"campus","York":"campus",
  "Belfast":"campus","Dunedin":"campus","Birmingham":"campus","Bristol":"campus","Cork":"campus",
  "Nishinomiya":"campus","Palmerston North":"campus",
};

function hashStr(s) {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// Pick a stable gradient for a city using a deterministic hash.
const GRAD_KEYS = ["neon","cobble","beach","nordic","cafe","alpine","market","campus"];
function gradFor(city, preferredVibe) {
  if (preferredVibe && G[preferredVibe]) return G[preferredVibe];
  return G[GRAD_KEYS[hashStr(city) % GRAD_KEYS.length]];
}

// Split "Tokyo, Japan" → { city, country }. Some VIA-TRM records have multiple
// locations separated by ";" — take the first.
function splitLocation(loc) {
  if (!loc) return { city: "", country: "" };
  const first = loc.split(";")[0].trim();
  const idx = first.lastIndexOf(",");
  if (idx < 0) return { city: first, country: "" };
  return { city: first.slice(0, idx).trim(), country: first.slice(idx + 1).trim() };
}

// Score one program's text against SCORE_MAP. Returns [primaryVibe, secondaryVibe?]
function vibesFor(text, city) {
  const lower = " " + (text || "").toLowerCase().replace(/[^a-z\s]/g, " ") + " ";
  const scores = {};
  for (const v of Object.keys(SCORE_MAP)) {
    let sc = 0;
    for (const kw of SCORE_MAP[v]) if (lower.includes(kw)) sc += 1;
    scores[v] = sc;
  }
  // city seed gives a +4 nudge to the preferred vibe (strong but not absolute)
  const seed = CITY_VIBE_SEED[city];
  if (seed) scores[seed] = (scores[seed] || 0) + 4;
  // ranking
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const best = ranked[0];
  if (!best || best[1] === 0) return [seed || "campus"];
  const out = [best[0]];
  const second = ranked[1];
  if (second && second[1] >= best[1] * 0.8 && second[1] > 0) out.push(second[0]);
  return out;
}

// Normalize one VIA-TRM program → Peel's program shape.
function normalize(p) {
  const a = p.attributes || {};
  const { city, country } = splitLocation(a.locations);
  const subjects = (a.program_subject_areas || "").split(";").map((s) => s.trim()).filter(Boolean);
  const text = [a.program_name, a.organization_name, a.locations, a.program_subject_areas, a.types].join(" ");
  const vibes = vibesFor(text, city);
  const photo = a.background_xl || a.background_large || null;
  const desc = subjects.length
    ? `${a.program_name}. Focus: ${subjects.slice(0, 2).join(", ")}.`
    : (a.program_name || "");
  return {
    id: p.id,
    city,
    country,
    desc,
    highlight: a.organization_name ? `${a.organization_name} – ${a.program_name}` : a.program_name,
    grad: gradFor(city, vibes[0]),
    clim: climOf(country),
    photo,
    term: a.program_term_names || "",
    startDate: (a.program_term_start_dates || "").split(";")[0]?.trim() || "",
    endDate:   (a.program_term_end_dates   || "").split(";")[0]?.trim() || "",
    subjects,
    housing: a.program_housing_types || "",
    contact: a.program_contact || "",
    language: a.instructional_languages || "",
    types: a.types || "",
    vibes,
  };
}

// Group a flat normalized list into SRC[vibe][continent] = [...]
function group(flat) {
  const out = {};
  for (const p of flat) {
    if (!p.city || !p.country) continue;
    const cont = continentOf(p.country);
    for (const v of p.vibes) {
      if (!out[v]) out[v] = { europe: [], asia: [], oceania: [], americas: [] };
      out[v][cont].push(p);
    }
  }
  return out;
}

export async function fetchVIAPrograms(orgId) {
  const raw = await rawFetch(orgId);
  const flat = (raw.data || []).map(normalize);
  return group(flat);
}
