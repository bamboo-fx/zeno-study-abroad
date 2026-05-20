import React from "react";
import { INK, CREAM } from "../theme/colors.js";

export function Canvas({ children }) {
  return (
    <div className="san" style={{ minHeight: "100vh", width: "100%", color: INK, position: "relative", overflow: "hidden",
      background: `radial-gradient(900px 600px at 12% -10%, #f3eeff 0%, transparent 55%),
                   radial-gradient(800px 700px at 100% 0%, #efe9ff 0%, transparent 55%),
                   ${CREAM}` }}>
      {/* shader-feel: slow drifting blurred color blobs (aurora-like depth, on white) */}
      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none"
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 0, mixBlendMode: "multiply" }}>
        <defs>
          <filter id="blobBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="90" />
          </filter>
          <radialGradient id="blobA"><stop offset="0%" stopColor="#b9a0ff" stopOpacity=".55" /><stop offset="100%" stopColor="#b9a0ff" stopOpacity="0" /></radialGradient>
          <radialGradient id="blobB"><stop offset="0%" stopColor="#7c4dff" stopOpacity=".45" /><stop offset="100%" stopColor="#7c4dff" stopOpacity="0" /></radialGradient>
          <radialGradient id="blobC"><stop offset="0%" stopColor="#4ea8ff" stopOpacity=".4" /><stop offset="100%" stopColor="#4ea8ff" stopOpacity="0" /></radialGradient>
          <radialGradient id="blobD"><stop offset="0%" stopColor="#d9a0ff" stopOpacity=".4" /><stop offset="100%" stopColor="#d9a0ff" stopOpacity="0" /></radialGradient>
        </defs>
        <g filter="url(#blobBlur)" opacity=".95">
          <circle r="320" fill="url(#blobA)">
            <animate attributeName="cx" values="220;520;160;320;220" dur="38s" repeatCount="indefinite" />
            <animate attributeName="cy" values="160;320;520;240;160" dur="42s" repeatCount="indefinite" />
          </circle>
          <circle r="380" fill="url(#blobB)">
            <animate attributeName="cx" values="1180;860;1240;1020;1180" dur="46s" repeatCount="indefinite" />
            <animate attributeName="cy" values="160;320;520;220;160" dur="50s" repeatCount="indefinite" />
          </circle>
          <circle r="300" fill="url(#blobC)">
            <animate attributeName="cx" values="720;420;980;620;720" dur="52s" repeatCount="indefinite" />
            <animate attributeName="cy" values="700;520;760;620;700" dur="44s" repeatCount="indefinite" />
          </circle>
          <circle r="260" fill="url(#blobD)">
            <animate attributeName="cx" values="320;820;220;560;320" dur="56s" repeatCount="indefinite" />
            <animate attributeName="cy" values="780;620;480;820;780" dur="48s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      {children}
    </div>
  );
}
