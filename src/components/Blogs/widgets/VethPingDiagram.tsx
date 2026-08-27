"use client";

import { useRef } from "react";
import { useLoopAnimation } from "./useLoopAnimation";
import { phase, DiagramNode, DiagramPacket } from "./diagramPrimitives";

/*
 * The direct veth demo from section 3, animated: ns1 and ns2 pinging each
 * other over the one cable between them. Unlike the other diagrams here,
 * this isn't a narrative to scroll through once — it's a loop, on purpose,
 * because "the wire carries traffic both ways continuously" is the thing
 * being shown, not a sequence of steps. See useLoopAnimation for how it
 * stays cheap while doing that indefinitely.
 */

const NS1: [number, number] = [150, 130];
const NS2: [number, number] = [570, 130];
const WIRE_START = 250;
const WIRE_END = 470;

// One cycle: request travels right, a short dwell at ns2, reply travels
// left, a short dwell at ns1 — then it wraps back to 0 seamlessly.
const REQ_END = 0.42;
const REPLY_START = 0.5;
const REPLY_END = 0.92;

export default function VethPingDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useLoopAnimation(ref);

  const sendingRequest = p < REQ_END;
  const sendingReply = p >= REPLY_START && p < REPLY_END;

  let packetX: number;
  let label: string;
  if (sendingRequest) {
    packetX = WIRE_START + (WIRE_END - WIRE_START) * phase(p, 0, REQ_END);
    label = "echo request →";
  } else if (sendingReply) {
    packetX =
      WIRE_END - (WIRE_END - WIRE_START) * phase(p, REPLY_START, REPLY_END);
    label = "← echo reply";
  } else if (p < REPLY_START) {
    packetX = WIRE_END;
    label = "64 bytes from 10.0.0.2";
  } else {
    packetX = WIRE_START;
    label = "icmp_seq ttl=64 time=0.06ms";
  }

  // ns1 owns the packet while sending the request and right after the reply
  // lands; ns2 owns it from arrival through sending the reply back. No gap
  // or overlap at the wrap point, so the glow never flickers mid-loop.
  const ns1Active = sendingRequest || p >= REPLY_END;
  const ns2Active = !ns1Active;

  return (
    <div ref={ref} className="not-prose my-8 w-full">
      <svg
        viewBox="0 0 720 220"
        role="img"
        aria-label="ns1 and ns2 exchanging a continuous ping over their veth pair: echo request from ns1 to ns2, echo reply back."
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "720 / 220",
          display: "block",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        <line
          x1={WIRE_START}
          y1={NS1[1]}
          x2={WIRE_END}
          y2={NS2[1]}
          stroke="var(--border)"
          strokeWidth={1.5}
        />

        <DiagramNode
          cx={NS1[0]}
          cy={NS1[1]}
          label="ns1"
          sub="veth0 · 10.0.0.1"
          active={ns1Active}
          w={170}
        />
        <DiagramNode
          cx={NS2[0]}
          cy={NS2[1]}
          label="ns2"
          sub="veth1 · 10.0.0.2"
          active={ns2Active}
          w={170}
        />

        <DiagramPacket pt={[packetX, (NS1[1] + NS2[1]) / 2]} visible />

        <text
          x={(WIRE_START + WIRE_END) / 2}
          y={NS1[1] - 20}
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
        fig. — ns1 ⇄ ns2 over the veth pair, one ping cycle, on loop
      </p>
    </div>
  );
}
