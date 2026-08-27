"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

// Default lap time. Diagrams with a longer path should pass a larger
// cycleMs (see BridgePathDiagram) rather than reuse this as-is — otherwise
// the packet visibly moves faster just because it has more ground to cover
// in the same time, even though nothing about the traffic itself changed.
export const DEFAULT_CYCLE_MS = 2600;

/*
 * A self-driving 0→1 progress loop for ambient diagrams that should just
 * keep playing — not wait for scroll, not settle at p=1 and stop. Unlike
 * useDiagramPlayback (one-shot, user-triggered), this one never finishes.
 *
 * Two things a loop that "doesn't stop" has to get right or it becomes a
 * real cost, not just an animation:
 *   - Scrolled off-screen: an IntersectionObserver freezes the elapsed-time
 *     accumulator so a tab full of these doesn't spend forever painting
 *     something nobody can see. Time resumes from where it froze, no jump.
 *   - Reduced motion: settles on one representative static frame instead of
 *     animating, for readers who've asked the OS for that.
 */
export function useLoopAnimation(
  ref: RefObject<HTMLElement | null>,
  cycleMs: number = DEFAULT_CYCLE_MS,
) {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setProgress(0.2); // mid-flight frame, not a blank/default one
      return;
    }

    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    observer.observe(node);

    let elapsed = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      if (last != null && visible) {
        elapsed = (elapsed + (now - last)) % cycleMs;
        setProgress(elapsed / cycleMs);
      }
      last = now;
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [ref, cycleMs]);

  return progress;
}
