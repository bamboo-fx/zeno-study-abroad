import React, { useState, useRef, useEffect } from "react";

import { G } from "./theme/gradients.js";
import { FONTS } from "./theme/fonts.jsx";

import { VIBES, CONTINENTS, SCHOOLS, SCORE_MAP } from "./data/options.js";
import { TESTI, GEN_TESTI } from "./data/testimonials.js";
import { DATA, loadPrograms } from "./data/programs.js";
import { matchSubjects } from "./data/majorSubjects.js";

const EMPTY_SRC = { neon:{}, cobble:{}, beach:{}, nordic:{}, cafe:{}, alpine:{}, market:{}, campus:{} };

import { Canvas } from "./components/Canvas.jsx";
import { Nav } from "./components/Nav.jsx";

import { Hero } from "./steps/Hero.jsx";
import { MajorStep } from "./steps/MajorStep.jsx";
import { ProfileStep } from "./steps/ProfileStep.jsx";
import { ContinentStep, CONT_GRAD } from "./steps/ContinentStep.jsx";
import { SchoolStep } from "./steps/SchoolStep.jsx";
import { VibeStep } from "./steps/VibeStep.jsx";
import { DestinationsStep } from "./steps/DestinationsStep.jsx";
import { Dashboard } from "./steps/Dashboard.jsx";

