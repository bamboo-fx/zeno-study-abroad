import React from "react";
import { ChevronLeft } from "lucide-react";
import { Pill } from "./Pill.jsx";

export function StepHead({ kicker, title, sub, back }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 44px" }}>
      {back && (
        <button onClick={back} className="pressable" style={{ display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "#7e96b4", background: "none", border: "none", cursor: "pointer", marginBottom: 22 }}>
          <ChevronLeft style={{ width: 15, height: 15 }} /> Back
        </button>
      )}
      <div className="fl"><Pill>{kicker}</Pill></div>
      <h2 className="ser fl" style={{ animationDelay: ".08s", fontSize: "clamp(34px,5vw,54px)", fontWeight: 600,
        letterSpacing: "-.025em", margin: "20px 0 0", lineHeight: 1.08 }}>{title}</h2>
      {sub && <p className="fl" style={{ animationDelay: ".16s", color: "#9fb3cf", fontSize: 16, margin: "16px 0 0", lineHeight: 1.55 }}>{sub}</p>}
    </div>
  );
}
