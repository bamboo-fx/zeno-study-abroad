import React, { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";

// 3D ring carousel of continent cards. Pure CSS 3D (no WebGL/CDN).
// Rotates CONTINUOUSLY and smoothly via requestAnimationFrame — cards flow
// around a 3D ring with no index snapping or stops. Transforms are written
// straight to the DOM through refs, so the spin never re-renders React.
// Hover eases the speed down (not a hard stop). Click the front card to pick.
export function Coverflow({ items, onPick, grads }) {
  const cardRefs = useRef([]);
  const wrapRef = useRef(null);
  const angleRef = useRef(0);          // live rotation, radians
  const speedRef = useRef(0.0065);     // current angular speed/frame (free-spin)
  const hoverRef = useRef(false);      // is the cursor over the carousel
  const snapRef = useRef(null);        // target angle to settle on (detent), or null
  const dirRef = useRef(0);            // last cursor direction (-1 / 0 / +1)
  const lastStepRef = useRef(0);       // throttle: time of last detent advance
  const frontRef = useRef(0);
  const [front, setFront] = useState(0);

  const AUTO = 0.0034;   // gentle idle free-spin speed (slow)

  // Cursor X -> a direction. Left half spins one way, right half the other.
  // Instead of a continuous speed, we advance ONE card at a time and rest on it.
  const onMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rel = (e.clientX - r.left) / r.width;    // 0 (left) .. 1 (right)
    const t = (rel - 0.5) * 2;                      // -1 .. +1
    dirRef.current = Math.abs(t) < 0.12 ? 0 : (t > 0 ? 1 : -1);
  };
  const onEnter = () => { hoverRef.current = true; };
  const onLeave = () => {
    hoverRef.current = false;
    snapRef.current = null;
    dirRef.current = 0;
  };

  useEffect(() => {
    const n = items.length;
    const step = (2 * Math.PI) / n;
    const radius = 230;
    let raf;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);

      if (hoverRef.current) {
        // ---- cursor control: notch to one card at a time, then rest ----
        if (snapRef.current === null) {
          // settle to the nearest card notch first
          snapRef.current = Math.round(angleRef.current / step) * step;
        }
        // if the cursor is pushing left/right, advance exactly one notch,
        // but throttle so it pauses on each card (a little "rigid")
        if (dirRef.current !== 0 && now - lastStepRef.current > 1600) {
          snapRef.current += dirRef.current * step;
          lastStepRef.current = now;
        }
        // ease toward the target notch and stop there
        angleRef.current += (snapRef.current - angleRef.current) * 0.07;
      } else {
        // ---- no cursor: continuous gentle auto-spin ----
        snapRef.current = null;
        angleRef.current += AUTO;
      }

      let bestI = 0, bestZ = -Infinity;
      for (let i = 0; i < n; i++) {
        const a = angleRef.current + i * step;
        const x = Math.sin(a) * radius;
        const z = Math.cos(a) * radius;
        const ry = -a * (180 / Math.PI);
        const depth = (z + radius) / (2 * radius);
        const el = cardRefs.current[i];
        if (el) {
          el.style.transform =
            `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${0.7 + depth * 0.3})`;
          el.style.opacity = String(0.35 + depth * 0.65);
          el.style.zIndex = String(Math.round(depth * 100));
          el.style.filter = depth > 0.92 ? "none" : `saturate(${0.7 + depth * 0.3})`;
        }
        if (z > bestZ) { bestZ = z; bestI = i; }
      }
      if (bestI !== frontRef.current) { frontRef.current = bestI; setFront(bestI); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items.length]);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ position: "relative", height: 360, perspective: 1500, width: "100%",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: "100%", height: 300, transformStyle: "preserve-3d" }}>
        {items.map((c, i) => {
          const Icon = c.icon;
          const isFront = i === front;
          return (
            <div
              key={c.id}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => (isFront ? onPick(c.id) : null)}
              style={{
                position: "absolute", top: "50%", left: "50%",
                width: 232, height: 290, cursor: "pointer",
                transform: "translate(-50%,-50%)",
                willChange: "transform, opacity",
                borderRadius: 22, overflow: "hidden",
                background: grads[c.id] || "linear-gradient(135deg,#b794f6,#7c4dff)",
                boxShadow: "0 24px 56px -22px rgba(60,40,110,.45)",
                border: "1px solid rgba(255,255,255,.5)",
              }}>
              <div style={{ position: "absolute", inset: 0,
                background: "linear-gradient(180deg,rgba(0,0,0,.06) 0%,transparent 35%,rgba(0,0,0,.55) 100%)" }} />
              <div style={{ position: "absolute", top: 22, left: 22,
                width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,.22)",
                backdropFilter: "blur(4px)", display: "grid", placeItems: "center" }}>
                <Icon style={{ width: 24, height: 24, color: "#fff" }} />
              </div>
              <div style={{ position: "absolute", left: 22, right: 22, bottom: 22 }}>
                <div className="ser" style={{ color: "#fff", fontSize: 26, fontWeight: 600,
                  letterSpacing: "-.02em", textShadow: "0 2px 16px rgba(0,0,0,.4)" }}>{c.label}</div>
                <div style={{ color: "rgba(255,255,255,.82)", fontSize: 12.5, marginTop: 4 }}>{c.sub}</div>
                <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 7,
                  background: "#fff", color: "#5a3aa8", fontWeight: 700, fontSize: 12,
                  padding: "8px 14px", borderRadius: 999,
                  opacity: isFront ? 1 : 0, transition: "opacity .5s var(--ease)" }}>
                  Choose <ArrowRight style={{ width: 13, height: 13 }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
