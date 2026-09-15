import { indexedDB } from "fake-indexeddb";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_STAGES, TERMINAL_STATUSES } from "../../domain/status";
import {
  APPLICATIONS_STORE,
  DB_NAME,
  DB_VERSION,
  openDatabase,
  RESUMES_STORE,
  SETTINGS_STORE,
} from "../db";
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
    stack: ["TypeScript"],
    jobUrl: "https://example.com/job",
    resumeId: "en",
    stages: [...DEFAULT_STAGES],
    contact: "",
    timeline: [
      {
        id: "tl-1",
        at: "2026-08-26",
        kind: "status_change",
        text: "Applied",
      },
    ],
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

  it("defines terminals and default stages", () => {
    expect(TERMINAL_STATUSES).toEqual(["Applied", "Offer", "Rejected"]);
    expect(DEFAULT_STAGES).toEqual([
      "Screening",
      "Code Test",
      "Tech Interview",
      "HR Interview",
    ]);
  });

  it("creates schema v2 stores including settings", async () => {
    db = await openDatabase();
    expect(db.version).toBe(DB_VERSION);
    expect([...db.objectStoreNames]).toEqual(
      expect.arrayContaining([
        APPLICATIONS_STORE,
        RESUMES_STORE,
        SETTINGS_STORE,
      ]),
    );
  });

  it("creates, reads, updates, and deletes applications", async () => {
    db = await openDatabase();
    const repo = new ApplicationRepository(db);

    const created = await repo.create(sampleApplication());
    expect(created.company).toBe("Acme");
    expect(created.stack).toEqual(["TypeScript"]);
    expect(created.stages).toEqual([...DEFAULT_STAGES]);
    expect(created.timeline[0]?.text).toBe("Applied");

    const listed = await repo.list();
    expect(listed).toHaveLength(1);
    expect(listed[0]?.jobTitle).toBe("Engineer");

    const fetched = await repo.getById("app-1");
    expect(fetched?.company).toBe("Acme");

    await repo.update(
      sampleApplication({
        status: "HR Interview",
        timeline: [
          {
            id: "tl-1",
            at: "2026-08-26",
            kind: "status_change",
            text: "Applied",
          },
          {
            id: "tl-2",
            at: "2026-08-27",
            kind: "note",
            text: "Follow up",
          },
        ],
      }),
    );
    const updated = await repo.getById("app-1");
    expect(updated?.status).toBe("HR Interview");
    expect(updated?.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "note", text: "Follow up" }),
      ]),
    );

    await repo.delete("app-1");
    expect(await repo.list()).toHaveLength(0);
  });
});
