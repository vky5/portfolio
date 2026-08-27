// Parses a blog's display date ("May 27, 2026", "Jul 7, 2026") into a real
// Date so posts can be sorted chronologically instead of alphabetically —
// Mongo's string sort on `date` put "Jul" before "May" because 'J' < 'M'.
export function parseBlogDate(date: string): Date | null {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
