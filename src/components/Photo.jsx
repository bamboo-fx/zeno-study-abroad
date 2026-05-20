import React, { useState } from "react";

export function Photo({ city, country, grad, photo, h = 200, round = 22, hideLabel = false }) {
  const [ok, setOk] = useState(false);
  return (
    <div style={{ position: "relative", height: h, borderRadius: round, overflow: "hidden", background: grad }}>
      {photo && (
        <img src={photo} alt={`${city}, ${country}`} onLoad={() => setOk(true)} onError={() => setOk(false)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: ok ? 1 : 0, transition: "opacity .6s" }} />
      )}
      {!hideLabel && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(124,77,255,.06) 0%,rgba(28,26,23,.5) 100%)" }} />
      )}
      {!hideLabel && (
        <div style={{ position: "absolute", left: 20, bottom: 16, display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 26, color: "#fff", textShadow: "0 2px 18px rgba(0,0,0,.45)" }}>{city}</span>
          <span style={{ color: "rgba(255,255,255,.82)", fontSize: 13 }}>{country}</span>
        </div>
      )}
    </div>
  );
}
