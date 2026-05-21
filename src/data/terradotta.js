// Client for /api/terradotta proxy. Returns the same SRC[vibe][continent] = [...]
// shape that viaTrm.js produces, so loadPrograms() can drop it in.
import { G } from "../theme/gradients.js";
import { climOf, continentOf } from "./regions.js";
import { SCORE_MAP } from "./options.js";

export const TERRADOTTA_SUBDOMAINS = {
  cmc: "cmc-ge",
  pomona: "pomona-sa",
  pitzer: "pitzer-sa",
  scripps: "scrippscollege-sa",
};

const GRAD_KEYS = ["neon", "cobble", "beach", "nordic", "cafe", "alpine", "market", "campus"];
function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function gradFor(city, vibe) { if (vibe && G[vibe]) return G[vibe]; return G[GRAD_KEYS[hashStr(city) % GRAD_KEYS.length]]; }

// Same CITY_VIBE_SEED logic as viaTrm.js — duplicated here to keep the two
// fetchers independent. Kept short; expand as Terra Dotta city coverage grows.
const SEED = {
  Tokyo: "neon", Seoul: "neon", Shanghai: "neon", Taipei: "neon", Berlin: "neon", London: "neon",
  Kyoto: "cobble", Edinburgh: "cobble", Prague: "cobble", Rome: "cobble", Athens: "cobble",
  Florence: "cobble", "St Andrews": "cobble", "Buenos Aires": "cobble", Oxford: "campus", Cambridge: "campus",
  Paris: "cafe", Vienna: "cafe", Lisbon: "cafe", Madrid: "cafe", Bordeaux: "cafe",
  Barcelona: "beach", Sydney: "beach", Bali: "beach", "Cape Town": "beach",
  Copenhagen: "nordic", Stockholm: "nordic", Reykjavik: "nordic", Amsterdam: "nordic", Freiburg: "nordic",
  Geneva: "alpine", Kathmandu: "alpine", Quito: "alpine", Christchurch: "alpine",
  Budapest: "market", Seville: "market", Accra: "market", Amman: "market",
};

function vibesFor(text, city) {
  const lower = " " + (text || "").toLowerCase().replace(/[^a-z\s]/g, " ") + " ";
  const scores = {};
  for (const v of Object.keys(SCORE_MAP)) { let sc = 0; for (const kw of SCORE_MAP[v]) if (lower.includes(kw)) sc += 1; scores[v] = sc; }
  if (SEED[city]) scores[SEED[city]] = (scores[SEED[city]] || 0) + 4;
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const best = ranked[0];
  if (!best || best[1] === 0) return [SEED[city] || "campus"];
  const out = [best[0]];
  const second = ranked[1];
  if (second && second[1] >= best[1] * 0.8 && second[1] > 0) out.push(second[0]);
  return out;
}

function normalize(p, editorial) {
  // Subjects (from hydrate) feed into vibe scoring — programs about "Marine
  // Biology" or "Tropical Ecology" should lean beach/alpine rather than
  // whatever city seed says.
  const subjectsText = Array.isArray(p.subjectAreas) ? p.subjectAreas.join(" ") : "";
  const text = [p.name, p.city, p.country, p.region, subjectsText].join(" ");
  const vibes = vibesFor(text, p.city);
  const ed = editorial && editorial.get(`${p.city}|${p.country}`);
  return {
    id: `td-${p.id}`,
    city: p.city,
    country: p.country,
    desc: (ed && ed.desc) || p.name,
    highlight: p.name,
    grad: (ed && ed.grad) || gradFor(p.city, vibes[0]),
    clim: (ed && ed.clim) || climOf(p.country),
    photo: null,
    vibes,
    // ── Hydrated fields (present when the brochure REST endpoint responded).
    // Always pass arrays/null even when missing so downstream callers can
    // treat them as data, not "undefined means anything goes".
    subjects:    Array.isArray(p.subjectAreas) ? p.subjectAreas : [],
    language:    Array.isArray(p.language)     ? p.language     : [],
    terms:       Array.isArray(p.terms)        ? p.terms        : [],
    classLevel:  Array.isArray(p.classLevel)   ? p.classLevel   : [],
    programType: Array.isArray(p.programType)  ? p.programType  : [],
    housing:     Array.isArray(p.housing)      ? p.housing      : [],
    languageLevel: Array.isArray(p.languageLevel) ? p.languageLevel : [],
    minGpa:      typeof p.minGpa === "number"  ? p.minGpa       : null,
    detailOk:    p.detailOk !== false,
  };
}

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

// Flatten a curated school snapshot into a city|country → editorial lookup.
// First entry wins (stable across vibes — they share the same city flavor).
export function buildEditorialIndex(schoolData) {
  const idx = new Map();
  if (!schoolData) return idx;
  for (const vibe of Object.keys(schoolData)) {
    const buckets = schoolData[vibe] || {};
    for (const cont of Object.keys(buckets)) {
      for (const p of buckets[cont] || []) {
        const key = `${p.city}|${p.country}`;
        if (!idx.has(key)) idx.set(key, { desc: p.desc, grad: p.grad, clim: p.clim });
      }
    }
  }
  return idx;
}

export async function fetchTerraDottaPrograms(subdomain, editorial) {
  // Cache key bumps when we change the shape (now hydrated). Editorial presence
  // is also part of the key so dev toggles don't serve stale.
  const key = `td2:${subdomain}:${editorial && editorial.size ? "ed" : "raw"}`;
  const cached = sessionStorage.getItem(key);
  if (cached) { try { return JSON.parse(cached); } catch {} }
  const r = await fetch(`/api/terradotta?subdomain=${encodeURIComponent(subdomain)}&hydrate=true`);
  if (!r.ok) throw new Error(`Terra Dotta proxy: HTTP ${r.status}`);
  const j = await r.json();
  const grouped = group((j.programs || []).map((p) => normalize(p, editorial)));
  try { sessionStorage.setItem(key, JSON.stringify(grouped)); } catch {}
  return grouped;
}
