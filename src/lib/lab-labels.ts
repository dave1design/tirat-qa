export type SiteStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "LOCKED";

export const SITE_STATUS_LABEL: Record<SiteStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  LOCKED: "Locked",
};
