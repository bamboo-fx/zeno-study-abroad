import React from "react";
import { GraduationCap, AlertCircle } from "lucide-react";

import { MAJORS } from "../data/options.js";
import { Wrap } from "../components/Wrap.jsx";
import { StepHead } from "../components/StepHead.jsx";
import { Tilt } from "../components/Tilt.jsx";

export function MajorStep({ major, setMajor, setStep }) {
  return (
    <Wrap>
      <StepHead kicker={<><GraduationCap style={{ width: 13, height: 13 }} /> Step 2</>}
        title="What's your major?"
        back={() => setStep("school")} />
      <p style={{ textAlign: "center", color: "#7e96b4", fontSize: 14.5, margin: "-6px 0 26px" }}>
        Your field shapes which programs fit best — finance & econ lean toward business-school partners, STEM toward research universities, and so on.
      </p>
      <div className="vibegrid">
        {MAJORS.map((mj, i) => {
          const on = major === mj.id; const Icon = mj.icon;
          return (
            <Tilt key={mj.id} max={10} className="fl" style={{ animationDelay: `${.1 + i * .035}s`, borderRadius: 18 }}
              onClick={() => { setMajor(mj.id); setStep("continent"); }}>
              <div style={{ position: "relative", minHeight: 132, borderRadius: 18, overflow: "hidden", cursor: "pointer",
                background: "#fff", border: on ? "2px solid #7c4dff" : "1px solid #ece7f7",
                boxShadow: on ? "0 24px 44px -22px rgba(124,77,255,.5)" : "0 16px 32px -22px rgba(60,40,110,.4)",
                padding: "20px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: "linear-gradient(135deg,#4ea8ff,#9d7bff)", display: "grid", placeItems: "center" }}>
                  <Icon style={{ width: 19, height: 19, color: "#fff" }} />
                </div>
                <div className="ser" style={{ fontSize: 17, fontWeight: 600, color: "#1c1830", marginTop: 4 }}>{mj.label}</div>
                <div style={{ fontSize: 12.5, color: "#9a90b8" }}>{mj.sub}</div>
              </div>
            </Tilt>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", maxWidth: 620, margin: "26px auto 0",
        fontSize: 12, color: "#9a90b8" }}>
        <AlertCircle style={{ width: 14, height: 14, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
        <span>Major-based fit is a guidance heuristic to surface relevant programs first — it does not replace your study-abroad office's official eligibility rules. Always confirm a program accepts your major.</span>
      </div>
    </Wrap>
  );
}
