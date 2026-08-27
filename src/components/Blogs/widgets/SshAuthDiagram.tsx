"use client";

import { useMemo, useRef } from "react";
import { useDiagramPlayback } from "./useDiagramPlayback";
import {
  Pt,
  polyline,
  pointAlong,
  clamp01,
  DiagramEdge,
  DiagramNode,
  DiagramPacket,
  DiagramArrowMarker,
  DiagramControls,
} from "./diagramPrimitives";

/*
 * Public-key challenge/response: Server sends a challenge, Client signs it
 * with the private key, Server checks the signature against authorized_keys.
 * One packet rides the whole route so the "nothing reusable crosses the
 * wire" point reads as a single continuous trip rather than four bullets.
 */

const ROUTE: Pt[] = [
  [150, 180], // Server
  [570, 180], // Client (challenge sent)
  [150, 200], // back to Server (signed response)
  [360, 60], // up to authorized_keys (check signature)
  [360, 320], // down to result (verified)
];

export default function SshAuthDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const { progress: p, playing, finished, toggle } = useDiagramPlayback(ref);

  const geo = useMemo(() => polyline(ROUTE), []);
  const at = (v: number) => geo.cum[v] / geo.total;
  const edgeProgress = (i: number) =>
    clamp01((p - at(i - 1)) / (at(i) - at(i - 1) || 1e-6));

  const dist = p * geo.total;
  const packet = pointAlong(ROUTE, geo.cum, geo.total, dist);
  const packetVisible = p > 0.001 && p < 0.999;

  return (
    <div ref={ref} className="not-prose my-8 w-full">
      <svg
        viewBox="0 0 720 380"
        role="img"
        aria-label="Public key authentication: Server sends a challenge, Client signs it with the private key, Server verifies the signature against authorized_keys."
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "720 / 380",
          display: "block",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        <defs>
          <DiagramArrowMarker />
        </defs>

        <DiagramEdge points={[ROUTE[0], ROUTE[1]]} progress={edgeProgress(1)} label="challenge" />
        <DiagramEdge points={[ROUTE[1], ROUTE[2]]} progress={edgeProgress(2)} label="signed response" />
        <DiagramEdge points={[ROUTE[2], ROUTE[3]]} progress={edgeProgress(3)} label="check signature" />
        <DiagramEdge points={[ROUTE[3], ROUTE[4]]} progress={edgeProgress(4)} label="valid" />

        <DiagramNode cx={ROUTE[0][0]} cy={ROUTE[0][1]} label="Server" active />
        <DiagramNode cx={ROUTE[1][0]} cy={ROUTE[1][1]} label="Client" sub="holds the private key" active={p >= at(1) - 0.01} />
        <DiagramNode cx={360} cy={60} label="authorized_keys" active={p >= at(3) - 0.01} />
        <DiagramNode cx={360} cy={320} label="Signature verified" active={p >= at(4) - 0.01} />

        <DiagramPacket pt={packet} visible={packetVisible} />
      </svg>
      <DiagramControls playing={playing} finished={finished} onToggle={toggle} />
      <p
        className="mt-3 text-center text-xs text-muted-foreground/70"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        fig. — challenge/response · scroll or press play
      </p>
    </div>
  );
}
