import React, { useState, useRef, useEffect } from "react";
import { GLOBE_SPOTS, CONTOURS, lle, HOLO, HOLO_DIM } from "../data/globe.js";

export function Globe3D({ onPick, background }) {
  const mountRef = useRef(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const [hover, setHover] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let renderer, scene, cam, raf, cleanup = () => {};
    let disposed = false;

    const boot = (THREE) => {
      if (disposed || !mountRef.current) return;
      const host = mountRef.current;
      const W = host.clientWidth, H = host.clientHeight;
      scene = new THREE.Scene();
      cam = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      cam.position.z = 7.4;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      host.appendChild(renderer.domElement);
      renderer.domElement.style.cursor = "grab";

      const world = new THREE.Group();
      scene.add(world);
      const R = 2.2;

      // faint solid core so the wireframe reads as a sphere
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(R * 0.985, 48, 48),
        new THREE.MeshBasicMaterial({ color: 0x041826, transparent: true, opacity: 0.55 })
      );
      world.add(core);

      // primary wireframe shell
      const wire = new THREE.Mesh(
        new THREE.SphereGeometry(R, 40, 28),
        new THREE.MeshBasicMaterial({ color: HOLO, wireframe: true, transparent: true, opacity: 0.28 })
      );
      world.add(wire);

      // crisp lat/lon scan lines (rings)
      const grid = new THREE.Group(); world.add(grid);
      const ringMat = new THREE.LineBasicMaterial({ color: HOLO, transparent: true, opacity: 0.5 });
      const dimMat = new THREE.LineBasicMaterial({ color: HOLO_DIM, transparent: true, opacity: 0.42 });
      // latitude circles
      for (let lat = -75; lat <= 75; lat += 15) {
        const r = R * Math.cos((lat * Math.PI) / 180);
        const y = R * Math.sin((lat * Math.PI) / 180);
        const pts = [];
        for (let a = 0; a <= 360; a += 6)
          pts.push(new THREE.Vector3(r * Math.cos((a * Math.PI) / 180), y, r * Math.sin((a * Math.PI) / 180)));
        grid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lat === 0 ? ringMat : dimMat));
      }
      // longitude meridians
      for (let lon = 0; lon < 360; lon += 15) {
        const pts = [];
        for (let a = -90; a <= 90; a += 4) {
          const la = (a * Math.PI) / 180, lo = (lon * Math.PI) / 180;
          pts.push(new THREE.Vector3(R * Math.cos(la) * Math.cos(lo), R * Math.sin(la), R * Math.cos(la) * Math.sin(lo)));
        }
        grid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), dimMat));
      }

      // continents as glowing coastline outlines + soft interior fill
      const coastMat = new THREE.LineBasicMaterial({ color: HOLO, transparent: true, opacity: 0.95 });
      const pointInPoly = (la, lo, poly) => {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
          const yi = poly[i][0], xi = poly[i][1], yj = poly[j][0], xj = poly[j][1];
          if (((yi > la) !== (yj > la)) && (lo < ((xj - xi) * (la - yi)) / (yj - yi) + xi)) inside = !inside;
        }
        return inside;
      };
      const fillPts = [];
      Object.values(CONTOURS).forEach((poly) => {
        // smooth + draw the closed coastline slightly above the surface
        const verts = [];
        for (let i = 0; i < poly.length; i++) {
          const [la1, lo1] = poly[i];
          const [la2, lo2] = poly[(i + 1) % poly.length];
          const seg = 5;
          for (let s = 0; s < seg; s++) {
            const f = s / seg;
            verts.push(new THREE.Vector3(...lle(la1 + (la2 - la1) * f, lo1 + (lo2 - lo1) * f, R * 1.006)));
          }
        }
        verts.push(verts[0].clone());
        world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(verts), coastMat.clone()));

        // sparse interior fill so landmass reads as solid, not hollow
        let mnLa = 90, mxLa = -90, mnLo = 180, mxLo = -180;
        poly.forEach(([la, lo]) => { mnLa = Math.min(mnLa, la); mxLa = Math.max(mxLa, la); mnLo = Math.min(mnLo, lo); mxLo = Math.max(mxLo, lo); });
        for (let la = mnLa; la <= mxLa; la += 3.2)
          for (let lo = mnLo; lo <= mxLo; lo += 3.2)
            if (pointInPoly(la, lo, poly)) {
              const [x, y, z] = lle(la, lo, R * 1.002);
              fillPts.push(x, y, z);
            }
      });
      const cGeo = new THREE.BufferGeometry();
      cGeo.setAttribute("position", new THREE.Float32BufferAttribute(fillPts, 3));
      world.add(new THREE.Points(cGeo, new THREE.PointsMaterial({ color: HOLO, size: 0.03, transparent: true, opacity: 0.45 })));


      // glow halo
      world.add(new THREE.Mesh(
        new THREE.SphereGeometry(R * 1.13, 40, 40),
        new THREE.MeshBasicMaterial({ color: HOLO, transparent: true, opacity: 0.06, side: THREE.BackSide })
      ));

      // arcing connection beams between region hotspots (Iron Man data-link look)
      const arcMat = new THREE.LineBasicMaterial({ color: HOLO, transparent: true, opacity: 0.5 });
      const pairs = [[0,1],[1,2],[2,3],[3,0],[0,2]];
      const arcs = [];
      pairs.forEach(([a, b]) => {
        const A = new THREE.Vector3(...lle(GLOBE_SPOTS[a].lat, GLOBE_SPOTS[a].lon, R));
        const B = new THREE.Vector3(...lle(GLOBE_SPOTS[b].lat, GLOBE_SPOTS[b].lon, R));
        const mid = A.clone().add(B).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.55);
        const curve = new THREE.QuadraticBezierCurve3(A, mid, B);
        const cp = curve.getPoints(50);
        const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(cp), arcMat.clone());
        ln.geometry.setDrawRange(0, 0);
        world.add(ln);
        arcs.push({ ln, total: cp.length, head: Math.random() * cp.length });
      });

      // clickable region hotspots
      const spots = [];
      GLOBE_SPOTS.forEach((s) => {
        const [x, y, z] = lle(s.lat, s.lon, R * 1.02);
        const g = new THREE.Group();
        g.position.set(x, y, z);
        const pin = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          new THREE.MeshBasicMaterial({ color: HOLO })
        );
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.16, 0.2, 32),
          new THREE.MeshBasicMaterial({ color: HOLO, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
        );
        const up = new THREE.Vector3(x, y, z).normalize();
        ring.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), up));
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.6, 6),
          new THREE.MeshBasicMaterial({ color: HOLO, transparent: true, opacity: 0.4 })
        );
        beam.position.copy(up.clone().multiplyScalar(0.3));
        beam.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up));
        g.add(pin); g.add(ring); g.add(beam);
        g.userData = { id: s.id, label: s.label, pin, ring };
        world.add(g);
        spots.push(g);
      });

      scene.add(new THREE.AmbientLight(0xffffff, 1));

      const ray = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let dragging = false, lx = 0, ly = 0, velY = 0.0016, velX = 0;
      let downX = 0, downY = 0, moved = false;

      const setMouse = (e) => {
        const r = renderer.domElement.getBoundingClientRect();
        const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
        const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
        mouse.x = (cx / r.width) * 2 - 1;
        mouse.y = -(cy / r.height) * 2 + 1;
        return { cx, cy };
      };
      const hit = () => {
        ray.setFromCamera(mouse, cam);
        const objs = spots.flatMap((g) => g.children);
        const x = ray.intersectObjects(objs, false)[0];
        if (!x) return null;
        let p = x.object; while (p && !p.userData.id) p = p.parent;
        return p;
      };
      const onDown = (e) => {
        const { cx, cy } = setMouse(e); dragging = true; moved = false;
        lx = cx; ly = cy; downX = cx; downY = cy;
        renderer.domElement.style.cursor = "grabbing";
      };
      const onMove = (e) => {
        const { cx, cy } = setMouse(e);
        if (dragging) {
          if (Math.abs(cx - downX) + Math.abs(cy - downY) > 5) moved = true;
          // damped input — eased toward the drag delta, not snapped 1:1
          const ty = (cx - lx) * 0.0042, tx = (cy - ly) * 0.0042;
          velY += (ty - velY) * 0.35;
          velX += (tx - velX) * 0.35;
          world.rotation.y += velY;
          world.rotation.x = Math.max(-0.85, Math.min(0.85, world.rotation.x + velX));
          lx = cx; ly = cy;
        } else {
          const h = hit();
          renderer.domElement.style.cursor = h ? "pointer" : "grab";
          setHover(h ? h.userData.label : null);
        }
      };
      const onUp = () => {
        if (dragging && !moved) { const h = hit(); if (h && pickRef.current) pickRef.current(h.userData.id); }
        dragging = false;
        renderer.domElement.style.cursor = "grab";
      };

      const el = renderer.domElement;
      el.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      el.addEventListener("touchstart", onDown, { passive: true });
      el.addEventListener("touchmove", onMove, { passive: true });
      el.addEventListener("touchend", onUp);
      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth, h = mountRef.current.clientHeight;
        cam.aspect = w / h; cam.updateProjectionMatrix(); renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      let tk = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        tk += 1;
        if (!dragging) {
          world.rotation.y += velY;
          // ease velocity gently back to the calm idle spin
          velY += (0.0016 - velY) * 0.012;
          velX *= 0.95;
          world.rotation.x += velX;
          // settle vertical tilt softly toward level
          world.rotation.x += (0 - world.rotation.x) * 0.006;
        }
        // animate the arcs "drawing" like data transfers
        arcs.forEach((a) => {
          a.head += 0.9;
          if (a.head > a.total + 20) a.head = 0;
          a.ln.geometry.setDrawRange(0, Math.min(a.total, Math.floor(a.head)));
          a.ln.material.opacity = 0.25 + 0.35 * Math.abs(Math.sin(tk * 0.04));
        });
        spots.forEach((g) => {
          const s = 1 + Math.sin(tk * 0.07 + g.position.x) * 0.18;
          g.userData.ring.scale.setScalar(s);
          g.userData.ring.material.opacity = 0.7 - (s - 1) * 1.5;
        });
        renderer.render(scene, cam);
      };
      loop();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        el.removeEventListener("mousedown", onDown);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        el.removeEventListener("touchstart", onDown);
        el.removeEventListener("touchmove", onMove);
        el.removeEventListener("touchend", onUp);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (el.parentNode) el.parentNode.removeChild(el);
      };
    };

    if (window.THREE) boot(window.THREE);
    else {
      const sc = document.createElement("script");
      sc.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      sc.onload = () => boot(window.THREE);
      sc.onerror = () => setReady("fail");
      document.head.appendChild(sc);
    }
    return () => { disposed = true; cleanup(); };
  }, []);

  const bgStyle = background
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 45%, #06243a 0%, #04121f 55%, #02070d 100%)" }
    : { position: "relative", width: "100%" };
  const canvasStyle = background
    ? { width: "100%", height: "100%" }
    : { width: "100%", height: 460, borderRadius: 28, overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 45%, #06243a 0%, #04121f 60%, #02070d 100%)",
        border: "1px solid rgba(53,214,255,.25)", boxShadow: "0 0 60px -10px rgba(53,214,255,.3) inset" };

  return (
    <div style={bgStyle}>
      <div ref={mountRef} style={canvasStyle} />
      {/* scanline overlay for the hologram feel */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(53,214,255,.05) 0px, rgba(53,214,255,.05) 1px, transparent 1px, transparent 4px)" }} />
      {ready === "fail" && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center",
          color: "#7fb9cf", fontSize: 14, textAlign: "center", padding: 30 }}>
          Couldn't load the 3D globe here. Use the region buttons below instead.
        </div>
      )}
      <div style={{ position: "absolute", bottom: background ? 28 : 16, left: 0, right: 0, textAlign: "center",
        fontSize: 12.5, color: "rgba(127,185,207,.8)", pointerEvents: "none", letterSpacing: ".08em",
        textTransform: "uppercase", fontWeight: 600 }}>
        {hover ? <span style={{ color: "#5fe3ff" }}>▸ {hover} — click to lock in</span>
               : "◇ Drag to rotate · click a glowing node"}
      </div>
    </div>
  );
}
