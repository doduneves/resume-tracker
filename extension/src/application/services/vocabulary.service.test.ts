import { indexedDB } from "fake-indexeddb";
import { afterEach, describe, expect, it } from "vitest";
import { DB_NAME, openDatabase } from "../../storage/db";
import { SettingsRepository } from "../../storage/repositories/settings.repository";
import { VocabularyService } from "./vocabulary.service";

describe("VocabularyService", () => {
  let db: IDBDatabase | undefined;

  afterEach(() => {
    db?.close();
    indexedDB.deleteDatabase(DB_NAME);
  });

  async function createService(): Promise<VocabularyService> {
    db = await openDatabase();
    return new VocabularyService(new SettingsRepository(db));
  }

  it("lists empty job titles and stack tags by default", async () => {
    const service = await createService();

    expect(await service.listJobTitles()).toEqual([]);
    expect(await service.listStackTags()).toEqual([]);
  });

  it("adds a job title and lists it as a suggestion", async () => {
    const service = await createService();

    const listed = await service.addJobTitle("Frontend Engineer");

    expect(listed).toEqual(["Frontend Engineer"]);
    expect(await service.listJobTitles()).toEqual(["Frontend Engineer"]);
  });

  it("adds a stack tag and lists it as a suggestion", async () => {
    const service = await createService();

    const listed = await service.addStackTag("TypeScript");

    expect(listed).toEqual(["TypeScript"]);
    expect(await service.listStackTags()).toEqual(["TypeScript"]);
  });

  it("trims values and ignores blank suggestions", async () => {
    const service = await createService();

    expect(await service.addJobTitle("  Staff Engineer  ")).toEqual([
      "Staff Engineer",
    ]);
    expect(await service.addJobTitle("   ")).toEqual(["Staff Engineer"]);
    expect(await service.addStackTag("  React  ")).toEqual(["React"]);
    expect(await service.addStackTag("")).toEqual(["React"]);
  });

  it("does not add a duplicate suggestion with different casing", async () => {
    const service = await createService();

    await service.addJobTitle("Engineer");
    expect(await service.addJobTitle("engineer")).toEqual(["Engineer"]);
    await service.addStackTag("Node.js");
    expect(await service.addStackTag("node.js")).toEqual(["Node.js"]);
  });

  it("keeps job titles and stack tags independent", async () => {
    const service = await createService();

    await service.addJobTitle("Engineer");
    await service.addStackTag("Go");

    expect(await service.listJobTitles()).toEqual(["Engineer"]);
    expect(await service.listStackTags()).toEqual(["Go"]);
  });

  it("persists suggestions across service instances on the same database", async () => {
    db = await openDatabase();
    const first = new VocabularyService(new SettingsRepository(db));
    await first.addJobTitle("Backend Engineer");
    await first.addStackTag("PostgreSQL");

    const second = new VocabularyService(new SettingsRepository(db));
    expect(await second.listJobTitles()).toEqual(["Backend Engineer"]);
    expect(await second.listStackTags()).toEqual(["PostgreSQL"]);
  });
});
