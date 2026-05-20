// Wikipedia thumbnail fallback for city photos. CORS-open, no key.
// Used when a program has no portal-hosted image (e.g. Terra Dotta programs).
export async function fetchCityPhoto(city, country) {
  if (!city) return null;
  const key = `wikiphoto:${city}|${country || ""}`;
  const cached = sessionStorage.getItem(key);
  if (cached !== null) return cached === "" ? null : cached;

  // Try "City, Country" first (disambiguates "Cambridge" → UK), then just "City".
  const candidates = country ? [`${city}, ${country}`, city] : [city];
  for (const q of candidates) {
    try {
      const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
      if (!r.ok) continue;
      const j = await r.json();
      // Prefer full-resolution originalimage; fall back to upscaled thumbnail.
      let url = j.originalimage && j.originalimage.source;
      if (!url && j.thumbnail && j.thumbnail.source) {
        // Wikipedia thumb URLs look like .../thumb/a/ab/Foo.jpg/320px-Foo.jpg
        // Rewrite the width segment to get a sharper image.
        url = j.thumbnail.source.replace(/\/\d+px-/, "/1280px-");
      }
      if (url) {
        try { sessionStorage.setItem(key, url); } catch {}
        return url;
      }
    } catch {}
  }
  try { sessionStorage.setItem(key, ""); } catch {}
  return null;
}
