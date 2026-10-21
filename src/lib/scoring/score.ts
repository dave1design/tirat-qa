import { SCORING, SEVERITIES } from "../constants";
import type { ReportText } from "./match";

export interface QualityInput extends ReportText {
  hasEvidence: boolean;
}

export interface QualityResult {
  points: number;
  notes: string[];
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function countSteps(steps: string) {
  return steps
    .split(/\r?\n|(?:^|\s)\d+[.)]\s/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2).length;
}

/** Report-quality rubric, max {@link SCORING.qualityMax}: title 1, steps 2, expected+actual 1, evidence 1. */
export function scoreQuality(r: QualityInput): QualityResult {
  let points = 0;
  const notes: string[] = [];

  if (words(r.title) >= 4) points += 1;
  else notes.push("Make the title a specific sentence (at least four words) that names the problem.");

  const steps = countSteps(r.steps);
  if (steps >= 3) points += 2;
  else if (steps === 2) {
    points += 1;
    notes.push("Add more detail to your steps — put each action on its own line so anyone can reproduce the issue.");
  } else notes.push("List the steps to reproduce as separate, numbered actions.");

  if (words(r.expected) >= 5 && words(r.actual) >= 5) points += 1;
  else notes.push("Describe the expected and actual results in full sentences.");

  if (r.hasEvidence) points += 1;
  else notes.push("Attach a screenshot when it helps show the problem.");

  return { points: Math.min(points, SCORING.qualityMax), notes };
}

/** Severity accuracy, max {@link SCORING.severityMax}: exact 2, one level away 1. */
export function scoreSeverity(chosen: string | null | undefined, actual: string): { points: number; note: string } {
  if (!chosen) return { points: 0, note: "No severity was selected." };
  const a = SEVERITIES.indexOf(chosen as (typeof SEVERITIES)[number]);
  const b = SEVERITIES.indexOf(actual as (typeof SEVERITIES)[number]);
  if (a < 0 || b < 0) return { points: 0, note: "" };
  const d = Math.abs(a - b);
  if (d === 0) return { points: SCORING.severityMax, note: "Your severity matches our assessment." };
  if (d === 1) return { points: 1, note: `Close — we rated this ${actual.toLowerCase()}.` };
  return { points: 0, note: `We rated this ${actual.toLowerCase()}; review the severity definitions in Learn.` };
}

export interface ScorableReport {
  status: string;
  matchedBugId: string | null;
  bugPoints: number;
  qualityPoints: number;
  severityPoints: number;
  pointsOverride: number | null;
}

export function reportPoints(r: ScorableReport) {
  if (r.pointsOverride !== null && r.pointsOverride !== undefined) return Math.max(0, r.pointsOverride);
  if (r.status !== "MATCHED") return 0;
  return r.bugPoints + r.qualityPoints + r.severityPoints;
}

export interface AttemptScore {
  score: number;
  maxScore: number;
  percent: number;
  passed: boolean;
  penalty: number;
  pendingReview: boolean;
}

/** Max available = every registry bug at full bug points + quality + (severity when required). */
export function maxScoreFor(bugs: { points: number }[], requireSeverity: boolean) {
  return bugs.reduce((sum, b) => sum + b.points + SCORING.qualityMax + (requireSeverity ? SCORING.severityMax : 0), 0);
}

export function scoreAttempt(reports: ScorableReport[], maxScore: number): AttemptScore {
  const earned = reports.reduce((sum, r) => sum + reportPoints(r), 0);
  const unsupported = reports.filter((r) => r.status === "UNSUPPORTED" && r.pointsOverride == null).length;
  const penalty = unsupported * SCORING.falsePositivePenalty;
  const score = Math.max(0, earned - penalty);
  const percent = maxScore > 0 ? Math.min(1, score / maxScore) : 0;
  return {
    score,
    maxScore,
    percent,
    passed: percent >= SCORING.passThreshold,
    penalty,
    pendingReview: reports.some((r) => r.status === "NEEDS_REVIEW" || r.status === "SUBMITTED"),
  };
}
