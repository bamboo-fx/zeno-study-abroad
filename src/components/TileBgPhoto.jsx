import React, { useEffect, useState } from "react";
import { fetchCityPhoto } from "../data/cityPhoto.js";

// Same blocklist used by cityPhoto.js — reject Wikipedia infobox collages,
// montages, paintings, flags, maps, locator imagery, anything that isn't a
// single straight photograph.
const BAD_NAME_RE = /(collage|montage|composite|infobox|panel|combo|flag|coat[_\s-]?of[_\s-]?arms|seal\b|emblem|crest|locator|location[_\s-]?map|orthographic|\bmap\b|globe|chart|diagram|topographic|administrative|wappen|escudo|bandera|drapeau|painting|paintings|fresco|engraving|lithograph|etching|woodcut|drawing|illustration|oil[_\s-]?on[_\s-]?canvas|oil[_\s-]?painting|portrait|mural|sketch|watercolou?r|battle[_\s-]?of|siege[_\s-]?of|massacre|gemälde|cuadro|pintura|tableau|peinture|by[_\s-][A-Z]|black[_\s-]?and[_\s-]?white|sepia|circa[_\s-]?\d{4}|veduta|photochrom|postcard|postage|stamp|banknote|coin|currency|statue|sculpture|mosaic|tapestry|carving|frieze|bas[_\s-]?relief|vase|codex|manuscript|miniature|plate[_\s-]?\d|rendering|render|schematic|blueprint|infographic|comic|cartoon|anime|stereoview|stereograph|daguerreotype|photogravure|aquarelle|\b1[6-8]\d{2}\b|\b19[0-7]\d\b)/i;

function looksBad(url) {
  if (!url) return true;
  try {
    const path = decodeURIComponent(url.split("?")[0]);
    const file = path.substring(path.lastIndexOf("/") + 1);
    if (BAD_NAME_RE.test(file)) return true;
  } catch {
    if (BAD_NAME_RE.test(url)) return true;
  }
  return false;
}

// For continent / vibe tiles we want the page's curated hero image when it's
// a clean single photo. City Wikipedia articles often have a collage as the
// lead image (Prague, London, Madrid, etc.) — we filter those and fall back
// to media-list scanning instead.
async function fetchSummaryHero(query) {
  if (!query) return null;
  const key = `tilehero4:${query}`;
  try {
    const cached = sessionStorage.getItem(key);
    if (cached !== null) return cached === "" ? null : cached;
  } catch {}
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if (r.ok) {
      const j = await r.json();
      let url = j.originalimage?.source;
      if (!url && j.thumbnail?.source) url = j.thumbnail.source.replace(/\/\d+px-/, "/2560px-");
      if (url && !looksBad(url)) {
        try { sessionStorage.setItem(key, url); } catch {}
        return url;
      }
    }
  } catch {}
  try { sessionStorage.setItem(key, ""); } catch {}
  return null;
}

export function TileBgPhoto({ query, country }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!query) return;
    let alive = true;
    fetchSummaryHero(query).then((u) => {
      if (!alive) return;
      if (u) { setSrc(u); return; }
      fetchCityPhoto(query, country || "").then((u2) => { if (alive && u2) setSrc(u2); });
    });
    return () => { alive = false; };
  }, [query, country]);
  if (!src) return null;
  return (
    <img src={src} alt=""
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", opacity: 0.92 }} />
  );
}
