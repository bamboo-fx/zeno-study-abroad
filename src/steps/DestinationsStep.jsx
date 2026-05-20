import React, { useState } from "react";
import { AlertCircle, ChevronLeft, ArrowRight, Check, GraduationCap, X, Info } from "lucide-react";

import { MAJORS } from "../data/options.js";
import { costInfo } from "../data/cost.js";
import { CTA, CARD } from "../theme/colors.js";
import { Wrap } from "../components/Wrap.jsx";
import { StepHead } from "../components/StepHead.jsx";
import { Photo } from "../components/Photo.jsx";

// Compact icons row + click-to-expand breakdown. Each component returns
// {score, reason, ok, known}; we render a small tick/dash/x icon per signal
// and the full reasons appear on click.
const SIGNAL_LABELS = {
  subject: "Subject",
  language: "Language",
  term: "Term",
  vibe: "Vibe",
  credit: "Credit history",
};
function signalIcon(c) {
  if (!c) return "—";
  if (!c.known) return "—";
  if (c.score >= 0.75) return "✓";
  if (c.score > 0) return "·";
  return "—";
}
function signalColor(c) {
  if (!c || !c.known) return "#c9bdec";
  if (c.score >= 0.75) return "#16a34a";
  if (c.score > 0) return "#d97706";
  return "#c9bdec";
}

function FitBreakdown({ fit, percent, color, eligible, gates, compact }) {
  const [open, setOpen] = useState(false);
  const order = ["subject", "language", "term", "vibe", "credit"];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} className="pressable"
        aria-label="Show match breakdown"
        style={{
          display: "flex", alignItems: "center", gap: compact ? 6 : 9,
          background: "rgba(255,255,255,.94)", backdropFilter: "blur(6px)",
          borderRadius: 999, padding: compact ? "6px 11px 6px 8px" : "10px 16px 10px 12px",
          boxShadow: compact ? "none" : "0 14px 30px -14px rgba(0,0,0,.4)",
          border: compact ? "1px solid #ece7f7" : "none",
          cursor: "pointer",
        }}>
        {eligible ? (
          <span style={{ width: compact ? 20 : 28, height: compact ? 20 : 28, borderRadius: 999,
            background: color, display: "grid", placeItems: "center" }}>
            <Check style={{ width: compact ? 12 : 16, height: compact ? 12 : 16, color: "#fff" }} strokeWidth={3} />
          </span>
        ) : (
          <span style={{ width: compact ? 20 : 28, height: compact ? 20 : 28, borderRadius: 999,
            background: "#dc2626", display: "grid", placeItems: "center" }}>
            <X style={{ width: compact ? 12 : 16, height: compact ? 12 : 16, color: "#fff" }} strokeWidth={3} />
          </span>
        )}
        <span style={{ fontSize: compact ? 13 : 17, fontWeight: 800, color }}>{percent}%</span>
        {!compact && <span style={{ fontSize: 12, fontWeight: 600, color: "#7a7299" }}>match</span>}
        <Info style={{ width: compact ? 11 : 13, height: compact ? 11 : 13, color: "#9a90b8", marginLeft: compact ? 2 : 4 }} />
      </button>

      {open && (
        <div className="fad" style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 30,
          background: "#fff", border: "1px solid #ece7f7", borderRadius: 16,
          boxShadow: "0 36px 70px -28px rgba(60,40,110,.45)",
          padding: "16px 18px", minWidth: 280, maxWidth: 360,
          textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
              textTransform: "uppercase", color: "#b0a6c8" }}>Why {percent}%</span>
            <button onClick={() => setOpen(false)} className="pressable"
              aria-label="Close"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9a90b8",
                width: 22, height: 22, display: "grid", placeItems: "center" }}>
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
          {!eligible && gates && gates.gpa && !gates.gpa.pass && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11,
              padding: "10px 12px", marginBottom: 12, fontSize: 12.5, color: "#991b1b" }}>
              <strong>Not eligible:</strong> {gates.gpa.reason}
            </div>
          )}
          <div style={{ display: "grid", gap: 9 }}>
            {order.map((k) => {
              const c = fit.components[k];
              const col = signalColor(c);
              return (
                <div key={k} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                    background: col, color: "#fff", fontWeight: 800, fontSize: 11,
                    display: "grid", placeItems: "center", marginTop: 1,
                  }}>{signalIcon(c)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1c1830" }}>{SIGNAL_LABELS[k]}</div>
                    <div style={{ fontSize: 12, color: "#564d75", lineHeight: 1.45 }}>{c.reason}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f0ecf9",
            fontSize: 11, color: "#9a90b8", lineHeight: 1.5 }}>
            ✓ full credit · · partial · — unknown or no match. Weights: subject 40 · language 20 · term 15 · vibe 10 · credit 15.
          </div>
        </div>
      )}
    </div>
  );
}

