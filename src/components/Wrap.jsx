import React from "react";

export function Wrap({ children, narrow }) {
  return (
    <div style={{ position: "relative", zIndex: 4, maxWidth: narrow ? 720 : 1180, margin: "0 auto", padding: "12px 28px 90px" }}>
      {children}
    </div>
  );
}
