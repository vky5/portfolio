import type { Contributions } from "@/lib/github";
import { Reveal } from "@/components/motion/Reveal";

const CELL = 10;
const GAP = 3;
const PITCH = CELL + GAP;

// Phosphor intensity: unlit glass → full amber.
const LEVEL_OPACITY = [0, 0.25, 0.5, 0.75, 1];

export default function ActivitySection({
  contributions,
}: {
  contributions: Contributions | null;
}) {
  if (!contributions) return null;
  const { days, total } = contributions;

  const firstDay = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((days.length + firstDay) / 7);
  const width = weeks * PITCH - GAP;
  const height = 7 * PITCH - GAP;

  return (
    <Reveal className="py-4">
      <div className="overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ minWidth: width / 1.6 }}
          className="w-full"
          role="img"
          aria-label={`GitHub contribution calendar${total ? `: ${total} contributions in the last year` : ""}`}
        >
          {days.map((day, i) => {
            const idx = i + firstDay;
            const col = Math.floor(idx / 7);
            const row = idx % 7;
            return (
              <rect
                key={day.date}
                x={col * PITCH}
                y={row * PITCH}
                width={CELL}
                height={CELL}
                rx="2"
                fill={day.level === 0 ? "var(--muted)" : "var(--primary)"}
                fillOpacity={day.level === 0 ? 1 : LEVEL_OPACITY[day.level]}
              >
                <title>{day.date}</title>
              </rect>
            );
          })}
        </svg>
      </div>
      <p className="mt-3 text-right font-mono text-[10px] tracking-wide text-muted-foreground/70">
        fig. 02 —{" "}
        {total !== null
          ? `${total.toLocaleString()} contributions`
          : "contributions"}{" "}
        in the last year ·{" "}
        <a
          href="https://github.com/vky5"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          github/vky5 ↗
        </a>
      </p>
    </Reveal>
  );
}
