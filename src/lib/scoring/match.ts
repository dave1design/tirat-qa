import { SCORING } from "../constants";

export type KeywordGroups = string[][];

export interface ReportText {
  title: string;
  description?: string;
  steps: string;
  expected: string;
  actual: string;
}

export interface RegistryBug {
  id: string;
  code: string;
  points: number;
  severity: string;
  keywordGroups: KeywordGroups;
}

export type MatchVerdict = "MATCHED" | "NEEDS_REVIEW" | "UNSUPPORTED";

export interface MatchResult {
  bug: RegistryBug | null;
  confidence: number;
  verdict: MatchVerdict;
}

export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9@.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fraction of keyword groups that have at least one term present in the report. */
export function groupCoverage(text: string, groups: KeywordGroups): number {
  if (groups.length === 0) return 0;
  const hay = ` ${normalize(text)} `;
  let hit = 0;
  for (const group of groups) {
    if (group.some((term) => hay.includes(normalize(term)))) hit += 1;
  }
  return hit / groups.length;
}

export function reportToText(r: ReportText) {
  return [r.title, r.description ?? "", r.steps, r.expected, r.actual].join(" \n ");
}

/** Finds the best registry match for one report. Never reads or exposes anything to the learner. */
export function matchReport(report: ReportText, registry: RegistryBug[]): MatchResult {
  const text = reportToText(report);
  let best: RegistryBug | null = null;
  let bestScore = 0;
  for (const bug of registry) {
    const c = groupCoverage(text, bug.keywordGroups);
    if (c > bestScore) {
      best = bug;
      bestScore = c;
    }
  }
  if (best && bestScore >= SCORING.autoMatchConfidence) return { bug: best, confidence: bestScore, verdict: "MATCHED" };
  if (best && bestScore >= SCORING.reviewConfidence) return { bug: best, confidence: bestScore, verdict: "NEEDS_REVIEW" };
  return { bug: null, confidence: bestScore, verdict: "UNSUPPORTED" };
}
