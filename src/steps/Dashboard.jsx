import React from "react";
import {
  ChevronLeft, ChevronDown, GraduationCap, AlertCircle, Check,
  Sparkles, Globe, Coffee, MapPin, Quote,
} from "lucide-react";

import { SEMS, MAJORS } from "../data/options.js";
import { CLIM } from "../data/climate.js";
import { costInfo } from "../data/cost.js";
import { countryProfile, visaGuide } from "../data/country.js";
import { courseCredit } from "../data/courseCredit.js";

import { CTA } from "../theme/colors.js";
import { Wrap } from "../components/Wrap.jsx";
import { Tilt } from "../components/Tilt.jsx";
import { Photo } from "../components/Photo.jsx";

export function Dashboard({
  picked, school, major, schoolObj,
  semTab, setSemTab, setDayOpen,
  dashTab, setDashTab,
  costOpen, setCostOpen,
  visaOpen, setVisaOpen,
  copied, setCopied,
  liveClim,
  testiFor,
  setStep, restart,
}) {
  return (
    <Wrap>
      <button onClick={() => setStep("destinations")} className="pressable"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#7e96b4",
          background: "none", border: "none", cursor: "pointer", marginBottom: 22 }}>
        <ChevronLeft style={{ width: 15, height: 15 }} /> Back to destinations
      </button>

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase",
        color: "#b0a6c8", marginBottom: 10 }}>Choose your term</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {SEMS.map((s) => {
          const Icon = s.icon; const on = semTab === s.id;
          return (
            <button key={s.id} onClick={() => { setSemTab(s.id); setDayOpen(false); }} className="pressable"
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px 12px", borderRadius: 15, fontSize: 14, fontWeight: 600, cursor: "pointer",
                border: on ? "none" : "1px solid #e6e0f5",
                background: on ? "#7c4dff" : "#ffffff",
                color: on ? "#fff" : "#7a6f95",
                boxShadow: on ? "0 12px 24px -10px rgba(124,77,255,.45)" : "0 6px 16px -10px rgba(60,40,110,.2)" }}>
              <Icon style={{ width: 16, height: 16 }} /> {s.label}
            </button>
          );
        })}
      </div>

      {(() => {
        const clim0 = liveClim || CLIM[picked.clim] || CLIM.cont;
        const w0 = clim0[semTab] || clim0.fall; const WI0 = w0.icon;
        const t0 = testiFor(picked.city, picked.clim, semTab);
        return (
          <Tilt max={5} className="bob" style={{ borderRadius: 28, marginBottom: 20 }}>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 28,
            minHeight: 340, border: "1px solid #ece7f7",
            boxShadow: "0 50px 90px -34px rgba(60,40,110,.5), 0 8px 20px -12px rgba(60,40,110,.25)" }}>
            <div style={{ position: "absolute", inset: 0 }}>
              <Photo city={picked.city} country={picked.country} grad={picked.grad} photo={picked.photo} h={340} round={0} hideLabel />
            </div>
            <div style={{ position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(20,16,40,.15) 0%, rgba(20,16,40,.1) 38%, rgba(20,16,40,.78) 100%)" }} />

            <button
              onClick={() => {
                try {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                } catch (e) {}
              }}
              className="pressable"
              style={{ position: "absolute", top: 22, right: 22, zIndex: 3,
                display: "flex", alignItems: "center", gap: 7,
                background: "rgba(255,255,255,.14)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,.28)", color: "#fff",
                borderRadius: 999, padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
                cursor: "pointer", textShadow: "0 1px 6px rgba(0,0,0,.4)" }}
              title="Copy a link to this destination"
            >
              {copied ? <><Check style={{ width: 14, height: 14 }} /> Link copied</> : <><Sparkles style={{ width: 14, height: 14 }} /> Share</>}
            </button>

            <div style={{ position: "relative", padding: "30px 32px" }}>
              <div className="ser" style={{ fontSize: "clamp(34px,5vw,52px)", fontWeight: 600,
                color: "#fff", lineHeight: 1.05, textShadow: "0 3px 24px rgba(0,0,0,.5)" }}>
                {picked.city}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8,
                color: "rgba(255,255,255,.92)", fontSize: 14 }}>
                <GraduationCap style={{ width: 16, height: 16 }} />
                <span style={{ textShadow: "0 2px 12px rgba(0,0,0,.6)" }}>{picked.highlight} · {schoolObj?.name}</span>
              </div>
            </div>

            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0,
              padding: "20px 22px 22px", display: "flex", gap: 16, flexWrap: "wrap",
              alignItems: "flex-end", justifyContent: "space-between" }}>
              <div className="san" style={{ display: "flex", alignItems: "center", gap: 13,
                background: "rgba(255,255,255,.14)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,.25)",
                borderRadius: 18, padding: "13px 18px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                  background: "linear-gradient(135deg,#9d7bff,#7c4dff)", display: "grid", placeItems: "center" }}>
                  <WI0 style={{ width: 22, height: 22, color: "#fff" }} strokeWidth={1.7} />
                </div>
                <div>
                  <div className="san" style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                    textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>{(SEMS.find((x) => x.id === semTab) || {}).label || semTab} weather</div>
                  <div className="san" style={{ fontSize: 15, fontWeight: 700, color: "#fff",
                    textShadow: "0 2px 12px rgba(0,0,0,.5)" }}>{w0.w}</div>
                  <div className="san" style={{ fontSize: 12, color: "rgba(255,255,255,.82)" }}>{w0.t}</div>
                </div>
              </div>
              {t0 && (
                <div style={{ flex: 1, minWidth: 240, maxWidth: 520,
                  background: "rgba(255,255,255,.14)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,.25)", borderRadius: 18, padding: "15px 20px" }}>
                  <Quote style={{ width: 18, height: 18, color: "rgba(255,255,255,.85)", marginBottom: 6 }} />
                  <div className="ser" style={{ fontSize: 16, fontStyle: "italic", color: "#fff",
                    lineHeight: 1.45, textShadow: "0 2px 12px rgba(0,0,0,.5)",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {t0.quote}
                  </div>
                </div>
              )}
            </div>
          </div>
          </Tilt>
        );
      })()}

      {(() => {
        const TABS = [
          { id: "overview", label: "Overview" },
          { id: "academics", label: "Courses" },
          { id: "money", label: "Expenses" },
          { id: "logistics", label: "Logistics" },
        ];
        return (
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {TABS.map((t) => {
              const on = dashTab === t.id;
              return (
                <button key={t.id} onClick={() => setDashTab(t.id)} className="pressable"
                  style={{ flex: "1 1 auto", minWidth: 120, padding: "12px 14px", borderRadius: 14,
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    border: on ? "none" : "1px solid #e6e0f5",
                    background: on ? "#7c4dff" : "#ffffff",
                    color: on ? "#fff" : "#7a6f95",
                    boxShadow: on ? "0 12px 24px -10px rgba(124,77,255,.45)" : "0 6px 16px -10px rgba(60,40,110,.2)" }}>
                  {t.label}
                </button>
              );
            })}
          </div>
        );
      })()}

      {dashTab === "overview" && (() => {
        const cp = countryProfile(picked.country);
        const overview = [
          [Sparkles, "Known for", cp.known],
          [Globe, "Language & getting by", cp.lang],
          [Coffee, "Student & social life", cp.life],
          [MapPin, "Getting around & trips out", cp.travel],
        ];
        return (
          <Tilt max={4} className="bob" style={{ borderRadius: 26, marginBottom: 16 }}>
          <div style={{ background: "#ffffff", overflow: "hidden", borderRadius: 26,
            border: "1px solid #ece7f7",
            boxShadow: "0 40px 70px -30px rgba(60,40,110,.4)", padding: "26px 30px 28px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
              textTransform: "uppercase", color: "#b0a6c8", marginBottom: 8 }}>About {picked.city}</div>
            <div className="ser" style={{ fontSize: 24, fontWeight: 600, color: "#1c1830", marginBottom: 6 }}>
              {picked.desc}
            </div>
            <p className="san" style={{ fontSize: 13.5, color: "#9a90b8", lineHeight: 1.55, marginBottom: 18 }}>
              Enrolled through {picked.highlight} · {schoolObj?.name} credit
            </p>
            {(() => {
              const clim = liveClim || CLIM[picked.clim] || CLIM.cont;
              const w = clim[semTab] || clim.fall;
              const semLabel = ((SEMS.find((x) => x.id === semTab) || {}).label || "this term").toLowerCase();
              const tier = costInfo(picked.city, picked.country).tier.toLowerCase();
              return (
                <p className="san" style={{ fontSize: 14.5, color: "#3d3458", lineHeight: 1.7, marginBottom: 22 }}>
                  A semester in {picked.city} drops you into {picked.country} at a {tier} pace of life. In {semLabel} expect{" "}
                  <span style={{ color: "#1c1830", fontWeight: 600 }}>{w.w.toLowerCase()}</span> ({w.t}) — that shapes how you'll
                  study, where you'll spend afternoons, and how often you'll travel. Most of your week runs through {picked.highlight},
                  with credit flowing back to {schoolObj?.name}. The cultural rhythm, language landscape and student scene
                  below give you the shape of daily life — the tabs above cover the practical stuff.
                </p>
              );
            })()}
            <div style={{ display: "grid", gap: 2, borderTop: "1px solid #f0ecf9" }}>
              {overview.map(([Ic, lab, val], k) => (
                <div key={lab} style={{ display: "flex", gap: 13, padding: "13px 4px",
                  borderBottom: k < overview.length - 1 ? "1px solid #f4f1fb" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: "#f0ebfa", display: "grid", placeItems: "center" }}>
                    <Ic style={{ width: 16, height: 16, color: "#7c4dff" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1830", marginBottom: 2 }}>{lab}</div>
                    <div className="san" style={{ fontSize: 13.5, color: "#564d75", lineHeight: 1.5 }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </Tilt>
        );
      })()}

      {dashTab === "academics" && (() => {
        const cc = courseCredit(picked.city, school, major);
        const majorLabel = (MAJORS.find((x) => x.id === major) || {}).label || "your major";
        const subjects = Array.isArray(picked.subjects) ? picked.subjects : [];
        const subjectsLine = subjects.length
          ? `The program lists these subject areas: ${subjects.join(", ")}.`
          : "";
        const advisorEmail = `Hi Professor,

I hope you're well. I'm a ${schoolObj?.name || "home-school"} student planning to study abroad in ${picked.city} through ${picked.highlight}. I'm a ${majorLabel} major and want to confirm how specific courses there would count toward my major.${subjectsLine ? "\n\n" + subjectsLine : ""}

Could you let me know whether the following would count, and at what level (e.g. major requirement / elective / Level I or II)? I've attached the syllabi.

  • [COURSE CODE] — [COURSE TITLE]
  • [COURSE CODE] — [COURSE TITLE]
  • [COURSE CODE] — [COURSE TITLE]

Thank you for your time — I really appreciate it.

Best,
[Your name]`;
        return (
          <Tilt max={4} className="bob" style={{ borderRadius: 26, marginBottom: 16 }}>
          <div style={{ background: "#ffffff", overflow: "hidden", borderRadius: 26,
            border: "1px solid #ece7f7",
            boxShadow: "0 40px 70px -30px rgba(60,40,110,.4)", padding: "26px 30px 28px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
              textTransform: "uppercase", color: "#b0a6c8", marginBottom: 8 }}>Course credit · {majorLabel}</div>

            {subjects.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#564d75", marginBottom: 8 }}>
                  Subject areas at this program (from {schoolObj?.live ? "the live portal" : "the snapshot"}):
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {subjects.map((s) => (
                    <span key={s} className="san" style={{ fontSize: 12, fontWeight: 600,
                      color: "#7c4dff", background: "#f0ebfa", borderRadius: 999, padding: "5px 11px" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {cc ? (
              <>
                <div className="ser" style={{ fontSize: 22, fontWeight: 600, color: "#1c1830", marginBottom: 6 }}>
                  Confirmed determinations
                </div>
                <div style={{ fontSize: 12.5, color: "#9a90b8", marginBottom: 18 }}>
                  Issued by {cc.by} · reviewed {cc.reviewedOn}
                </div>
                {cc.note && (
                  <p className="san" style={{ fontSize: 14, color: "#564d75", lineHeight: 1.6,
                    background: "#faf9fe", border: "1px solid #eee9f8", borderRadius: 14,
                    padding: "14px 16px", marginBottom: 18 }}>{cc.note}</p>
                )}
                <div style={{ display: "grid", gap: 2, borderTop: "1px solid #f0ecf9" }}>
                  {cc.courses.map((cr, k) => {
                    const noCred = /no credit/i.test(cr.result);
                    const lvl2 = /level\s*ii|level\s*2/i.test(cr.result);
                    const col = noCred ? "#dc2626" : (lvl2 ? "#16a34a" : "#d97706");
                    return (
                      <div key={k} style={{ display: "flex", gap: 14, padding: "16px 4px", alignItems: "flex-start",
                        borderBottom: k < cc.courses.length - 1 ? "1px solid #f4f1fb" : "none" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1830" }}>{cr.code}</div>
                          <div className="san" style={{ fontSize: 13, color: "#9a90b8", marginTop: 2 }}>{cr.title}</div>
                        </div>
                        <span className="san" style={{ fontSize: 12.5, fontWeight: 700, color: col,
                          background: col + "1a", borderRadius: 999, padding: "6px 12px", flexShrink: 0,
                          whiteSpace: "nowrap" }}>{cr.result}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 18,
                  paddingTop: 16, borderTop: "1px solid #f0ecf9", fontSize: 11.5, color: "#9a90b8" }}>
                  <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
                  <span>These are real past determinations for {majorLabel} majors at {schoolObj?.name}. Course offerings and rulings can change each term — re-confirm your exact courses & syllabi with your department before relying on them.</span>
                </div>
              </>
            ) : (
              <>
                <div className="ser" style={{ fontSize: 22, fontWeight: 600, color: "#1c1830", marginBottom: 10 }}>
                  Not yet confirmed — here's how to get the real answer
                </div>
                <p className="san" style={{ fontSize: 14.5, color: "#564d75", lineHeight: 1.65, marginBottom: 20 }}>
                  Whether a specific course counts toward {majorLabel} — and at what level (major requirement, elective, Level I vs II) — is decided by your home department from the actual syllabus. It is <strong>not</strong> something this app can answer for you. Here's the process:
                </p>
                <div style={{ display: "grid", gap: 2, borderTop: "1px solid #f0ecf9", marginBottom: 22 }}>
                  {[
                    ["Find the host course catalog", `Look up ${picked.highlight}'s course list for your term.`],
                    ["Pull the syllabi", "Download the syllabus for each course you're considering."],
                    ["Map to your requirements", `Note which could fill ${majorLabel} requirements vs. electives vs. levels.`],
                    ["Email the right faculty", "Send your department/advisor the codes + syllabi and ask for a written ruling."],
                    ["Keep it in writing", "Save the reply — that email IS your credit confirmation."],
                  ].map(([h, d], k, arr) => (
                    <div key={k} style={{ display: "flex", gap: 14, padding: "15px 4px", alignItems: "flex-start",
                      borderBottom: k < arr.length - 1 ? "1px solid #f4f1fb" : "none" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                        background: "#f0ebfa", display: "grid", placeItems: "center",
                        fontSize: 12, fontWeight: 800, color: "#7c4dff" }}>{k + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1830", marginBottom: 2 }}>{h}</div>
                        <div className="san" style={{ fontSize: 13.5, color: "#564d75", lineHeight: 1.55 }}>{d}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#faf9fe", border: "1px solid #eee9f8", borderRadius: 16,
                  padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1c1830" }}>Ready-to-send email to your advisor</div>
                    <button onClick={() => { try { navigator.clipboard.writeText(advisorEmail); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch (e) {} }}
                      className="pressable" style={{ fontSize: 12.5, fontWeight: 600, color: "#fff",
                        background: "#7c4dff", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
                      {copied ? "Copied ✓" : "Copy email"}
                    </button>
                  </div>
                  <pre className="san" style={{ whiteSpace: "pre-wrap", fontSize: 12.5, color: "#564d75",
                    lineHeight: 1.6, margin: 0, fontFamily: "inherit" }}>{advisorEmail}</pre>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 18,
                  fontSize: 11.5, color: "#9a90b8" }}>
                  <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
                  <span>This app deliberately does <strong>not</strong> guess course-credit outcomes — only a written ruling from your home department is valid, since it depends on your exact courses, syllabi, major and term.</span>
                </div>
              </>
            )}
          </div>
          </Tilt>
        );
      })()}

      {dashTab === "money" && (() => {
        const c = costInfo(picked.city, picked.country);
        const maxAmt = Math.max(...c.breakdown.map((b) => b.amt));
        return (
          <Tilt max={5} className="bob" style={{ borderRadius: 24, marginBottom: 16 }}>
          <div style={{ background: "#ffffff", borderRadius: 24, border: "1px solid #ece7f7",
            boxShadow: "0 30px 56px -28px rgba(60,40,110,.4)", overflow: "hidden" }}>
            <div onClick={() => setCostOpen((o) => !o)} style={{ padding: "24px 28px", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 14, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
                    textTransform: "uppercase", color: "#b0a6c8", marginBottom: 6 }}>Cost of living</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span className="ser" style={{ fontSize: 30, fontWeight: 600, color: "#1c1830" }}>
                      ~${c.studentMo.toLocaleString()}<span style={{ fontSize: 15, color: "#9a90b8", fontWeight: 400 }}>/mo</span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.tierColor,
                      background: c.tierColor + "1a", borderRadius: 999, padding: "5px 12px" }}>
                      {c.tier}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#7e96b4", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    Rough all-in student month. {c.vsNY}.
                    <span style={{ color: "#7c4dff", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
                      {costOpen ? "Hide" : "See"} breakdown
                      <ChevronDown style={{ width: 14, height: 14, transform: costOpen ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ position: "relative", width: 78, height: 78 }}>
                    <svg width="78" height="78" viewBox="0 0 78 78">
                      <circle cx="39" cy="39" r="33" fill="none" stroke="#efeaff" strokeWidth="9" />
                      <circle cx="39" cy="39" r="33" fill="none" stroke={c.tierColor} strokeWidth="9"
                        strokeLinecap="round" strokeDasharray={`${Math.min(c.idx, 130) / 130 * 207} 207`}
                        transform="rotate(-90 39 39)" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: "#1c1830" }}>{c.idx}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 10.5, color: "#9a90b8", marginTop: 4 }}>index · NYC=100</div>
                </div>
              </div>
            </div>
            {costOpen && (
              <div className="fad" style={{ borderTop: "1px solid #f0ecf9", padding: "22px 28px 26px",
                background: "#fbfaff" }}>
                <div style={{ display: "grid", gap: 16 }}>
                  {c.breakdown.map((b) => (
                    <div key={b.key}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1c1830" }}>{b.key}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#7c4dff" }}>~${b.amt.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 7, borderRadius: 999, background: "#ece7f7", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 999, width: `${(b.amt / maxAmt) * 100}%`,
                          background: "linear-gradient(90deg,#9d6bff,#7c4dff)" }} />
                      </div>
                      <div style={{ fontSize: 11.5, color: "#9a90b8", marginTop: 5 }}>{b.note}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginTop: 20, paddingTop: 16, borderTop: "1px solid #ece7f7" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1c1830" }}>Estimated total</span>
                  <span className="ser" style={{ fontSize: 22, fontWeight: 600, color: "#1c1830" }}>~${c.studentMo.toLocaleString()}<span style={{ fontSize: 13, color: "#9a90b8", fontWeight: 400 }}>/mo</span></span>
                </div>

                <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid #ece7f7" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
                    textTransform: "uppercase", color: "#b0a6c8", marginBottom: 4 }}>Where you'll live</div>
                  <div style={{ fontSize: 12.5, color: "#9a90b8", marginBottom: 14 }}>
                    Typical arrangements programs in {picked.city} offer — housing is usually the choice that moves your budget most.
                  </div>
                  <div style={{ display: "grid", gap: 12 }}>
                    {c.housing.map((h) => (
                      <div key={h.type} style={{ background: "#fff", border: "1px solid #ece7f7",
                        borderRadius: 16, padding: "16px 18px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: "#1c1830" }}>{h.type}</span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#7c4dff",
                                background: "#f0ebfa", borderRadius: 999, padding: "3px 9px" }}>{h.perk}</span>
                            </div>
                            <div style={{ fontSize: 12.5, color: "#6b6090", lineHeight: 1.5 }}>{h.desc}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div className="ser" style={{ fontSize: 19, fontWeight: 600, color: "#1c1830" }}>~${h.monthly.toLocaleString()}</div>
                            <div style={{ fontSize: 10.5, color: "#9a90b8" }}>/month</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 16,
                  fontSize: 11.5, color: "#9a90b8" }}>
                  <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
                  <span>Cost and housing figures are a planning model from 2026 cost-of-living data, not quotes. The exact housing types, prices and meal plans vary by program — confirm options with {picked.city}'s provider and your study-abroad office.</span>
                </div>
              </div>
            )}
          </div>
          </Tilt>
        );
      })()}

      {dashTab === "logistics" && (() => {
        const cp = countryProfile(picked.country);
        return (
          <Tilt max={5} className="bob" style={{ borderRadius: 24, marginBottom: 16 }}>
          <div style={{ background: "#ffffff", borderRadius: 24, border: "1px solid #ece7f7",
            boxShadow: "0 30px 56px -28px rgba(60,40,110,.4)", padding: "24px 28px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
              textTransform: "uppercase", color: "#b0a6c8", marginBottom: 16 }}>Before you go · {picked.country}</div>
            <div style={{ display: "grid", gap: 18 }}>
              <div style={{ display: "flex", gap: 13 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                  background: "#f0ebfa", display: "grid", placeItems: "center" }}>
                  <Check style={{ width: 17, height: 17, color: "#7c4dff" }} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1c1830", marginBottom: 3 }}>Safety — general orientation</div>
                  <div className="san" style={{ fontSize: 13.5, color: "#564d75", lineHeight: 1.55 }}>{cp.safety}</div>
                </div>
              </div>
              <div>
                <div onClick={() => setVisaOpen((o) => !o)} style={{ display: "flex", gap: 13, cursor: "pointer" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                    background: "#f0ebfa", display: "grid", placeItems: "center" }}>
                    <GraduationCap style={{ width: 17, height: 17, color: "#7c4dff" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1c1830", marginBottom: 3,
                      display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      Visa & entry
                      {(() => { const vg = visaGuide(picked.country); return (
                        <span style={{ fontSize: 11, fontWeight: 700, color: vg.color,
                          background: vg.color + "1a", borderRadius: 999, padding: "3px 9px" }}>{vg.level}</span>
                      ); })()}
                      <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 600, color: "#7c4dff",
                        display: "inline-flex", alignItems: "center", gap: 4 }}>
                        {visaOpen ? "Hide steps" : "Step-by-step"}
                        <ChevronDown style={{ width: 14, height: 14, transform: visaOpen ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                      </span>
                    </div>
                    <div className="san" style={{ fontSize: 13.5, color: "#564d75", lineHeight: 1.55 }}>{cp.visa}</div>
                  </div>
                </div>
                {visaOpen && (() => {
                  const vg = visaGuide(picked.country);
                  return (
                    <div className="fad" style={{ marginTop: 16, marginLeft: 49 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
                        textTransform: "uppercase", color: "#b0a6c8", marginBottom: 4 }}>
                        Likely visa for {picked.country}
                      </div>
                      <div className="ser" style={{ fontSize: 17, fontWeight: 600, color: "#1c1830", marginBottom: 8 }}>
                        {vg.type}
                      </div>
                      <a href={vg.officialURL} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14,
                          fontSize: 13, fontWeight: 600, color: "#7c4dff",
                          background: "#f0ebfa", borderRadius: 10, padding: "8px 13px",
                          textDecoration: "none", border: "1px solid #e1d6f7" }}>
                        {vg.officialKnown
                          ? `Official ${picked.country} student visa page`
                          : `Official ${picked.country} travel info (US State Dept)`} ↗
                      </a>
                      {vg.note && (
                        <div style={{ display: "flex", gap: 9, alignItems: "flex-start",
                          background: vg.color + "12", border: `1px solid ${vg.color}33`,
                          borderRadius: 14, padding: "13px 15px", marginBottom: 16 }}>
                          <AlertCircle style={{ width: 15, height: 15, color: vg.color, flexShrink: 0, marginTop: 1 }} />
                          <div className="san" style={{ fontSize: 13, color: "#564d75", lineHeight: 1.55 }}>
                            <strong style={{ color: vg.color }}>{picked.country}: {vg.lead}.</strong> {vg.note.flag}
                          </div>
                        </div>
                      )}
                      {!vg.note && (
                        <div className="san" style={{ fontSize: 12.5, color: "#9a90b8", marginBottom: 14 }}>
                          General timing: <strong style={{ color: "#7c4dff" }}>{vg.lead}.</strong>{vg.schengen ? " Schengen long-stay rules apply for terms over 90 days." : ""}
                        </div>
                      )}
                      <div style={{ display: "grid", gap: 2 }}>
                        {vg.steps.map(([h, d], k) => (
                          <div key={k} style={{ display: "flex", gap: 13, padding: "13px 4px", alignItems: "flex-start",
                            borderBottom: k < vg.steps.length - 1 ? "1px solid #f4f1fb" : "none" }}>
                            <div style={{ width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                              background: "#f0ebfa", display: "grid", placeItems: "center",
                              fontSize: 11.5, fontWeight: 800, color: "#7c4dff" }}>{k + 1}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1c1830", marginBottom: 2 }}>{h}</div>
                              <div className="san" style={{ fontSize: 13, color: "#564d75", lineHeight: 1.55 }}>{d}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 14,
                        fontSize: 11.5, color: "#9a90b8" }}>
                        <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
                        <span>This is the general shape of the process, not legal advice or a fee/form list. Exact requirements depend on your citizenship and consulate and change often — verify on the official {picked.country} consulate site and with your study-abroad office, and start early.</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 18,
              paddingTop: 16, borderTop: "1px solid #f0ecf9", fontSize: 11.5, color: "#9a90b8" }}>
              <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
              <span>General orientation only — not legal or safety advice. Visa requirements depend on your citizenship and program length, and safety varies within a country. Always confirm current rules with {picked.country}'s consulate and your study-abroad office.</span>
            </div>
          </div>
          </Tilt>
        );
      })()}

      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12.5, color: "#9a90b8",
        background: "transparent", border: "none", borderRadius: 14, padding: "13px 16px", marginTop: 4 }}>
        <AlertCircle style={{ width: 15, height: 15, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
        <span>Cultural & language notes are general orientation. Weather is <strong>seasonal climate normals</strong> from Open-Meteo (2020–2024) — not a live forecast. Program photos come from the host portal where available, with Wikipedia city thumbnails as a fallback. Confirm program specifics with {schoolObj?.name}'s study-abroad office.</span>
      </div>

      <button onClick={restart} className="pressable" style={{ ...CTA, width: "100%", marginTop: 20 }}>Plan another trip</button>
    </Wrap>
  );
}
