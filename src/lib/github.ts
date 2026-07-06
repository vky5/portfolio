const GITHUB_USER = "vky5";

export interface ContributionDay {
  date: string;
  level: number; // 0–4, GitHub's own intensity buckets
}

export interface Contributions {
  days: ContributionDay[];
  total: number | null;
}

/**
 * Reads the public contribution calendar from the profile page HTML —
 * no token needed. Returns null on any failure so the UI can hide itself.
 */
export async function getContributions(): Promise<Contributions | null> {
  try {
    const res = await fetch(
      `https://github.com/users/${GITHUB_USER}/contributions`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (portfolio-build)" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const html = await res.text();

    const days: ContributionDay[] = [];
    const cellRe =
      /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"|data-level="(\d)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"/g;
    let m: RegExpExecArray | null;
    while ((m = cellRe.exec(html)) !== null) {
      const date = m[1] ?? m[4];
      const level = parseInt(m[2] ?? m[3], 10);
      days.push({ date, level });
    }
    if (days.length === 0) return null;

    // Cells appear in weekday-row order; the grid needs chronological order.
    days.sort((a, b) => a.date.localeCompare(b.date));

    const totalMatch = html.match(
      /([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i,
    );
    const total = totalMatch
      ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
      : null;

    return { days, total };
  } catch (err) {
    console.error("getContributions failed:", err);
    return null;
  }
}
