export type TimelineEntryKind = "status_change" | "note" | "rejection_reason";

export interface TimelineEntry {
  id: string;
  at: string;
  kind: TimelineEntryKind;
  text: string;
}

export function createTimelineEntry(
  kind: TimelineEntryKind,
  text: string,
  at: string,
  id: string = crypto.randomUUID(),
): TimelineEntry {
  return { id, at, kind, text };
}
