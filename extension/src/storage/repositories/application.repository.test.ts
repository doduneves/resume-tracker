import { indexedDB } from "fake-indexeddb";
import { afterEach, describe, expect, it } from "vitest";
import { APPLICATION_STATUSES } from "../../domain/status";
import { DB_NAME, openDatabase } from "../db";
import { ApplicationRepository } from "./application.repository";
import type { Application } from "../../domain/application";

function sampleApplication(overrides: Partial<Application> = {}): Application {
  return {
    id: "app-1",
    company: "Acme",
    status: "Applied",
    jobTitle: "Engineer",
    nextStep: "",
    lastUpdated: "2026-08-26",
    salary: "",
    rating: null,
    matchLevel: "",
    stack: "",
    jobUrl: "https://example.com/job",
    resumeId: "en",
    stages: "",
    contact: "",
    notes: "",
    appliedAt: "2026-08-26",
    ...overrides,
  };
}

describe("ApplicationRepository", () => {
  let db: IDBDatabase | undefined;

  afterEach(() => {
    db?.close();
    indexedDB.deleteDatabase(DB_NAME);
  });

  it("exposes all six application statuses", () => {
    expect(APPLICATION_STATUSES).toEqual([
      "Applied",
      "Screening",
      "HR Interview",
      "Technical Interview",
      "Offer",
      "Rejected",
    ]);
  });

  it("creates, reads, updates, and deletes applications", async () => {
    db = await openDatabase();
    const repo = new ApplicationRepository(db);

    const created = await repo.create(sampleApplication());
    expect(created.company).toBe("Acme");

    const listed = await repo.list();
    expect(listed).toHaveLength(1);
    expect(listed[0]?.jobTitle).toBe("Engineer");

    const fetched = await repo.getById("app-1");
    expect(fetched?.company).toBe("Acme");

    await repo.update(
      sampleApplication({ status: "HR Interview", notes: "Follow up" }),
    );
    const updated = await repo.getById("app-1");
    expect(updated?.status).toBe("HR Interview");
    expect(updated?.notes).toBe("Follow up");

    await repo.delete("app-1");
    expect(await repo.list()).toHaveLength(0);
  });
});
