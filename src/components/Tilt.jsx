import React, { useRef } from "react";

// 3D tilt-on-hover wrapper.
// IMPORTANT: writes the transform straight to the DOM via a ref and never
// calls setState, so moving the mouse does NOT re-render React (which was
// what made every icon/animation restart on each mouse move).
export function Tilt({ children, max = 8, className = "", style = {}, onClick }) {
  const ref = useRef(null);
  const apply = (rx, ry, s) => {
    const el = ref.current; if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`;
  };
  const move = (e) => {
    const el = ref.current; if (!el) return;
    // fast follow while pointer is over the card
    el.style.transition = "transform .12s linear";
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    apply((-py * max).toFixed(2), (px * max).toFixed(2), 1.02);
  };
  const leave = () => {
    const el = ref.current; if (!el) return;
    // smooth eased settle back to rest
    el.style.transition = "transform .7s var(--ease)";
    apply(0, 0, 1);
  };
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} onClick={onClick}
      className={className}
      style={{ ...style, transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform .7s var(--ease)", transformStyle: "preserve-3d", willChange: "transform" }}>
      {children}
    </div>
  );
}
