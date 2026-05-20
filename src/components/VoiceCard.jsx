import React from "react";

export function VoiceCard({ v }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #ece7f7", borderRadius: 26,
      padding: "32px 30px 28px", boxShadow: "0 22px 44px -22px rgba(60,40,110,.32)" }}>
      <p className="san" style={{ fontSize: 16, color: "#1c1830", lineHeight: 1.6, marginBottom: 22 }}>
        “{v.quote}”
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 999, flexShrink: 0,
          background: "#f6f1ff", display: "grid", placeItems: "center",
          fontSize: 26, lineHeight: 1,
          fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}>
          {v.emoji}
        </div>
        <div className="san" style={{ fontSize: 13, color: "#9a90b8", lineHeight: 1.4 }}>{v.who}</div>
      </div>
    </div>
  );
}
export function VoiceColumn({ items, duration = 32, delay = 0, className }) {
  return (
    <div className={className} style={{ overflow: "hidden", flex: "1 1 0", minWidth: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22,
        animation: `vmarquee ${duration}s linear ${delay}s infinite`, willChange: "transform" }}>
        {[0, 1].map((dup) => (
          <React.Fragment key={dup}>
            {items.map((v, i) => <VoiceCard key={dup + "-" + i} v={v} />)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
