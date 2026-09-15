import { describe, expect, it } from "vitest";
import {
  DEFAULT_STAGES,
  TERMINAL_STATUSES,
  statusOptionsFor,
} from "./status";

describe("statusOptionsFor", () => {
  it("returns terminals plus that row’s stages", () => {
    expect(statusOptionsFor(["Screening", "Onsite"])).toEqual([
      ...TERMINAL_STATUSES,
      "Screening",
      "Onsite",
    ]);
  });

  it("does not inject default stages that are not on the row", () => {
    expect(statusOptionsFor(["Custom"])).toEqual([
      ...TERMINAL_STATUSES,
      "Custom",
    ]);
    expect(statusOptionsFor(["Custom"])).not.toEqual(
      expect.arrayContaining([...DEFAULT_STAGES]),
    );
  });

  it("deduplicates stages that match a terminal and keeps current status", () => {
    expect(statusOptionsFor(["Offer", "Screening"], "Legacy")).toEqual([
      ...TERMINAL_STATUSES,
      "Screening",
      "Legacy",
    ]);
  });
});
