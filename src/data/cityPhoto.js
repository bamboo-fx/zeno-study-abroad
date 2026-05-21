// City photos from Wikipedia. Avoids montage/collage lead images by going
// through the media-list endpoint and filtering on filename. CORS-open, no key.

// Filenames we never want to show as a destination hero: city-infobox collages,
// flags, coats of arms, locator maps, charts, etc.
const BAD_NAME_RE = /(collage|montage|composite|infobox|panel|combo|flag|coat[_\s-]?of[_\s-]?arms|seal\b|emblem|crest|locator|location[_\s-]?map|orthographic|\bmap\b|globe|chart|diagram|topographic|administrative|wappen|escudo|bandera|drapeau|painting|paintings|fresco|engraving|lithograph|etching|woodcut|drawing|illustration|oil[_\s-]?on[_\s-]?canvas|oil[_\s-]?painting|portrait|mural|sketch|watercolou?r|battle[_\s-]?of|siege[_\s-]?of|massacre|gemälde|cuadro|pintura|tableau|peinture|by[_\s-][A-Z]|black[_\s-]?and[_\s-]?white|sepia|circa[_\s-]?\d{4}|veduta|photochrom|postcard|postage|stamp|banknote|coin|currency|statue|sculpture|mosaic|tapestry|carving|frieze|bas[_\s-]?relief|vase|codex|manuscript|miniature|plate[_\s-]?\d|rendering|render|schematic|blueprint|infographic|comic|cartoon|anime|stereoview|stereograph|daguerreotype|photogravure|aquarelle|aerial[_\s-]?view|satellite|interior\b|gallery|museum_of|\b1[6-8]\d{2}\b|\b19[0-7]\d\b)/i;

function looksBad(url) {
  if (!url) return true;
  try {
    const path = decodeURIComponent(url.split("?")[0]);
    const file = path.substring(path.lastIndexOf("/") + 1);
    if (BAD_NAME_RE.test(file)) return true;
  } catch {
    if (BAD_NAME_RE.test(url)) return true;
  }
  return false;
}

// Rewrites a Wikipedia thumb URL to its original (full-res) source.
// Pattern: /wikipedia/commons/thumb/a/ab/File.jpg/640px-File.jpg
//      ->  /wikipedia/commons/a/ab/File.jpg
function toOriginal(src) {
  if (!src) return src;
  let s = src.startsWith("//") ? "https:" + src : src;
  return s.replace(/\/thumb(\/[a-f0-9]\/[a-f0-9]{2}\/[^/]+)\/\d+px-[^/]+$/i, "$1");
}

// Bumps a thumb URL to a 2560px width when we can't reach the original.
function bumpThumb(src) {
  if (!src) return src;
  let s = src.startsWith("//") ? "https:" + src : src;
  return s.replace(/\/\d+px-/, "/2560px-");
}

async function mediaListPhotos(query) {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(query)}`);
  if (!r.ok) return [];
  const j = await r.json();
  const scored = [];
  for (const it of j.items || []) {
    if (it.type !== "image") continue;
    // Always prefer the original-source URL when available; falls back to the
    // largest srcset entry rewritten to full-res.
    let src = it?.original?.source || it?.srcset?.[it.srcset.length - 1]?.src;
    if (!src) continue;
    src = toOriginal(src);
    const clean = src.split("?")[0];
    if (!/\.(jpe?g|png)$/i.test(clean)) continue;
    if (looksBad(clean)) continue;
    if (looksBad(it?.title || "")) continue;
    const w = it?.original?.width || 0;
    const h = it?.original?.height || 0;
    if (w && h && (w < 1600 || h / w > 1.4)) continue;
    scored.push({ url: src, w, h });
  }
  scored.sort((a, b) => (b.w * b.h) - (a.w * a.h) || (b.w - b.h) - (a.w - a.h));
  return Array.from(new Set(scored.map((s) => s.url)));
}

// One high-quality photo. Skips collage/montage lead images by going straight
// to media-list and picking the first photographic image.
export async function fetchCityPhoto(city, country) {
  if (!city) return null;
  const key = `wikiphoto5:${city}|${country || ""}`;
  const cached = sessionStorage.getItem(key);
  if (cached !== null) return cached === "" ? null : cached;

  const candidates = country ? [`${city}, ${country}`, city] : [city];
  for (const q of candidates) {
    try {
      const photos = await mediaListPhotos(q);
      if (photos.length) {
        const pick = photos[0];
        try { sessionStorage.setItem(key, pick); } catch {}
        return pick;
      }
    } catch {}
  }
  // Last-ditch fallback: page summary (may include a collage, but better than nothing).
  for (const q of candidates) {
    try {
      const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
      if (!r.ok) continue;
      const j = await r.json();
      let url = j.originalimage?.source;
      if (!url && j.thumbnail?.source) url = bumpThumb(j.thumbnail.source);
      if (url && !looksBad(url)) {
        try { sessionStorage.setItem(key, url); } catch {}
        return url;
      }
    } catch {}
  }
  try { sessionStorage.setItem(key, ""); } catch {}
  return null;
}

// Multiple photos for the dashboard slideshow. Same filtering applied.
export async function fetchCityPhotos(city, country) {
  if (!city) return [];
  const cacheKey = `wikiphotos5:${city}|${country || ""}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {}

  const candidates = country ? [`${city}, ${country}`, city] : [city];
  for (const q of candidates) {
    try {
      const photos = await mediaListPhotos(q);
      if (photos.length) {
        const sliced = photos.slice(0, 12);
        try { sessionStorage.setItem(cacheKey, JSON.stringify(sliced)); } catch {}
        return sliced;
      }
    } catch {}
  }
  return [];
}
