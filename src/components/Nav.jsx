import React from "react";

export function Nav({ step, restart }) {
  return (
    <div style={{ position: "relative", zIndex: 5, maxWidth: 1180, margin: "0 auto",
      padding: "26px 28px", display: "flex", alignItems: "center", gap: 14 }}>
      <div onClick={restart} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 38, height: 38, borderRadius: 13, background: "linear-gradient(135deg,#4ea8ff,#9d7bff)",
          display: "grid", placeItems: "center", boxShadow: "0 8px 22px rgba(78,168,255,.4)" }}>
          <svg width="23" height="23" viewBox="0 0 64 64" fill="none">
            {/* sticker body — circle with the bottom-right corner peeled away */}
            <path d="M32 5C46.9 5 59 17.1 59 32c0 6.0-2 11.6-5.3 16.1-3 .2-6.6 1.6-9.9 4.6
                     -3.4 3.1-5.1 6.9-5.5 9.9C33.9 58.4 32.9 59 32 59 17.1 59 5 46.9 5 32 5 17.1 17.1 5 32 5Z"
              fill="#fff" />
            {/* the peeled-up curl flap */}
            <path d="M53.7 48.1c-3.6 4.9-8.9 8.5-15 10
                     .4-3 2.1-6.8 5.5-9.9 3.3-3 6.9-4.4 9.9-4.6
                     a27 27 0 0 1-.4 4.5Z"
              fill="rgba(255,255,255,.45)" stroke="#fff" strokeWidth="2.4"
              strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="ser" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-.02em" }}>Peel</div>
          <div style={{ fontSize: 11, color: "#7e96b4", marginTop: -2 }}>Every Layer of Every Country</div>
        </div>
      </div>
      {step !== "hero" && (
        <button onClick={restart} className="pressable"
          style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "#9fb3cf", background: "rgba(18,34,58,.5)",
            border: "1px solid rgba(78,168,255,.2)", borderRadius: 999, padding: "9px 18px", cursor: "pointer" }}>
          Start over
        </button>
      )}
    </div>
  );
}