export default function App() {
  const [step, setStep] = useState("hero");
  const STEP_ORDER = ["hero", "school", "major", "profile", "continent", "images", "destinations", "dashboard"];
  const STEP_META = {
    school: { label: "Pick your college", n: "Step 1", grad: G.campus },
    major: { label: "Choose your major", n: "Step 2", grad: G.cafe },
    profile: { label: "Sharpen the ranking", n: "Optional", grad: G.nordic },
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
  // Mirrors the school-step dropdown's open state so the page footer can hide
  // while the dropdown is showing. SchoolStep owns the real state.
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [gpa, setGpa] = useState(null);
  const [termPref, setTermPref] = useState(null);
  const [langProf, setLangProf] = useState([]);
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
  const hydratedRef = useRef(false);
  const pendingCityRef = useRef(null);

  // Live program list per school. Falls back to mock DATA[school] when no
  // live source is configured. See loadPrograms in src/data/programs.js.
  const [srcPrograms, setSrcPrograms] = useState(null);
  const [srcLoading, setSrcLoading] = useState(false);
  useEffect(() => {
    if (!school) { setSrcPrograms(null); return; }
    let alive = true;
    setSrcLoading(true);
    loadPrograms(school).then((p) => {
      if (alive) { setSrcPrograms(p); setSrcLoading(false); }
    }).catch(() => { if (alive) { setSrcPrograms(DATA[school] || EMPTY_SRC); setSrcLoading(false); } });
    return () => { alive = false; };
  }, [school]);

  // Live seasonal climate for the picked city. Falls back to the static CLIM
  // bucket if Open-Meteo is unreachable.
  const [liveClim, setLiveClim] = useState(null);
  useEffect(() => {
    if (!picked) { setLiveClim(null); return; }
    let alive = true;
    setLiveClim(null);
    import("./data/liveClim.js").then(({ fetchCityClim }) => fetchCityClim(picked.city, picked.country))
      .then((c) => { if (alive) setLiveClim(c); })
      .catch(() => { if (alive) setLiveClim(null); });
    return () => { alive = false; };
  }, [picked]);

  // Shareable URL: hash params encode the current step + selections so a link
  // like #step=destinations&school=cmc&vibe=cobble&continent=europe deep-links
  // back to the same place. `picked` is resolved from SRC once programs load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const sch = params.get("school");
    if (sch && SCHOOLS.some((x) => x.id === sch)) {
      setSchool(sch);
      const name = SCHOOLS.find((x) => x.id === sch)?.name;
      if (name) setQuery(name);
    }
    const mj = params.get("major"); if (mj) setMajor(mj);
    const g = params.get("gpa"); if (g) { const n = parseFloat(g); if (Number.isFinite(n)) setGpa(n); }
    const tp = params.get("term"); if (tp) setTermPref(tp);
    const lp = params.get("lang"); if (lp) {
      try {
        const parsed = lp.split(",").map((s) => { const [language, level] = s.split(":"); return { language, level }; })
                         .filter((x) => x.language && x.level);
        if (parsed.length) setLangProf(parsed.slice(0, 3));
      } catch {}
    }
    const cont = params.get("continent"); if (cont) setContinent(cont);
    const vibe = params.get("vibe"); if (vibe) { setSelected([vibe]); setDestKey(vibe); }
    const city = params.get("city"); if (city) pendingCityRef.current = city;
    const stp = params.get("step"); if (stp) setStep(stp);
    hydratedRef.current = true;
  }, []);

  // Resolve `picked` from the city param once programs for the school load.
  useEffect(() => {
    if (!pendingCityRef.current || !srcPrograms || !destKey) return;
    const byCont = srcPrograms[destKey] || {};
    const all = [...(byCont.europe||[]),...(byCont.asia||[]),...(byCont.oceania||[]),...(byCont.americas||[])];
    const match = all.find((d) => d.city === pendingCityRef.current);
    if (match) { setPicked(match); pendingCityRef.current = null; }
  }, [srcPrograms, destKey]);

  // Mirror state into the URL hash. Skip until hydration completes, and keep
  // the hero URL clean (no junk after the path).
  useEffect(() => {
    if (!hydratedRef.current) return;
    const base = window.location.pathname + window.location.search;
    if (step === "hero") { window.history.replaceState(null, "", base); return; }
    const p = new URLSearchParams();
    p.set("step", step);
    if (school) p.set("school", school);
    if (major) p.set("major", major);
    if (gpa != null) p.set("gpa", String(gpa));
    if (termPref) p.set("term", termPref);
    if (langProf.length) p.set("lang", langProf.map((l) => `${l.language}:${l.level}`).join(","));
    if (continent) p.set("continent", continent);
    if (destKey) p.set("vibe", destKey);
    if (picked?.city) p.set("city", picked.city);
    window.history.replaceState(null, "", `${base}#${p.toString()}`);
  }, [step, school, major, gpa, termPref, langProf, continent, destKey, picked]);

  const schoolObj = SCHOOLS.find((s) => s.id === school);
  const contLabel = CONTINENTS.find((c) => c.id === continent)?.label;
  const contGrad = CONT_GRAD[continent] || null;

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

  const SRC = srcPrograms || (school ? (DATA[school] || EMPTY_SRC) : EMPTY_SRC);
  const activeCont = continent || null;
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
  // Major fit comes from real program subject areas now (see matchSubjects).
  // The hash-based "match %" below is a placeholder until Phase 4 replaces it
  // with a transparent weighted sum across {subject, language, term, vibe,
  // credit-history}. In the meantime we surface subject match as the primary
  // signal so the ranking is at least defensible — no more city-array hack.
  const matchScore = (dd, i) => {
    const sm = matchSubjects(dd, major);                 // 0..1
    const subjectComponent = Math.round(sm.score * 40);  // up to 40 pts
    // Tiny deterministic jitter so two equal scores don't shuffle on render.
    const s = (dd.city + dd.country + (destKey || "")).split("")
      .reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const jitter = s % 9;
    return 50 + subjectComponent + jitter - i * 2;
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
  const restart = () => { setStep("hero"); setSchool(""); setMajor(null); setGpa(null); setTermPref(null); setLangProf([]); setQuery(""); setContinent(null); setSelected([]); setDestKey(null); setPicked(null); setChatInput(""); setChatNote(""); window.scrollTo({ top: 0, behavior: "auto" }); };

  const testiFor = (city, clim, sem) => (TESTI[city] || GEN_TESTI(city, clim))[sem];


  const renderStep = (s) => (
    <>
      {s === "hero" && <Hero setStep={setStep} />}

      {s === "school" && (
        <SchoolStep
          school={school} setSchool={setSchool}
          query={query} setQuery={setQuery}
          setStep={setStep} restart={restart}
          onOpenChange={setSchoolDropdownOpen}
        />
      )}

      {s === "major" && <MajorStep major={major} setMajor={setMajor} setStep={setStep} />}

      {s === "profile" && (
        <ProfileStep
          gpa={gpa} setGpa={setGpa}
          termPref={termPref} setTermPref={setTermPref}
          langProf={langProf} setLangProf={setLangProf}
          setStep={setStep}
        />
      )}

      {s === "continent" && <ContinentStep setContinent={setContinent} setSelected={setSelected} setStep={setStep} />}

      {s === "images" && (
        <VibeStep
          selected={selected} toggleVibe={toggleVibe}
          setStep={setStep} findFromSelected={findFromSelected}
          contGrad={contGrad} contLabel={contLabel} schoolObj={schoolObj}
          chatInput={chatInput} setChatInput={setChatInput}
          chatNote={chatNote} setChatNote={setChatNote} submitChat={submitChat}
          cityPreview={cityPreview}
        />
      )}

      {s === "destinations" && (
        <DestinationsStep
          srcLoading={srcLoading} chosen={chosen} ranked={ranked}
          primaryVibe={primaryVibe} contLabel={contLabel} schoolObj={schoolObj} major={major}
          destIdx={destIdx} setDestIdx={setDestIdx} destDirRef={destDirRef}
          choose={choose} setStep={setStep}
        />
      )}

      {s === "dashboard" && picked && (
        <Dashboard
          picked={picked} school={school} major={major} schoolObj={schoolObj}
          semTab={semTab} setSemTab={setSemTab} setDayOpen={setDayOpen}
          dashTab={dashTab} setDashTab={setDashTab}
          costOpen={costOpen} setCostOpen={setCostOpen}
          visaOpen={visaOpen} setVisaOpen={setVisaOpen}
          copied={copied} setCopied={setCopied}
          liveClim={liveClim} testiFor={testiFor}
          setStep={setStep} restart={restart}
        />
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


      {!(step === "school" && schoolDropdownOpen) && (
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "10px 0 50px",
          color: "#6b82a4", fontSize: 12 }}>
          Peel · honest by design — live programs from each school's official portal · climate from Open-Meteo · photos from program portals & Wikipedia
        </div>
      )}
    </Canvas>
  );
}
