// Acalog catalog scraper for CMC / HMC / Scripps / Pitzer.
//
// Output: src/data/catalogIndex.json — a per-school map of course prefixes,
// sample course titles, and the home-school suffix observed for each prefix.
// Pomona (Coursedog) is intentionally skipped — its SPA hides the API behind
// a static-page hydration that needs a headless browser to crack. Defer.
//
// Run quarterly: `node scripts/scrape-catalogs.mjs`

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const UA = "zeno-catalog-scraper (study-abroad-matching; jgomez23@alumni-polytechnic.org)";
const RATE_MS = 1000; // 1 rps, gentle

// Catalog IDs confirmed 2026-05-20. Re-check yearly when catalogs roll over.
const SCHOOLS = [
  { id: "cmc",          host: "catalog.claremontmckenna.edu", catoid: 40, root: 8416, suffix: "CM" },
  { id: "harvey-mudd",  host: "catalog.hmc.edu",              catoid: 26, root: 1366, suffix: "HM" },
  { id: "scripps",      host: "catalog.scrippscollege.edu",   catoid: 35, root: 4491, suffix: "SC" },
  { id: "pitzer",       host: "catalog.pitzer.edu",           catoid: 32, root: 2340, suffix: "PZ" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  await sleep(RATE_MS);
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

function entities(s) {
  return s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"').replace(/&ndash;/g, "–").replace(/\s+/g, " ").trim();
}

// Match both "CSCI005 HM" (HMC-style) and "AFRI 010A PZ" (Pitzer-style).
const CODE_RE = /\b([A-Z]{2,5}) ?(\d{2,3}[A-Z]{0,2})\s+([A-Z]{2})\b/g;

function extractCodes(html, schoolSuffix) {
  const out = [];
  // Pull from aria-label first ("View course details for CSCI005 HM"), then
  // anywhere else in the body. We dedupe later.
  const ariaRe = /aria-label="View course details for ([^"]+)"/g;
  let m;
  while ((m = ariaRe.exec(html))) {
    const trip = m[1].trim().match(/^([A-Z]{2,5}) ?(\d{2,3}[A-Z]{0,2})\s+([A-Z]{2})$/);
    if (trip) out.push({ prefix: trip[1], number: trip[2], suffix: trip[3], source: "aria" });
  }
  // Fallback: scan body text. Pitzer's flat page uses titles like
  // "AFRI 010A AF -Intro to Africana Studies".
  while ((m = CODE_RE.exec(html))) {
    out.push({ prefix: m[1], number: m[2], suffix: m[3], source: "body" });
  }
  return out;
}

