"use client";

import { useMemo, useRef } from "react";
import { useDiagramPlayback } from "./useDiagramPlayback";
import {
  Pt,
  polyline,
  pointAlong,
  phase,
  DiagramEdge,
  DiagramNode,
  DiagramPacket,
  DiagramArrowMarker,
  DiagramControls,
} from "./diagramPrimitives";

/*
 * Diffie-Hellman key exchange: Client and Server each send a public value
 * toward the center. Neither ever transmits the secret itself — the diagram
 * makes that literal by having two packets converge on one "shared session
 * key" node instead of one side handing a key to the other. A second phase
 * then reveals the resulting encrypted channel directly between the two.
 */

const CLIENT: Pt = [150, 60];
const SERVER: Pt = [570, 60];
const KEY: Pt = [360, 380];

const ROUTE_CLIENT: Pt[] = [[150, 84], [230, 250], [310, 356]];
const ROUTE_SERVER: Pt[] = [[570, 84], [490, 250], [410, 356]];
const CHANNEL: Pt[] = [[218, 60], [502, 60]];

const KEX_START = 0.05;
const KEX_END = 0.5;
const CHANNEL_START = 0.6;
const CHANNEL_END = 0.9;

export default function SshKeyExchangeDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const { progress: p, playing, finished, toggle } = useDiagramPlayback(ref);

  const geoClient = useMemo(() => polyline(ROUTE_CLIENT), []);
  const geoServer = useMemo(() => polyline(ROUTE_SERVER), []);

  const kexP = phase(p, KEX_START, KEX_END);
  const channelP = phase(p, CHANNEL_START, CHANNEL_END);

  const clientPacket = pointAlong(
    ROUTE_CLIENT,
    geoClient.cum,
    geoClient.total,
    kexP * geoClient.total,
  );
  const serverPacket = pointAlong(
    ROUTE_SERVER,
    geoServer.cum,
    geoServer.total,
    kexP * geoServer.total,
  );
  const packetsVisible = kexP > 0.001 && kexP < 0.999;
  const keyActive = p >= KEX_END - 0.02;

  return (
    <div ref={ref} className="not-prose my-8 w-full">
      <svg
        viewBox="0 0 720 420"
        role="img"
        aria-label="Diffie-Hellman key exchange: Client and Server each derive the same shared session key, then establish an encrypted channel."
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "720 / 420",
          display: "block",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        <defs>
          <DiagramArrowMarker />
        </defs>

        <DiagramEdge points={ROUTE_CLIENT} progress={kexP} label="public value a" />
        <DiagramEdge points={ROUTE_SERVER} progress={kexP} label="public value b" />
        <DiagramEdge points={CHANNEL} progress={channelP} label="encrypted channel" />

        <DiagramNode cx={CLIENT[0]} cy={CLIENT[1]} label="Client" active />
        <DiagramNode cx={SERVER[0]} cy={SERVER[1]} label="Server" active />
        <DiagramNode
          cx={KEY[0]}
          cy={KEY[1]}
          label="Shared Session Key"
          sub="derived independently by both sides"
          active={keyActive}
          w={220}
          h={54}
        />

        <DiagramPacket pt={clientPacket} visible={packetsVisible} />
        <DiagramPacket pt={serverPacket} visible={packetsVisible} />
      </svg>
      <DiagramControls playing={playing} finished={finished} onToggle={toggle} />
      <p
        className="mt-3 text-center text-xs text-muted-foreground/70"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        fig. — key exchange · scroll or press play
      </p>
    </div>
  );
}
