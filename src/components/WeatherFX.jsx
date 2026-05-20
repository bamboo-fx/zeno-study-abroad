import React from "react";
import { Leaf, CloudSnow, Snowflake, CloudRain, Sun } from "lucide-react";

// Maps each season to a visual "mood": background wash, accent, glow and an
// animated effect. Reads BOTH the icon and the condition text so specific
// scenes (cherry blossom, autumn foliage, heatwave) get their own effect.
export function weatherMood(icon, desc = "") {
  const d = desc.toLowerCase();
  const FG = "#1c1830", SUB = "#6b6090";
  // cherry blossom / bloom — petals drifting down
  if (d.includes("blossom") || d.includes("cherry") || d.includes("bloom"))
    return { key: "petal", fg: FG, sub: SUB,
      bg: "linear-gradient(150deg,#fdeef6 0%,#f5eefb 55%,#eef0fb 100%)",
      accent: "#d6457f", glow: "rgba(214,69,127,.28)", chip: "rgba(214,69,127,.12)" };
  // autumn foliage — tumbling leaves
  if (d.includes("foliage") || d.includes("autumn") || (icon === Leaf))
    return { key: "leaf", fg: FG, sub: SUB,
      bg: "linear-gradient(150deg,#fdf0e4 0%,#f6eef9 55%,#eef0fb 100%)",
      accent: "#d97706", glow: "rgba(217,119,6,.26)", chip: "rgba(217,119,6,.12)" };
  // snow / freezing
  if (icon === CloudSnow || icon === Snowflake || d.includes("snow"))
    return { key: "snow", fg: FG, sub: SUB,
      bg: "linear-gradient(150deg,#eaf4fc 0%,#eef1fb 55%,#f1f0fb 100%)",
      accent: "#2f86c4", glow: "rgba(47,134,196,.24)", chip: "rgba(47,134,196,.12)" };
  // heavy / monsoon / storm rain
  if (d.includes("monsoon") || d.includes("downpour") || d.includes("storm"))
    return { key: "storm", fg: FG, sub: SUB,
      bg: "linear-gradient(150deg,#e7eef8 0%,#e9ecf7 55%,#edeef9 100%)",
      accent: "#3f6fb0", glow: "rgba(63,111,176,.26)", chip: "rgba(63,111,176,.12)" };
  // regular rain / showers
  if (icon === CloudRain || d.includes("rain") || d.includes("shower"))
    return { key: "rain", fg: FG, sub: SUB,
      bg: "linear-gradient(150deg,#e9f2fb 0%,#ecedf8 55%,#eff0fb 100%)",
      accent: "#3a86c8", glow: "rgba(58,134,200,.24)", chip: "rgba(58,134,200,.12)" };
  // hot & dry heatwave
  if (d.includes("hot") || d.includes("intense"))
    return { key: "heat", fg: FG, sub: SUB,
      bg: "linear-gradient(150deg,#fdeede 0%,#faeef2 55%,#f0eefb 100%)",
      accent: "#e0731f", glow: "rgba(224,115,31,.3)", chip: "rgba(224,115,31,.13)" };
  // bright sun / clear
  if (icon === Sun || d.includes("sunny") || d.includes("clear"))
    return { key: "sun", fg: FG, sub: SUB,
      bg: "linear-gradient(150deg,#fdf4dd 0%,#f6eff4 55%,#eef0fb 100%)",
      accent: "#d39e00", glow: "rgba(211,158,0,.28)", chip: "rgba(211,158,0,.13)" };
  // cloud / overcast
  return { key: "cloud", fg: FG, sub: SUB,
    bg: "linear-gradient(150deg,#eef1f6 0%,#edeef6 55%,#f0f0f8 100%)",
    accent: "#5b7390", glow: "rgba(91,115,144,.24)", chip: "rgba(91,115,144,.12)" };
}

