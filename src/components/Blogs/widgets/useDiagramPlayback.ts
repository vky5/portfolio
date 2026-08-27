"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useSectionProgress } from "./useSectionProgress";

/*
 * Wraps useSectionProgress with a play/pause override, so a diagram can be
 * watched on demand instead of only by scrolling. Once the reader hits Play
 * once, that instance stops listening to scroll for progress — mixing
 * "scroll drives it" and "the timer drives it" reads as the diagram fighting
 * the reader, so the switch is one-way per mount (a fresh page load goes back
 * to scroll-scrubbed).
 *
 * One toggle button, not separate Play/Replay buttons: a fresh click and a
 * click after finishing both mean the same thing ("show me the whole thing"),
 * so both start from 0 — only a click after an actual mid-way Pause resumes
 * from where it stopped. `finished` tells the caller when to swap the
 * button's label/icon to "Replay" without needing a second control.
 *
 * Playback runs at a constant rate: resuming from 70% takes 30% as long as a
 * full run, rather than always taking the same duration regardless of how
 * much is left.
 */

const FULL_DURATION_MS = 3200;

export function useDiagramPlayback(ref: RefObject<HTMLElement | null>) {
  const scrollProgress = useSectionProgress(ref);
  const [manual, setManual] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (frame.current != null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setPlaying(false);
  }, []);

  const runFrom = useCallback(
    (from: number) => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
      const startTime = performance.now();
      const remaining = 1 - from;
      const duration = FULL_DURATION_MS * remaining;
      setPlaying(true);
      const tick = (now: number) => {
        const t = duration <= 0 ? 1 : Math.min(1, (now - startTime) / duration);
        setManual(from + remaining * t);
        if (t < 1) {
          frame.current = requestAnimationFrame(tick);
        } else {
          frame.current = null;
          setPlaying(false);
        }
      };
      frame.current = requestAnimationFrame(tick);
    },
    [],
  );

  // A click that isn't resuming a pause always means "from the start": that
  // covers both the very first click (manual is still null, so there's
  // nothing to resume) and clicking again after finishing (manual >= 1).
  const toggle = useCallback(() => {
    if (playing) {
      stop();
      return;
    }
    runFrom(manual != null && manual < 1 ? manual : 0);
  }, [playing, manual, stop, runFrom]);

  useEffect(() => stop, [stop]);

  const finished = manual != null && manual >= 1 && !playing;

  return {
    progress: manual ?? scrollProgress,
    playing,
    finished,
    toggle,
  };
}
