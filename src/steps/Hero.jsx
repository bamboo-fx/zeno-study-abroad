import React from "react";
import { ArrowRight } from "lucide-react";

import { CTA } from "../theme/colors.js";

import { Tilt } from "../components/Tilt.jsx";
import { ParallaxLayer } from "../components/ParallaxLayer.jsx";
import { ScrollReveal } from "../components/ScrollReveal.jsx";
import { DashboardMockup } from "../components/DashboardMockup.jsx";
import { TestimonialsMarquee } from "../components/TestimonialsMarquee.jsx";

const Landmark = ({ src, w, h, alt }) => (
  <img src={src} alt={alt} style={{ width: w, height: h, objectFit: "contain", display: "block",
    filter: "drop-shadow(0 12px 24px rgba(0,0,0,.35))" }} />
);

export function Hero({ setStep }) {
  const parItems = [
    { key: "eif", top: "-26%", right: "-4%", w: 560, mx: -22, my: -16, dl: "0s",
      node: <Tilt max={12}><Landmark src="/landmarks/eiffel.png" w={560} h={800} alt="Eiffel Tower" /></Tilt> },
    { key: "giza", top: "44%", right: "34%", w: 320, mx: -32, my: -10, dl: ".8s",
      node: <Tilt max={12}><Landmark src="/landmarks/giza.png" w={320} h={210} alt="Pyramids of Giza" /></Tilt> },
    { key: "taj", top: "54%", right: "-4%", w: 340, mx: -16, my: -22, dl: "1.6s",
      node: <Tilt max={12}><Landmark src="/landmarks/taj.png" w={340} h={250} alt="Taj Mahal" /></Tilt> },
  ];

  const onStartExploring = () => {
    document.body.style.overflow = "";
    const el = document.getElementById("peel-preview");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sectionTopAbs = rect.top + window.scrollY;
    const target = Math.max(0, sectionTopAbs - 12);
    const startY = window.scrollY;
    const dist = target - startY;
    const dur = 2200;
    const t0 = performance.now();
    const ease = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    let cancelled = false;
    const cancel = () => { cancelled = true; window.removeEventListener("wheel", cancel); window.removeEventListener("touchstart", cancel); window.removeEventListener("keydown", cancel); };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    const step = (now) => {
      if (cancelled) return;
      const t = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, startY + dist * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else cancel();
    };
    requestAnimationFrame(step);
  };

  return (
    <>
      <style>{`
        @keyframes trailDash { to { stroke-dashoffset: -360; } }
        .travel-trail { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
        .travel-trail path.trail { stroke: #b9a8d8; stroke-width: 1.6; fill: none; stroke-linecap: round;
          stroke-dasharray: 2 10; animation: trailDash 26s linear infinite; opacity: .55; }
      `}</style>
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "30px 28px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "22vh" }}>
        <svg className="travel-trail" viewBox="0 0 1180 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path className="trail"
            d="M -100 220 C 80 280, 200 380, 320 440 C 440 500, 580 460, 700 380 C 820 300, 940 280, 1060 320 C 1180 360, 1280 280, 1320 220" />
        </svg>
        <img src="/paperplane.png" alt=""
          style={{ position: "absolute", top: "48%", left: "28%", zIndex: 3,
            width: 40, height: "auto",
            transform: "translate(-50%, -50%) rotate(18deg)",
            opacity: 0.6,
            filter: "grayscale(80%) drop-shadow(0 4px 10px rgba(0,0,0,.15))" }} />
        <div style={{ position: "relative", zIndex: 4, maxWidth: 920 }}>
          <h1 className="ser fl" style={{ animationDelay: ".15s", fontSize: "clamp(44px,7vw,84px)", lineHeight: 1.06,
            fontWeight: 600, letterSpacing: "-.03em", margin: "0" }}>
            See it<br />before you <span style={{ fontStyle: "italic", color: "#9d7bff" }}>go</span>.
          </h1>
          <div className="fl" style={{ animationDelay: ".45s", display: "flex", gap: 14, marginTop: 38, flexWrap: "wrap" }}>
            <button className="pressable" style={CTA} onClick={onStartExploring}>
              Start exploring <ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
        <ParallaxLayer items={parItems} />
      </div>
      <ScrollReveal title={
        <>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".14em",
            textTransform: "uppercase", color: "#9d6bff" }}>What you'll see</div>
          <h2 className="ser" style={{ fontSize: "clamp(34px,5vw,64px)", fontWeight: 600,
            color: "#1c1830", marginTop: 10, lineHeight: 1.05, letterSpacing: "-.02em" }}>
            Every layer of your<br /><span style={{ fontStyle: "italic", color: "#9d7bff" }}>destination</span>, at a glance.
          </h2>
        </>
      }>
        <DashboardMockup />
      </ScrollReveal>
      <TestimonialsMarquee />
      <div style={{ textAlign: "center", margin: "10px auto 80px", maxWidth: 520, padding: "0 28px" }}>
        <button className="pressable" style={{ ...CTA, fontSize: 16, padding: "16px 32px" }}
          onClick={() => setStep("school")}>
          Build my trip <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </>
  );
}
