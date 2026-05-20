import React, { useState, useEffect } from "react";
import { UNSPLASH_KEY } from "../config.js";

export function Photo({ city, country, grad, h = 200, round = 22, hideLabel = false }) {
  const [src, setSrc] = useState(null);
  const [st, setSt] = useState("idle");
  const hasKey = UNSPLASH_KEY && UNSPLASH_KEY !== "PASTE_KEY_HERE";

  useEffect(() => {
    if (!hasKey) return;
    let alive = true;
    const q = encodeURIComponent(`${city} ${country} city`);
    fetch(`https://api.unsplash.com/search/photos?query=${q}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const url = d && d.results && d.results[0] && d.results[0].urls && d.results[0].urls.regular;
        if (alive && url) { setSrc(url); } else if (alive) { setSt("fail"); }
      })
      .catch(() => { if (alive) setSt("fail"); });
    return () => { alive = false; };
  }, [city, country, hasKey]);

  return (
    <div style={{ position: "relative", height: h, borderRadius: round, overflow: "hidden", background: grad }}>
      {src && st !== "fail" && (
        <img src={src} alt={`${city}, ${country}`} onLoad={() => setSt("ok")} onError={() => setSt("fail")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: st === "ok" ? 1 : 0, transition: "opacity .6s" }} />
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
