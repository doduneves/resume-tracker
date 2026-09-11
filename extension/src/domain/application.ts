import type { ResumeId } from "./resume";
import type { ApplicationStatus } from "./status";

export interface Application {
  id: string;
  company: string;
  status: ApplicationStatus;
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
