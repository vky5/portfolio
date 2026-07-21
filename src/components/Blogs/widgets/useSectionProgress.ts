"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/*
 * Returns 0→1 for how far a target element has scrolled through its scroll
 * container. The catch this solves: NativeBlogLayout scrolls the *window*,
 * BookSummaryLayout scrolls an inner <main> with overflow-y:auto. A window-
 * only scroll listener is dead inside the book layout, so we find the actual
 * scroll parent and measure against it.
 *
 * Progress runs 0 when the element's top sits at 85% of the viewport height
 * and 1 when it reaches 15% — i.e. it scrubs while the element crosses the
 * middle band, not only when fully scrolled past.
 */

const START = 0.85;
const END = 0.15;

function getScrollParent(node: HTMLElement): HTMLElement | null {
  let el = node.parentElement;
  while (el) {
    const overflowY = getComputedStyle(el).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight
    ) {
      return el;
    }
    el = el.parentElement;
  }
  return null; // window
}

export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
): number {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setProgress(1); // show the finished diagram, no scrubbing
      return;
    }

    const scroller = getScrollParent(el);
    const scrollTarget: HTMLElement | Window = scroller ?? window;

    const compute = () => {
      frame.current = null;
      const rect = el.getBoundingClientRect();
      const viewTop = scroller ? scroller.getBoundingClientRect().top : 0;
      const viewH = scroller ? scroller.clientHeight : window.innerHeight;
      const relTop = rect.top - viewTop;
      const start = viewH * START;
      const end = viewH * END;
      const p = (relTop - start) / (end - start);
      setProgress(Math.min(1, Math.max(0, p)));
    };

    const onScroll = () => {
      if (frame.current == null) {
        frame.current = requestAnimationFrame(compute);
      }
    };

    compute();
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
      scrollTarget.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progress;
}
