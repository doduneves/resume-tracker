import type { Resume, ResumeId } from "../../domain/resume";
import { RESUMES_STORE } from "../db";

export interface ResumeRecord extends Resume {
  blob: Blob;
}

/**
 * Phase 2 will persist PDF blobs in the `resumes` object store.
 * Schema v1 already creates that store so no IndexedDB version bump is needed later.
 */
export class ResumeRepository {
  constructor(private readonly db: IDBDatabase) {}

  async getById(_id: ResumeId): Promise<ResumeRecord | undefined> {
    void this.db;
    void RESUMES_STORE;
    throw new Error("ResumeRepository is not implemented (Phase 2)");
  }

  async put(_record: ResumeRecord): Promise<ResumeRecord> {
    throw new Error("ResumeRepository is not implemented (Phase 2)");
  }

  async delete(_id: ResumeId): Promise<void> {
    throw new Error("ResumeRepository is not implemented (Phase 2)");
  }
}
