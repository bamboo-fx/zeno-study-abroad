import React, { useState } from "react";
import { BookOpen, AlertCircle, ArrowRight, Check } from "lucide-react";

import { Wrap } from "../components/Wrap.jsx";
import { StepHead } from "../components/StepHead.jsx";
import { CTA } from "../theme/colors.js";

const REQ_TYPES = [
  { id: "major-req", label: "Major requirement", sub: "A required course in your major." },
  { id: "major-seq", label: "Major sequence / elective", sub: "An upper-division or elective inside your major." },
  { id: "ge", label: "GE requirement", sub: "General education — writing, area, foreign language, etc." },
  { id: "language", label: "Language requirement", sub: "Continuing or fulfilling a language sequence." },
  { id: "elective", label: "Free elective", sub: "Any credit toward graduation — flexible." },
];

export function CourseStep({ courseReq, setCourseReq, setStep }) {
  const initial = Array.isArray(courseReq?.types)
    ? courseReq.types
    : (courseReq?.type ? [courseReq.type] : []);
  const [types, setTypes] = useState(initial);

  const toggle = (id) => setTypes((arr) => arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  const canContinue = types.length > 0;

  const onContinue = () => {
    if (!canContinue) return;
    setCourseReq({ types });
    setStep("continent");
  };

  return (
    <Wrap narrow>
      <StepHead
        kicker={<><BookOpen style={{ width: 13, height: 13 }} /> Step 4</>}
        title="What are you trying to fulfill abroad?"
        sub="Pick any that apply — you can stack a GE, a major requirement, and a free elective."
        back={() => setStep("profile")}
      />

      <div style={{ display: "grid", gap: 10, maxWidth: 620, margin: "0 auto" }}>
        {REQ_TYPES.map((r, i) => {
          const on = types.includes(r.id);
          return (
            <button key={r.id} onClick={() => toggle(r.id)} className="pressable fl"
              style={{ animationDelay: `${.05 + i * .04}s`, textAlign: "left", cursor: "pointer",
                padding: "16px 18px", borderRadius: 14,
                background: "#fff",
                border: on ? "2px solid #7c4dff" : "1px solid #ece7f7",
                boxShadow: on ? "0 24px 44px -22px rgba(124,77,255,.45)" : "0 12px 28px -22px rgba(60,40,110,.3)",
                display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: on ? "#7c4dff" : "#fff",
                border: on ? "2px solid #7c4dff" : "2px solid #d8d0ee",
                display: "grid", placeItems: "center", transition: "background .15s" }}>
                {on && <Check style={{ width: 14, height: 14, color: "#fff" }} strokeWidth={3} />}
              </div>
              <div style={{ flex: 1 }}>
                <div className="ser" style={{ fontSize: 16, fontWeight: 600, color: "#1c1830" }}>{r.label}</div>
                <div style={{ fontSize: 12.5, color: "#9a90b8", marginTop: 2 }}>{r.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
        <button className="pressable" disabled={!canContinue} onClick={onContinue}
          style={{ ...CTA, opacity: canContinue ? 1 : .5, cursor: canContinue ? "pointer" : "not-allowed" }}>
          Continue <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", maxWidth: 620, margin: "26px auto 0",
        fontSize: 12, color: "#9a90b8" }}>
        <AlertCircle style={{ width: 14, height: 14, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
        <span>Credit transfer is approved by your home registrar — Peel surfaces likely fits but every course must be cleared through your school's official process.</span>
      </div>
    </Wrap>
  );
}
