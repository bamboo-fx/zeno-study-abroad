import React from "react";

export function Pill({ children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600,
      letterSpacing: ".06em", textTransform: "uppercase", color: "#4ea8ff",
      background: "rgba(78,168,255,.12)", border: "1px solid rgba(78,168,255,.28)",
      borderRadius: 999, padding: "7px 15px" }}>{children}</div>
  );
}
