import { indexedDB } from "fake-indexeddb";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_STAGES } from "../../domain/status";
import { DB_NAME, openDatabase } from "../../storage/db";
import { ApplicationRepository } from "../../storage/repositories/application.repository";
import { ApplicationService } from "./application.service";
import { todayIsoDate } from "./dates";

describe("ApplicationService", () => {
  let db: IDBDatabase | undefined;

  afterEach(() => {
    db?.close();
    indexedDB.deleteDatabase(DB_NAME);
  });

  it("creates applications with Applied status, default stages, and a timeline entry", async () => {
    db = await openDatabase();
    const service = new ApplicationService(new ApplicationRepository(db));
    const today = todayIsoDate();

    const created = await service.create({ company: "Globex" });

    expect(created.status).toBe("Applied");
    expect(created.appliedAt).toBe(today);
    expect(created.lastUpdated).toBe(today);
    expect(created.company).toBe("Globex");
    expect(created.resumeId).toBeNull();
    expect(created.rating).toBeNull();
    expect(created.stages).toEqual([...DEFAULT_STAGES]);
    expect(created.stack).toEqual([]);
    expect(created.timeline).toEqual([
      expect.objectContaining({
        kind: "status_change",
        text: "Applied",
        at: today,
      }),
    ]);
  });

  it("lists, updates, and deletes applications", async () => {
    db = await openDatabase();
    const service = new ApplicationService(new ApplicationRepository(db));

    const created = await service.create({ company: "Initech" });
    const listed = await service.list();
    expect(listed).toHaveLength(1);

    await service.update({
      ...created,
      salary: "CLT",
    });
    const updated = (await service.list())[0];
    expect(updated?.salary).toBe("CLT");
    expect(updated?.status).toBe("Applied");

    await service.delete(created.id);
    expect(await service.list()).toHaveLength(0);
  });

  it("appends a status_change timeline entry and sets lastUpdated", async () => {
    db = await openDatabase();
    const service = new ApplicationService(new ApplicationRepository(db));
    const created = await service.create({ company: "Hooli" });
    const today = todayIsoDate();

    const updated = await service.updateStatus(created.id, "Screening");

    expect(updated.status).toBe("Screening");
    expect(updated.lastUpdated).toBe(today);
    expect(updated.timeline).toEqual([
      expect.objectContaining({ kind: "status_change", text: "Applied" }),
      expect.objectContaining({
        kind: "status_change",
        text: "Screening",
        at: today,
      }),
    ]);
  });

  it("rejects an invalid status that is not a terminal or row stage", async () => {
    db = await openDatabase();
    const service = new ApplicationService(new ApplicationRepository(db));
    const created = await service.create();

    await expect(
      service.updateStatus(created.id, "Technical Interview"),
    ).rejects.toThrow(/Invalid status/);
  });

  it("rejects with a Rejected timeline entry and no reason when none is provided", async () => {
    db = await openDatabase();
    const service = new ApplicationService(new ApplicationRepository(db));
    const created = await service.create({ company: "Pied Piper" });
    const today = todayIsoDate();

    const updated = await service.reject(created.id);

    expect(updated.status).toBe("Rejected");
    expect(updated.lastUpdated).toBe(today);
    expect(updated.timeline.filter((entry) => entry.kind === "status_change").at(-1)).toEqual(
      expect.objectContaining({
        kind: "status_change",
        text: "Rejected",
        at: today,
      }),
    );
    expect(
      updated.timeline.some((entry) => entry.kind === "rejection_reason"),
    ).toBe(false);
  });

  it("rejects with a rejection_reason timeline entry when a reason is provided", async () => {
    db = await openDatabase();
    const service = new ApplicationService(new ApplicationRepository(db));
    const created = await service.create();
    const today = todayIsoDate();

    const updated = await service.reject(created.id, "  Headcount freeze  ");

    expect(updated.status).toBe("Rejected");
    expect(updated.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "status_change", text: "Rejected" }),
        expect.objectContaining({
          kind: "rejection_reason",
          text: "Headcount freeze",
          at: today,
        }),
      ]),
    );
  });

  it("appends a note timeline entry", async () => {
    db = await openDatabase();
    const service = new ApplicationService(new ApplicationRepository(db));
    const created = await service.create();
    const today = todayIsoDate();

    const updated = await service.addNote(created.id, "Recruiter asked for availability");

    expect(updated.lastUpdated).toBe(today);
    expect(updated.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "note",
          text: "Recruiter asked for availability",
          at: today,
        }),
      ]),
    );
  });
});
