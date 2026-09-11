import { indexedDB } from "fake-indexeddb";
import { afterEach, describe, expect, it } from "vitest";
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

  it("creates applications with Applied status and today's dates", async () => {
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
  });

  it("lists, updates, and deletes applications", async () => {
    db = await openDatabase();
    const service = new ApplicationService(new ApplicationRepository(db));

    const created = await service.create({ company: "Initech" });
    const listed = await service.list();
    expect(listed).toHaveLength(1);

    await service.update({
      ...created,
      status: "Technical Interview",
      salary: "CLT",
    });
    const updated = (await service.list())[0];
    expect(updated?.status).toBe("Technical Interview");
    expect(updated?.salary).toBe("CLT");

    await service.delete(created.id);
    expect(await service.list()).toHaveLength(0);
  });
});
