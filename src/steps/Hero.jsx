import React from "react";
import { ArrowRight } from "lucide-react";

import { G } from "../theme/gradients.js";
import { CTA, CARD } from "../theme/colors.js";

import { Photo } from "../components/Photo.jsx";
import { Tilt } from "../components/Tilt.jsx";
import { ParallaxLayer } from "../components/ParallaxLayer.jsx";
import { ScrollReveal } from "../components/ScrollReveal.jsx";
import { DashboardMockup } from "../components/DashboardMockup.jsx";
import { TestimonialsMarquee } from "../components/TestimonialsMarquee.jsx";

export function Hero({ setStep }) {
  const parItems = [
    { key: "bcn", top: "4%", right: "2%", w: 210, mx: -22, my: -16, dl: "0s",
      node: <Tilt max={12} style={{ borderRadius: 22 }}><div style={{ ...CARD, padding: 10, borderRadius: 22 }}>
        <Photo city="Barcelona" country="Spain" grad={G.beach} h={150} round={15} /></div></Tilt> },
    { key: "kyo", top: "40%", right: "16%", w: 190, mx: -32, my: -10, dl: ".8s",
      node: <Tilt max={12} style={{ borderRadius: 22 }}><div style={{ ...CARD, padding: 10, borderRadius: 22 }}>
        <Photo city="Kyoto" country="Japan" grad={G.cobble} h={150} round={15} /></div></Tilt> },
    { key: "cph", top: "60%", right: "-2%", w: 200, mx: -16, my: -22, dl: "1.6s",
      node: <Tilt max={12} style={{ borderRadius: 22 }}><div style={{ ...CARD, padding: 10, borderRadius: 22 }}>
        <Photo city="Copenhagen" country="Denmark" grad={G.nordic} h={150} round={15} /></div></Tilt> },
  ];

  const onStartExploring = () => {
    document.body.style.overflow = "";
    const el = document.getElementById("peel-preview");
    if (!el) return;
    window.__peelForceFlat = true;
    const release = () => {
      window.__peelForceFlat = false;
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", release);
    };
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("keydown", release);
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const sectionBottomAbs = rect.bottom + window.scrollY;
    const target = Math.max(0, sectionBottomAbs - vh * 0.4 - 0.505 * rect.height);
    const startY = window.scrollY;
    const dist = target - startY;
    const dur = 850;
    const t0 = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, startY + dist * ease(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <>
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "30px 28px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "22vh" }}>
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
