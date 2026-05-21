import React, { useState, useEffect } from "react";
import { fetchCityPhoto, fetchCityPhotos } from "../data/cityPhoto.js";

export function Photo({ city, country, grad, photo, h = 200, round = 22, hideLabel = false, fit = "cover", cycle = false, cycleMs = 4500 }) {
  const [src, setSrc] = useState(photo || null);
  const [prevSrc, setPrevSrc] = useState(null);
  const [ok, setOk] = useState(false);
  const [pool, setPool] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photo) { setSrc(photo); return; }
    let alive = true;
    if (cycle) {
      fetchCityPhotos(city, country).then((urls) => {
        if (!alive) return;
        if (urls && urls.length) { setPool(urls); setSrc(urls[0]); setIdx(0); }
        else fetchCityPhoto(city, country).then((u) => { if (alive && u) setSrc(u); });
      });
    } else {
      fetchCityPhoto(city, country).then((url) => { if (alive && url) setSrc(url); });
    }
    return () => { alive = false; };
  }, [photo, city, country, cycle]);

  useEffect(() => {
    if (!cycle || pool.length < 2) return;
    const id = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % pool.length;
        setPrevSrc(pool[i]);
        setSrc(pool[next]);
        setOk(false);
        return next;
      });
    }, cycleMs);
    return () => clearInterval(id);
  }, [cycle, cycleMs, pool]);

  return (
    <div style={{ position: "relative", height: h, borderRadius: round, overflow: "hidden", background: grad }}>
      {prevSrc && (
        <img src={prevSrc} alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit,
            opacity: ok ? 0 : 1, transition: "opacity 1s ease" }} />
      )}
      {src && (
        <img src={src} alt={`${city}, ${country}`} onLoad={() => setOk(true)} onError={() => setOk(false)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit,
            opacity: ok ? 1 : 0, transition: "opacity 1s ease" }} />
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
