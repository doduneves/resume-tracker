import type { Application } from "../domain/application";

export function notesText(row: Application): string {
  return row.timeline
    .filter((entry) => entry.kind === "note")
    .map((entry) => entry.text)
    .join("\n");
}

export function rowStatusClass(status: string): string {
  if (status === "Rejected") {
    return "row-rejected";
  }
  if (status === "Applied") {
    return "row-applied";
  }
  return "row-in-progress";
}

export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
