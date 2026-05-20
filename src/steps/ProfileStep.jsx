import React, { useState } from "react";
import { Sliders, AlertCircle, Plus, X, Check } from "lucide-react";

import { Wrap } from "../components/Wrap.jsx";
import { StepHead } from "../components/StepHead.jsx";
import { CTA } from "../theme/colors.js";

// The eight languages Terra Dotta/VIA-TRM list most often across the 5C
// catalog. "English" is implied for English-taught programs; users tick a
// non-English language only when they actually study it. Order matches
// frequency in the live data.
const LANGUAGES = [
  "Spanish", "French", "German", "Italian", "Japanese", "Mandarin", "Arabic", "Portuguese",
];

const LEVELS = [
  { id: "none", label: "None" },
  { id: "basic", label: "Basic" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "native", label: "Native" },
];

const TERMS = [
  { id: "any", label: "No preference", sub: "Show all terms" },
  { id: "fall", label: "Fall", sub: "Sep – Dec" },
  { id: "spring", label: "Spring", sub: "Jan – May" },
  { id: "summer", label: "Summer", sub: "Jun – Aug" },
  { id: "academic-year", label: "Academic Year", sub: "Sep – May" },
];

export function ProfileStep({
  gpa, setGpa,
  termPref, setTermPref,
  langProf, setLangProf,
  setStep,
}) {
  const [gpaLocal, setGpaLocal] = useState(gpa == null ? "" : String(gpa));
  const onGpaBlur = () => {
    const v = gpaLocal.trim();
    if (v === "") { setGpa(null); return; }
    const n = parseFloat(v);
    if (Number.isFinite(n) && n >= 0 && n <= 4.3) setGpa(n);
    else setGpaLocal(gpa == null ? "" : String(gpa));
  };

  const addLang = (lang) => {
    if (!lang) return;
    if (langProf.some((l) => l.language === lang)) return;
    if (langProf.length >= 3) return;
    setLangProf([...langProf, { language: lang, level: "intermediate" }]);
  };
  const removeLang = (lang) => setLangProf(langProf.filter((l) => l.language !== lang));
  const updateLevel = (lang, level) =>
    setLangProf(langProf.map((l) => (l.language === lang ? { ...l, level } : l)));

  const availableLangs = LANGUAGES.filter((l) => !langProf.some((x) => x.language === l));

  return (
    <Wrap>
      <StepHead
        kicker={<><Sliders style={{ width: 13, height: 13 }} /> Optional · sharpens ranking</>}
        title="A bit about you"
        sub="All optional. Anything you fill in is used to rank programs you can actually take — skip the rest."
        back={() => setStep("major")}
      />

      {/* GPA */}
      <Card title="GPA" hint="Used to flag programs whose minimum GPA you don't meet — they're shown muted, not hidden.">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4.3"
            placeholder="e.g. 3.45"
            value={gpaLocal}
            onChange={(e) => setGpaLocal(e.target.value)}
            onBlur={onGpaBlur}
            style={{
              flex: 1, maxWidth: 200, padding: "11px 14px",
              fontSize: 16, borderRadius: 12, border: "1px solid #e6e0f5",
              background: "#fff", color: "#1c1830", outline: "none",
            }}
          />
          {gpa != null && (
            <button onClick={() => { setGpa(null); setGpaLocal(""); }} className="pressable"
              style={{ fontSize: 12.5, color: "#9a90b8", background: "none", border: "none", cursor: "pointer" }}>
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Term preference */}
      <Card title="Preferred term" hint="Programs that run in your chosen term rank higher. 'No preference' shows them all.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 9 }}>
          {TERMS.map((t) => {
            const on = termPref === t.id || (!termPref && t.id === "any");
            return (
              <button key={t.id} onClick={() => setTermPref(t.id === "any" ? null : t.id)} className="pressable"
                style={{
                  padding: "11px 13px", borderRadius: 13, textAlign: "left", cursor: "pointer",
                  border: on ? "2px solid #7c4dff" : "1px solid #e6e0f5",
                  background: on ? "#f7f2ff" : "#fff",
                  boxShadow: on ? "0 12px 22px -14px rgba(124,77,255,.4)" : "none",
                }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1830" }}>{t.label}</div>
                <div style={{ fontSize: 11.5, color: "#9a90b8", marginTop: 2 }}>{t.sub}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Language proficiency */}
      <Card title="Languages you speak" hint="Helps surface programs taught in a language you can handle. Skip if you only need English-taught programs.">
        {langProf.length > 0 && (
          <div style={{ display: "grid", gap: 9, marginBottom: 12 }}>
            {langProf.map((l) => (
              <div key={l.language} style={{
                display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap",
                padding: "10px 12px", borderRadius: 12, background: "#f7f5fc", border: "1px solid #ece7f7",
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1c1830", minWidth: 100 }}>{l.language}</span>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {LEVELS.map((lv) => {
                    const on = l.level === lv.id;
                    return (
                      <button key={lv.id} onClick={() => updateLevel(l.language, lv.id)} className="pressable"
                        style={{
                          fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 999, cursor: "pointer",
                          background: on ? "#7c4dff" : "#fff",
                          color: on ? "#fff" : "#564d75",
                          border: on ? "none" : "1px solid #e6e0f5",
                        }}>
                        {lv.label}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => removeLang(l.language)} className="pressable"
                  aria-label={`Remove ${l.language}`}
                  style={{
                    marginLeft: "auto", width: 26, height: 26, borderRadius: 999, cursor: "pointer",
                    background: "none", border: "none", color: "#9a90b8",
                    display: "grid", placeItems: "center",
                  }}>
                  <X style={{ width: 15, height: 15 }} />
                </button>
              </div>
            ))}
          </div>
        )}
        {langProf.length < 3 && availableLangs.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {availableLangs.map((lang) => (
              <button key={lang} onClick={() => addLang(lang)} className="pressable"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 12.5, fontWeight: 600, padding: "7px 12px", borderRadius: 999, cursor: "pointer",
                  background: "#fff", color: "#564d75", border: "1px solid #e6e0f5",
                }}>
                <Plus style={{ width: 12, height: 12 }} /> {lang}
              </button>
            ))}
          </div>
        )}
        {langProf.length >= 3 && (
          <div style={{ fontSize: 12, color: "#9a90b8", marginTop: 4 }}>Three is the limit — remove one to add another.</div>
        )}
      </Card>

      <button onClick={() => setStep("continent")} className="pressable" style={{ ...CTA, width: "100%", marginTop: 10 }}>
        <Check style={{ width: 17, height: 17 }} /> Continue
      </button>
      <button onClick={() => setStep("continent")} className="pressable"
        style={{
          width: "100%", marginTop: 10,
          fontSize: 13, color: "#9a90b8", background: "none", border: "none", cursor: "pointer",
        }}>
        Skip — all optional
      </button>

      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", maxWidth: 620, margin: "26px auto 0",
        fontSize: 12, color: "#9a90b8" }}>
        <AlertCircle style={{ width: 14, height: 14, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
        <span>Eligibility is set by the host program and your study-abroad office. These inputs only re-rank what's already in your school's approved list — they don't add or remove eligibility.</span>
      </div>
    </Wrap>
  );
}

function Card({ title, hint, children }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #ece7f7", borderRadius: 20,
      padding: "20px 22px", marginBottom: 16,
      boxShadow: "0 24px 44px -28px rgba(60,40,110,.3)",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
        textTransform: "uppercase", color: "#b0a6c8", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#7e96b4", marginBottom: 14, lineHeight: 1.5 }}>{hint}</div>
      {children}
    </div>
  );
}
