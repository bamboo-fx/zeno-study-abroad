import React, { useState, useRef, useEffect } from "react";
import {
  Send, Sparkles, Check, MapPin, Coffee,
  GraduationCap, ChevronLeft, ChevronDown, School, AlertCircle,
  Search, BadgeCheck, Globe, HelpCircle, Quote, ArrowRight,
} from "lucide-react";

import { G } from "./theme/gradients.js";
import { INK, CTA, GHOST, CARD } from "./theme/colors.js";
import { FONTS } from "./theme/fonts.jsx";

import { VIBES, CONTINENTS, MAJORS, SCHOOLS, SEMS, SCORE_MAP } from "./data/options.js";
import { CLIM } from "./data/climate.js";
import { costInfo } from "./data/cost.js";
import { countryProfile, visaGuide } from "./data/country.js";
import { courseCredit } from "./data/courseCredit.js";
import { TESTI, GEN_TESTI } from "./data/testimonials.js";
import { CMC, DATA, loadPrograms } from "./data/programs.js";

import { Canvas } from "./components/Canvas.jsx";
import { Nav } from "./components/Nav.jsx";
import { Wrap } from "./components/Wrap.jsx";
import { StepHead } from "./components/StepHead.jsx";
import { Coverflow } from "./components/Coverflow.jsx";
import { Tilt } from "./components/Tilt.jsx";
import { ParallaxLayer } from "./components/ParallaxLayer.jsx";
import { ScrollReveal } from "./components/ScrollReveal.jsx";
import { DashboardMockup } from "./components/DashboardMockup.jsx";
import { TestimonialsMarquee } from "./components/TestimonialsMarquee.jsx";
import { Photo } from "./components/Photo.jsx";

