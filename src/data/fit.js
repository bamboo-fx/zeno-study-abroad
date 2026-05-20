// Real matchScore.
//
// Replaces the old `hash(city+major) % 17 + cityArrayBonus` with a
// transparent weighted sum across five signals plus hard eligibility gates.
// Every component returns `{ score: 0..1, reason: string, ok: bool }` so the
// UI can show exactly why a program got the number it did.
//
// Weights live here so the formula is reviewable in one place:
//
//   subject  * 40     real Areas of study ↔ major taxonomy match
//   language * 20     program language ↔ user proficiency
//   term     * 15     user term preference ↔ program TERMS
//   vibe     * 10     program is in the user's chosen vibe bucket
//   credit   * 15     COURSE_CREDIT has a real determination for this slot
//
// Sum is clamped to [30, 99] so we never advertise "100% match" (no one is)
// and never let a fully-unknown program look broken (everyone gets at least
// the 30-point floor of "you're allowed to apply").

import { matchSubjects } from "./majorSubjects.js";

const W = { subject: 40, language: 20, term: 15, vibe: 10, credit: 15 };

// Map our internal term ids to the strings Terra Dotta/VIA-TRM use.
const TERM_LABELS = {
  fall: ["Fall"],
  spring: ["Spring"],
  summer: ["Summer"],
  "academic-year": ["Academic Year", "Year"],
};

function subjectComponent(program, majorId) {
  const sm = matchSubjects(program, majorId);
  if (!majorId || majorId === "open") {
    return { score: 1, reason: "No major specified — every program is on-target.", ok: true, matched: [], known: true };
  }
  if (!program.subjects || program.subjects.length === 0) {
    return { score: 0, reason: "Program subjects unknown — couldn't verify the major fit.", ok: false, matched: [], known: false };
  }
  if (sm.matched.length === 0) {
    return { score: 0, reason: "No listed subjects match this major.", ok: false, matched: [], known: true };
  }
  const top = sm.matched.slice(0, 3).join(", ");
  return { score: sm.score, reason: `Matches on: ${top}.`, ok: sm.score > 0, matched: sm.matched, known: true };
}

function languageComponent(program, langProf) {
  const langs = Array.isArray(program.language) ? program.language : [];
  // Unknown language: half credit. Cheaper than a 0 (the program might be
  // fine in English) and more honest than a 1 (we don't actually know).
  if (langs.length === 0) {
    return { score: 0.5, reason: "Program language not listed.", ok: true, known: false };
  }
  // Pure-English programs: anyone can take them.
  if (langs.every((l) => /^english$/i.test(l))) {
    return { score: 1, reason: "Taught in English.", ok: true, known: true };
  }
  const nonEng = langs.filter((l) => !/^english$/i.test(l));
  // English + something else (bilingual programs): full credit if user has
  // any of the languages, else 0.75 — they can still take the English track.
  const hasEnglish = langs.some((l) => /^english$/i.test(l));
  const levelRank = { none: 0, basic: 1, intermediate: 2, advanced: 3, native: 4 };
  let best = 0;
  let bestLang = null;
  for (const l of langProf) {
    if (nonEng.some((p) => p.toLowerCase() === l.language.toLowerCase())) {
      const r = levelRank[l.level] || 0;
      if (r > best) { best = r; bestLang = l; }
    }
  }
  if (best >= 2) return { score: 1, reason: `You have ${bestLang.level} ${bestLang.language}.`, ok: true, known: true };
  if (best === 1) return { score: 0.6, reason: `You have basic ${bestLang.language} — most programs want intermediate.`, ok: true, known: true };
  if (hasEnglish) return { score: 0.75, reason: `Bilingual program (${langs.join(", ")}) — English track usually available.`, ok: true, known: true };
  return { score: 0, reason: `Taught in ${nonEng.join("/")} only — no proficiency listed.`, ok: false, known: true };
}

function termComponent(program, termPref) {
  if (!termPref) return { score: 1, reason: "No term preference set.", ok: true, known: true };
  const terms = Array.isArray(program.terms) ? program.terms : [];
  if (terms.length === 0) return { score: 0.5, reason: "Program terms not listed.", ok: true, known: false };
  const wanted = TERM_LABELS[termPref] || [];
  const hit = wanted.some((w) => terms.some((t) => t.toLowerCase() === w.toLowerCase()));
  if (hit) return { score: 1, reason: `Runs in ${wanted[0]}.`, ok: true, known: true };
  return { score: 0, reason: `Not offered in ${wanted[0]} — runs ${terms.join(", ")}.`, ok: false, known: true };
}

function vibeComponent() {
  // The program reached fit() because it was already filtered into the
  // user's vibe bucket. Treat that as a 1 — the chip should still show it
  // so users know the vibe was part of the score.
  return { score: 1, reason: "Matches your vibe pick.", ok: true, known: true };
}

function creditComponent(program, schoolId, majorId, courseCreditLookup) {
  // courseCreditLookup is COURSE_CREDIT from country.js; passed in so this
  // module stays decoupled and testable.
  if (!majorId || majorId === "open" || !schoolId || !courseCreditLookup) {
    return { score: 0, reason: "No major or school context.", ok: false, known: false };
  }
  const c = courseCreditLookup[program.city];
  if (!c || !c[schoolId] || !c[schoolId][majorId]) {
    return { score: 0, reason: "No confirmed credit determination yet.", ok: false, known: true };
  }
  return { score: 1, reason: "Confirmed credit determinations on file.", ok: true, known: true };
}

function gpaGate(program, gpa) {
  if (gpa == null) return { pass: true, reason: null };
  const min = program.minGpa;
  if (min == null) return { pass: true, reason: null };
  if (gpa >= min) return { pass: true, reason: null };
  return { pass: false, reason: `GPA ${gpa.toFixed(2)} below program minimum of ${min.toFixed(2)}.` };
}

export function fitScore(program, user, courseCreditLookup) {
  const subject = subjectComponent(program, user.major);
  const language = languageComponent(program, user.langProf || []);
  const term = termComponent(program, user.termPref);
  const vibe = vibeComponent();
  const credit = creditComponent(program, user.school, user.major, courseCreditLookup);

  const raw =
    subject.score * W.subject +
    language.score * W.language +
    term.score * W.term +
    vibe.score * W.vibe +
    credit.score * W.credit;

  const gpa = gpaGate(program, user.gpa);
  const eligible = gpa.pass;

  const total = Math.max(30, Math.min(99, Math.round(raw)));

  return {
    total,
    eligible,
    gates: { gpa },
    components: { subject, language, term, vibe, credit },
    // Tie-break key for sort stability — surface the program with the
    // stronger subject signal first when two totals land on the same number.
    tieBreak: subject.score,
  };
}

export const FIT_WEIGHTS = W;
