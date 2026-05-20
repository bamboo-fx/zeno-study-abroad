// ── COURSE CREDIT — REAL DETERMINATIONS ONLY ───────────────────────────────
// Course-credit equivalency is school-, major-, AND syllabus-specific, and
// only a home-institution faculty/registrar ruling is authoritative. This
// table holds ONLY real determinations actually issued by a study-abroad
// office / department. Anything not in here renders as "not yet confirmed —
// here's how to get the real answer", never as a guess.
//
// Shape:  COURSE_CREDIT[programCity]?.[homeSchoolId]?.[majorId] = {
//   reviewedOn: "YYYY-MM",            // when this ruling was issued
//   by: "who issued it",
//   courses: [ { code, title, result } ]   // result is the REAL ruling text
// }
// Seeded with the actual CMC-econ / Paris determination from the
// study-abroad email thread (Apr 2026) as a worked example. Add more real
// rulings here as the study-abroad office provides them.
export const COURSE_CREDIT = {
  "Paris": {
    cmc: {
      business: {
        reviewedOn: "2026-04",
        by: "CMC Economics dept. (faculty determination)",
        note: "Paris IES does not currently offer any Level II Econ elective courses that count toward the CMC Economics major — only Level I. Confirm again for your specific term & courses.",
        courses: [
          { code: "PO/IE/EC 370", title: "Green Growth, Sustainability & the New Economy", result: "No credit within the CMC Econ major" },
          { code: "IR/EC 340", title: "Economic Integration & European Markets", result: "Econ Level I" },
          { code: "EC/PO 350", title: "International Political Economy & Trade Conflicts", result: "Econ Level I" },
        ],
      },
    },
  },
};
export function courseCredit(city, schoolId, majorId) {
  const c = COURSE_CREDIT[city];
  if (!c || !schoolId) return null;
  const s = c[schoolId];
  if (!s) return null;
  return s[majorId] || null;
}
