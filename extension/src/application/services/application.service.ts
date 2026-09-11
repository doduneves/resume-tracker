import type { Application } from "../../domain/application";
import type { ResumeId } from "../../domain/resume";
import type { ApplicationRepository } from "../../storage/repositories/application.repository";
import { todayIsoDate } from "./dates";

export type ApplicationInput = Partial<Omit<Application, "id">>;

export class ApplicationService {
  constructor(private readonly applications: ApplicationRepository) {}

  async list(): Promise<Application[]> {
    const rows = await this.applications.list();
    return rows.sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
  }

  async create(input: ApplicationInput = {}): Promise<Application> {
    const today = todayIsoDate();
    const application: Application = {
      id: crypto.randomUUID(),
      company: input.company ?? "",
      status: input.status ?? "Applied",
      jobTitle: input.jobTitle ?? "",
      nextStep: input.nextStep ?? "",
      lastUpdated: input.lastUpdated ?? today,
      salary: input.salary ?? "",
      rating: normalizeRating(input.rating ?? null),
      matchLevel: input.matchLevel ?? "",
      stack: input.stack ?? "",
      jobUrl: input.jobUrl ?? "",
      resumeId: normalizeResumeId(input.resumeId ?? null),
      stages: input.stages ?? "",
      contact: input.contact ?? "",
      notes: input.notes ?? "",
      appliedAt: input.appliedAt ?? today,
    };
    return this.applications.create(application);
  }

  async update(application: Application): Promise<Application> {
    return this.applications.update({
      ...application,
      rating: normalizeRating(application.rating),
      resumeId: normalizeResumeId(application.resumeId),
    });
  }

  async delete(id: string): Promise<void> {
    await this.applications.delete(id);
  }
}

function normalizeRating(rating: number | null): number | null {
  if (rating === null || Number.isNaN(rating)) {
    return null;
  }
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  return rating;
}

function normalizeResumeId(resumeId: ResumeId | null): ResumeId | null {
  if (resumeId === "en" || resumeId === "pt-br" || resumeId === null) {
    return resumeId;
  }
  return null;
}
