import type { Application } from "../domain/application";
import { notesText } from "./applicationView";

export type SortableField =
  | "company"
  | "jobTitle"
  | "status"
  | "stages"
  | "jobUrl"
  | "resumeId"
  | "nextStep"
  | "lastUpdated"
  | "salary"
  | "rating"
  | "matchLevel"
  | "stack"
  | "contact"
  | "notes";

export type SortDirection = "asc" | "desc";

export const DEFAULT_SORT_FIELD: SortableField = "lastUpdated";
export const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

export function compareApplications(
  a: Application,
  b: Application,
  field: SortableField,
  direction: SortDirection,
): number {
  const av = fieldValue(a, field);
  const bv = fieldValue(b, field);
  const cmp = compareValues(av, bv);
  if (cmp !== 0) {
    return direction === "asc" ? cmp : -cmp;
  }
  return a.id.localeCompare(b.id);
}

function fieldValue(
  row: Application,
  field: SortableField,
): string | number {
  switch (field) {
    case "rating":
      return row.rating ?? Number.NEGATIVE_INFINITY;
    case "stages":
    case "stack":
      return row[field].join(", ").toLowerCase();
    case "notes":
      return notesText(row).toLowerCase();
    case "resumeId":
      return row.resumeId ?? "";
    default:
      return String(row[field] ?? "").toLowerCase();
  }
}

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b));
}
