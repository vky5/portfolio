"use client";

import { useMemo, useRef } from "react";
import { useSectionProgress } from "./useSectionProgress";

/*
 * A hand-built, scroll-scrubbed architecture diagram of a request lifecycle:
 *   User → API Gateway → Auth → Application → Postgres/Redis → Response → User
 *
 * Everything is driven by one number `p` (0→1) from useSectionProgress. A
 * packet rides an invisible polyline through the node centres; nodes light
 * and edges draw as the packet passes them. Nothing here is a video or GIF —
 * every shape's state is a pure function of scroll position. Theme-aware via
 * CSS vars, so it follows the site palette in light and dark.
 */

type Pt = [number, number];

// Route the packet travels (through node centres). Straight segments only so
// geometry can be computed in JS without touching the DOM.
const ROUTE: Pt[] = [
  [360, 44], // User
  [360, 150], // Gateway
  [360, 256], // Auth
  [360, 372], // App
  [250, 500], // Postgres
  [360, 372], // back to App
  [470, 500], // Redis
  [360, 372], // back to App
  [600, 372], // Response
  [600, 44], // up the right side
  [360, 44], // back to User
];

function polyline(pts: Pt[]) {
  const cum = [0];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    cum.push(total);
  }
  return { cum, total };
}

function pointAlong(pts: Pt[], cum: number[], total: number, dist: number): Pt {
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

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export default function AuthFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref);

  const geo = useMemo(() => polyline(ROUTE), []);
  const dist = p * geo.total;

  // Activation p for each route vertex (a node lights when the packet reaches
  // that vertex's distance along the route).
  const at = (vertexIndex: number) => geo.cum[vertexIndex] / geo.total;

  const nodes = useMemo(() => {
    const on = (v: number) => geo.cum[v] / geo.total;
    return [
      { id: "user", cx: 360, cy: 44, label: "User", shape: "rect" as const, on: 0 },
      { id: "gateway", cx: 360, cy: 150, label: "API Gateway", shape: "rect" as const, on: on(1) },
      { id: "auth", cx: 360, cy: 256, label: "Auth Service", shape: "rect" as const, on: on(2) },
      { id: "app", cx: 360, cy: 372, label: "Application", shape: "rect" as const, on: on(3) },
      { id: "err", cx: 588, cy: 256, label: "401 Unauthorized", shape: "rect" as const, on: on(2), error: true },
      { id: "pg", cx: 250, cy: 500, label: "PostgreSQL", shape: "db" as const, on: on(4) },
      { id: "redis", cx: 470, cy: 500, label: "Redis Cache", shape: "db" as const, on: on(6) },
      { id: "resp", cx: 600, cy: 372, label: "Response", shape: "rect" as const, on: on(8) },
    ];
  }, [geo]);

  const packet = pointAlong(ROUTE, geo.cum, geo.total, dist);
  const packetVisible = p > 0.001 && p < 0.999;

  return (
    <div ref={ref} className="not-prose my-8 w-full">
      <svg
        viewBox="0 0 720 560"
        className="w-full h-auto"
        role="img"
        aria-label="Request lifecycle: User to API Gateway to Auth Service to Application to PostgreSQL and Redis, then Response back to User."
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        <defs>
          <marker
            id="af-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--border)" />
          </marker>
        </defs>

        {/* Edges: a faint always-on track, plus an amber overlay revealed as
            the packet passes. */}
        <Edge points={[[360, 70], [360, 128]]} on={0} p={p} label="HTTP request" />
        <Edge points={[[360, 172], [360, 234]]} on={at(1)} p={p} />
        <Edge points={[[360, 278], [360, 350]]} on={at(2)} p={p} label="valid token" />
        <Edge points={[[420, 256], [522, 256]]} on={at(2)} p={p} label="invalid" muted />
        <Edge points={[[330, 392], [268, 476]]} on={at(3)} p={p} />
        <Edge points={[[390, 392], [452, 476]]} on={at(5)} p={p} />
        <Edge points={[[420, 372], [534, 372]]} on={at(7)} p={p} />
        <Edge
          points={[[600, 350], [600, 70], [426, 44]]}
          on={at(8)}
          p={p}
          label="response"
        />

        {nodes.map((n) => (
          <Node key={n.id} node={n} active={p >= n.on - 0.001} />
        ))}

        {/* Traveling packet */}
        {packetVisible && (
          <g style={{ filter: "drop-shadow(0 0 6px var(--primary))" }}>
            <circle cx={packet[0]} cy={packet[1]} r={5.5} fill="var(--primary)" />
            <circle cx={packet[0]} cy={packet[1]} r={11} fill="var(--primary)" opacity={0.18} />
          </g>
        )}
      </svg>
      <p className="mt-3 text-center text-xs text-muted-foreground/70" style={{ fontFamily: "var(--font-mono, monospace)" }}>
        fig. — request lifecycle · scroll to trace the path
      </p>
    </div>
  );
}

function Edge({
  points,
  on,
  p,
  label,
  muted,
}: {
  points: Pt[];
  on: number;
  p: number;
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

  // Draw the overlay over a short scroll window once the packet reaches it.
  const draw = clamp01((p - on) / 0.05);
  const stroke = muted ? "var(--muted-foreground)" : "var(--primary)";
  const mid: Pt = points[Math.floor(points.length / 2)] ?? points[0];

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="var(--border)"
        strokeWidth={1.5}
        markerEnd="url(#af-arrow)"
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

type NodeSpec = {
  id: string;
  cx: number;
  cy: number;
  label: string;
  shape: "rect" | "db";
  on: number;
  error?: boolean;
};

function Node({ node, active }: { node: NodeSpec; active: boolean }) {
  const w = 132;
  const h = 46;
  const x = node.cx - w / 2;
  const y = node.cy - h / 2;

  const accent = node.error ? "var(--destructive)" : "var(--primary)";
  const stroke = active ? accent : "var(--border)";
  const textFill = active
    ? node.error
      ? "var(--destructive)"
      : "var(--foreground)"
    : "var(--muted-foreground)";

  const glow = active && !node.error
    ? { filter: "drop-shadow(0 0 7px color-mix(in oklch, var(--primary) 55%, transparent))" }
    : undefined;

  return (
    <g style={{ ...glow, opacity: node.error ? 0.85 : 1, transition: "opacity 0.2s" }}>
      {node.shape === "db" ? (
        <DbCylinder cx={node.cx} cy={node.cy} stroke={stroke} active={active} />
      ) : (
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
      )}
      <text
        x={node.cx}
        y={node.cy + (node.shape === "db" ? 4 : 5)}
        textAnchor="middle"
        fontSize={13}
        fontWeight={active ? 600 : 400}
        fill={textFill}
      >
        {node.label}
      </text>
    </g>
  );
}

function DbCylinder({
  cx,
  cy,
  stroke,
  active,
}: {
  cx: number;
  cy: number;
  stroke: string;
  active: boolean;
}) {
  const w = 130;
  const h = 58;
  const rx = w / 2;
  const ry = 9;
  const x = cx - rx;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  const sw = active ? 2 : 1.5;
  return (
    <g fill="var(--card)" stroke={stroke} strokeWidth={sw}>
      <path
        d={`M${x},${top + ry} a${rx},${ry} 0 0 1 ${w},0 L${x + w},${bottom - ry} a${rx},${ry} 0 0 1 ${-w},0 Z`}
      />
      <ellipse cx={cx} cy={top + ry} rx={rx} ry={ry} />
    </g>
  );
}
