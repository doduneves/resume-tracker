export const TERMINAL_STATUSES = ["Applied", "Offer", "Rejected"] as const;

export type TerminalStatus = (typeof TERMINAL_STATUSES)[number];

export const DEFAULT_STAGES = [
  "Screening",
  "Code Test",
  "Tech Interview",
  "HR Interview",
] as const;

export function isAllowedStatus(status: string, stages: string[]): boolean {
  return (TERMINAL_STATUSES as readonly string[]).includes(status) ||
    stages.includes(status);
}
