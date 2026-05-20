import React from "react";
import { VOICES } from "../data/voices.js";
import { VoiceColumn } from "./VoiceCard.jsx";

export function TestimonialsMarquee() {
  const colA = VOICES.slice(0, 2);
  const colB = VOICES.slice(2, 4);
  const colC = VOICES.slice(4, 6);
  return (
    <section style={{ position: "relative", maxWidth: 1180, margin: "0 auto 40px", padding: "0 28px" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <h2 className="ser" style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 600,
          color: "#1c1830", letterSpacing: "-.02em" }}>How students are using Peel</h2>
        <p className="san" style={{ fontSize: 14, color: "#7e96b4", marginTop: 8 }}>
          Representative student accounts across the 5C consortium.
        </p>
      </div>
      <div style={{ display: "flex", gap: 24, height: 520, overflow: "hidden",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
        maskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)" }}>
        <VoiceColumn items={colA} duration={34} delay={0} />
        <VoiceColumn items={colB} duration={42} delay={-12} className="hide-md" />
        <VoiceColumn items={colC} duration={38} delay={-22} className="hide-lg" />
      </div>
    </section>
  );
}
