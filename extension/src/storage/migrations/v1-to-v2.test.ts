import { indexedDB } from "fake-indexeddb";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_STAGES } from "../../domain/status";
import {
  APPLICATIONS_STORE,
  DB_NAME,
  openDatabase,
  RESUMES_STORE,
} from "../db";
import { ApplicationRepository } from "../repositories/application.repository";
import {
  migrateV1RecordToV2,
  type ApplicationV1,
} from "./v1-to-v2";

function sampleV1(overrides: Partial<ApplicationV1> = {}): ApplicationV1 {
  return {
    id: "app-1",
    company: "Acme",
    status: "Screening",
    jobTitle: "Engineer",
    nextStep: "call recruiter",
    lastUpdated: "2026-08-27",
    salary: "CLT",
    rating: 4,
    matchLevel: "high",
    stack: "TypeScript, React",
    jobUrl: "https://example.com/job",
    resumeId: "en",
    stages: "",
    contact: "Ada",
    notes: "Follow up next week",
    appliedAt: "2026-08-26",
    ...overrides,
  };
}

function openV1(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(APPLICATIONS_STORE)) {
        db.createObjectStore(APPLICATIONS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(RESUMES_STORE)) {
        db.createObjectStore(RESUMES_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Failed to open v1 IndexedDB"));
  });
}

describe("migrateV1RecordToV2", () => {
  it("converts arrays, bootstraps Applied, migrates notes, and clears invalid nextStep", () => {
    let n = 0;
    const migrated = migrateV1RecordToV2(sampleV1(), () => `id-${++n}`);

    expect(migrated.stages).toEqual([...DEFAULT_STAGES]);
    expect(migrated.stack).toEqual(["TypeScript", "React"]);
    expect(migrated.nextStep).toBe("");
    expect(migrated.company).toBe("Acme");
    expect(migrated.status).toBe("Screening");
    expect(migrated.rating).toBe(4);
    expect(migrated.timeline).toEqual([
      {
        id: "id-1",
        at: "2026-08-26",
        kind: "status_change",
        text: "Applied",
      },
      {
        id: "id-2",
        at: "2026-08-27",
        kind: "note",
        text: "Follow up next week",
      },
    ]);
    expect(migrated).not.toHaveProperty("notes");
  });

  it("splits a non-empty stages string and keeps a single stack value", () => {
    const migrated = migrateV1RecordToV2(
      sampleV1({
        stages: "Screening, Onsite",
        stack: "Go",
        notes: "",
        nextStep: "2026-09-01",
      }),
    );

    expect(migrated.stages).toEqual(["Screening", "Onsite"]);
    expect(migrated.stack).toEqual(["Go"]);
    expect(migrated.nextStep).toBe("2026-09-01");
    expect(migrated.timeline).toEqual([
      expect.objectContaining({
        kind: "status_change",
        text: "Applied",
        at: "2026-08-26",
      }),
    ]);
  });

  it("uses appliedAt for a note when lastUpdated is not a date", () => {
    const migrated = migrateV1RecordToV2(
      sampleV1({
        notes: "hello",
        lastUpdated: "yesterday",
      }),
    );

    expect(migrated.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "note",
          text: "hello",
          at: "2026-08-26",
        }),
      ]),
    );
  });
});

describe("IndexedDB v1 to v2 upgrade", () => {
  let db: IDBDatabase | undefined;

  afterEach(() => {
    db?.close();
    indexedDB.deleteDatabase(DB_NAME);
  });

  it("migrates v1 rows when opening schema v2", async () => {
    const v1 = await openV1();
    const tx = v1.transaction(APPLICATIONS_STORE, "readwrite");
    tx.objectStore(APPLICATIONS_STORE).add(sampleV1());
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error ?? new Error("Failed to seed v1 application"));
    });
    v1.close();

    db = await openDatabase();
    const repo = new ApplicationRepository(db);
    const rows = await repo.list();

    expect(rows).toHaveLength(1);
    expect(rows[0]?.company).toBe("Acme");
    expect(rows[0]?.stages).toEqual([...DEFAULT_STAGES]);
    expect(rows[0]?.stack).toEqual(["TypeScript", "React"]);
    expect(rows[0]?.nextStep).toBe("");
    expect(rows[0]?.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "status_change", text: "Applied" }),
        expect.objectContaining({ kind: "note", text: "Follow up next week" }),
      ]),
    );
  });
});
