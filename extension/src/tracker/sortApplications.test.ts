import { describe, expect, it } from "vitest";
import type { Application } from "../domain/application";
import { createTimelineEntry } from "../domain/timeline";
import {
  compareApplications,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
} from "./sortApplications";

describe("compareApplications", () => {
  it("defaults to lastUpdated descending", () => {
    expect(DEFAULT_SORT_FIELD).toBe("lastUpdated");
    expect(DEFAULT_SORT_DIRECTION).toBe("desc");

    const older = sample({ id: "a", lastUpdated: "2026-01-01" });
    const newer = sample({ id: "b", lastUpdated: "2026-09-10" });
    const rows = [older, newer].sort((a, b) =>
      compareApplications(a, b, DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION),
    );

    expect(rows.map((row) => row.id)).toEqual(["b", "a"]);
  });

  it("sorts company names ascending", () => {
    const globex = sample({ id: "g", company: "Globex" });
    const acme = sample({ id: "a", company: "Acme" });
    const rows = [globex, acme].sort((a, b) =>
      compareApplications(a, b, "company", "asc"),
    );
    expect(rows.map((row) => row.company)).toEqual(["Acme", "Globex"]);
  });

  it("sorts stages by joined chip labels", () => {
    const later = sample({ id: "b", stages: ["Screening", "Onsite"] });
    const earlier = sample({ id: "a", stages: ["HR Interview"] });
    const rows = [later, earlier].sort((a, b) =>
      compareApplications(a, b, "stages", "asc"),
    );
    expect(rows.map((row) => row.id)).toEqual(["a", "b"]);
  });

  it("sorts notes from timeline text", () => {
    const beta = sample({
      id: "b",
      timeline: [createTimelineEntry("note", "beta", "2026-09-01")],
    });
    const alpha = sample({
      id: "a",
      timeline: [createTimelineEntry("note", "alpha", "2026-09-01")],
    });
    const rows = [beta, alpha].sort((a, b) =>
      compareApplications(a, b, "notes", "asc"),
    );
    expect(rows.map((row) => row.id)).toEqual(["a", "b"]);
  });
});

function sample(overrides: Partial<Application>): Application {
  return {
    id: "id",
    company: "",
    status: "Applied",
    jobTitle: "",
    nextStep: "",
    lastUpdated: "2026-09-01",
    salary: "",
    rating: null,
    matchLevel: "",
    stack: [],
    jobUrl: "",
    resumeId: null,
    stages: [],
    contact: "",
    timeline: [],
    appliedAt: "2026-09-01",
    ...overrides,
  };
}
