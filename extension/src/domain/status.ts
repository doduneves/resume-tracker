export const APPLICATION_STATUSES = [
  "Applied",
  "Screening",
  "HR Interview",
  "Technical Interview",
  "Offer",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
