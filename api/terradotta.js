// Terra Dotta proxy + parser. Lives as a single file used in two places:
//   1. Vercel Edge Function — default export below
//   2. Vite dev middleware — see vite.config.js (imports handleTerraDotta)
//
// Why a proxy: Terra Dotta search pages return HTML and don't send CORS
// headers, so the browser can't fetch them directly. This proxy fetches
// server-side, parses the search-results table, and returns JSON with
// CORS=* and a 24h cache.

const ALLOWED = new Set(["pomona-sa", "pitzer-sa", "scrippscollege-sa"]);

function stripTags(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&").replace(/&ndash;/g, "–").replace(/&#x3a;/g, ":")
    .replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function parseTerraDotta(html) {
  // Each program is a <tr> with 5 <td>s: name (with link), city, country, region, save.
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
    const name = stripTags(link[2]);
    const city = cells[1];
    const country = cells[2];
    const region = cells[3];
    if (!country || country.toLowerCase() === "country") continue;
    out.push({ id, name, city, country, region });
  }
  return out;
}

export async function handleTerraDotta(searchParams) {
  const sub = searchParams.get("subdomain");
  if (!ALLOWED.has(sub)) return { status: 400, body: { error: "unknown subdomain", allowed: [...ALLOWED] } };
  const url = `https://${sub}.terradotta.com/index.cfm?FuseAction=Programs.SearchResults&Order=asc&Sort=Program_City&program_active=1&program_type_id=1&requiredminimumtofindismeet=0`;
  const r = await fetch(url);
  if (!r.ok) return { status: 502, body: { error: "upstream", upstreamStatus: r.status } };
  const html = await r.text();
  const programs = parseTerraDotta(html);
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
      "cache-control": "public, max-age=86400",
    },
  });
}

export const config = { runtime: "edge" };
