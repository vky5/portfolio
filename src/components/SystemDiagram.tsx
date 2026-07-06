"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Not a stock illustration: this is the actual architecture serving the
 * page you are looking at. One request cycle plays on loop — out through
 * the edge to the server components, down to the data stores, and back.
 * Hovering a node lights up its connections.
 */

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
};

// Fractions of the cycle during which each packet is in flight.
type Hop = {
  id: string;
  d: string;
  nodes: [string, string];
  start: number;
  end: number;
  reverse?: boolean;
};

const W = 100;
const H = 36;
const CYCLE = 9; // seconds per request cycle

const NODES: Node[] = [
  { id: "you", label: "you", x: 16, y: 30 },
  { id: "edge", label: "edge · cdn", x: 16, y: 150 },
  { id: "next", label: "next · rsc", x: 190, y: 90 },
  { id: "db", label: "mongodb", x: 364, y: 30 },
  { id: "media", label: "cloudinary", x: 364, y: 150 },
];

const PATHS = {
  youEdge: "M 66 66 L 66 150",
  edgeNext: "M 116 168 C 156 168, 150 108, 190 108",
  nextDb: "M 290 108 C 330 108, 324 48, 364 48",
  nextMedia: "M 290 108 C 330 108, 324 168, 364 168",
};

const HOPS: Hop[] = [
  // Request
  { id: "req1", d: PATHS.youEdge, nodes: ["you", "edge"], start: 0.0, end: 0.1 },
  { id: "req2", d: PATHS.edgeNext, nodes: ["edge", "next"], start: 0.1, end: 0.2 },
  { id: "req3", d: PATHS.nextDb, nodes: ["next", "db"], start: 0.2, end: 0.3 },
  { id: "req4", d: PATHS.nextMedia, nodes: ["next", "media"], start: 0.22, end: 0.32 },
  // Response
  { id: "res3", d: PATHS.nextDb, nodes: ["next", "db"], start: 0.36, end: 0.46, reverse: true },
  { id: "res4", d: PATHS.nextMedia, nodes: ["next", "media"], start: 0.38, end: 0.48, reverse: true },
  { id: "res2", d: PATHS.edgeNext, nodes: ["edge", "next"], start: 0.52, end: 0.62, reverse: true },
  { id: "res1", d: PATHS.youEdge, nodes: ["you", "edge"], start: 0.62, end: 0.72, reverse: true },
  // Then the system rests until the next cycle.
];

function Packet({ hop }: { hop: Hop }) {
  const { start, end, reverse } = hop;
  const keyPoints = reverse ? "1;1;0;0" : "0;0;1;1";
  const keyTimes = `0;${start};${end};1`;

  return (
    <circle r="2.5" fill="var(--primary)" opacity="0">
      <animateMotion
        dur={`${CYCLE}s`}
        repeatCount="indefinite"
        path={hop.d}
        calcMode="linear"
        keyPoints={keyPoints}
        keyTimes={keyTimes}
      />
      <animate
        attributeName="opacity"
        dur={`${CYCLE}s`}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
        keyTimes={`0;${Math.max(start - 0.01, 0)};${start};${end};${Math.min(end + 0.01, 1)};1`}
      />
    </circle>
  );
}

export default function SystemDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const isLit = (hop: Hop) => hovered !== null && hop.nodes.includes(hovered);

  return (
    <figure aria-hidden="true" className="select-none">
      <svg viewBox="0 0 480 216" className="w-full" fill="none" role="presentation">
        {/* Connections (each drawn once) */}
        {Object.values(PATHS).map((d) => {
          const lit = HOPS.some((h) => h.d === d && isLit(h));
          return (
            <path
              key={d}
              d={d}
              stroke={lit ? "var(--primary)" : "var(--border)"}
              strokeWidth="1"
              style={{ transition: "stroke 200ms ease" }}
            />
          );
        })}

        {/* One request cycle, on loop */}
        {!reducedMotion && HOPS.map((hop) => <Packet key={hop.id} hop={hop} />)}

        {/* Nodes */}
        {NODES.map((node) => {
          const lit = hovered === node.id;
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "default" }}
            >
              <rect
                x={node.x}
                y={node.y}
                width={W}
                height={H}
                rx="8"
                fill="var(--card)"
                stroke={lit ? "var(--primary)" : "var(--border)"}
                style={{ transition: "stroke 200ms ease" }}
              />
              <text
                x={node.x + W / 2}
                y={node.y + H / 2 + 4}
                textAnchor="middle"
                fontFamily="var(--font-geist-mono)"
                fontSize="11"
                fill={lit ? "var(--foreground)" : "var(--muted-foreground)"}
                style={{ transition: "fill 200ms ease" }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-right font-mono text-[10px] tracking-wide text-muted-foreground/70">
        fig. 01 — how this page reached you
      </figcaption>
    </figure>
  );
}
