// Parses the leading "Mon YYYY" out of a free-text experience period
// ("Jul 2025 - Sep 2025", "Dec 2023", "Jun 2026 - Present") into a real Date
// so entries can be sorted chronologically instead of alphabetically.
const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

export function parsePeriodStart(period: string): Date | null {
  const match = period.match(/([A-Za-z]{3,})\.?\s+(\d{4})/);
  if (!match) return null;
  const monthIndex = MONTHS.indexOf(match[1].slice(0, 3).toLowerCase());
  if (monthIndex === -1) return null;
  return new Date(Date.UTC(parseInt(match[2], 10), monthIndex, 1));
}