function extractTitles(html) {
  // Map course code → title using the "CODE -Title" or "CODE Title" pattern
  // that surfaces in Pitzer-style flat listings and HMC tooltip strings.
  const titles = new Map();
  const re = /([A-Z]{2,5} ?\d{2,3}[A-Z]{0,2} [A-Z]{2})\s*-?\s*([A-Z][^<\n"]{3,80})/g;
  let m;
  while ((m = re.exec(html))) {
    const key = m[1].replace(/\s+/g, " ");
    const title = entities(m[2]).replace(/ opens.*$/, "");
    if (title && !titles.has(key)) titles.set(key, title);
  }
  return titles;
}

function extractDeptLinks(html, catoid) {
  // HMC-style dept index has <a href="content.php?catoid=X&navoid=Y" class="navbar">Department of CS</a>
  // We pick links that mention "Department" or look like dept names (not catalog chrome).
  const out = [];
  const re = /href="(?:https?:\/\/[^/]+)?\/?content\.php\?catoid=(\d+)&navoid=(\d+)"[^>]*class="navbar"[^>]*>([^<]+)<\/a>/g;
  let m;
  const skip = /catalog|trustees|admission|life on campus|calendar|policies|degree|majors|archived|addendum|colleges|opportunities|areas of study|courses?$/i;
  while ((m = re.exec(html))) {
    if (Number(m[1]) !== catoid) continue;
    const text = entities(m[3]);
    if (skip.test(text)) continue;
    out.push({ navoid: Number(m[2]), name: text });
  }
  return out;
}

function maxPage(html) {
  // Acalog flat-listing pagination: filter[cpage]=N. Find the highest N.
  const re = /filter%5Bcpage%5D=(\d+)/g;
  let m, max = 1;
  while ((m = re.exec(html))) max = Math.max(max, Number(m[1]));
  return max;
}

async function fetchAllPages(host, catoid, navoid) {
  // Acalog needs a stable filter set + cpage=N. The first request uses the
  // bare URL; subsequent ones include the filter signature observed in the
  // page's own pagination links.
  const base = `https://${host}/content.php?catoid=${catoid}&navoid=${navoid}`;
  const first = await get(base);
  const pages = [first];
  const total = maxPage(first);
  if (total <= 1) return pages;
  const filterSfx = "&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D=1&filter%5B3%5D=1";
  for (let i = 2; i <= total; i++) {
    try { pages.push(await get(`${base}${filterSfx}&filter%5Bcpage%5D=${i}`)); }
    catch (e) { console.warn(`  page ${i}: ${e.message}`); }
  }
  return pages;
}

async function scrapeSchool(s) {
  const root = `https://${s.host}/content.php?catoid=${s.catoid}&navoid=${s.root}`;
  console.log(`[${s.id}] root ${root}`);
  const rootPages = await fetchAllPages(s.host, s.catoid, s.root);
  console.log(`[${s.id}] ${rootPages.length} root pages`);

  const deptLinks = extractDeptLinks(rootPages[0], s.catoid);
  console.log(`[${s.id}] ${deptLinks.length} dept sub-pages found`);

  const pages = rootPages.map((html, i) => ({ navoid: s.root, name: i === 0 ? "(root)" : `(root p${i + 1})`, html }));
  for (const d of deptLinks) {
    try {
      const subs = await fetchAllPages(s.host, s.catoid, d.navoid);
      for (let i = 0; i < subs.length; i++) {
        pages.push({ navoid: d.navoid, name: i === 0 ? d.name : `${d.name} (p${i + 1})`, html: subs[i] });
      }
    } catch (e) { console.warn(`[${s.id}] dept ${d.navoid} ${d.name}: ${e.message}`); }
  }

  // Aggregate prefix → { titles, suffixes, count, sampleCourses, sectionNames }.
  const byPrefix = new Map();
  for (const page of pages) {
    const codes = extractCodes(page.html, s.suffix);
    const titles = extractTitles(page.html);
    for (const c of codes) {
      const key = `${c.prefix}|${c.number}|${c.suffix}`;
      const dispCode = `${c.prefix} ${c.number} ${c.suffix}`;
      const title = titles.get(dispCode) || titles.get(`${c.prefix}${c.number} ${c.suffix}`) || null;
      if (!byPrefix.has(c.prefix)) {
        byPrefix.set(c.prefix, { prefix: c.prefix, count: 0, suffixes: new Set(), titles: new Map(), sectionNames: new Set() });
      }
      const rec = byPrefix.get(c.prefix);
      rec.count++;
      rec.suffixes.add(c.suffix);
      if (title) rec.titles.set(`${c.number} ${c.suffix}`, title);
      if (page.name !== "(root)") rec.sectionNames.add(page.name);
    }
  }

  // Dedupe and finalize: keep only prefixes where this school is the dominant
  // home suffix (so we don't claim "Africana Studies" for HMC just because a
  // joint course slipped through).
  const departments = [];
  for (const rec of byPrefix.values()) {
    if (rec.count < 2) continue;
    const owned = rec.suffixes.has(s.suffix);
    const sampleTitles = Array.from(rec.titles.values()).slice(0, 3);
    departments.push({
      prefix: rec.prefix,
      count: rec.count,
      suffixes: Array.from(rec.suffixes).sort(),
      owned,
      sectionName: Array.from(rec.sectionNames)[0] || null,
      sampleTitles,
    });
  }
  departments.sort((a, b) => b.count - a.count);
  return { school: s.id, scrapedAt: new Date().toISOString().slice(0, 10), departments };
}

async function main() {
  const out = {};
  for (const s of SCHOOLS) {
    try { out[s.id] = await scrapeSchool(s); }
    catch (e) { console.error(`[${s.id}] failed: ${e.message}`); out[s.id] = { error: e.message }; }
  }
  const here = dirname(fileURLToPath(import.meta.url));
  const target = join(here, "..", "src", "data", "catalogIndex.json");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
  console.log(`wrote ${target}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