export function DestinationsStep({
  srcLoading, chosen, ranked, primaryVibe, contLabel, schoolObj, major,
  destIdx, setDestIdx, destDirRef, choose, setStep,
}) {
  return (
    <Wrap>
      <StepHead kicker={<>{(MAJORS.find((x) => x.id === major) || {}).label || "All majors"}{primaryVibe?.label ? ` · ${primaryVibe.label}` : ""}{contLabel ? ` · ${contLabel}` : " · global mix"}</>}
        title="Pick your destination"
        back={() => setStep("images")} />

      {srcLoading ? (
        <div className="fad" style={{ ...CARD, maxWidth: 460, margin: "0 auto", textAlign: "center", padding: 36, borderRadius: 22 }}>
          <div className="ser" style={{ fontSize: 18, fontWeight: 600, color: "#1c1830" }}>Loading approved programs…</div>
          <div style={{ fontSize: 13, color: "#9a90b8", marginTop: 6 }}>Pulling the live list from {schoolObj?.name}'s portal.</div>
        </div>
      ) : chosen.length === 0 ? (
        <div className="fl" style={{ ...CARD, maxWidth: 560, margin: "0 auto", textAlign: "center", padding: 44, borderRadius: 24 }}>
          <AlertCircle style={{ width: 34, height: 34, color: "#4ea8ff", margin: "0 auto 14px" }} />
          <div className="ser" style={{ fontSize: 21, fontWeight: 600, marginBottom: 6 }}>Nothing here for that combination</div>
          <p style={{ fontSize: 14, color: "#7e96b4", marginBottom: 22 }}>No “{primaryVibe?.label}”{contLabel ? ` in ${contLabel}` : ""} programs in {schoolObj?.name}'s approved list. Try another region or vibe.</p>
          <button onClick={() => setStep("images")} className="pressable" style={{ ...CTA }}>
            <ChevronLeft style={{ width: 16, height: 16 }} /> Pick another vibe
          </button>
        </div>
      ) : (() => {
        const safeIdx = Math.min(destIdx, ranked.length - 1);
        const goTo = (target) => {
          const t = Math.min(ranked.length - 1, Math.max(0, target));
          destDirRef.current = t >= safeIdx ? 1 : -1;
          setDestIdx(t);
        };
        const go = (dir) => goTo(safeIdx + dir);
        const mColor = (m) => m >= 90 ? "#16a34a" : m >= 80 ? "#7c4dff" : "#9d6bff";

        return (
          <div>
            <div style={{ textAlign: "center", fontSize: 13, color: "#9a90b8", marginBottom: 4 }}>
              Ranked by match · {safeIdx + 1} of {ranked.length}
            </div>
            <div style={{ textAlign: "center", fontSize: 11.5, color: "#b0a6c8", marginBottom: 18 }}>
              {major && major !== "open"
                ? "Sorted to surface programs that tend to suit your major first — every approved option is still shown."
                : "Every approved program is shown, ranked by overall fit."}
            </div>

            <div style={{ position: "relative", height: 660, maxWidth: 1180, margin: "0 auto",
              perspective: 1600, overflow: "hidden" }}>
              {ranked.map((item, i) => {
                const off = i - safeIdx;
                const abs = Math.abs(off);
                if (abs > 1) return null;
                const isCenter = off === 0;
                const x = off * 340;
                const ry = off === 0 ? 0 : (off < 0 ? 36 : -36);
                const z = isCenter ? 0 : -240;
                const scale = isCenter ? 1 : 0.8;
                const op = isCenter ? 1 : 0.5;
                return (
                  <div key={item.dd.city}
                    onClick={() => !isCenter && goTo(i)}
                    style={{ position: "absolute", top: "50%", left: "50%",
                      width: isCenter ? 560 : 300,
                      transform: `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${scale})`,
                      opacity: item.fit.eligible ? op : op * 0.55, zIndex: isCenter ? 5 : 5 - abs,
                      filter: item.fit.eligible ? (isCenter ? "none" : "saturate(.8) blur(.4px)")
                                                : "grayscale(.5) saturate(.5)",
                      cursor: isCenter ? "default" : "pointer",
                      pointerEvents: abs > 1 ? "none" : "auto",
                      transition: "transform .85s cubic-bezier(.22,1,.36,1), opacity .85s ease, filter .6s ease",
                      willChange: "transform" }}>
                    <div className={isCenter ? "bob" : ""}
                      style={{ background: "#ffffff", overflow: "hidden",
                        borderRadius: isCenter ? 30 : 24,
                        border: "1px solid #ece7f7",
                        boxShadow: isCenter
                          ? "0 54px 100px -38px rgba(60,40,110,.5), 0 12px 28px -16px rgba(60,40,110,.3)"
                          : "0 40px 74px -34px rgba(60,40,110,.45)" }}>
                      <div style={{ position: "relative", padding: isCenter ? 14 : 10 }}>
                        <Photo city={item.dd.city} country={item.dd.country} grad={item.dd.grad}
                          photo={item.dd.photo}
                          h={isCenter ? 300 : 180} round={isCenter ? 22 : 16} />
                        {isCenter && (
                          <div style={{ position: "absolute", top: 26, right: 26 }}>
                            <FitBreakdown
                              fit={item.fit}
                              percent={item.m}
                              color={mColor(item.m)}
                              eligible={item.fit.eligible}
                              gates={item.fit.gates}
                            />
                          </div>
                        )}
                      </div>
                      {isCenter ? (
                        <div style={{ padding: "16px 36px 32px" }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                            <span className="ser" style={{ fontSize: 28, fontWeight: 600, color: "#1c1830" }}>{item.dd.city}</span>
                            <span style={{ fontSize: 15, color: "#9a90b8" }}>{item.dd.country}</span>
                          </div>
                          <p style={{ fontSize: 15, color: "#564d75", lineHeight: 1.5, marginBottom: 14 }}>{item.dd.desc}</p>
                          {!item.fit.eligible && item.fit.gates.gpa && !item.fit.gates.gpa.pass && (
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start",
                              background: "#fef2f2", border: "1px solid #fecaca",
                              borderRadius: 12, padding: "10px 13px", marginBottom: 14,
                              fontSize: 12.5, color: "#991b1b", lineHeight: 1.5 }}>
                              <AlertCircle style={{ width: 14, height: 14, color: "#dc2626", flexShrink: 0, marginTop: 1 }} />
                              <span>{item.fit.gates.gpa.reason} Shown for transparency — confirm with your study-abroad office.</span>
                            </div>
                          )}
                          {(() => {
                            const c = costInfo(item.dd.city, item.dd.country);
                            return (
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
                                fontSize: 13, marginBottom: 20,
                                background: "#f7f5fc", borderRadius: 12, padding: "9px 14px" }}>
                                <span style={{ fontWeight: 700, color: c.tierColor }}>~${c.studentMo.toLocaleString()}/mo</span>
                                <span style={{ color: "#9a90b8" }}>est. student cost</span>
                                <span style={{ fontWeight: 600, color: c.tierColor }}>· {c.tier}</span>
                              </div>
                            );
                          })()}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600,
                              color: "#7c4dff", background: "#f0ebfa", borderRadius: 12, padding: "10px 15px" }}>
                              <GraduationCap style={{ width: 15, height: 15 }} /> {item.dd.highlight}
                            </span>
                            <button onClick={() => choose(item.dd)} className="pressable" style={{ ...CTA }}>
                              Choose {item.dd.city} <ArrowRight style={{ width: 17, height: 17 }} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: "6px 20px 22px" }}>
                          <div className="ser" style={{ fontSize: 20, fontWeight: 600, color: "#1c1830" }}>{item.dd.city}</div>
                          <div style={{ fontSize: 12.5, color: "#9a90b8", marginTop: 2 }}>{item.dd.country}</div>
                          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
                            fontSize: 12.5, fontWeight: 700,
                            color: item.fit.eligible ? mColor(item.m) : "#9a90b8" }}>
                            {item.fit.eligible
                              ? (<><Check style={{ width: 13, height: 13 }} strokeWidth={3} /> {item.m}% match</>)
                              : (<><X style={{ width: 13, height: 13 }} strokeWidth={3} /> Not eligible</>)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <button onClick={() => go(-1)} disabled={safeIdx === 0} className="pressable"
                aria-label="Previous"
                style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                  zIndex: 9, width: 50, height: 50, borderRadius: 999,
                  cursor: safeIdx === 0 ? "default" : "pointer", border: "1px solid #e6e0f5", background: "#fff",
                  display: "grid", placeItems: "center", opacity: safeIdx === 0 ? .3 : 1,
                  boxShadow: "0 14px 30px -16px rgba(60,40,110,.4)" }}>
                <ChevronLeft style={{ width: 22, height: 22, color: "#7c4dff" }} />
              </button>
              <button onClick={() => go(1)} disabled={safeIdx === ranked.length - 1} className="pressable"
                aria-label="Next"
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                  zIndex: 9, width: 50, height: 50, borderRadius: 999,
                  cursor: safeIdx === ranked.length - 1 ? "default" : "pointer", border: "1px solid #e6e0f5", background: "#fff",
                  display: "grid", placeItems: "center", opacity: safeIdx === ranked.length - 1 ? .3 : 1,
                  boxShadow: "0 14px 30px -16px rgba(60,40,110,.4)" }}>
                <ArrowRight style={{ width: 22, height: 22, color: "#7c4dff" }} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 7, justifyContent: "center", marginTop: 16 }}>
              {ranked.map((_, di) => (
                <button key={di} onClick={() => goTo(di)} aria-label={`Go to ${di + 1}`}
                  className="pressable" style={{ width: di === safeIdx ? 26 : 8, height: 8, borderRadius: 999,
                    border: "none", cursor: "pointer", padding: 0,
                    background: di === safeIdx ? "#7c4dff" : "#dcd3f0", transition: "width .25s" }} />
              ))}
            </div>

            {ranked.length > 1 && (
              <div className="fad" style={{ maxWidth: 620, margin: "52px auto 0" }}>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div className="ser" style={{ fontSize: 24, fontWeight: 600, color: "#1c1830" }}>
                    Your full ranking
                  </div>
                  <div style={{ fontSize: 13, color: "#9a90b8", marginTop: 5 }}>
                    All {ranked.length} matches, best to least — tap one to revisit
                  </div>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {ranked.map((r, ri) => (
                    <button key={r.dd.city + ri} onClick={() => goTo(ri)} className="pressable"
                      style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "left",
                        background: "#fff", border: "1px solid #ece7f7", borderRadius: 16,
                        padding: "14px 18px", cursor: "pointer",
                        boxShadow: "0 16px 34px -22px rgba(60,40,110,.4)" }}>
                      <span className="ser" style={{ fontSize: 20, fontWeight: 700, color: "#c9bdec",
                        width: 30, flexShrink: 0 }}>{ri + 1}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: 16, fontWeight: 600, color: "#1c1830" }}>
                          {r.dd.city} <span style={{ color: "#9a90b8", fontWeight: 400, fontSize: 13 }}>{r.dd.country}</span>
                        </span>
                        <span style={{ display: "block", fontSize: 12.5, color: "#9a90b8", marginTop: 2 }}>
                          {r.dd.highlight}
                        </span>
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0,
                        fontSize: 15, fontWeight: 800, color: mColor(r.m) }}>
                        <span style={{ width: 22, height: 22, borderRadius: 999, background: mColor(r.m),
                          display: "grid", placeItems: "center" }}>
                          <Check style={{ width: 12, height: 12, color: "#fff" }} strokeWidth={3} />
                        </span>
                        {r.m}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", maxWidth: 760, margin: "30px auto 0",
        fontSize: 12.5, color: "#9a90b8", background: "transparent", border: "none",
        borderRadius: 14, padding: "13px 16px" }}>
        <AlertCircle style={{ width: 15, height: 15, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
        <span>{schoolObj?.note}. Always confirm availability, eligibility & credit with the study-abroad office before applying.</span>
      </div>
    </Wrap>
  );
}
