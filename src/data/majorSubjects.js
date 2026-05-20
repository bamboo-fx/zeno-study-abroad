// Major → subject-area matching.
//
// Replaces the old MAJOR_FIT city-array hack with real subject matching
// against the vocabularies actually used by our live sources:
//   • Terra Dotta (Pomona, Scripps) — short curated names like "Computer
//     Science", "International Relations", "Gender and Women's Studies".
//   • VIA-TRM (HMC) — full CIP names like "Computer Software Engineering",
//     "Business Administration, Management And Operations".
//
// The regexes below were authored after dumping the real subject strings from
// both sources (see /goal command). They're deliberately loose enough to match
// both styles. `exclude` knocks out false positives (e.g. "Business" shouldn't
// match "Business Administration" for the *humanities* major).

import { MAJORS } from "./options.js";
import catalogIndex from "./catalogIndex.json" with { type: "json" };

export const MAJOR_SUBJECTS = {
  business: {
    include: [
      /\beconomic/i,                // Economics; Business/Managerial Economics
      /\bfinanc/i,                  // Finance; Finance and Financial Management
      /\baccount/i,                 // Accounting
      /\bbusiness\b/i,              // Business; Business Administration
      /\bmanagement\b/i,            // Management; Human Resources Management
      /\bmarketing\b/i,             // Marketing
      /\bentrepreneur/i,            // Entrepreneurship
      /\bcommerce\b/i,              // Business/Commerce
      /\borganizational lead/i,
      /\binternational business/i,
    ],
  },
  cs: {
    include: [
      /\bcomputer\s*science/i,
      /\bcomputer engineering/i,
      /\bcomputer software/i,
      /\bsoftware/i,
      /\binformation systems\b/i,
      /\binformatics\b/i,
      /\bdata\s*science/i,
      /\bdata\s*sciences\b/i,
      /\bartificial intelligence/i,
      /\bcomputer and information/i,
    ],
  },
  stem: {
    include: [
      /\bengineer/i,                // Engineering, Mechanical/Civil/etc.
      /\bphysics\b/i,
      /\bchemistry\b/i,
      /\bbiochemistr/i,
      /\bbiology\b/i,
      /\bmolecular biology/i,
      /\bneuroscience\b/i,
      /\bmathematic/i,
      /\bmath\/statistics/i,
      /\bstatistics\b/i,
      /\bastronom/i,
      /\bastrophysics/i,
      /\bgeolog/i,
      /\bearth (science|sciences)/i,
      /\bmaterials science/i,
      /\bbiomedical (sciences|engineering)/i,
      /\bbiotechnology/i,
      /\brobotics/i,
      /\bnatural sciences\b/i,
      /\bphysiology\b/i,
      /\bmicrobiology/i,
    ],
    // Exclude when the only hit was a generic "Sciences" alone — too vague.
    exclude: [/^sciences$/i, /^social sciences$/i, /^behavioral sciences$/i],
  },
  social: {
    include: [
      /\bpolitical science/i,
      /\bpolitics\b/i,
      /\binternational relations/i,
      /\bgovernment\b/i,
      /\bpublic polic/i,
      /\bsocial polic/i,
      /\bsociolog/i,
      /\banthropolog/i,
      /\bpsycholog/i,
      /\bcognitive science/i,
      /\bsocial sciences\b/i,
      /\bbehavioral sciences\b/i,
      /\bcriminolog/i,
      /\bdevelopment studies/i,
      /\bhuman rights/i,
      /\bpeace.*conflict/i,
      /\bpublic health\b/i,
    ],
  },
  humanities: {
    include: [
      /\bhistory\b/i,
      /\bphilosoph/i,
      /\bliterature\b/i,
      /\benglish (language|literature)/i,
      /\bclassics?\b/i,
      /\bclassical/i,
      /\bcomparative literature/i,
      /\breligio/i,                 // Religion; Religious Studies
      /\btheolog/i,
      /\bjewish studies/i,
      /\bmiddle eastern studies/i,
      /\basian studies/i,
      /\beuropean studies/i,
      /\bafrican studies/i,
      /\bafricana studies/i,
      /\blatin american studies/i,
      /\bgender.*studies/i,
      /\bwomen's studies/i,
      /\bhumanities\b/i,
      /\barchaeolog/i,
      /\bcultural studies/i,
    ],
  },
  arts: {
    include: [
      /\bart history/i,
      /\bart\b/i,                   // Art (Terra Dotta short form)
      /\bfine (and|&) studio/i,
      /\bstudio arts?\b/i,
      /\bfine arts?\b/i,
      /\bvisual (and|&) performing/i,
      /\bperforming and visual/i,
      /\btheatre?\b/i,              // Theatre / Theater
      /\bfilm\b/i,
      /\bcinema/i,
      /\bphotograph/i,
      /\bmusic\b/i,
      /\bmusic (performance|theory|technology)/i,
      /\bdance\b/i,
      /\bdesign\b/i,
      /\bgraphic design/i,
      /\barchitect/i,               // Architecture; Architectural History
      /\bcreative writing/i,
      /\bmedia studies/i,
      /\bdrama\b/i,
      /\bdrawing\b/i,
      /\bpainting\b/i,
      /\bsculpture\b/i,
      /\billustration/i,
    ],
  },
  language: {
    include: [
      /\barabic\b/i,
      /\bchinese\b/i,
      /\bfrench\b/i,
      /\bgerman\b/i,
      /\bitalian\b/i,
      /\bjapanese\b/i,
      /\bkorean\b/i,
      /\brussian\b/i,
      /\bspanish\b/i,
      /\bportuguese\b/i,
      /\bgreek\b/i,
      /\blatin\b/i,
      /\bhebrew\b/i,
      /\blinguistic/i,
      /\barea, ethnic/i,
      /\bforeign languages\b/i,
      /\bromance languages/i,
      /\blanguage and literature/i,
      /\blanguage and culture/i,
      /\b(asian|european|african|latin american|middle eastern|asian) studies\b/i,
      /\barea studies\b/i,
      /\binternational\/global studies/i,
    ],
  },
  // "open" intentionally has no filter — every program is equally on-target.
  open: { include: [] },
};

