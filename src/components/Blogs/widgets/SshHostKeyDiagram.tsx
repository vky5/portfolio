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
 * Host-key trust-on-first-use: the path everyone hits (fingerprint matches,
 * handshake proceeds) is the main route the packet travels. The path nobody
 * wants to hit (fingerprint mismatch, connection refused) is drawn as a
 * muted branch off the same decision point — it's there so scrolling shows
 * *why* that warning exists, not just that it can appear.
 */

const ROUTE: Pt[] = [
  [110, 200], // Client
  [340, 100], // known_hosts lookup
  [340, 300], // fingerprint compare
  [600, 200], // Proceed with handshake
];

const MISMATCH: Pt = [600, 340];

export default function SshHostKeyDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const { progress: p, playing, finished, toggle } = useDiagramPlayback(ref);

  const geo = useMemo(() => polyline(ROUTE), []);
  const at = (v: number) => geo.cum[v] / geo.total;
  const edgeProgress = (i: number) =>
    clamp01((p - at(i - 1)) / (at(i) - at(i - 1) || 1e-6));

  const dist = p * geo.total;
  const packet = pointAlong(ROUTE, geo.cum, geo.total, dist);
  const packetVisible = p > 0.001 && p < 0.999;
  const finalProgress = edgeProgress(3);

  return (
    <div ref={ref} className="not-prose my-8 w-full">
      <svg
        viewBox="0 0 720 400"
        role="img"
        aria-label="Host key verification: known_hosts lookup and fingerprint compare, branching into proceed or connection refused."
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "720 / 400",
          display: "block",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        <defs>
          <DiagramArrowMarker />
        </defs>

        <DiagramEdge points={[ROUTE[0], ROUTE[1]]} progress={edgeProgress(1)} label="lookup" />
        <DiagramEdge points={[ROUTE[1], ROUTE[2]]} progress={edgeProgress(2)} label="compare fingerprint" />
        <DiagramEdge points={[ROUTE[2], ROUTE[3]]} progress={finalProgress} label="match" />
        <DiagramEdge points={[ROUTE[2], MISMATCH]} progress={finalProgress} label="mismatch" muted />

        <DiagramNode cx={ROUTE[0][0]} cy={ROUTE[0][1]} label="Client" active w={120} />
        <DiagramNode cx={ROUTE[1][0]} cy={ROUTE[1][1]} label="known_hosts lookup" active={p >= at(1) - 0.01} w={190} />
        <DiagramNode cx={ROUTE[2][0]} cy={ROUTE[2][1]} label="Fingerprint compare" active={p >= at(2) - 0.01} w={190} />
        <DiagramNode cx={ROUTE[3][0]} cy={ROUTE[3][1]} label="Proceed with handshake" active={p >= at(3) - 0.01} w={210} />
        <DiagramNode cx={MISMATCH[0]} cy={MISMATCH[1]} label="Connection refused" active={p >= at(3) - 0.01} error w={190} />

        <DiagramPacket pt={packet} visible={packetVisible} />
      </svg>
      <DiagramControls playing={playing} finished={finished} onToggle={toggle} />
      <p
        className="mt-3 text-center text-xs text-muted-foreground/70"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        fig. — host key verification · scroll or press play
      </p>
    </div>
  );
}
