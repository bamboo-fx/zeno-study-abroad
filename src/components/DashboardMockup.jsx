import React from "react";

// A faithful mini-mockup of the Peel dashboard for the scroll-reveal frame.
// Pure visual — not interactive — but built from the same design language so
// it accurately previews what a user gets after picking a destination.
export function DashboardMockup() {
  return (
    <div style={{ height: "100%", padding: 22, display: "flex", flexDirection: "column", gap: 14,
      background: "linear-gradient(180deg,#ffffff 0%,#fbfaff 100%)" }}>
      {/* immersive destination tile mock */}
      <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", flex: "0 0 auto",
        height: 200, background: "linear-gradient(135deg,#1f3a5f,#2c5282 60%,#1a365d)",
        boxShadow: "0 30px 56px -28px rgba(60,40,110,.4)" }}>
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(20,16,40,.15) 0%, rgba(20,16,40,.1) 38%, rgba(20,16,40,.78) 100%)" }} />
        <div style={{ position: "relative", padding: "20px 22px" }}>
          <div className="ser" style={{ fontSize: 30, fontWeight: 600, color: "#fff",
            textShadow: "0 3px 24px rgba(0,0,0,.5)" }}>Edinburgh</div>
          <div className="san" style={{ fontSize: 12, color: "rgba(255,255,255,.9)", marginTop: 4 }}>
            IFSA – University of Edinburgh · Claremont McKenna College
          </div>
        </div>
        <div style={{ position: "absolute", left: 16, bottom: 14, display: "flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,.14)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,.25)", borderRadius: 14, padding: "9px 13px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 9,
            background: "linear-gradient(135deg,#9d7bff,#7c4dff)", display: "grid", placeItems: "center",
            color: "#fff", fontSize: 14 }}>☂</div>
          <div>
            <div className="san" style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em",
              textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>Fall semester</div>
            <div className="san" style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Cool & often rainy</div>
          </div>
        </div>
      </div>
      {/* tab bar mock */}
      <div style={{ display: "flex", gap: 6, flex: "0 0 auto" }}>
        {[["Overview", true], ["Courses", false], ["Expenses", false], ["Logistics", false]].map(([l, on], i) => (
          <div key={i} style={{ flex: 1, padding: "8px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600,
            textAlign: "center",
            background: on ? "#7c4dff" : "#fff", color: on ? "#fff" : "#7a6f95",
            border: on ? "none" : "1px solid #e6e0f5" }}>{l}</div>
        ))}
      </div>
      {/* tiny content cards row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, flex: 1, minHeight: 0 }}>
        <div style={{ background: "#fff", border: "1px solid #ece7f7", borderRadius: 16, padding: 16,
          boxShadow: "0 14px 28px -16px rgba(60,40,110,.25)" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#b0a6c8", marginBottom: 6 }}>About Edinburgh</div>
          <div className="ser" style={{ fontSize: 16, fontWeight: 600, color: "#1c1830", marginBottom: 6 }}>
            Medieval Old Town and a 1583 university.
          </div>
          <p className="san" style={{ fontSize: 11, color: "#564d75", lineHeight: 1.5 }}>
            English — no language barrier. Pub-centered social life; budget flights make weekend trips across Europe cheap.
          </p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ece7f7", borderRadius: 16, padding: 16,
          boxShadow: "0 14px 28px -16px rgba(60,40,110,.25)" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#b0a6c8", marginBottom: 6 }}>Cost</div>
          <div className="ser" style={{ fontSize: 22, fontWeight: 600, color: "#1c1830" }}>~$1,610<span style={{ fontSize: 11, color: "#9a90b8" }}>/mo</span></div>
          <span style={{ display: "inline-block", marginTop: 6, fontSize: 10, fontWeight: 700, color: "#d97706",
            background: "#d977061a", borderRadius: 999, padding: "3px 8px" }}>Pricey</span>
          <div style={{ fontSize: 10, color: "#7e96b4", marginTop: 8 }}>27% below NYC</div>
        </div>
      </div>
    </div>
  );
}