// matchSubjects(program, majorId) → { score: 0..1, matched: string[] }
//
// `score` is the fraction of the program's subjects that match the major's
// include patterns, clamped to [0, 1]. We cap denominator at 8 so a broad
// "every subject under the sun" program (some IFSA direct-enroll programs
// list 60+) doesn't get punished — three strong hits is enough.
//
// `matched` is the actual subject strings that hit, so the UI can show
// "matched on: Computer Science, Informatics" instead of an opaque number.
export function matchSubjects(program, majorId) {
  if (!majorId || majorId === "open") return { score: 1, matched: [] };
  const cfg = MAJOR_SUBJECTS[majorId];
  if (!cfg) return { score: 0, matched: [] };
  const subjects = Array.isArray(program && program.subjects) ? program.subjects : [];
  if (subjects.length === 0) return { score: 0, matched: [] };
  const matched = [];
  for (const s of subjects) {
    if (cfg.exclude && cfg.exclude.some((re) => re.test(s))) continue;
    if (cfg.include.some((re) => re.test(s))) matched.push(s);
  }
  const denom = Math.min(subjects.length, 8);
  const score = Math.min(1, matched.length / denom);
  return { score, matched };
}

// Classify a single string (course title or department name) against every
// major. Returns the first major whose regex hits, or null. Order matches the
// MAJOR_SUBJECTS object — cs before stem before social, so "Computer Science"
// resolves to cs not stem.
function classifyText(text) {
  if (!text) return null;
  for (const majorId of Object.keys(MAJOR_SUBJECTS)) {
    const cfg = MAJOR_SUBJECTS[majorId];
    if (!cfg.include || cfg.include.length === 0) continue;
    if (cfg.exclude && cfg.exclude.some((re) => re.test(text))) continue;
    if (cfg.include.some((re) => re.test(text))) return majorId;
  }
  return null;
}

// Per-school catalog-derived department → major mapping. Each school resolves
// to { [majorId]: [{prefix, sampleTitle}] }. Built once at module load from
// catalogIndex.json (Phase 6a). Only "owned" prefixes count — joint listings
// that don't belong to this school are ignored.
//
// Exposed for future use — Course Credit can show "your major's likely
// departments at {school}" in the advisor-email template, and per-school
// major-fit weighting can sanity-check abroad subject matches against the
// student's actual home-school taxonomy.
export const MAJOR_DEPARTMENTS_BY_SCHOOL = (() => {
  const out = {};
  for (const school of Object.keys(catalogIndex)) {
    const node = catalogIndex[school];
    if (!node || !Array.isArray(node.departments)) continue;
    const bySchool = {};
    for (const d of node.departments) {
      if (!d.owned) continue;
      // Try each sample title until one classifies. Fall back to the prefix
      // itself (so "GOVT" matches /\bgovernment\b/ via a soft expansion).
      const candidates = [...(d.sampleTitles || []), d.prefix];
      let major = null;
      for (const t of candidates) { major = classifyText(t); if (major) break; }
      if (!major) continue;
      if (!bySchool[major]) bySchool[major] = [];
      bySchool[major].push({ prefix: d.prefix, sampleTitle: d.sampleTitles[0] || null, count: d.count });
    }
    // Stable sort: most courses first, so the highest-signal department wins
    // any UI that surfaces only the top few.
    for (const m of Object.keys(bySchool)) bySchool[m].sort((a, b) => b.count - a.count);
    out[school] = bySchool;
  }
  return out;
})();

// Flat list of (prefix, sampleTitle) per school — convenient for autocomplete.
export const DEPARTMENTS_BY_SCHOOL = (() => {
  const out = {};
  for (const school of Object.keys(catalogIndex)) {
    const node = catalogIndex[school];
    if (!node || !Array.isArray(node.departments)) continue;
    out[school] = node.departments
      .filter((d) => d.owned)
      .map((d) => ({ prefix: d.prefix, sampleTitle: d.sampleTitles[0] || null, count: d.count }));
  }
  return out;
})();

// Friendly label for the UI breakdown chip.
export function majorLabel(majorId) {
  const m = MAJORS.find((x) => x.id === majorId);
  return m ? m.label : "your major";
}
