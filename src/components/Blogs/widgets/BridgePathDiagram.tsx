"use client";

import { useMemo, useRef } from "react";
import { useLoopAnimation, DEFAULT_CYCLE_MS } from "./useLoopAnimation";
import { Pt, polyline, pointAlong, phase, DiagramNode, DiagramPacket } from "./diagramPrimitives";

/*
 * The full end-to-end path a frame takes once ns1 and ns2 are wired through
 * br0 instead of directly to each other: ns1's eth0 down its veth cable to
 * veth1, across the bridge to veth3, up the other cable to ns2's eth0 — and
 * back. Same topology as VethPingDiagram's direct-cable version, just with
 * the bridge hop in the middle, and the same reason it loops instead of
 * resolving once: the thing being shown is that traffic keeps crossing the
 * bridge both ways, not a one-time sequence of steps.
 */

const NS1_ETH0: Pt = [150, 56];
const VETH1: Pt = [150, 224];
const BR0: Pt = [360, 344];
const VETH3: Pt = [570, 224];
const NS2_ETH0: Pt = [570, 56];

const FORWARD: Pt[] = [NS1_ETH0, VETH1, BR0, VETH3, NS2_ETH0];
const BACKWARD: Pt[] = [...FORWARD].reverse();
const LAST = FORWARD.length - 1;

// VethPingDiagram's straight wire is 220px (WIRE_END - WIRE_START there).
// This route is ~3.7x longer, so its cycle runs proportionally longer too —
// same packet speed in px/s, not just the same lap time, so the two read as
// the same mechanism rather than one looking rushed next to the other.
const VETH_PING_WIRE_LENGTH = 220;
const PATH_LENGTH = polyline(FORWARD).total;
const CYCLE_MS = Math.round(
  DEFAULT_CYCLE_MS * (PATH_LENGTH / VETH_PING_WIRE_LENGTH),
);

// One cycle: request crosses ns1 → br0 → ns2, a short dwell, reply crosses
// back — mirroring VethPingDiagram's timing so the two read as the same
// mechanism at two different zoom levels.
const REQ_END = 0.42;
const REPLY_START = 0.5;
const REPLY_END = 0.92;

// Which two consecutive route points currently bound the packet, so exactly
// those two nodes glow. Purely a function of position, not accumulated
// state, so the highlight resets cleanly every lap instead of drifting.
function segmentBounds(cum: number[], total: number, dist: number): [number, number] {
  if (dist <= 0) return [0, 0];
  if (dist >= total) return [LAST, LAST];
  for (let i = 1; i < cum.length; i++) {
    if (dist <= cum[i]) return [i - 1, i];
  }
  return [LAST, LAST];
}

export default function BridgePathDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useLoopAnimation(ref, CYCLE_MS);

  const fwd = useMemo(() => polyline(FORWARD), []);
  const bwd = useMemo(() => polyline(BACKWARD), []);

  const sendingRequest = p < REQ_END;
  const sendingReply = p >= REPLY_START && p < REPLY_END;

  let packet: Pt;
  let activeIdx: [number, number];
  let label: string;

  if (sendingRequest) {
    const dist = phase(p, 0, REQ_END) * fwd.total;
    packet = pointAlong(FORWARD, fwd.cum, fwd.total, dist);
    activeIdx = segmentBounds(fwd.cum, fwd.total, dist);
    label = "echo request →";
  } else if (sendingReply) {
    const dist = phase(p, REPLY_START, REPLY_END) * bwd.total;
    packet = pointAlong(BACKWARD, bwd.cum, bwd.total, dist);
    const [a, b] = segmentBounds(bwd.cum, bwd.total, dist);
    activeIdx = [LAST - a, LAST - b]; // backward indices back onto FORWARD's
    label = "← echo reply";
  } else if (p < REPLY_START) {
    packet = NS2_ETH0;
    activeIdx = [LAST, LAST];
    label = "arrived at ns2 eth0";
  } else {
    packet = NS1_ETH0;
    activeIdx = [0, 0];
    label = "arrived at ns1 eth0";
  }

  const isActive = (i: number) => activeIdx[0] === i || activeIdx[1] === i;

  return (
    <div ref={ref} className="not-prose my-8 w-full">
      <svg
        viewBox="0 0 720 400"
        role="img"
        aria-label="A frame continuously crossing from ns1's eth0 down its veth cable to veth1, across br0, up the other cable through veth3 to ns2's eth0, and back."
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "720 / 400",
          display: "block",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        {FORWARD.slice(0, -1).map(([x1, y1], i) => {
          const [x2, y2] = FORWARD[i + 1];
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--border)"
              strokeWidth={1.5}
            />
          );
        })}

        <DiagramNode cx={NS1_ETH0[0]} cy={NS1_ETH0[1]} label="ns1 eth0" sub="10.0.0.1" active={isActive(0)} w={160} />
        <DiagramNode cx={VETH1[0]} cy={VETH1[1]} label="veth1" sub="bridge port" active={isActive(1)} w={150} />
        <DiagramNode cx={BR0[0]} cy={BR0[1]} label="br0" sub="L2 switch" active={isActive(2)} w={150} />
        <DiagramNode cx={VETH3[0]} cy={VETH3[1]} label="veth3" sub="bridge port" active={isActive(3)} w={150} />
        <DiagramNode cx={NS2_ETH0[0]} cy={NS2_ETH0[1]} label="ns2 eth0" sub="10.0.0.2" active={isActive(4)} w={160} />

        <DiagramPacket pt={packet} visible />

        <text
          x={360}
          y={24}
          textAnchor="middle"
          fontSize={11}
          fill="var(--muted-foreground)"
        >
          {label}
        </text>
      </svg>
      <p
        className="mt-3 text-center text-xs text-muted-foreground/70"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        fig. — ns1 ⇄ ns2 through br0, on loop
      </p>
    </div>
  );
}
