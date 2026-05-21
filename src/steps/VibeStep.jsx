import React from "react";
import { ChevronLeft, Globe, MapPin, Sparkles, Send, BadgeCheck, ArrowRight, Check } from "lucide-react";

import { VIBES, VIBE_PHOTO_BY_REGION } from "../data/options.js";
import { INK, CTA } from "../theme/colors.js";
import { Wrap } from "../components/Wrap.jsx";
import { Tilt } from "../components/Tilt.jsx";
import { TileBgPhoto } from "../components/TileBgPhoto.jsx";

export function VibeStep({
  selected, toggleVibe, setStep, findFromSelected,
  contGrad, contLabel, continent, schoolObj,
  chatInput, setChatInput, chatNote, setChatNote, submitChat,
  cityPreview,
}) {
  const regionMap = (continent && continent !== "any") ? (VIBE_PHOTO_BY_REGION[continent] || {}) : {};
  const photoFor = (v) => regionMap[v.id] || v.photoQ;
  return (
    <Wrap>
      <button onClick={() => setStep("continent")} className="pressable"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#7e96b4",
          background: "none", border: "none", cursor: "pointer", marginBottom: 18 }}>
        <ChevronLeft style={{ width: 15, height: 15 }} /> Back
      </button>
      <div className="flyin" style={{ position: "relative", overflow: "hidden", borderRadius: 20, marginBottom: 20,
        background: contGrad || "linear-gradient(135deg,#b794f6 0%,#7c4dff 60%,#5a3aa8 100%)",
        boxShadow: "0 22px 44px -26px rgba(60,40,110,.45)" }}>
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(180deg,rgba(0,0,0,.05) 0%,transparent 40%,rgba(0,0,0,.4) 100%)" }} />
        <div style={{ position: "relative", padding: "22px 26px 22px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 10,
            fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "#fff",
            background: "rgba(255,255,255,.18)", borderRadius: 999, padding: "5px 12px" }}>
            <Globe style={{ width: 11, height: 11 }} /> {contLabel ? "Arrived in " + contLabel : "A world mix"}
          </div>
          <h2 className="ser" style={{ fontSize: "clamp(24px,3.2vw,34px)", fontWeight: 600,
            color: "#fff", margin: "10px 0 0", letterSpacing: "-.02em",
            textShadow: "0 2px 20px rgba(0,0,0,.3)" }}>
            {contLabel || "A world mix"}
          </h2>
          <p style={{ color: "rgba(255,255,255,.88)", fontSize: 13, marginTop: 7, maxWidth: 420, lineHeight: 1.45 }}>
            {contLabel
              ? `Real ${schoolObj?.name} programs across ${contLabel}. Pick the vibe you want there.`
              : `A global mix of real ${schoolObj?.name} programs. Pick the vibe you want.`}
          </p>
        </div>
      </div>

      <div className="flyin-soft" style={{ textAlign: "center", marginBottom: 16 }}>
        <h3 className="ser" style={{ fontSize: "clamp(20px,2.8vw,28px)", fontWeight: 600, letterSpacing: "-.02em" }}>
          Which of these is you?
        </h3>
        <p style={{ color: "#7e96b4", fontSize: 13, marginTop: 6 }}>
          Tap any that fit — or describe it below.
        </p>
      </div>
      <div className="vibegrid">
        {VIBES.map((v, i) => {
          const on = selected.includes(v.id); const Icon = v.icon;
          return (
            <Tilt key={v.id} max={10} className="fl" style={{ animationDelay: `${.12 + i * .035}s`, borderRadius: 18 }}
              onClick={() => toggleVibe(v.id)}>
              <div style={{ position: "relative", height: 148, borderRadius: 18, overflow: "hidden", cursor: "pointer",
                boxShadow: on ? "0 0 0 3px #4ea8ff, 0 20px 38px -20px rgba(0,0,0,.55)" : "0 16px 32px -20px rgba(0,0,0,.5)" }}>
                <div style={{ position: "absolute", inset: 0, background: v.grad }} />
                <TileBgPhoto query={photoFor(v)} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.22) 0%,rgba(0,0,0,.05) 38%,rgba(0,0,0,.72) 100%)" }} />
                <Icon style={{ position: "absolute", top: 13, left: 13, width: 21, height: 21, color: "rgba(255,255,255,.92)" }} />
                {on && <div style={{ position: "absolute", top: 11, right: 11, width: 24, height: 24, borderRadius: 999,
                  background: "linear-gradient(135deg,#4ea8ff,#9d7bff)", display: "grid", placeItems: "center" }}><Check style={{ width: 14, height: 14, color: "#06121f" }} strokeWidth={3} /></div>}
                <div style={{ position: "absolute", left: 15, right: 15, bottom: 13 }}>
                  <div className="ser" style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>{v.label}</div>
                  <div style={{ color: "rgba(255,255,255,.78)", fontSize: 11.5, marginTop: 1 }}>{v.sub}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 7, color: "rgba(255,255,255,.85)", fontSize: 10.5 }}>
                    <MapPin style={{ width: 11, height: 11 }} /> {cityPreview(v.id)}
                  </div>
                </div>
              </div>
            </Tilt>
          );
        })}
      </div>

      <div className="fl" style={{ marginTop: 22, animationDelay: ".5s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
          fontSize: 12.5, color: "#9a90b8", marginBottom: 10 }}>
          <Sparkles style={{ width: 14, height: 14, color: "#9d6bff" }} />
          <span>Or just describe what you want</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", maxWidth: 560, margin: "0 auto" }}>
          <input value={chatInput} onChange={(e) => { setChatInput(e.target.value); setChatNote(""); }}
            onKeyDown={(e) => e.key === "Enter" && submitChat()}
            placeholder="historic, walkable, great coffee…"
            className="san" style={{ flex: 1, background: "transparent",
              border: "none", borderBottom: "1.5px solid #d8cdf2",
              borderRadius: 0, padding: "10px 2px", fontSize: 14, color: INK, outline: "none" }} />
          <button onClick={submitChat} className="pressable"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent",
              border: "1px solid #d8cdf2", color: "#7c4dff", fontWeight: 700, fontSize: 13,
              borderRadius: 999, padding: "9px 18px", cursor: "pointer" }}>
            <Send style={{ width: 14, height: 14 }} /> Go
          </button>
        </div>
        {chatNote && <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#7c4dff",
          display: "flex", gap: 7, alignItems: "center", justifyContent: "center" }}>
          <BadgeCheck style={{ width: 14, height: 14 }} /> {chatNote}</div>}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
        <button disabled={selected.length === 0} onClick={findFromSelected} className="pressable"
          style={{ ...CTA, opacity: selected.length ? 1 : .4, cursor: selected.length ? "pointer" : "not-allowed" }}>
          Find my destinations <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </Wrap>
  );
}
