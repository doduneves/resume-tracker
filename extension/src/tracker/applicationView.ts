import type { TimelineEntry } from "../domain/timeline";

export function rowStatusClass(status: string): string {
  if (status === "Rejected") {
    return "row-rejected";
  }
  if (status === "Applied") {
    return "row-applied";
  }
  return "row-in-progress";
}

export function formatDisplayDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) {
    return iso;
  }
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function chronologicalTimeline(
  entries: TimelineEntry[],
): TimelineEntry[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => {
      const byDate = a.entry.at.localeCompare(b.entry.at);
      return byDate !== 0 ? byDate : a.index - b.index;
    })
    .map(({ entry }) => entry);
}

export function isoDateValue(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}
