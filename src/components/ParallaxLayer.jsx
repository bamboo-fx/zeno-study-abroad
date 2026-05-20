import React, { useRef, useEffect } from "react";

// Parallax layer for the hero. Self-contained: attaches its own mousemove
// listener and moves children directly through refs. No React state, so it
// never re-renders the app and never restarts the entrance animations.
export function ParallaxLayer({ items }) {
  const refs = useRef([]);
  useEffect(() => {
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        refs.current.forEach((el, i) => {
          if (!el) return;
          const it = items[i];
          el.style.setProperty("--px", `${x * it.mx}px`);
          el.style.setProperty("--py", `${y * it.my}px`);
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, [items]);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }} className="fad">
      {items.map((it, i) => (
        <div key={it.key} ref={(el) => (refs.current[i] = el)}
          style={{ position: "absolute", top: it.top, right: it.right, bottom: it.bottom, left: it.left,
            width: it.w, pointerEvents: "auto",
            transform: "translate3d(var(--px,0),var(--py,0),0)",
            transition: "transform .5s cubic-bezier(.2,.7,.3,1)" }}>
          <div className="bob" style={{ animationDelay: it.dl }}>{it.node}</div>
        </div>
      ))}
    </div>
  );
}
