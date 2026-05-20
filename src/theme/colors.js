// Unified holographic theme — deep space blue/violet, glowing cyan accents.
export const INK = "#1c1830";          // primary dark text on white
export const CREAM = "#ffffff";        // base white background
export const ACC = "#7c4dff";          // accent purple
export const ACC2 = "#9d6bff";         // lighter purple
export const GLOW = "rgba(124,77,255,.25)";

// Shared style objects (stable references, module scope). Kept simple & flat.
export const CTA = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
  background: "#7c4dff", color: "#ffffff", fontWeight: 700, fontSize: 15,
  border: "none", borderRadius: 14, padding: "16px 30px", cursor: "pointer",
  boxShadow: "0 8px 20px rgba(124,77,255,.28)",
};
export const GHOST = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
  background: "#ffffff", color: "#5a4d7a", fontWeight: 600, fontSize: 15,
  border: "1px solid #e6e0f5", borderRadius: 14, padding: "16px 26px", cursor: "pointer",
};
export const CARD = {
  background: "#ffffff", border: "1px solid #ece7f7", borderRadius: 20,
  boxShadow: "0 10px 30px -16px rgba(60,40,110,.18)",
};
