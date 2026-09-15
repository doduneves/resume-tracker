import type { Application } from "../../domain/application";
import { DEFAULT_STAGES } from "../../domain/status";
import {
  createTimelineEntry,
  type TimelineEntry,
} from "../../domain/timeline";
import type { ResumeId } from "../../domain/resume";

export interface ApplicationV1 {
  id: string;
  company: string;
  status: string;
  jobTitle: string;
  nextStep: string;
  lastUpdated: string;
  salary: string;
  rating: number | null;
  matchLevel: string;
  stack: string;
  jobUrl: string;
  resumeId: ResumeId | null;
  stages: string;
  contact: string;
  notes: string;
  appliedAt: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  return ISO_DATE.test(value);
}

export function migrateV1RecordToV2(
  record: ApplicationV1,
  createId: () => string = () => crypto.randomUUID(),
): Application {
  const stages = parseStages(record.stages);
  const stack = parseList(record.stack);
  const nextStep = isIsoDate(record.nextStep) ? record.nextStep : "";
  const timeline: TimelineEntry[] = [
    createTimelineEntry("status_change", "Applied", record.appliedAt, createId()),
  ];

  const notes = record.notes?.trim() ?? "";
  if (notes) {
    const at = isIsoDate(record.lastUpdated)
      ? record.lastUpdated
      : record.appliedAt;
    timeline.push(createTimelineEntry("note", record.notes, at, createId()));
  }

  return {
    id: record.id,
    company: record.company,
    status: record.status,
    jobTitle: record.jobTitle,
    nextStep,
    lastUpdated: record.lastUpdated,
    salary: record.salary,
    rating: record.rating,
    matchLevel: record.matchLevel,
    stack,
    jobUrl: record.jobUrl,
    resumeId: record.resumeId,
    stages,
    contact: record.contact,
    timeline,
    appliedAt: record.appliedAt,
  };
}

function parseStages(stages: string): string[] {
  const parsed = parseList(stages);
  return parsed.length > 0 ? parsed : [...DEFAULT_STAGES];
}

function parseList(value: string): string[] {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return [];
  }
  if (!trimmed.includes(",")) {
    return [trimmed];
  }
  return trimmed.split(",").map((part) => part.trim()).filter(Boolean);
}
