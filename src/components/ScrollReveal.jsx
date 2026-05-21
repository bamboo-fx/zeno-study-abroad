import React from "react";

// Scroll-driven 3D tilt-to-flat reveal — native, no framer-motion.
// Uses requestAnimationFrame + a ref-based transform so it never re-renders.
export function ScrollReveal({ title, children }) {
  const wrapRef = React.useRef(null);
  const cardRef = React.useRef(null);
  const headRef = React.useRef(null);
  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = wrapRef.current;
      if (!el || !cardRef.current) { raf = requestAnimationFrame(tick); return; }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // raw progress 0 → 1 as the section travels through the viewport
      const raw = Math.max(0, Math.min(1, 1 - (r.bottom - vh * 0.4) / (r.height * 1.0)));
      // finish the tilt-to-flat motion at ~55% of section progress —
      // the remaining ~45% is a "dwell" zone where the card is fully straight,
      // so the user can scroll and actually SEE the flat dashboard before it leaves.
      // If a programmatic scroll has set window.__peelForceFlat, lock to p=1.
      const p = window.__peelForceFlat ? 1 : Math.min(1, raw / 0.55);
      const rot = 24 - 24 * p;                // 24° → 0°
      const scl = 0.92 + 0.08 * p;            // 0.92 → 1
      const ty = -40 * p;                      // gentle header rise, keeps title on screen
      cardRef.current.style.transform = `perspective(1200px) rotateX(${rot}deg) scale(${scl})`;
      if (headRef.current) headRef.current.style.transform = `translateY(${ty}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section id="peel-preview" ref={wrapRef} style={{ position: "relative", maxWidth: 1300, margin: "0 auto",
      padding: "60px 28px 140px" }}>
      <div ref={headRef} style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 48px",
        transition: "transform .1s linear" }}>
        {title}
      </div>
      <div ref={cardRef} style={{ maxWidth: 1240, margin: "0 auto", borderRadius: 32,
        background: "linear-gradient(180deg,#1c1830,#2b2545)", padding: 18,
        border: "1px solid #3d335a",
        boxShadow: "0 0 0 #0000004d, 0 9px 20px rgba(0,0,0,.3), 0 37px 37px rgba(60,40,110,.22), 0 84px 50px rgba(60,40,110,.15), 0 149px 60px rgba(60,40,110,.06)",
        transformOrigin: "50% 100%", willChange: "transform" }}>
        <div style={{ height: "min(64vh,620px)", borderRadius: 22, overflow: "hidden",
          background: "#ffffff" }}>
          {children}
        </div>
      </div>
    </section>
  );
}