export default function App() {
  const [step, setStep] = useState("hero");
  const STEP_ORDER = ["hero", "school", "major", "continent", "images", "destinations", "dashboard"];
  const STEP_META = {
    school: { label: "Pick your college", n: "Step 1", grad: G.campus },
    major: { label: "Choose your major", n: "Step 2", grad: G.cafe },
    continent: { label: "Choose your region", n: "Step 3", grad: G.beach },
    images: { label: "Find your vibe", n: "Step 4", grad: G.neon },
    destinations: { label: "See the cities", n: "Step 5", grad: G.cobble },
    dashboard: { label: "Your trip, season by season", n: "Step 6", grad: G.market },
  };
  const prevStepRef = useRef("hero");
  const goingBack = STEP_ORDER.indexOf(step) < STEP_ORDER.indexOf(prevStepRef.current);
  useEffect(() => { prevStepRef.current = step; }, [step]);
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const [continent, setContinent] = useState(null);
  const [selected, setSelected] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatNote, setChatNote] = useState("");
  const [destKey, setDestKey] = useState(null);
  const [picked, setPicked] = useState(null);
  const [semTab, setSemTab] = useState("fall");
  const [dayOpen, setDayOpen] = useState(false);
  const [costOpen, setCostOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visaOpen, setVisaOpen] = useState(false);
  const [dashTab, setDashTab] = useState("overview");
  // Lock page scroll while the user is on the hero, so they can only proceed
  // by pressing the Start exploring button. Restore scroll otherwise.
  useEffect(() => {
    if (step === "hero") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [step]);
  const [destIdx, setDestIdx] = useState(0);
  const destDirRef = useRef(1);
  const boxRef = useRef(null);

  // Live program list per school. Falls back to mock DATA[school] when no
  // live source is configured. See src/data/programs.js#loadPrograms.
  const [srcPrograms, setSrcPrograms] = useState(null);
  const [srcLoading, setSrcLoading] = useState(false);
  useEffect(() => {
    if (!school) { setSrcPrograms(null); return; }
    let alive = true;
    setSrcLoading(true);
    loadPrograms(school).then((p) => {
      if (alive) { setSrcPrograms(p); setSrcLoading(false); }
    }).catch(() => { if (alive) { setSrcPrograms(DATA[school] || CMC); setSrcLoading(false); } });
    return () => { alive = false; };
  }, [school]);

  useEffect(() => {
    const close = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const schoolObj = SCHOOLS.find((s) => s.id === school);
  const contLabel = CONTINENTS.find((c) => c.id === continent)?.label;
  const CONT_GRAD = { europe: G.cobble, asia: G.neon, oceania: G.beach, americas: G.market };
  const contGrad = CONT_GRAD[continent] || null;
  const matches = query.trim()
    ? SCHOOLS.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
        .sort((a, b) => { const q = query.trim().toLowerCase();
          return (a.name.toLowerCase().startsWith(q) ? 0 : 1) - (b.name.toLowerCase().startsWith(q) ? 0 : 1) || a.name.localeCompare(b.name); })
    : SCHOOLS;

  const pickSchool = (s) => { setSchool(s.id); setQuery(s.name); setOpen(false); };
  const onKey = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => Math.min(h + 1, matches.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
    else if (e.key === "Enter" && matches[hi]) { e.preventDefault(); pickSchool(matches[hi]); }
    else if (e.key === "Escape") setOpen(false);
  };
  const hl = (name) => {
    const q = query.trim(); if (!q) return name;
    const i = name.toLowerCase().indexOf(q.toLowerCase()); if (i === -1) return name;
    return (<>{name.slice(0, i)}<mark style={{ background: "rgba(78,168,255,.3)", color: INK, borderRadius: 3 }}>{name.slice(i, i + q.length)}</mark>{name.slice(i + q.length)}</>);
  };

  const toggleVibe = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const goToDest = (key) => { setDestKey(key); setDestIdx(0); setStep("destinations"); };
  const findFromSelected = () => { if (selected[0]) goToDest(selected[0]); };

  const scoreVibes = (text) => {
    const lower = " " + text.toLowerCase().replace(/[^a-z\s]/g, " ") + " ";
    let bestId = "cobble", bestScore = -1;
    for (const v of VIBES) { let sc = 0; for (const kw of SCORE_MAP[v.id]) if (lower.includes(kw)) sc += 1; if (sc > bestScore) { bestScore = sc; bestId = v.id; } }
    return { bestId, bestScore };
  };
  const submitChat = () => {
    const text = chatInput.trim(); if (!text) return;
    const { bestId, bestScore } = scoreVibes(text);
    const v = VIBES.find((x) => x.id === bestId);
    setChatNote((bestScore > 0 ? "Best match: " : "Closest fit: ") + `“${v.label}”${contLabel ? " in " + contLabel : ""} — taking you there…`);
    setTimeout(() => goToDest(bestId), 850);
  };

  const SRC = srcPrograms || (school ? (DATA[school] || CMC) : CMC);
  const activeCont = continent && continent !== "any" ? continent : null;
  const VIBE_KEYS = ["neon","cobble","beach","nordic","cafe","alpine","market","campus"];
  const aggList = () => {
    const seen = new Set(), out = [];
    VIBE_KEYS.forEach((k) => {
      const bc = SRC[k] || {};
      const arr = activeCont ? (bc[activeCont] || [])
        : [...(bc.europe||[]),...(bc.asia||[]),...(bc.oceania||[]),...(bc.americas||[])];
      arr.forEach((d) => { const key = d.city + d.country; if (!seen.has(key)) { seen.add(key); out.push(d); } });
    });
    return out;
  };
  const destForVibe = (key) => {
    if (!key) return [];
    if (key === "surprise") return aggList().sort(() => Math.random() - 0.5).slice(0, 6);
    const byCont = SRC[key] || {};
    if (activeCont) return byCont[activeCont] || [];
    return [...(byCont.europe||[]),...(byCont.asia||[]),...(byCont.oceania||[]),...(byCont.americas||[])].slice(0, 6);
  };
  const chosen = destForVibe(destKey);
  const primaryVibe = VIBES.find((v) => v.id === destKey);
  // Designed heuristic: which cities tend to suit which academic focus.
  // Not official eligibility — a fit nudge so relevant programs rank first.
  const MAJOR_FIT = {
    business: ["London", "Singapore", "Hong Kong", "Frankfurt", "Zurich", "Geneva", "Milan", "Madrid", "Shanghai"],
    stem: ["Zurich", "Munich", "Stockholm", "Copenhagen", "Tokyo", "Singapore", "Delft", "Lausanne", "Edinburgh"],
    cs: ["London", "Berlin", "Stockholm", "Tokyo", "Seoul", "Singapore", "Amsterdam", "Tallinn", "San Francisco"],
    social: ["Geneva", "Brussels", "London", "Washington", "Vienna", "The Hague", "Paris", "Cape Town"],
    humanities: ["Rome", "Florence", "Oxford", "Cambridge", "Edinburgh", "Athens", "Paris", "Prague", "St Andrews"],
    arts: ["Paris", "Florence", "Berlin", "Barcelona", "Vienna", "Copenhagen", "Tokyo", "London"],
    language: ["Madrid", "Seville", "Salamanca", "Paris", "Buenos Aires", "Tokyo", "Seoul", "Berlin", "Florence"],
    open: [],
  };
  const majorBonus = (dd) => {
    if (!major || major === "open") return 0;
    const list = MAJOR_FIT[major] || [];
    return list.some((c) => dd.city && dd.city.toLowerCase().includes(c.toLowerCase())) ? 9 : -3;
  };
  // Deterministic "match %" per destination so it's stable across renders.
  const matchScore = (dd, i) => {
    const s = (dd.city + dd.country + (destKey || "") + (major || "")).split("")
      .reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    // base 72–98, then a major-fit nudge
    return 98 - (s % 17) - i * 2 + majorBonus(dd);
  };
  const ranked = chosen
    .map((dd, i) => ({ dd, m: Math.max(58, Math.min(99, matchScore(dd, i))) }))
    .sort((a, b) => b.m - a.m);
  const cityPreview = (vid) => {
    if (vid === "surprise") {
      const a = aggList();
      return a.length ? a.slice(0, 3).map((x) => x.city).join(" · ") : "No programs here";
    }
    const byCont = SRC[vid] || {};
    const src = activeCont ? (byCont[activeCont] || []) : [...(byCont.europe||[]),...(byCont.asia||[]),...(byCont.oceania||[]),...(byCont.americas||[])];
    if (!src.length) return "No programs here";
    return src.slice(0, 3).map((x) => x.city).join(" · ");
  };
  const choose = (dd) => { setPicked(dd); setSemTab("fall"); setDayOpen(false); setCostOpen(false); setVisaOpen(false); setDashTab("overview"); setStep("dashboard"); };
  const restart = () => { setStep("hero"); setSchool(""); setMajor(null); setQuery(""); setContinent(null); setSelected([]); setDestKey(null); setPicked(null); setChatInput(""); setChatNote(""); window.scrollTo({ top: 0, behavior: "auto" }); };

  const testiFor = (city, clim, sem) => (TESTI[city] || GEN_TESTI(city, clim))[sem];

  // FONTS, Canvas, Nav, Wrap, Pill, StepHead now live at module scope (stable
  // identity — defining them here was what remounted the tree on every render).
  // Keep these lowercase aliases so existing style references work unchanged.
  const cta = CTA;
  const ghost = GHOST;
  const card = CARD;

  /* ---------- HERO ---------- */
  const renderHero = () => {
    const parItems = [
      { key: "bcn", top: "4%", right: "2%", w: 210, mx: -22, my: -16, dl: "0s",
        node: <Tilt max={12} style={{ borderRadius: 22 }}><div style={{ ...card, padding: 10, borderRadius: 22 }}>
          <Photo city="Barcelona" country="Spain" grad={G.beach} h={150} round={15} /></div></Tilt> },
      { key: "kyo", top: "40%", right: "16%", w: 190, mx: -32, my: -10, dl: ".8s",
        node: <Tilt max={12} style={{ borderRadius: 22 }}><div style={{ ...card, padding: 10, borderRadius: 22 }}>
          <Photo city="Kyoto" country="Japan" grad={G.cobble} h={150} round={15} /></div></Tilt> },
      { key: "cph", top: "60%", right: "-2%", w: 200, mx: -16, my: -22, dl: "1.6s",
        node: <Tilt max={12} style={{ borderRadius: 22 }}><div style={{ ...card, padding: 10, borderRadius: 22 }}>
          <Photo city="Copenhagen" country="Denmark" grad={G.nordic} h={150} round={15} /></div></Tilt> },
    ];
    return (
      <>
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "30px 28px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "22vh" }}>
        <div style={{ position: "relative", zIndex: 4, maxWidth: 920 }}>
          <h1 className="ser fl" style={{ animationDelay: ".15s", fontSize: "clamp(44px,7vw,84px)", lineHeight: 1.06,
            fontWeight: 600, letterSpacing: "-.03em", margin: "0" }}>
            See it<br />before you <span style={{ fontStyle: "italic", color: "#9d7bff" }}>go</span>.
          </h1>
          <div className="fl" style={{ animationDelay: ".45s", display: "flex", gap: 14, marginTop: 38, flexWrap: "wrap" }}>
            <button className="pressable" style={cta}
              onClick={() => {
                document.body.style.overflow = "";
                const el = document.getElementById("peel-preview");
                if (!el) return;
                // Force the tablet flat during this programmatic scroll so it
                // arrives straight, not diagonal. Releases on user wheel/touch.
                window.__peelForceFlat = true;
                const release = () => { window.__peelForceFlat = false;
                  window.removeEventListener("wheel", release);
                  window.removeEventListener("touchstart", release);
                  window.removeEventListener("keydown", release); };
                window.addEventListener("wheel", release, { passive: true });
                window.addEventListener("touchstart", release, { passive: true });
                window.addEventListener("keydown", release);
                const rect = el.getBoundingClientRect();
                const vh = window.innerHeight || 800;
                const sectionBottomAbs = rect.bottom + window.scrollY;
                // Land where the title sits comfortably at top and tablet centered.
                // p=0.9 visual composition is what we want for placement.
                const target = Math.max(0, sectionBottomAbs - vh * 0.4 - 0.505 * rect.height);
                const startY = window.scrollY;
                const dist = target - startY;
                const dur = 850; // ms
                const t0 = performance.now();
                const ease = (x) => 1 - Math.pow(1 - x, 3); // ease-out cubic
                const step = (now) => {
                  const t = Math.min(1, (now - t0) / dur);
                  window.scrollTo(0, startY + dist * ease(t));
                  if (t < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
              }}>
              Start exploring <ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>

        {/* floating layered cards — parallax via refs only, never re-renders */}
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
        <button className="pressable" style={{ ...cta, fontSize: 16, padding: "16px 32px" }}
          onClick={() => setStep("school")}>
          Build my trip <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>
      </>
    );
  };

  const renderStep = (s) => (
    <>
      {s === "hero" && renderHero()}

      {s === "school" && (
        <Wrap narrow>
          <StepHead kicker={<><School style={{ width: 13, height: 13 }} /> Step 1</>}
            title="Which Claremont College?"
            back={restart} />
          <div className="fl" style={{ animationDelay: ".24s" }}>
            <div ref={boxRef} style={{ position: "relative" }}>
              <div style={{ ...card, background: "#ffffff", backdropFilter: "none", display: "flex", alignItems: "center", gap: 12, padding: "6px 18px", borderRadius: 20,
                boxShadow: open ? "0 0 0 3px rgba(124,77,255,.35), 0 24px 60px -18px rgba(60,40,110,.35)" : card.boxShadow }}>
                <Search style={{ width: 20, height: 20, color: "#6b82a4", flexShrink: 0 }} />
                <input value={query}
                  onChange={(e) => { setQuery(e.target.value); setSchool(""); setOpen(true); setHi(0); }}
                  onFocus={() => { if (school) { setQuery(""); setSchool(""); } setHi(0); setOpen(true); }}
                  onKeyDown={onKey}
                  placeholder="Pomona, CMC, Pitzer, Scripps, Harvey Mudd…"
                  className="san" style={{ flex: 1, background: "none", border: "none", outline: "none", padding: "16px 0", fontSize: 15, fontWeight: 600, color: INK }} />
              </div>
              {open && (
                <div className="fad scl" style={{ position: "absolute", zIndex: 1000, top: "calc(100% + 10px)", left: 0, right: 0,
                  background: "#ffffff", border: "1px solid #ece7f7",
                  borderRadius: 20, overflow: "hidden", maxHeight: 320, overflowY: "auto",
                  boxShadow: "0 24px 60px -18px rgba(60,40,110,.45)" }}>
                  {matches.length === 0 ? (
                    <div style={{ padding: "20px 22px", fontSize: 14, color: "#7e96b4", display: "flex", gap: 9, alignItems: "center", background: "#ffffff" }}>
                      <AlertCircle style={{ width: 16, height: 16, color: "#4ea8ff" }} /> Only the five Claremont colleges are covered here.
                    </div>
                  ) : matches.map((s, idx) => (
                    <button key={s.id} onMouseEnter={() => setHi(idx)} onClick={() => pickSchool(s)}
                      style={{ width: "100%", textAlign: "left", padding: "15px 20px", display: "flex", alignItems: "center", gap: 13,
                        background: idx === hi ? "#eef0ff" : "#ffffff", border: "none",
                        borderBottom: "1px solid #ece7f7", cursor: "pointer" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(78,168,255,.16)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <School style={{ width: 16, height: 16, color: "#9d7bff" }} />
                      </div>
                      <span className="san" style={{ fontSize: 15, fontWeight: 600, color: INK }}>{hl(s.name)}</span>
                      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700,
                        padding: "4px 10px", borderRadius: 999,
                        background: "transparent",
                        color: s.pooled ? "#4ea8ff" : "#9d7bff" }}>
                        <BadgeCheck style={{ width: 12, height: 12 }} /> {s.pooled ? "5C pool" : "Real data"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {schoolObj && (
              <div style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: "#7e96b4",
                background: "transparent", border: "none", borderRadius: 14, padding: "13px 16px", marginTop: 16 }}>
                <AlertCircle style={{ width: 15, height: 15, color: "#4ea8ff", flexShrink: 0, marginTop: 1 }} />
                <span>{schoolObj.note}.</span>
              </div>
            )}
            <button disabled={!schoolObj} onClick={() => setStep("major")} className="pressable"
              style={{ ...cta, width: "100%", marginTop: 22, opacity: schoolObj ? 1 : .4, cursor: schoolObj ? "pointer" : "not-allowed" }}>
              Continue <ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </Wrap>
      )}

      {s === "major" && (
        <Wrap>
          <StepHead kicker={<><GraduationCap style={{ width: 13, height: 13 }} /> Step 2</>}
            title="What's your major?"
            back={() => setStep("school")} />
          <p style={{ textAlign: "center", color: "#7e96b4", fontSize: 14.5, margin: "-6px 0 26px" }}>
            Your field shapes which programs fit best — finance & econ lean toward business-school partners, STEM toward research universities, and so on.
          </p>
          <div className="vibegrid">
            {MAJORS.map((mj, i) => {
              const on = major === mj.id; const Icon = mj.icon;
              return (
                <Tilt key={mj.id} max={10} className="fl" style={{ animationDelay: `${.1 + i * .035}s`, borderRadius: 18 }}
                  onClick={() => { setMajor(mj.id); setStep("continent"); }}>
                  <div style={{ position: "relative", minHeight: 132, borderRadius: 18, overflow: "hidden", cursor: "pointer",
                    background: "#fff", border: on ? "2px solid #7c4dff" : "1px solid #ece7f7",
                    boxShadow: on ? "0 24px 44px -22px rgba(124,77,255,.5)" : "0 16px 32px -22px rgba(60,40,110,.4)",
                    padding: "20px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                      background: "linear-gradient(135deg,#4ea8ff,#9d7bff)", display: "grid", placeItems: "center" }}>
                      <Icon style={{ width: 19, height: 19, color: "#fff" }} />
                    </div>
                    <div className="ser" style={{ fontSize: 17, fontWeight: 600, color: "#1c1830", marginTop: 4 }}>{mj.label}</div>
                    <div style={{ fontSize: 12.5, color: "#9a90b8" }}>{mj.sub}</div>
                  </div>
                </Tilt>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", maxWidth: 620, margin: "26px auto 0",
            fontSize: 12, color: "#9a90b8" }}>
            <AlertCircle style={{ width: 14, height: 14, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
            <span>Major-based fit is a guidance heuristic to surface relevant programs first — it does not replace your study-abroad office's official eligibility rules. Always confirm a program accepts your major.</span>
          </div>
        </Wrap>
      )}

      {s === "continent" && (
        <Wrap narrow>
          <StepHead kicker={<><Globe style={{ width: 13, height: 13 }} /> Step 3</>}
            title="Where in the world?"
            back={() => setStep("major")} />

          <div className="fl" style={{ animationDelay: ".2s" }}>
            <Coverflow
              items={CONTINENTS}
              grads={CONT_GRAD}
              onPick={(id) => { setContinent(id); setSelected([]); setStep("images"); }}
            />
          </div>

          <button onClick={() => { setContinent("any"); setSelected([]); setStep("images"); }}
            className="pressable fl" style={{ ...ghost, width: "100%", marginTop: 30, animationDelay: ".4s" }}>
            <HelpCircle style={{ width: 18, height: 18, color: "#7c4dff" }} /> Not sure? Show me a mix
          </button>
        </Wrap>
      )}

      {s === "images" && (
        <Wrap>
          <button onClick={() => setStep("continent")} className="pressable"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#7e96b4",
              background: "none", border: "none", cursor: "pointer", marginBottom: 18 }}>
            <ChevronLeft style={{ width: 15, height: 15 }} /> Back
          </button>
          {/* Continent banner — flies in like arriving there */}
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
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.12) 0%,transparent 38%,rgba(0,0,0,.66) 100%)" }} />
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
              style={{ ...cta, opacity: selected.length ? 1 : .4, cursor: selected.length ? "pointer" : "not-allowed" }}>
              Find my destinations <ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </Wrap>
      )}

      {s === "destinations" && (
        <Wrap>
          <StepHead kicker={<>{(MAJORS.find((x) => x.id === major) || {}).label || "All majors"}{primaryVibe?.label ? ` · ${primaryVibe.label}` : ""}{contLabel ? ` · ${contLabel}` : " · global mix"}</>}
            title="Pick your destination"
            back={() => setStep("images")} />

          {srcLoading ? (
            <div className="fad" style={{ ...card, maxWidth: 460, margin: "0 auto", textAlign: "center", padding: 36, borderRadius: 22 }}>
              <div className="ser" style={{ fontSize: 18, fontWeight: 600, color: "#1c1830" }}>Loading approved programs…</div>
              <div style={{ fontSize: 13, color: "#9a90b8", marginTop: 6 }}>Pulling the live list from {schoolObj?.name}'s portal.</div>
            </div>
          ) : chosen.length === 0 ? (
            <div className="fl" style={{ ...card, maxWidth: 560, margin: "0 auto", textAlign: "center", padding: 44, borderRadius: 24 }}>
              <AlertCircle style={{ width: 34, height: 34, color: "#4ea8ff", margin: "0 auto 14px" }} />
              <div className="ser" style={{ fontSize: 21, fontWeight: 600, marginBottom: 6 }}>Nothing here for that combination</div>
              <p style={{ fontSize: 14, color: "#7e96b4", marginBottom: 22 }}>No “{primaryVibe?.label}”{contLabel ? ` in ${contLabel}` : ""} programs in {schoolObj?.name}'s approved list. Try another region or vibe.</p>
              <button onClick={() => setStep("images")} className="pressable" style={{ ...cta }}>
                <ChevronLeft style={{ width: 16, height: 16 }} /> Pick another vibe
              </button>
            </div>
          ) : (() => {
            const safeIdx = Math.min(destIdx, ranked.length - 1);
            const goTo = (target) => {
              const t = Math.min(ranked.length - 1, Math.max(0, target));
              destDirRef.current = t >= safeIdx ? 1 : -1;
              setDestIdx(t);
            };
            const go = (dir) => goTo(safeIdx + dir);
            const swipeCls = destDirRef.current >= 0 ? "cswipe-next" : "cswipe-prev";
            const mColor = (m) => m >= 90 ? "#16a34a" : m >= 80 ? "#7c4dff" : "#9d6bff";
            const prev = safeIdx > 0 ? ranked[safeIdx - 1] : null;
            const next = safeIdx < ranked.length - 1 ? ranked[safeIdx + 1] : null;
            const cur = ranked[safeIdx];

            return (
              <div>
                <div style={{ textAlign: "center", fontSize: 13, color: "#9a90b8", marginBottom: 4 }}>
                  Ranked by match · {safeIdx + 1} of {ranked.length}
                </div>
                <div style={{ textAlign: "center", fontSize: 11.5, color: "#b0a6c8", marginBottom: 18 }}>
                  {major && major !== "open"
                    ? "Sorted to surface programs that tend to suit your major first — every approved option is still shown."
                    : "Every approved program is shown, ranked by overall fit."}
                </div>

                <div style={{ position: "relative", height: 660, maxWidth: 1180, margin: "0 auto",
                  perspective: 1600, overflow: "hidden" }}>
                  {ranked.map((item, i) => {
                    const off = i - safeIdx;          // -1, 0, +1
                    const abs = Math.abs(off);
                    if (abs > 1) return null;          // only render 3: center + one each side
                    const isCenter = off === 0;
                    // coverflow placement: smooth because of CSS transition on transform
                    const x = off * 340;
                    const ry = off === 0 ? 0 : (off < 0 ? 36 : -36);
                    const z = isCenter ? 0 : -240;
                    const scale = isCenter ? 1 : 0.8;
                    const op = isCenter ? 1 : 0.5;
                    return (
                      <div key={item.dd.city}
                        onClick={() => !isCenter && goTo(i)}
                        style={{ position: "absolute", top: "50%", left: "50%",
                          width: isCenter ? 560 : 300,
                          transform: `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${scale})`,
                          opacity: op, zIndex: isCenter ? 5 : 5 - abs,
                          filter: isCenter ? "none" : "saturate(.8) blur(.4px)",
                          cursor: isCenter ? "default" : "pointer",
                          pointerEvents: abs > 1 ? "none" : "auto",
                          transition: "transform .85s cubic-bezier(.22,1,.36,1), opacity .85s ease, filter .6s ease",
                          willChange: "transform" }}>
                        <div className={isCenter ? "bob" : ""}
                          style={{ background: "#ffffff", overflow: "hidden",
                            borderRadius: isCenter ? 30 : 24,
                            border: "1px solid #ece7f7",
                            boxShadow: isCenter
                              ? "0 54px 100px -38px rgba(60,40,110,.5), 0 12px 28px -16px rgba(60,40,110,.3)"
                              : "0 40px 74px -34px rgba(60,40,110,.45)" }}>
                          <div style={{ position: "relative", padding: isCenter ? 14 : 10 }}>
                            <Photo city={item.dd.city} country={item.dd.country} grad={item.dd.grad}
                              photo={item.dd.photo}
                              h={isCenter ? 300 : 180} round={isCenter ? 22 : 16} />
                            {isCenter && (
                              <div style={{ position: "absolute", top: 26, right: 26, display: "flex", alignItems: "center", gap: 9,
                                background: "rgba(255,255,255,.94)", backdropFilter: "blur(6px)",
                                borderRadius: 999, padding: "10px 16px 10px 12px",
                                boxShadow: "0 14px 30px -14px rgba(0,0,0,.4)" }}>
                                <span style={{ width: 28, height: 28, borderRadius: 999, background: mColor(item.m),
                                  display: "grid", placeItems: "center" }}>
                                  <Check style={{ width: 16, height: 16, color: "#fff" }} strokeWidth={3} />
                                </span>
                                <span style={{ fontSize: 17, fontWeight: 800, color: mColor(item.m) }}>{item.m}%</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#7a7299" }}>match</span>
                              </div>
                            )}
                          </div>
                          {isCenter ? (
                            <div style={{ padding: "16px 36px 32px" }}>
                              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                                <span className="ser" style={{ fontSize: 28, fontWeight: 600, color: "#1c1830" }}>{item.dd.city}</span>
                                <span style={{ fontSize: 15, color: "#9a90b8" }}>{item.dd.country}</span>
                              </div>
                              <p style={{ fontSize: 15, color: "#564d75", lineHeight: 1.5, marginBottom: 14 }}>{item.dd.desc}</p>
                              {(() => {
                                const c = costInfo(item.dd.city, item.dd.country);
                                return (
                                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
                                    fontSize: 13, marginBottom: 20,
                                    background: "#f7f5fc", borderRadius: 12, padding: "9px 14px" }}>
                                    <span style={{ fontWeight: 700, color: c.tierColor }}>~${c.studentMo.toLocaleString()}/mo</span>
                                    <span style={{ color: "#9a90b8" }}>est. student cost</span>
                                    <span style={{ fontWeight: 600, color: c.tierColor }}>· {c.tier}</span>
                                  </div>
                                );
                              })()}
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600,
                                  color: "#7c4dff", background: "#f0ebfa", borderRadius: 12, padding: "10px 15px" }}>
                                  <GraduationCap style={{ width: 15, height: 15 }} /> {item.dd.highlight}
                                </span>
                                <button onClick={() => choose(item.dd)} className="pressable" style={{ ...cta }}>
                                  Choose {item.dd.city} <ArrowRight style={{ width: 17, height: 17 }} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ padding: "6px 20px 22px" }}>
                              <div className="ser" style={{ fontSize: 20, fontWeight: 600, color: "#1c1830" }}>{item.dd.city}</div>
                              <div style={{ fontSize: 12.5, color: "#9a90b8", marginTop: 2 }}>{item.dd.country}</div>
                              <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
                                fontSize: 12.5, fontWeight: 700, color: mColor(item.m) }}>
                                <Check style={{ width: 13, height: 13 }} strokeWidth={3} /> {item.m}% match
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button onClick={() => go(-1)} disabled={safeIdx === 0} className="pressable"
                    aria-label="Previous"
                    style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                      zIndex: 9, width: 50, height: 50, borderRadius: 999,
                      cursor: safeIdx === 0 ? "default" : "pointer", border: "1px solid #e6e0f5", background: "#fff",
                      display: "grid", placeItems: "center", opacity: safeIdx === 0 ? .3 : 1,
                      boxShadow: "0 14px 30px -16px rgba(60,40,110,.4)" }}>
                    <ChevronLeft style={{ width: 22, height: 22, color: "#7c4dff" }} />
                  </button>
                  <button onClick={() => go(1)} disabled={safeIdx === ranked.length - 1} className="pressable"
                    aria-label="Next"
                    style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                      zIndex: 9, width: 50, height: 50, borderRadius: 999,
                      cursor: safeIdx === ranked.length - 1 ? "default" : "pointer", border: "1px solid #e6e0f5", background: "#fff",
                      display: "grid", placeItems: "center", opacity: safeIdx === ranked.length - 1 ? .3 : 1,
                      boxShadow: "0 14px 30px -16px rgba(60,40,110,.4)" }}>
                    <ArrowRight style={{ width: 22, height: 22, color: "#7c4dff" }} />
                  </button>
                </div>

                <div style={{ display: "flex", gap: 7, justifyContent: "center", marginTop: 16 }}>
                  {ranked.map((_, di) => (
                    <button key={di} onClick={() => goTo(di)} aria-label={`Go to ${di + 1}`}
                      className="pressable" style={{ width: di === safeIdx ? 26 : 8, height: 8, borderRadius: 999,
                        border: "none", cursor: "pointer", padding: 0,
                        background: di === safeIdx ? "#7c4dff" : "#dcd3f0", transition: "width .25s" }} />
                  ))}
                </div>

                {ranked.length > 1 && (
                  <div className="fad" style={{ maxWidth: 620, margin: "52px auto 0" }}>
                    <div style={{ textAlign: "center", marginBottom: 18 }}>
                      <div className="ser" style={{ fontSize: 24, fontWeight: 600, color: "#1c1830" }}>
                        Your full ranking
                      </div>
                      <div style={{ fontSize: 13, color: "#9a90b8", marginTop: 5 }}>
                        All {ranked.length} matches, best to least — tap one to revisit
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {ranked.map((r, ri) => (
                        <button key={r.dd.city + ri} onClick={() => goTo(ri)} className="pressable"
                          style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "left",
                            background: "#fff", border: "1px solid #ece7f7", borderRadius: 16,
                            padding: "14px 18px", cursor: "pointer",
                            boxShadow: "0 16px 34px -22px rgba(60,40,110,.4)" }}>
                          <span className="ser" style={{ fontSize: 20, fontWeight: 700, color: "#c9bdec",
                            width: 30, flexShrink: 0 }}>{ri + 1}</span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: "block", fontSize: 16, fontWeight: 600, color: "#1c1830" }}>
                              {r.dd.city} <span style={{ color: "#9a90b8", fontWeight: 400, fontSize: 13 }}>{r.dd.country}</span>
                            </span>
                            <span style={{ display: "block", fontSize: 12.5, color: "#9a90b8", marginTop: 2 }}>
                              {r.dd.highlight}
                            </span>
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0,
                            fontSize: 15, fontWeight: 800, color: mColor(r.m) }}>
                            <span style={{ width: 22, height: 22, borderRadius: 999, background: mColor(r.m),
                              display: "grid", placeItems: "center" }}>
                              <Check style={{ width: 12, height: 12, color: "#fff" }} strokeWidth={3} />
                            </span>
                            {r.m}%
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", maxWidth: 760, margin: "30px auto 0",
            fontSize: 12.5, color: "#9a90b8", background: "transparent", border: "none",
            borderRadius: 14, padding: "13px 16px" }}>
            <AlertCircle style={{ width: 15, height: 15, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
            <span>{schoolObj?.pooled
              ? "Harvey Mudd draws from the shared Claremont Consortium provider pool; availability varies. Confirm with the HMC Office of Study Abroad."
              : `Sourced from a recent snapshot of ${schoolObj?.name}'s approved program list. Confirm availability, eligibility & credit with the study abroad office — listings change yearly.`}</span>
          </div>
        </Wrap>
      )}

      {s === "dashboard" && picked && (
        <Wrap>
          <button onClick={() => setStep("destinations")} className="pressable"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#7e96b4",
              background: "none", border: "none", cursor: "pointer", marginBottom: 22 }}>
            <ChevronLeft style={{ width: 15, height: 15 }} /> Back to destinations
          </button>

          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase",
            color: "#b0a6c8", marginBottom: 10 }}>Choose your term</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {SEMS.map((s) => {
              const Icon = s.icon; const on = semTab === s.id;
              return (
                <button key={s.id} onClick={() => { setSemTab(s.id); setDayOpen(false); }} className="pressable"
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "14px 12px", borderRadius: 15, fontSize: 14, fontWeight: 600, cursor: "pointer",
                    border: on ? "none" : "1px solid #e6e0f5",
                    background: on ? "#7c4dff" : "#ffffff",
                    color: on ? "#fff" : "#7a6f95",
                    boxShadow: on ? "0 12px 24px -10px rgba(124,77,255,.45)" : "0 6px 16px -10px rgba(60,40,110,.2)" }}>
                  <Icon style={{ width: 16, height: 16 }} /> {s.label}
                </button>
              );
            })}
          </div>

          {(() => {
            const clim0 = CLIM[picked.clim] || CLIM.cont;
            const w0 = clim0[semTab] || clim0.fall; const WI0 = w0.icon;
            const t0 = testiFor(picked.city, picked.clim, semTab);
            return (
              <Tilt max={5} className="bob" style={{ borderRadius: 28, marginBottom: 20 }}>
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 28,
                minHeight: 340, border: "1px solid #ece7f7",
                boxShadow: "0 50px 90px -34px rgba(60,40,110,.5), 0 8px 20px -12px rgba(60,40,110,.25)" }}>
                {/* full-bleed city photo as the tile background */}
                <div style={{ position: "absolute", inset: 0 }}>
                  <Photo city={picked.city} country={picked.country} grad={picked.grad} photo={picked.photo} h={340} round={0} hideLabel />
                </div>
                {/* darkening scrim so overlaid content stays readable */}
                <div style={{ position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(20,16,40,.15) 0%, rgba(20,16,40,.1) 38%, rgba(20,16,40,.78) 100%)" }} />

                {/* top: city name + program */}
                <div style={{ position: "relative", padding: "30px 32px" }}>
                  <div className="ser" style={{ fontSize: "clamp(34px,5vw,52px)", fontWeight: 600,
                    color: "#fff", lineHeight: 1.05, textShadow: "0 3px 24px rgba(0,0,0,.5)" }}>
                    {picked.city}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8,
                    color: "rgba(255,255,255,.92)", fontSize: 14 }}>
                    <GraduationCap style={{ width: 16, height: 16 }} />
                    <span style={{ textShadow: "0 2px 12px rgba(0,0,0,.6)" }}>{picked.highlight} · {schoolObj?.name}</span>
                  </div>
                </div>

                {/* bottom: frosted panel with weather + a testimonial line, on the photo */}
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0,
                  padding: "20px 22px 22px", display: "flex", gap: 16, flexWrap: "wrap",
                  alignItems: "flex-end", justifyContent: "space-between" }}>
                  <div className="san" style={{ display: "flex", alignItems: "center", gap: 13,
                    background: "rgba(255,255,255,.14)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,.25)",
                    borderRadius: 18, padding: "13px 18px" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                      background: "linear-gradient(135deg,#9d7bff,#7c4dff)", display: "grid", placeItems: "center" }}>
                      <WI0 style={{ width: 22, height: 22, color: "#fff" }} strokeWidth={1.7} />
                    </div>
                    <div>
                      <div className="san" style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                        textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>{(SEMS.find((x) => x.id === semTab) || {}).label || semTab} weather</div>
                      <div className="san" style={{ fontSize: 15, fontWeight: 700, color: "#fff",
                        textShadow: "0 2px 12px rgba(0,0,0,.5)" }}>{w0.w}</div>
                      <div className="san" style={{ fontSize: 12, color: "rgba(255,255,255,.82)" }}>{w0.t}</div>
                    </div>
                  </div>
                  {t0 && (
                    <div style={{ flex: 1, minWidth: 240, maxWidth: 520,
                      background: "rgba(255,255,255,.14)", backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,.25)", borderRadius: 18, padding: "15px 20px" }}>
                      <Quote style={{ width: 18, height: 18, color: "rgba(255,255,255,.85)", marginBottom: 6 }} />
                      <div className="ser" style={{ fontSize: 16, fontStyle: "italic", color: "#fff",
                        lineHeight: 1.45, textShadow: "0 2px 12px rgba(0,0,0,.5)",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {t0.quote}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </Tilt>
            );
          })()}

          {(() => {
            const TABS = [
              { id: "overview", label: "Overview" },
              { id: "academics", label: "Courses" },
              { id: "money", label: "Expenses" },
              { id: "logistics", label: "Logistics" },
            ];
            return (
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {TABS.map((t) => {
                  const on = dashTab === t.id;
                  return (
                    <button key={t.id} onClick={() => setDashTab(t.id)} className="pressable"
                      style={{ flex: "1 1 auto", minWidth: 120, padding: "12px 14px", borderRadius: 14,
                        fontSize: 14, fontWeight: 600, cursor: "pointer",
                        border: on ? "none" : "1px solid #e6e0f5",
                        background: on ? "#7c4dff" : "#ffffff",
                        color: on ? "#fff" : "#7a6f95",
                        boxShadow: on ? "0 12px 24px -10px rgba(124,77,255,.45)" : "0 6px 16px -10px rgba(60,40,110,.2)" }}>
                      {t.label}
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {dashTab === "overview" && (() => {
            const cp = countryProfile(picked.country);
            const overview = [
              [Sparkles, "Known for", cp.known],
              [Globe, "Language & getting by", cp.lang],
              [Coffee, "Student & social life", cp.life],
              [MapPin, "Getting around & trips out", cp.travel],
            ];
            return (
              <Tilt max={4} className="bob" style={{ borderRadius: 26, marginBottom: 16 }}>
              <div style={{ background: "#ffffff", overflow: "hidden", borderRadius: 26,
                border: "1px solid #ece7f7",
                boxShadow: "0 40px 70px -30px rgba(60,40,110,.4)", padding: "26px 30px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
                  textTransform: "uppercase", color: "#b0a6c8", marginBottom: 8 }}>About {picked.city}</div>
                <div className="ser" style={{ fontSize: 24, fontWeight: 600, color: "#1c1830", marginBottom: 6 }}>
                  {picked.desc}
                </div>
                <p className="san" style={{ fontSize: 13.5, color: "#9a90b8", lineHeight: 1.55, marginBottom: 18 }}>
                  Enrolled through {picked.highlight} · {schoolObj?.name} credit
                </p>
                {(() => {
                  const clim = CLIM[picked.clim] || CLIM.cont;
                  const w = clim[semTab] || clim.fall;
                  const semLabel = ((SEMS.find((x) => x.id === semTab) || {}).label || "this term").toLowerCase();
                  const tier = costInfo(picked.city, picked.country).tier.toLowerCase();
                  return (
                    <p className="san" style={{ fontSize: 14.5, color: "#3d3458", lineHeight: 1.7, marginBottom: 22 }}>
                      A semester in {picked.city} drops you into {picked.country} at a {tier} pace of life. In {semLabel} expect{" "}
                      <span style={{ color: "#1c1830", fontWeight: 600 }}>{w.w.toLowerCase()}</span> ({w.t}) — that shapes how you'll
                      study, where you'll spend afternoons, and how often you'll travel. Most of your week runs through {picked.highlight},
                      with credit flowing back to {schoolObj?.name}. The cultural rhythm, language landscape and student scene
                      below give you the shape of daily life — the tabs above cover the practical stuff.
                    </p>
                  );
                })()}
                <div style={{ display: "grid", gap: 2, borderTop: "1px solid #f0ecf9" }}>
                  {overview.map(([Ic, lab, val], k) => (
                    <div key={lab} style={{ display: "flex", gap: 13, padding: "13px 4px",
                      borderBottom: k < overview.length - 1 ? "1px solid #f4f1fb" : "none" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                        background: "#f0ebfa", display: "grid", placeItems: "center" }}>
                        <Ic style={{ width: 16, height: 16, color: "#7c4dff" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1830", marginBottom: 2 }}>{lab}</div>
                        <div className="san" style={{ fontSize: 13.5, color: "#564d75", lineHeight: 1.5 }}>{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </Tilt>
            );
          })()}

          {dashTab === "academics" && (() => {
            const cc = courseCredit(picked.city, school, major);
            const majorLabel = (MAJORS.find((x) => x.id === major) || {}).label || "your major";
            const advisorEmail = `Hi Professor,

I hope you're well. I'm a ${schoolObj?.name || "home-school"} student planning to study abroad in ${picked.city} through ${picked.highlight}. I'm a ${majorLabel} major and want to confirm how specific courses there would count toward my major.

Could you let me know whether the following would count, and at what level (e.g. major requirement / elective / Level I or II)? I've attached the syllabi.

  • [COURSE CODE] — [COURSE TITLE]
  • [COURSE CODE] — [COURSE TITLE]
  • [COURSE CODE] — [COURSE TITLE]

Thank you for your time — I really appreciate it.

Best,
[Your name]`;
            return (
              <Tilt max={4} className="bob" style={{ borderRadius: 26, marginBottom: 16 }}>
              <div style={{ background: "#ffffff", overflow: "hidden", borderRadius: 26,
                border: "1px solid #ece7f7",
                boxShadow: "0 40px 70px -30px rgba(60,40,110,.4)", padding: "26px 30px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
                  textTransform: "uppercase", color: "#b0a6c8", marginBottom: 8 }}>Course credit · {majorLabel}</div>

                {cc ? (
                  <>
                    <div className="ser" style={{ fontSize: 22, fontWeight: 600, color: "#1c1830", marginBottom: 6 }}>
                      Confirmed determinations
                    </div>
                    <div style={{ fontSize: 12.5, color: "#9a90b8", marginBottom: 18 }}>
                      Issued by {cc.by} · reviewed {cc.reviewedOn}
                    </div>
                    {cc.note && (
                      <p className="san" style={{ fontSize: 14, color: "#564d75", lineHeight: 1.6,
                        background: "#faf9fe", border: "1px solid #eee9f8", borderRadius: 14,
                        padding: "14px 16px", marginBottom: 18 }}>{cc.note}</p>
                    )}
                    <div style={{ display: "grid", gap: 2, borderTop: "1px solid #f0ecf9" }}>
                      {cc.courses.map((cr, k) => {
                        const noCred = /no credit/i.test(cr.result);
                        const lvl2 = /level\s*ii|level\s*2/i.test(cr.result);
                        const col = noCred ? "#dc2626" : (lvl2 ? "#16a34a" : "#d97706");
                        return (
                          <div key={k} style={{ display: "flex", gap: 14, padding: "16px 4px", alignItems: "flex-start",
                            borderBottom: k < cc.courses.length - 1 ? "1px solid #f4f1fb" : "none" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1830" }}>{cr.code}</div>
                              <div className="san" style={{ fontSize: 13, color: "#9a90b8", marginTop: 2 }}>{cr.title}</div>
                            </div>
                            <span className="san" style={{ fontSize: 12.5, fontWeight: 700, color: col,
                              background: col + "1a", borderRadius: 999, padding: "6px 12px", flexShrink: 0,
                              whiteSpace: "nowrap" }}>{cr.result}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 18,
                      paddingTop: 16, borderTop: "1px solid #f0ecf9", fontSize: 11.5, color: "#9a90b8" }}>
                      <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
                      <span>These are real past determinations for {majorLabel} majors at {schoolObj?.name}. Course offerings and rulings can change each term — re-confirm your exact courses & syllabi with your department before relying on them.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ser" style={{ fontSize: 22, fontWeight: 600, color: "#1c1830", marginBottom: 10 }}>
                      Not yet confirmed — here's how to get the real answer
                    </div>
                    <p className="san" style={{ fontSize: 14.5, color: "#564d75", lineHeight: 1.65, marginBottom: 20 }}>
                      Whether a specific course counts toward {majorLabel} — and at what level (major requirement, elective, Level I vs II) — is decided by your home department from the actual syllabus. It is <strong>not</strong> something this app can answer for you. Here's the process:
                    </p>
                    <div style={{ display: "grid", gap: 2, borderTop: "1px solid #f0ecf9", marginBottom: 22 }}>
                      {[
                        ["Find the host course catalog", `Look up ${picked.highlight}'s course list for your term.`],
                        ["Pull the syllabi", "Download the syllabus for each course you're considering."],
                        ["Map to your requirements", `Note which could fill ${majorLabel} requirements vs. electives vs. levels.`],
                        ["Email the right faculty", "Send your department/advisor the codes + syllabi and ask for a written ruling."],
                        ["Keep it in writing", "Save the reply — that email IS your credit confirmation."],
                      ].map(([h, d], k, arr) => (
                        <div key={k} style={{ display: "flex", gap: 14, padding: "15px 4px", alignItems: "flex-start",
                          borderBottom: k < arr.length - 1 ? "1px solid #f4f1fb" : "none" }}>
                          <div style={{ width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                            background: "#f0ebfa", display: "grid", placeItems: "center",
                            fontSize: 12, fontWeight: 800, color: "#7c4dff" }}>{k + 1}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1830", marginBottom: 2 }}>{h}</div>
                            <div className="san" style={{ fontSize: 13.5, color: "#564d75", lineHeight: 1.55 }}>{d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "#faf9fe", border: "1px solid #eee9f8", borderRadius: 16,
                      padding: "18px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1c1830" }}>Ready-to-send email to your advisor</div>
                        <button onClick={() => { try { navigator.clipboard.writeText(advisorEmail); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch (e) {} }}
                          className="pressable" style={{ fontSize: 12.5, fontWeight: 600, color: "#fff",
                            background: "#7c4dff", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
                          {copied ? "Copied ✓" : "Copy email"}
                        </button>
                      </div>
                      <pre className="san" style={{ whiteSpace: "pre-wrap", fontSize: 12.5, color: "#564d75",
                        lineHeight: 1.6, margin: 0, fontFamily: "inherit" }}>{advisorEmail}</pre>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 18,
                      fontSize: 11.5, color: "#9a90b8" }}>
                      <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
                      <span>This app deliberately does <strong>not</strong> guess course-credit outcomes — only a written ruling from your home department is valid, since it depends on your exact courses, syllabi, major and term.</span>
                    </div>
                  </>
                )}
              </div>
              </Tilt>
            );
          })()}

          {dashTab === "money" && (() => {
            const c = costInfo(picked.city, picked.country);
            const maxAmt = Math.max(...c.breakdown.map((b) => b.amt));
            return (
              <Tilt max={5} className="bob" style={{ borderRadius: 24, marginBottom: 16 }}>
              <div style={{ background: "#ffffff", borderRadius: 24, border: "1px solid #ece7f7",
                boxShadow: "0 30px 56px -28px rgba(60,40,110,.4)", overflow: "hidden" }}>
                <div onClick={() => setCostOpen((o) => !o)} style={{ padding: "24px 28px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 14, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
                        textTransform: "uppercase", color: "#b0a6c8", marginBottom: 6 }}>Cost of living</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <span className="ser" style={{ fontSize: 30, fontWeight: 600, color: "#1c1830" }}>
                          ~${c.studentMo.toLocaleString()}<span style={{ fontSize: 15, color: "#9a90b8", fontWeight: 400 }}>/mo</span>
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: c.tierColor,
                          background: c.tierColor + "1a", borderRadius: 999, padding: "5px 12px" }}>
                          {c.tier}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: "#7e96b4", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        Rough all-in student month. {c.vsNY}.
                        <span style={{ color: "#7c4dff", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
                          {costOpen ? "Hide" : "See"} breakdown
                          <ChevronDown style={{ width: 14, height: 14, transform: costOpen ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ position: "relative", width: 78, height: 78 }}>
                        <svg width="78" height="78" viewBox="0 0 78 78">
                          <circle cx="39" cy="39" r="33" fill="none" stroke="#efeaff" strokeWidth="9" />
                          <circle cx="39" cy="39" r="33" fill="none" stroke={c.tierColor} strokeWidth="9"
                            strokeLinecap="round" strokeDasharray={`${Math.min(c.idx, 130) / 130 * 207} 207`}
                            transform="rotate(-90 39 39)" />
                        </svg>
                        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                          <span style={{ fontSize: 17, fontWeight: 800, color: "#1c1830" }}>{c.idx}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 10.5, color: "#9a90b8", marginTop: 4 }}>index · NYC=100</div>
                    </div>
                  </div>
                </div>
                {costOpen && (
                  <div className="fad" style={{ borderTop: "1px solid #f0ecf9", padding: "22px 28px 26px",
                    background: "#fbfaff" }}>
                    <div style={{ display: "grid", gap: 16 }}>
                      {c.breakdown.map((b) => (
                        <div key={b.key}>
                          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#1c1830" }}>{b.key}</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#7c4dff" }}>~${b.amt.toLocaleString()}</span>
                          </div>
                          <div style={{ height: 7, borderRadius: 999, background: "#ece7f7", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 999, width: `${(b.amt / maxAmt) * 100}%`,
                              background: "linear-gradient(90deg,#9d6bff,#7c4dff)" }} />
                          </div>
                          <div style={{ fontSize: 11.5, color: "#9a90b8", marginTop: 5 }}>{b.note}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginTop: 20, paddingTop: 16, borderTop: "1px solid #ece7f7" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1c1830" }}>Estimated total</span>
                      <span className="ser" style={{ fontSize: 22, fontWeight: 600, color: "#1c1830" }}>~${c.studentMo.toLocaleString()}<span style={{ fontSize: 13, color: "#9a90b8", fontWeight: 400 }}>/mo</span></span>
                    </div>

                    <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid #ece7f7" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
                        textTransform: "uppercase", color: "#b0a6c8", marginBottom: 4 }}>Where you'll live</div>
                      <div style={{ fontSize: 12.5, color: "#9a90b8", marginBottom: 14 }}>
                        Typical arrangements programs in {picked.city} offer — housing is usually the choice that moves your budget most.
                      </div>
                      <div style={{ display: "grid", gap: 12 }}>
                        {c.housing.map((h) => (
                          <div key={h.type} style={{ background: "#fff", border: "1px solid #ece7f7",
                            borderRadius: 16, padding: "16px 18px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
                                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1c1830" }}>{h.type}</span>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: "#7c4dff",
                                    background: "#f0ebfa", borderRadius: 999, padding: "3px 9px" }}>{h.perk}</span>
                                </div>
                                <div style={{ fontSize: 12.5, color: "#6b6090", lineHeight: 1.5 }}>{h.desc}</div>
                              </div>
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div className="ser" style={{ fontSize: 19, fontWeight: 600, color: "#1c1830" }}>~${h.monthly.toLocaleString()}</div>
                                <div style={{ fontSize: 10.5, color: "#9a90b8" }}>/month</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 16,
                      fontSize: 11.5, color: "#9a90b8" }}>
                      <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
                      <span>Cost and housing figures are a planning model from 2026 cost-of-living data, not quotes. The exact housing types, prices and meal plans vary by program — confirm options with {picked.city}'s provider and your study-abroad office.</span>
                    </div>
                  </div>
                )}
              </div>
              </Tilt>
            );
          })()}

          {dashTab === "logistics" && (() => {
            const cp = countryProfile(picked.country);
            return (
              <Tilt max={5} className="bob" style={{ borderRadius: 24, marginBottom: 16 }}>
              <div style={{ background: "#ffffff", borderRadius: 24, border: "1px solid #ece7f7",
                boxShadow: "0 30px 56px -28px rgba(60,40,110,.4)", padding: "24px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
                  textTransform: "uppercase", color: "#b0a6c8", marginBottom: 16 }}>Before you go · {picked.country}</div>
                <div style={{ display: "grid", gap: 18 }}>
                  <div style={{ display: "flex", gap: 13 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                      background: "#f0ebfa", display: "grid", placeItems: "center" }}>
                      <Check style={{ width: 17, height: 17, color: "#7c4dff" }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1c1830", marginBottom: 3 }}>Safety — general orientation</div>
                      <div className="san" style={{ fontSize: 13.5, color: "#564d75", lineHeight: 1.55 }}>{cp.safety}</div>
                    </div>
                  </div>
                  <div>
                    <div onClick={() => setVisaOpen((o) => !o)} style={{ display: "flex", gap: 13, cursor: "pointer" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                        background: "#f0ebfa", display: "grid", placeItems: "center" }}>
                        <GraduationCap style={{ width: 17, height: 17, color: "#7c4dff" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1c1830", marginBottom: 3,
                          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          Visa & entry
                          {(() => { const vg = visaGuide(picked.country); return (
                            <span style={{ fontSize: 11, fontWeight: 700, color: vg.color,
                              background: vg.color + "1a", borderRadius: 999, padding: "3px 9px" }}>{vg.level}</span>
                          ); })()}
                          <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 600, color: "#7c4dff",
                            display: "inline-flex", alignItems: "center", gap: 4 }}>
                            {visaOpen ? "Hide steps" : "Step-by-step"}
                            <ChevronDown style={{ width: 14, height: 14, transform: visaOpen ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                          </span>
                        </div>
                        <div className="san" style={{ fontSize: 13.5, color: "#564d75", lineHeight: 1.55 }}>{cp.visa}</div>
                      </div>
                    </div>
                    {visaOpen && (() => {
                      const vg = visaGuide(picked.country);
                      return (
                        <div className="fad" style={{ marginTop: 16, marginLeft: 49 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
                            textTransform: "uppercase", color: "#b0a6c8", marginBottom: 4 }}>
                            Likely visa for {picked.country}
                          </div>
                          <div className="ser" style={{ fontSize: 17, fontWeight: 600, color: "#1c1830", marginBottom: 14 }}>
                            {vg.type}
                          </div>
                          {vg.note && (
                            <div style={{ display: "flex", gap: 9, alignItems: "flex-start",
                              background: vg.color + "12", border: `1px solid ${vg.color}33`,
                              borderRadius: 14, padding: "13px 15px", marginBottom: 16 }}>
                              <AlertCircle style={{ width: 15, height: 15, color: vg.color, flexShrink: 0, marginTop: 1 }} />
                              <div className="san" style={{ fontSize: 13, color: "#564d75", lineHeight: 1.55 }}>
                                <strong style={{ color: vg.color }}>{picked.country}: {vg.lead}.</strong> {vg.note.flag}
                              </div>
                            </div>
                          )}
                          {!vg.note && (
                            <div className="san" style={{ fontSize: 12.5, color: "#9a90b8", marginBottom: 14 }}>
                              General timing: <strong style={{ color: "#7c4dff" }}>{vg.lead}.</strong>{vg.schengen ? " Schengen long-stay rules apply for terms over 90 days." : ""}
                            </div>
                          )}
                          <div style={{ display: "grid", gap: 2 }}>
                            {vg.steps.map(([h, d], k) => (
                              <div key={k} style={{ display: "flex", gap: 13, padding: "13px 4px", alignItems: "flex-start",
                                borderBottom: k < vg.steps.length - 1 ? "1px solid #f4f1fb" : "none" }}>
                                <div style={{ width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                                  background: "#f0ebfa", display: "grid", placeItems: "center",
                                  fontSize: 11.5, fontWeight: 800, color: "#7c4dff" }}>{k + 1}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1c1830", marginBottom: 2 }}>{h}</div>
                                  <div className="san" style={{ fontSize: 13, color: "#564d75", lineHeight: 1.55 }}>{d}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 14,
                            fontSize: 11.5, color: "#9a90b8" }}>
                            <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
                            <span>This is the general shape of the process, not legal advice or a fee/form list. Exact requirements depend on your citizenship and consulate and change often — verify on the official {picked.country} consulate site and with your study-abroad office, and start early.</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 18,
                  paddingTop: 16, borderTop: "1px solid #f0ecf9", fontSize: 11.5, color: "#9a90b8" }}>
                  <AlertCircle style={{ width: 13, height: 13, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
                  <span>General orientation only — not legal or safety advice. Visa requirements depend on your citizenship and program length, and safety varies within a country. Always confirm current rules with {picked.country}'s consulate and your study-abroad office.</span>
                </div>
              </div>
              </Tilt>
            );
          })()}

          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12.5, color: "#9a90b8",
            background: "transparent", border: "none", borderRadius: 14, padding: "13px 16px", marginTop: 4 }}>
            <AlertCircle style={{ width: 15, height: 15, color: "#9d6bff", flexShrink: 0, marginTop: 1 }} />
            <span>Cultural & language notes are general orientation, and weather in the tile above is the <strong>typical seasonal climate</strong> (not a live forecast). Confirm program specifics with {schoolObj?.name}'s study-abroad office. Real photos of {picked.city} appear automatically once this app is published online.</span>
          </div>

          <button onClick={restart} className="pressable" style={{ ...cta, width: "100%", marginTop: 20 }}>Plan another trip</button>
        </Wrap>
      )}
    </>
  );


  return (
    <Canvas>
      {FONTS}
      <Nav step={step} restart={restart} />

      <div className={goingBack ? "page-back" : "page"} key={step}>

      {renderStep(step)}

      </div>

      {(() => {
        const idx = STEP_ORDER.indexOf(step);
        const nextKey = STEP_ORDER[idx + 1];
        if (step === "hero" || !nextKey) return null;
        if (step === "destinations" || step === "images") return null;
        if (nextKey === "dashboard" && !picked) return null;
        const SCALE = 0.3;
        return (
          <div className="peek-side" aria-hidden="true" style={{ position: "fixed", right: 0, top: "50%",
            transform: "translateY(-50%)", zIndex: 2, pointerEvents: "none",
            filter: "drop-shadow(-20px 24px 30px rgba(60,40,110,.26))" }}>
            <div style={{ maxHeight: "62vh", maxWidth: 360, overflow: "hidden", position: "relative",
              maskImage: "linear-gradient(100deg, transparent 0%, rgba(0,0,0,.5) 24%, #000 58%)",
              WebkitMaskImage: "linear-gradient(100deg, transparent 0%, rgba(0,0,0,.5) 24%, #000 58%)" }}>
              <div style={{ position: "absolute", top: 14, left: 20, zIndex: 5,
                display: "flex", alignItems: "center", gap: 7,
                fontSize: 9.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase",
                color: "#b9a3e8" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#b9a3e8"
                  strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {STEP_META[nextKey] ? STEP_META[nextKey].n : "Up next"}
              </div>
              <div style={{ zoom: SCALE, width: 1180,
                opacity: .32, filter: "saturate(.7) blur(.4px)" }}>
                {renderStep(nextKey)}
              </div>
            </div>
          </div>
        );
      })()}


      {!(step === "school" && open) && (
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "10px 0 50px",
          color: "#6b82a4", fontSize: 12 }}>
          Peel · honest by design — real program data, real climate, photos when published
        </div>
      )}
    </Canvas>
  );
}
