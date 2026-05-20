import React from "react";

export const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700&display=swap');
    :root{
      --ease:cubic-bezier(.22,1,.36,1);
      --ease-soft:cubic-bezier(.4,0,.2,1);
      --dur:.66s;
    }
    *{box-sizing:border-box}
    *,*::before,*::after{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
    .ser{font-family:'Fraunces',Georgia,serif}
    .san{font-family:'Manrope',system-ui,sans-serif}

    /* entrance — gentler distance, unified curve, soft blur-in */
    @keyframes fl{from{opacity:0;transform:translateY(14px);filter:blur(4px)}to{opacity:1;transform:none;filter:blur(0)}}
    @keyframes fad{from{opacity:0}to{opacity:1}}
    @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes vmarquee{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}
    .hide-md{display:none}.hide-lg{display:none}
    @media (min-width:760px){.hide-md{display:block}}
    @media (min-width:1024px){.hide-lg{display:block}}
    @keyframes bobC{0%,100%{transform:translateY(-50%)}50%{transform:translateY(calc(-50% - 12px))}}
    .bobC{animation:bobC 7.5s ease-in-out infinite}
    .fl{animation:fl var(--dur) var(--ease) both}
    .fad{animation:fad .55s var(--ease-soft) both}
    .bob{animation:bob 7.5s ease-in-out infinite}

    /* page-level transition between steps */
    @keyframes pageIn{0%{opacity:0;transform:translateX(110vw)}12%{opacity:1}100%{opacity:1;transform:translateX(0)}}
    .page{animation:pageIn 2.1s cubic-bezier(.16,.84,.3,1) both;position:relative;z-index:4}
    @keyframes pageInBack{0%{opacity:0;transform:translateX(-110vw)}12%{opacity:1}100%{opacity:1;transform:translateX(0)}}
    .page-back{animation:pageInBack 2.1s cubic-bezier(.16,.84,.3,1) both;position:relative;z-index:4}
    @keyframes cardSwipeNext{0%{opacity:0;transform:translateX(680px) scale(.94)}14%{opacity:1}100%{opacity:1;transform:translateX(0) scale(1)}}
    @keyframes cardSwipePrev{0%{opacity:0;transform:translateX(-680px) scale(.94)}14%{opacity:1}100%{opacity:1;transform:translateX(0) scale(1)}}
    .cswipe-next{animation:cardSwipeNext 1.15s cubic-bezier(.16,.84,.3,1) both}
    .cswipe-prev{animation:cardSwipePrev 1.15s cubic-bezier(.16,.84,.3,1) both}
    @keyframes peekIn{from{opacity:0;transform:translateY(-50%) translateX(120%)}to{opacity:1;transform:translateY(-50%) translateX(0)}}
    @keyframes peekBob{0%,100%{transform:translateX(0)}50%{transform:translateX(-7px)}}
    .peek-side{animation:peekIn .8s var(--ease) both}
    .peek-inner{animation:peekBob 3.4s ease-in-out infinite}
    @media (max-width:1100px){.peek-side{display:none!important}}
    .vibegrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
    @media (max-width:860px){.vibegrid{grid-template-columns:repeat(2,1fr)}}
    @media (max-width:520px){.vibegrid{grid-template-columns:1fr}}
    /* "fly there" — zoom/expand in like arriving at a place */
    @keyframes flyIn{0%{opacity:0;transform:scale(.62) translateY(40px);filter:blur(12px)}60%{opacity:1;filter:blur(0)}100%{opacity:1;transform:scale(1) translateY(0);filter:blur(0)}}
    .flyin{animation:flyIn .9s var(--ease) both}
    @keyframes flyInSoft{0%{opacity:0;transform:scale(.86);filter:blur(6px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}
    .flyin-soft{animation:flyInSoft .8s var(--ease) both}
    @keyframes flowDash{to{stroke-dashoffset:-2000}}
    @keyframes flowSway{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-38px) scaleY(1.08)}}
    @keyframes flowSway2{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(44px) scaleY(.93)}}
    @keyframes flowDash{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-1200}}
    @keyframes flowDashRev{0%{stroke-dashoffset:0}100%{stroke-dashoffset:1200}}
    @keyframes flowGlow{0%,100%{opacity:.5}50%{opacity:.9}}
    @keyframes heroPlane{0%{left:-30%;top:66%;transform:rotate(-7deg);opacity:0}4%{opacity:1}30%{left:120%;top:14%;transform:rotate(-12deg);opacity:1}31%{opacity:0}100%{left:120%;top:14%;opacity:0}}


    /* hover / press — same curve everywhere, springy but calm */
    .lift{transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
    .lift:hover{transform:translateY(-6px)}
    .pressable{transition:transform .28s var(--ease),box-shadow .28s var(--ease),background .28s var(--ease-soft),border-color .28s var(--ease-soft),color .28s var(--ease-soft)}
    .pressable:hover{transform:translateY(-2px)}
    .pressable:active{transform:scale(.975)}
    button,a,input{transition:background .28s var(--ease-soft),border-color .28s var(--ease-soft),color .28s var(--ease-soft),box-shadow .28s var(--ease-soft)}

    @keyframes wfx-rain{to{transform:translateY(150%)}}
    @keyframes wfx-snow{0%{transform:translateY(0) translateX(0)}50%{transform:translateY(450%) translateX(24px)}100%{transform:translateY(900%) translateX(-10px)}}
    @keyframes wfx-leaf{0%{transform:translateY(0) translateX(0) rotate(0)}50%{transform:translateY(450%) translateX(38px) rotate(180deg)}100%{transform:translateY(900%) translateX(-12px) rotate(360deg)}}
    @keyframes wfx-petal{0%{transform:translateY(0) translateX(0) rotate(0)}25%{transform:translateY(220%) translateX(34px) rotate(90deg)}50%{transform:translateY(450%) translateX(-20px) rotate(180deg)}75%{transform:translateY(680%) translateX(30px) rotate(270deg)}100%{transform:translateY(950%) translateX(-8px) rotate(360deg)}}
    @keyframes wfx-pulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
    @keyframes wfx-drift{to{transform:translateX(380%)}}
    @keyframes wfx-flash{0%,97%,100%{opacity:0}98%{opacity:.5}99%{opacity:.15}}
    @keyframes wfx-shimmer{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:.7;transform:translateY(-6px)}}
    ::selection{background:#7c4dff;color:#fff}
    *{scrollbar-width:thin;scrollbar-color:#d8cdf2 transparent}
    .scl::-webkit-scrollbar{width:8px}.scl::-webkit-scrollbar-thumb{background:#d8cdf2;border-radius:9px}
    html{scroll-behavior:smooth}

    /* accessibility: respect reduced-motion */
    @media (prefers-reduced-motion:reduce){
      *,*::before,*::after{animation-duration:.001s!important;animation-iteration-count:1!important;transition-duration:.001s!important;scroll-behavior:auto!important}
    }
  `}</style>
);
