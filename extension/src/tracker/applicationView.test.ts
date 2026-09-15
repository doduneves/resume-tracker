import { describe, expect, it } from "vitest";
import { createTimelineEntry } from "../domain/timeline";
import {
  chronologicalTimeline,
  formatDisplayDate,
  rowStatusClass,
} from "./applicationView";

describe("rowStatusClass", () => {
  it("uses a red tint for Rejected, neutral for Applied, and green otherwise", () => {
    expect(rowStatusClass("Rejected")).toBe("row-rejected");
    expect(rowStatusClass("Applied")).toBe("row-applied");
    expect(rowStatusClass("Offer")).toBe("row-in-progress");
    expect(rowStatusClass("Screening")).toBe("row-in-progress");
  });
});

describe("formatDisplayDate", () => {
  it("formats an ISO date as DD/MM/YYYY", () => {
    expect(formatDisplayDate("2026-09-15")).toBe("15/09/2026");
  });
});

describe("chronologicalTimeline", () => {
  it("sorts by date ascending and keeps same-day insert order", () => {
    const applied = createTimelineEntry("status_change", "Applied", "2026-09-10");
    const interview = createTimelineEntry(
      "status_change",
      "HR Interview",
      "2026-09-14",
    );
    const note = createTimelineEntry("note", "Followed up", "2026-09-14");
    const rejected = createTimelineEntry("status_change", "Rejected", "2026-09-15");
    const reason = createTimelineEntry(
      "rejection_reason",
      "Headcount freeze",
      "2026-09-15",
    );

    const ordered = chronologicalTimeline([
      rejected,
      reason,
      applied,
      interview,
      note,
    ]);

    expect(ordered.map((entry) => entry.text)).toEqual([
      "Applied",
      "HR Interview",
      "Followed up",
      "Rejected",
      "Headcount freeze",
    ]);
  });
});
