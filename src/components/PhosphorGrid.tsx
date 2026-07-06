"use client";

import { useEffect, useRef } from "react";

/*
 * Background starfield in document space — the constellation belongs to
 * the page, not the viewport, so it scrolls with the content and every
 * section sits under its own pattern. Seeded random: the same unique
 * sky on every visit. Static by design: nothing drifts on its own.
 * On desktop, dots near the cursor flare amber like phosphor under an
 * electron beam (instant, no easing — a lagged glow reads as chasing).
 */

const DENSITY = 4500; // px² per dot — lower is denser
const GLOW_RADIUS = 130;
const AMBER_SHARE = 0.08;
const SEED = 0xb0b5; // fixed: this page's particular sky

type Dot = {
  x: number;
  y: number; // document coordinate
  r: number;
  a: number; // base alpha
  amber: boolean;
};

// mulberry32 — tiny deterministic PRNG.
function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function PhosphorGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const interactive = finePointer && !reduced;

    let w = 0;
    let h = 0;
    let docH = 0;
    let dots: Dot[] = [];
    const beam = { x: -9999, y: -9999 }; // viewport coordinates
    let raf = 0;
    let dirty = true;

    // Same seed + same generation order = the first N dots are identical
    // every time, so growing the page only appends to the constellation.
    const scatter = () => {
      const rand = prng(SEED);
      const count = Math.floor((w * docH) / DENSITY);
      dots = Array.from({ length: count }, () => ({
        x: rand() * w,
        y: rand() * docH,
        r: 0.5 + rand() * 1.1,
        a: 0.12 + rand() * 0.3,
        amber: rand() < AMBER_SHARE,
      }));
    };

    const draw = () => {
      const dark = document.documentElement.classList.contains("dark");
      const neutral = dark ? "255,255,255" : "20,15,5";
      const amber = dark ? "255,176,0" : "143,100,0";
      const scrollY = window.scrollY;

      ctx.clearRect(0, 0, w, h);
      for (const dot of dots) {
        const vy = dot.y - scrollY; // viewport position
        if (vy < -4 || vy > h + 4) continue;

        let color = dot.amber ? amber : neutral;
        let alpha = dot.amber ? dot.a + 0.15 : dot.a;
        let r = dot.r;

        if (interactive) {
          const d = Math.hypot(dot.x - beam.x, vy - beam.y);
          if (d < GLOW_RADIUS) {
            const t = 1 - d / GLOW_RADIUS;
            const intensity = t * t;
            color = amber;
            alpha = Math.min(1, alpha + intensity * 0.8);
            r = dot.r + intensity * 0.8;
          }
        }

        ctx.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(dot.x, vy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      docH = Math.max(document.documentElement.scrollHeight, h);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scatter();
      dirty = true;
    };

    const tick = () => {
      if (dirty) {
        draw();
        dirty = false;
      }
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      dirty = true;
    };
    const onMove = (e: PointerEvent) => {
      beam.x = e.clientX;
      beam.y = e.clientY;
      dirty = true;
    };
    const onLeave = () => {
      beam.x = -9999;
      beam.y = -9999;
      dirty = true;
    };

    const themeObserver = new MutationObserver(() => {
      dirty = true;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Content streams in (fonts, images, data) and changes page height.
    const sizeObserver = new ResizeObserver(() => {
      if (document.documentElement.scrollHeight !== docH) measure();
    });
    sizeObserver.observe(document.body);

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
