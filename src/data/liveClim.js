// Live seasonal climate for a city via Open-Meteo (free, no key, CORS-open).
// Returns the same shape as src/data/climate.js CLIM[bucket] — namely
// { fall, spring, summer } where each season has { t, w, icon, note }.
// Falls back silently to the hardcoded bucket if anything fails.
import { Sun, CloudRain, CloudSnow, Cloud, Leaf, Snowflake } from "lucide-react";

const GEOCODE = "https://geocoding-api.open-meteo.com/v1/search";
const CLIMATE = "https://climate-api.open-meteo.com/v1/climate";

async function geocode(city, country) {
  const key = `geo:${city}|${country || ""}`;
  const cached = sessionStorage.getItem(key);
  if (cached) { try { return JSON.parse(cached); } catch {} }
  const url = `${GEOCODE}?name=${encodeURIComponent(city)}&count=1`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`geocode ${r.status}`);
  const j = await r.json();
  const hit = j.results && j.results[0];
  if (!hit) throw new Error("no geocode hit");
  const out = { lat: hit.latitude, lon: hit.longitude };
  try { sessionStorage.setItem(key, JSON.stringify(out)); } catch {}
  return out;
}

// season → list of month numbers (1-indexed)
const SEASONS = { fall: [9, 10, 11], spring: [3, 4, 5], summer: [6, 7, 8] };

function bucketSeasons(daily) {
  const time = daily.time, mx = daily.temperature_2m_max, mn = daily.temperature_2m_min, pr = daily.precipitation_sum;
  const out = {};
  for (const name of Object.keys(SEASONS)) {
    const months = SEASONS[name];
    let sumMax = 0, sumMin = 0, sumPr = 0, n = 0, rainy = 0;
    for (let i = 0; i < time.length; i++) {
      const m = parseInt(time[i].slice(5, 7), 10);
      if (!months.includes(m)) continue;
      if (mx[i] == null || mn[i] == null) continue;
      sumMax += mx[i]; sumMin += mn[i]; sumPr += pr[i] || 0;
      if ((pr[i] || 0) > 1) rainy += 1;
      n += 1;
    }
    if (!n) { out[name] = null; continue; }
    const avgMax = sumMax / n, avgMin = sumMin / n, rainyRatio = rainy / n, avgT = (avgMax + avgMin) / 2;
    out[name] = { avgMax, avgMin, avgT, rainyRatio };
  }
  return out;
}

function describe(season, stats, hemisphere) {
  if (!stats) return null;
  const { avgMax, avgMin, avgT, rainyRatio } = stats;
  const t = `${Math.round(avgMin)}–${Math.round(avgMax)}°C`;

  // Pick icon
  let icon, w, note;
  if (avgT < 0 || (avgT < 5 && rainyRatio > 0.3)) { icon = CloudSnow; w = "Cold, often snowy"; note = "Pack serious cold-weather layers."; }
  else if (rainyRatio > 0.5)                      { icon = CloudRain; w = `${avgT < 12 ? "Cool" : avgT < 20 ? "Mild" : "Warm"} & frequently wet`; note = "Bring a waterproof layer."; }
  else if (rainyRatio > 0.35)                     { icon = Cloud;     w = `${avgT < 12 ? "Cool" : avgT < 20 ? "Mild" : "Warm"}, often overcast`; note = "Variable — sun and rain in a day."; }
  else if (avgT >= 25)                            { icon = Sun;       w = "Hot & mostly dry"; note = "Plan for strong midday heat."; }
  else if (avgT >= 15)                            { icon = Sun;       w = "Warm & sunny"; note = "Pleasant most days."; }
  else if (avgT >= 5)                             { icon = Sun;       w = "Cool & bright"; note = "Layer up; light most days."; }
  else                                            { icon = Snowflake; w = "Cold & dry"; note = "Bring real winter gear."; }

  // Editorial twist for canonical "fall foliage" / "blossom" seasons
  if (season === "fall" && hemisphere === "N" && avgT >= 5 && avgT <= 16) { icon = Leaf; w = "Crisp, colorful foliage"; }
  return { t, w, icon, note };
}

export async function fetchCityClim(city, country) {
  const cacheKey = `clim:${city}|${country || ""}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) { try { return rehydrate(JSON.parse(cached)); } catch {} }

  const { lat, lon } = await geocode(city, country);
  const url = `${CLIMATE}?latitude=${lat}&longitude=${lon}&start_date=2020-01-01&end_date=2024-12-31&models=EC_Earth3P_HR&daily=temperature_2m_max,temperature_2m_min,precipitation_sum`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`climate ${r.status}`);
  const j = await r.json();
  const stats = bucketSeasons(j.daily || {});
  const hemisphere = lat >= 0 ? "N" : "S";

  // Southern hemisphere: swap season labels so user "fall" still means cool,
  // not boiling. We map the climate of months Mar-May / Jun-Aug / Sep-Nov
  // accordingly; do this by swapping spring↔fall when lat < 0.
  const out = {};
  for (const season of ["fall", "spring", "summer"]) {
    const sourceSeason = hemisphere === "S"
      ? (season === "fall" ? "spring" : season === "spring" ? "fall" : "summer")
      : season;
    out[season] = describe(season, stats[sourceSeason], hemisphere) || null;
  }
  const serializable = serialize(out);
  try { sessionStorage.setItem(cacheKey, JSON.stringify(serializable)); } catch {}
  return out;
}

// Serialization helpers: lucide icons are React components, can't be JSON'd.
// Cache the icon's name and resurrect on read.
const ICONS = { Sun, CloudRain, CloudSnow, Cloud, Leaf, Snowflake };
function iconName(I) { return Object.keys(ICONS).find((k) => ICONS[k] === I) || "Cloud"; }
function serialize(c) {
  const o = {};
  for (const s of Object.keys(c)) {
    if (!c[s]) { o[s] = null; continue; }
    o[s] = { ...c[s], icon: iconName(c[s].icon) };
  }
  return o;
}
function rehydrate(c) {
  const o = {};
  for (const s of Object.keys(c)) {
    if (!c[s]) { o[s] = null; continue; }
    o[s] = { ...c[s], icon: ICONS[c[s].icon] || Cloud };
  }
  return o;
}
