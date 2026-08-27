"use client";

import { useRef } from "react";
import { useDiagramPlayback } from "./useDiagramPlayback";
import {
  phase,
  DiagramEdge,
  DiagramNode,
  DiagramArrowMarker,
  DiagramControls,
} from "./diagramPrimitives";

/*
 * Section 1's hook, drawn: one shared network stack means one port table,
 * so two processes binding :3000 collide (EADDRINUSE). Give each process
 * its own network namespace and the port table splits with it — same two
 * processes, same port, no conflict. A crossfade between a "before" group
 * (single stack) and an "after" group (split stacks) rather than a literal
 * flow, since the point is a state change, not a packet going anywhere.
 */

const PROCESS_A: [number, number] = [150, 300];
const PROCESS_B: [number, number] = [570, 300];
const STACK_SHARED: [number, number] = [360, 90];
const STACK_A: [number, number] = [150, 90];
const STACK_B: [number, number] = [570, 90];

export default function NetnsConflictDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const { progress: p, playing, finished, toggle } = useDiagramPlayback(ref);

  const fadeBefore = 1 - phase(p, 0.45, 0.62);
  const fadeAfter = phase(p, 0.45, 0.62);
  const errorOpacity = phase(p, 0.12, 0.28) * fadeBefore;
  const successOpacity = phase(p, 0.72, 0.88) * fadeAfter;
  const stackHasError = errorOpacity > 0.4;

  return (
    <div ref={ref} className="not-prose my-8 w-full">
      <svg
        viewBox="0 0 720 380"
        role="img"
        aria-label="Two processes both try to bind port 3000. With one shared network stack they collide with EADDRINUSE. Split them into two network namespaces, each with its own port table, and the same bind succeeds for both."
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

        {/* Before: one shared stack, one port table */}
        <g opacity={fadeBefore}>
          <DiagramEdge points={[PROCESS_A, STACK_SHARED]} progress={1} />
          <DiagramEdge points={[PROCESS_B, STACK_SHARED]} progress={1} />
          <DiagramNode
            cx={STACK_SHARED[0]}
            cy={STACK_SHARED[1]}
            label="root network stack"
            sub="one port table"
            active
            error={stackHasError}
          />
          <text
            x={360}
            y={160}
            textAnchor="middle"
            fontSize={13}
            fontWeight={600}
            fill="var(--destructive)"
            opacity={errorOpacity}
          >
            bind :3000 → EADDRINUSE
          </text>
        </g>

        {/* After: one namespace per process, one port table each */}
        <g opacity={fadeAfter}>
          <DiagramEdge points={[PROCESS_A, STACK_A]} progress={1} />
          <DiagramEdge points={[PROCESS_B, STACK_B]} progress={1} />
          <DiagramNode
            cx={STACK_A[0]}
            cy={STACK_A[1]}
            label="netns: ns1"
            sub="own port table"
            active
          />
          <DiagramNode
            cx={STACK_B[0]}
            cy={STACK_B[1]}
            label="netns: ns2"
            sub="own port table"
            active
          />
          <text
            x={360}
            y={160}
            textAnchor="middle"
            fontSize={13}
            fontWeight={600}
            fill="var(--primary)"
            opacity={successOpacity}
          >
            bind :3000 on both — no conflict
          </text>
        </g>

        <DiagramNode
          cx={PROCESS_A[0]}
          cy={PROCESS_A[1]}
          label="Process A"
          sub="bind :3000"
          active
        />
        <DiagramNode
          cx={PROCESS_B[0]}
          cy={PROCESS_B[1]}
          label="Process B"
          sub="bind :3000"
          active
        />
      </svg>
      <DiagramControls playing={playing} finished={finished} onToggle={toggle} />
      <p
        className="mt-3 text-center text-xs text-muted-foreground/70"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        fig. — one port table vs. two · scroll or press play
      </p>
    </div>
  );
}
