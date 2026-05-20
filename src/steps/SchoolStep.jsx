import React, { useState, useRef, useEffect } from "react";
import { Search, AlertCircle, BadgeCheck, School, ArrowRight } from "lucide-react";

import { SCHOOLS } from "../data/options.js";
import { INK, CTA, CARD } from "../theme/colors.js";
import { Wrap } from "../components/Wrap.jsx";
import { StepHead } from "../components/StepHead.jsx";

export function SchoolStep({ school, setSchool, query, setQuery, setStep, restart, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const boxRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => { onOpenChange && onOpenChange(open); }, [open, onOpenChange]);

  const schoolObj = SCHOOLS.find((s) => s.id === school);
  const matches = query.trim()
    ? SCHOOLS.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
        .sort((a, b) => {
          const q = query.trim().toLowerCase();
          return (a.name.toLowerCase().startsWith(q) ? 0 : 1) - (b.name.toLowerCase().startsWith(q) ? 0 : 1) || a.name.localeCompare(b.name);
        })
    : SCHOOLS;

  const pickSchool = (s) => { setSchool(s.id); setQuery(s.name); setOpen(false); };
  const onKey = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => Math.min(h + 1, matches.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
    else if (e.key === "Enter" && matches[hi]) { e.preventDefault(); pickSchool(matches[hi]); }
    else if (e.key === "Escape") setOpen(false);
  };
  const hl = (name) => {
    const q = query.trim(); if (!q) return name;
    const i = name.toLowerCase().indexOf(q.toLowerCase()); if (i === -1) return name;
    return (<>{name.slice(0, i)}<mark style={{ background: "rgba(78,168,255,.3)", color: INK, borderRadius: 3 }}>{name.slice(i, i + q.length)}</mark>{name.slice(i + q.length)}</>);
  };

  return (
    <Wrap narrow>
      <StepHead kicker={<><School style={{ width: 13, height: 13 }} /> Step 1</>}
        title="Which Claremont College?"
        back={restart} />
      <div className="fl" style={{ animationDelay: ".24s" }}>
        <div ref={boxRef} style={{ position: "relative" }}>
          <div style={{ ...CARD, background: "#ffffff", backdropFilter: "none", display: "flex", alignItems: "center", gap: 12, padding: "6px 18px", borderRadius: 20,
            boxShadow: open ? "0 0 0 3px rgba(124,77,255,.35), 0 24px 60px -18px rgba(60,40,110,.35)" : CARD.boxShadow }}>
            <Search style={{ width: 20, height: 20, color: "#6b82a4", flexShrink: 0 }} />
            <input value={query}
              onChange={(e) => { setQuery(e.target.value); setSchool(""); setOpen(true); setHi(0); }}
              onFocus={() => { if (school) { setQuery(""); setSchool(""); } setHi(0); setOpen(true); }}
              onKeyDown={onKey}
              placeholder="Pomona, CMC, Pitzer, Scripps, Harvey Mudd…"
              className="san" style={{ flex: 1, background: "none", border: "none", outline: "none", padding: "16px 0", fontSize: 15, fontWeight: 600, color: INK }} />
          </div>
          {open && (
            <div className="fad scl" style={{ position: "absolute", zIndex: 1000, top: "calc(100% + 10px)", left: 0, right: 0,
              background: "#ffffff", border: "1px solid #ece7f7",
              borderRadius: 20, overflow: "hidden", maxHeight: 320, overflowY: "auto",
              boxShadow: "0 24px 60px -18px rgba(60,40,110,.45)" }}>
              {matches.length === 0 ? (
                <div style={{ padding: "20px 22px", fontSize: 14, color: "#7e96b4", display: "flex", gap: 9, alignItems: "center", background: "#ffffff" }}>
                  <AlertCircle style={{ width: 16, height: 16, color: "#4ea8ff" }} /> Only the five Claremont colleges are covered here.
                </div>
              ) : matches.map((s, idx) => (
                <button key={s.id} onMouseEnter={() => setHi(idx)} onClick={() => pickSchool(s)}
                  style={{ width: "100%", textAlign: "left", padding: "15px 20px", display: "flex", alignItems: "center", gap: 13,
                    background: idx === hi ? "#eef0ff" : "#ffffff", border: "none",
                    borderBottom: "1px solid #ece7f7", cursor: "pointer" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(78,168,255,.16)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <School style={{ width: 16, height: 16, color: "#9d7bff" }} />
                  </div>
                  <span className="san" style={{ fontSize: 15, fontWeight: 600, color: INK }}>{hl(s.name)}</span>
                  <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 999,
                    background: "transparent",
                    color: s.live ? "#16a34a" : "#9d7bff" }}>
                    <BadgeCheck style={{ width: 12, height: 12 }} /> {s.live ? "Live data" : "Snapshot"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        {schoolObj && (
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: "#7e96b4",
            background: "transparent", border: "none", borderRadius: 14, padding: "13px 16px", marginTop: 16 }}>
            <AlertCircle style={{ width: 15, height: 15, color: "#4ea8ff", flexShrink: 0, marginTop: 1 }} />
            <span>{schoolObj.note}.</span>
          </div>
        )}
        <button disabled={!schoolObj} onClick={() => setStep("major")} className="pressable"
          style={{ ...CTA, width: "100%", marginTop: 22, opacity: schoolObj ? 1 : .4, cursor: schoolObj ? "pointer" : "not-allowed" }}>
          Continue <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </Wrap>
  );
}

