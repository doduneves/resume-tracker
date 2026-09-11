import type { ResumeId } from "./resume";
import type { TimelineEntry } from "./timeline";

export interface Application {
  id: string;
  company: string;
  status: string;
  jobTitle: string;
  nextStep: string;
  lastUpdated: string;
  salary: string;
  rating: number | null;
  matchLevel: string;
  stack: string[];
  jobUrl: string;
  resumeId: ResumeId | null;
  stages: string[];
  contact: string;
  timeline: TimelineEntry[];
  appliedAt: string;
}
