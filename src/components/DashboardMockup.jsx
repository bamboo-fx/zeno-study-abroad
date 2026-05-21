import React from "react";

// A faithful mini-mockup of the Peel dashboard for the scroll-reveal frame.
// Pure visual — not interactive — but built from the same design language so
// it accurately previews what a user gets after picking a destination.
export function DashboardMockup() {
  return (
    <div style={{ height: "100%", padding: 18, display: "flex", flexDirection: "column", gap: 12,
      background: "linear-gradient(180deg,#ffffff 0%,#fbfaff 100%)" }}>
      {/* immersive destination tile mock */}
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", flex: "0 0 auto",
        height: 150, background: "linear-gradient(135deg,#1f3a5f,#2c5282 60%,#1a365d)",
        boxShadow: "0 30px 56px -28px rgba(60,40,110,.4)" }}>
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(20,16,40,.15) 0%, rgba(20,16,40,.1) 38%, rgba(20,16,40,.78) 100%)" }} />
        <div style={{ position: "relative", padding: "16px 18px" }}>
          <div className="ser" style={{ fontSize: 24, fontWeight: 600, color: "#fff",
            textShadow: "0 3px 24px rgba(0,0,0,.5)" }}>Edinburgh</div>
          <div className="san" style={{ fontSize: 11, color: "rgba(255,255,255,.9)", marginTop: 3 }}>
            IFSA – University of Edinburgh · Claremont McKenna College
          </div>
        </div>
        <div style={{ position: "absolute", left: 14, bottom: 12, display: "flex", alignItems: "center", gap: 9,
          background: "rgba(255,255,255,.14)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,.25)", borderRadius: 12, padding: "7px 11px" }}>
          <div style={{ width: 26, height: 26, borderRadius: 8,
            background: "linear-gradient(135deg,#9d7bff,#7c4dff)", display: "grid", placeItems: "center",
            color: "#fff", fontSize: 13 }}>☂</div>
          <div>
            <div className="san" style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em",
              textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>Fall semester</div>
            <div className="san" style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Cool & often rainy</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 14, bottom: 12,
          background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.22)",
          borderRadius: 12, padding: "8px 12px", maxWidth: 220 }}>
          <div className="san" style={{ fontSize: 9, color: "rgba(255,255,255,.7)", fontWeight: 700,
            letterSpacing: ".08em", textTransform: "uppercase" }}>Past student</div>
          <div className="san" style={{ fontSize: 10.5, color: "#fff", marginTop: 3, lineHeight: 1.35 }}>
            "Fall in Edinburgh hits with the wind off the Firth…"
          </div>
        </div>
      </div>
      {/* tab bar mock */}
      <div style={{ display: "flex", gap: 5, flex: "0 0 auto" }}>
        {[["Overview", true], ["Courses", false], ["Expenses", false], ["Logistics", false]].map(([l, on], i) => (
          <div key={i} style={{ flex: 1, padding: "7px 8px", borderRadius: 9, fontSize: 11, fontWeight: 600,
            textAlign: "center",
            background: on ? "#7c4dff" : "#fff", color: on ? "#fff" : "#7a6f95",
            border: on ? "none" : "1px solid #e6e0f5" }}>{l}</div>
        ))}
      </div>
      {/* content row 1: about + cost */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10, flex: "0 0 auto" }}>
        <div style={{ background: "#fff", border: "1px solid #ece7f7", borderRadius: 14, padding: 13,
          boxShadow: "0 14px 28px -16px rgba(60,40,110,.25)" }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#b0a6c8", marginBottom: 5 }}>About Edinburgh</div>
          <div className="ser" style={{ fontSize: 14, fontWeight: 600, color: "#1c1830", marginBottom: 4 }}>
            Medieval Old Town and a 1583 university.
          </div>
          <p className="san" style={{ fontSize: 10.5, color: "#564d75", lineHeight: 1.5, margin: 0 }}>
            English — no language barrier. Pub-centered social life; budget flights make weekend trips across Europe cheap.
          </p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ece7f7", borderRadius: 14, padding: 13,
          boxShadow: "0 14px 28px -16px rgba(60,40,110,.25)" }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#b0a6c8", marginBottom: 4 }}>Cost</div>
          <div className="ser" style={{ fontSize: 19, fontWeight: 600, color: "#1c1830" }}>~$1,610<span style={{ fontSize: 10, color: "#9a90b8" }}>/mo</span></div>
          <span style={{ display: "inline-block", marginTop: 4, fontSize: 9, fontWeight: 700, color: "#d97706",
            background: "#d977061a", borderRadius: 999, padding: "2px 7px" }}>Pricey</span>
          <div style={{ fontSize: 9.5, color: "#7e96b4", marginTop: 6 }}>27% below NYC</div>
        </div>
      </div>
      {/* content row 2: climate strip */}
      <div style={{ background: "#fff", border: "1px solid #ece7f7", borderRadius: 14, padding: 13,
        boxShadow: "0 14px 28px -16px rgba(60,40,110,.25)", flex: "0 0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#b0a6c8" }}>Climate by month</div>
          <div className="san" style={{ fontSize: 9.5, color: "#9a90b8" }}>°F · live from Open-Meteo</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 6 }}>
          {[["Aug","64"],["Sep","58"],["Oct","51"],["Nov","45"],["Dec","41"],["Jan","40"]].map(([m, t], i) => (
            <div key={i} style={{ background: "#faf9fe", borderRadius: 8, padding: "8px 4px", textAlign: "center" }}>
              <div className="san" style={{ fontSize: 8.5, color: "#9a90b8", fontWeight: 700,
                letterSpacing: ".08em", textTransform: "uppercase" }}>{m}</div>
              <div className="ser" style={{ fontSize: 14, fontWeight: 600, color: "#1c1830", marginTop: 2 }}>{t}°</div>
            </div>
          ))}
        </div>
      </div>
      {/* content row 3: logistics + day-in-life */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 10, flex: 1, minHeight: 0 }}>
        <div style={{ background: "#fff", border: "1px solid #ece7f7", borderRadius: 14, padding: 13,
          boxShadow: "0 14px 28px -16px rgba(60,40,110,.25)" }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#b0a6c8", marginBottom: 6 }}>Visa</div>
          <div className="ser" style={{ fontSize: 13, fontWeight: 600, color: "#1c1830", marginBottom: 4 }}>
            Student visa needed
          </div>
          <div className="san" style={{ fontSize: 10, color: "#564d75", lineHeight: 1.5 }}>
            Apply ~3 months out · biometrics in person · ~£490
          </div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#faf9fe,#fff)", border: "1px solid #ece7f7",
          borderRadius: 14, padding: 13, boxShadow: "0 14px 28px -16px rgba(60,40,110,.25)" }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#b0a6c8", marginBottom: 6 }}>A day in your life</div>
          <div className="san" style={{ fontSize: 10.5, color: "#564d75", lineHeight: 1.55 }}>
            Coffee on Cockburn St → 10am lecture at George Square → reading in the National Library → pub night with classmates in Grassmarket.
          </div>
        </div>
      </div>
    </div>
  );
}
