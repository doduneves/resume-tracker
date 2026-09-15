import type { Application } from "../../domain/application";
import type { ResumeId } from "../../domain/resume";
import { DEFAULT_STAGES, isAllowedStatus } from "../../domain/status";
import { createTimelineEntry } from "../../domain/timeline";
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
    const appliedAt = input.appliedAt ?? today;
    const application: Application = {
      id: crypto.randomUUID(),
      company: input.company ?? "",
      status: "Applied",
      jobTitle: input.jobTitle ?? "",
      nextStep: input.nextStep ?? "",
      lastUpdated: input.lastUpdated ?? today,
      salary: input.salary ?? "",
      rating: normalizeRating(input.rating ?? null),
      matchLevel: input.matchLevel ?? "",
      stack: input.stack ?? [],
      jobUrl: input.jobUrl ?? "",
      resumeId: normalizeResumeId(input.resumeId ?? null),
      stages: input.stages ?? [...DEFAULT_STAGES],
      contact: input.contact ?? "",
      timeline: [
        createTimelineEntry("status_change", "Applied", appliedAt),
      ],
      appliedAt,
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

  async updateStatus(id: string, status: string): Promise<Application> {
    const existing = await this.requireById(id);
    if (!isAllowedStatus(status, existing.stages)) {
      throw new Error(
        `Invalid status "${status}" for this application`,
      );
    }
    const today = todayIsoDate();
    return this.applications.update({
      ...existing,
      status,
      lastUpdated: today,
      timeline: [
        ...existing.timeline,
        createTimelineEntry("status_change", status, today),
      ],
    });
  }

  async addNote(id: string, text: string): Promise<Application> {
    const existing = await this.requireById(id);
    const today = todayIsoDate();
    return this.applications.update({
      ...existing,
      lastUpdated: today,
      timeline: [
        ...existing.timeline,
        createTimelineEntry("note", text, today),
      ],
    });
  }

  async reject(id: string, reason?: string): Promise<Application> {
    const existing = await this.requireById(id);
    const today = todayIsoDate();
    const timeline = [
      ...existing.timeline,
      createTimelineEntry("status_change", "Rejected", today),
    ];
    const trimmed = reason?.trim() ?? "";
    if (trimmed) {
      timeline.push(
        createTimelineEntry("rejection_reason", trimmed, today),
      );
    }
    return this.applications.update({
      ...existing,
      status: "Rejected",
      lastUpdated: today,
      timeline,
    });
  }

  async delete(id: string): Promise<void> {
    await this.applications.delete(id);
  }

  private async requireById(id: string): Promise<Application> {
    const existing = await this.applications.getById(id);
    if (!existing) {
      throw new Error(`Application not found: ${id}`);
    }
    return existing;
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