// Animated weather effect layer (CSS-only, no React state — perf-safe).
const fxWrap = { position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: "inherit" };
export function WeatherFX({ kind, accent }) {
  if (kind === "petal") {
    const petals = Array.from({ length: 22 });
    return (
      <div style={fxWrap}>
        {petals.map((_, i) => (
          <span key={i} style={{ position: "absolute", top: "-10%",
            left: `${(i * 4.6) % 100}%`, width: 10, height: 8,
            background: i % 3 ? accent : "#ffd1e8",
            borderRadius: "100% 0 100% 0", opacity: 0.85,
            animation: `wfx-petal ${6 + (i % 5) * 1.3}s linear ${(i % 7) * 0.6}s infinite` }} />
        ))}
        <div style={{ position: "absolute", top: -70, left: -50, width: 220, height: 220, borderRadius: 999,
          background: `radial-gradient(circle, ${accent}33 0%, transparent 65%)` }} />
      </div>
    );
  }
  if (kind === "rain" || kind === "storm") {
    const n = kind === "storm" ? 60 : 38;
    const drops = Array.from({ length: n });
    return (
      <div style={fxWrap}>
        {drops.map((_, i) => (
          <span key={i} style={{ position: "absolute", top: "-25%",
            left: `${(i * (100 / n)) % 100}%`, width: kind === "storm" ? 2 : 1.5,
            height: kind === "storm" ? 30 : 22,
            background: `linear-gradient(${accent},transparent)`,
            opacity: kind === "storm" ? 0.6 : 0.45,
            transform: kind === "storm" ? "rotate(12deg)" : "none",
            animation: `wfx-rain ${(kind === "storm" ? 0.45 : 0.7) + (i % 5) * 0.14}s linear ${(i % 9) * 0.1}s infinite` }} />
        ))}
        {kind === "storm" && (
          <div style={{ position: "absolute", inset: 0, background: "#bcd6ff",
            opacity: 0, animation: "wfx-flash 6s steps(1) 2s infinite" }} />
        )}
      </div>
    );
  }
  if (kind === "snow") {
    const flakes = Array.from({ length: 30 });
    return (
      <div style={fxWrap}>
        {flakes.map((_, i) => (
          <span key={i} style={{ position: "absolute", top: "-10%",
            left: `${(i * 3.4) % 100}%`, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2,
            borderRadius: 999, background: accent, opacity: 0.75,
            filter: "blur(.3px)",
            animation: `wfx-snow ${4 + (i % 5)}s linear ${(i % 6) * 0.5}s infinite` }} />
        ))}
      </div>
    );
  }
  if (kind === "leaf") {
    const leaves = Array.from({ length: 20 });
    const tones = [accent, "#e8915a", "#d9a441", "#c96f3a"];
    return (
      <div style={fxWrap}>
        {leaves.map((_, i) => (
          <span key={i} style={{ position: "absolute", top: "-10%",
            left: `${(i * 5.2) % 100}%`, width: 9, height: 9,
            background: tones[i % tones.length],
            borderRadius: "0 70% 0 70%", opacity: 0.7,
            animation: `wfx-leaf ${5 + (i % 4) * 1.5}s linear ${(i % 6) * 0.7}s infinite` }} />
        ))}
      </div>
    );
  }
  if (kind === "sun" || kind === "heat") {
    const rays = kind === "sun";
    return (
      <div style={fxWrap}>
        <div style={{ position: "absolute", top: -100, right: -70, width: 300, height: 300, borderRadius: 999,
          background: `radial-gradient(circle, ${accent}66 0%, transparent 65%)`,
          animation: "wfx-pulse 5s ease-in-out infinite" }} />
        {rays && Array.from({ length: 7 }).map((_, i) => (
          <span key={i} style={{ position: "absolute", top: 30, right: 70, width: 2, height: 130,
            transformOrigin: "top center", background: `linear-gradient(${accent}88,transparent)`,
            transform: `rotate(${i * 26 - 20}deg)`, opacity: 0.4,
            animation: `wfx-pulse ${4 + i * 0.3}s ease-in-out infinite` }} />
        ))}
        {kind === "heat" && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: `${i * 14}%`, height: 30,
            background: `linear-gradient(transparent, ${accent}14, transparent)`,
            animation: `wfx-shimmer ${3 + i}s ease-in-out ${i * 0.4}s infinite` }} />
        ))}
      </div>
    );
  }
  // cloud / overcast — slow drifting soft clouds
  return (
    <div style={fxWrap}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", top: `${8 + i * 20}%`, left: "-45%",
          width: 200 + i * 40, height: 54, borderRadius: 999,
          background: `${accent}22`, filter: "blur(16px)",
          animation: `wfx-drift ${20 + i * 8}s linear ${i * 3.5}s infinite` }} />
      ))}
    </div>
  );
}
