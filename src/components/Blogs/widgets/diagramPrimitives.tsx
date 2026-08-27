"use client";

import { useMemo } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

/*
 * Shared drawing primitives for the scroll-scrubbed SVG diagrams used across
 * blog widgets (the pattern originates in AuthFlowDiagram). Arc-length
 * parameterization along a polyline, a node box, and a "draws in as you
 * scroll" edge live here so each new diagram only has to describe its own
 * layout and phase timing, not re-derive the geometry math.
 */

export type Pt = [number, number];

export function polyline(pts: Pt[]) {
  const cum = [0];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    cum.push(total);
  }
  return { cum, total };
}

export function pointAlong(
  pts: Pt[],
  cum: number[],
  total: number,
  dist: number,
): Pt {
  if (dist <= 0) return pts[0];
  if (dist >= total) return pts[pts.length - 1];
  for (let i = 1; i < pts.length; i++) {
    if (dist <= cum[i]) {
      const t = (dist - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      return [
        pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t,
        pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t,
      ];
    }
  }
  return pts[pts.length - 1];
}

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Maps overall scroll progress `p` to a local 0→1 progress within [start, end].
export function phase(p: number, start: number, end: number) {
  return clamp01((p - start) / (end - start || 1e-6));
}

export function DiagramArrowMarker() {
  return (
    <marker
      id="diagram-arrow"
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,5 L0,10 z" fill="var(--border)" />
    </marker>
  );
}

export function DiagramPacket({ pt, visible }: { pt: Pt; visible: boolean }) {
  if (!visible) return null;
  return (
    <g style={{ filter: "drop-shadow(0 0 6px var(--primary))" }}>
      <circle cx={pt[0]} cy={pt[1]} r={5.5} fill="var(--primary)" />
      <circle cx={pt[0]} cy={pt[1]} r={11} fill="var(--primary)" opacity={0.18} />
    </g>
  );
}

export function DiagramEdge({
  points,
  progress,
  label,
  muted,
}: {
  points: Pt[];
  progress: number; // 0..1, how much of the edge to reveal
  label?: string;
  muted?: boolean;
}) {
  const { d, len } = useMemo(() => {
    let path = `M${points[0][0]},${points[0][1]}`;
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      total += Math.hypot(
        points[i][0] - points[i - 1][0],
        points[i][1] - points[i - 1][1],
      );
      path += ` L${points[i][0]},${points[i][1]}`;
    }
    return { d: path, len: total };
  }, [points]);

  const draw = clamp01(progress);
  const stroke = muted ? "var(--muted-foreground)" : "var(--primary)";
  const mid: Pt = points[Math.floor(points.length / 2)] ?? points[0];

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="var(--border)"
        strokeWidth={1.5}
        markerEnd="url(#diagram-arrow)"
      />
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
        opacity={muted ? 0.7 : 1}
      />
      {label && (
        <text
          x={mid[0] + 8}
          y={mid[1] - 6}
          fontSize={11}
          fill="var(--muted-foreground)"
          opacity={draw > 0.5 ? 1 : 0.35}
        >
          {label}
        </text>
      )}
    </g>
  );
}

// Playback control shared by every scroll-scrubbed diagram — pairs with
// useDiagramPlayback. One pill, not separate Play/Replay buttons: a fresh
// click and a click after finishing both mean "show me the whole thing," so
// they'd be identical buttons doing identical things. Only the label/icon
// swaps to "Replay" once it's actually finished. Styled like the "Show more"
// pill used elsewhere in the blog widgets so it reads as the same design
// language, not a video-player bolt-on.
export function DiagramControls({
  playing,
  finished,
  onToggle,
}: {
  playing: boolean;
  finished: boolean;
  onToggle: () => void;
}) {
  const Icon = playing ? Pause : finished ? RotateCcw : Play;
  const label = playing ? "Pause" : finished ? "Replay" : "Play";
  return (
    <div className="mt-3 flex items-center justify-center">
      <button
        type="button"
        onClick={onToggle}
        aria-label={`${label} animation`}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </button>
    </div>
  );
}

export function DiagramNode({
  cx,
  cy,
  label,
  sub,
  active,
  error,
  w = 150,
  h = 48,
}: {
  cx: number;
  cy: number;
  label: string;
  sub?: string;
  active: boolean;
  error?: boolean;
  w?: number;
  h?: number;
}) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  const accent = error ? "var(--destructive)" : "var(--primary)";
  const stroke = active ? accent : "var(--border)";
  const textFill = active
    ? error
      ? "var(--destructive)"
      : "var(--foreground)"
    : "var(--muted-foreground)";
  const glow =
    active && !error
      ? {
          filter:
            "drop-shadow(0 0 7px color-mix(in oklch, var(--primary) 55%, transparent))",
        }
      : undefined;

  return (
    <g style={{ ...glow, opacity: error ? 0.9 : 1, transition: "opacity 0.2s" }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill="var(--card)"
        stroke={stroke}
        strokeWidth={active ? 2 : 1.5}
      />
      <text
        x={cx}
        y={sub ? cy - 4 : cy + 5}
        textAnchor="middle"
        fontSize={13}
        fontWeight={active ? 600 : 400}
        fill={textFill}
      >
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fill={textFill} opacity={0.75}>
          {sub}
        </text>
      )}
    </g>
  );
}
