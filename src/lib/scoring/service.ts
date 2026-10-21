import "server-only";
import { db } from "../db";
import { SCORING } from "../constants";
import { parseJson } from "../utils";
import { matchReport, type KeywordGroups, type RegistryBug } from "./match";
import { maxScoreFor, scoreAttempt, scoreQuality, scoreSeverity } from "./score";

export function toRegistryBug(b: { id: string; code: string; points: number; severity: string; keywordGroups: string }): RegistryBug {
  return { id: b.id, code: b.code, points: b.points, severity: b.severity, keywordGroups: parseJson<KeywordGroups>(b.keywordGroups, []) };
}

/** Auto-scores one freshly submitted report against the private registry for the attempt's website version. */
export async function autoScoreReport(reportId: string) {
  const report = await db.bugReport.findUniqueOrThrow({
    where: { id: reportId },
    include: { attempt: { include: { website: { select: { id: true, requireSeverity: true } } } } },
  });
  const bugs = await db.bugRegistryItem.findMany({
    where: { websiteId: report.attempt.websiteId, version: report.attempt.websiteVersion, active: true },
  });
  const registry = bugs.map(toRegistryBug);
  const result = matchReport(report, registry);
  const quality = scoreQuality({ ...report, hasEvidence: !!report.evidencePath });

  const data: Parameters<typeof db.bugReport.update>[0]["data"] = {
    confidence: result.confidence,
    qualityPoints: 0,
    severityPoints: 0,
    bugPoints: 0,
    matchedBugId: null,
    status: result.verdict,
    feedback: "",
  };

  if (result.bug && result.verdict !== "UNSUPPORTED") {
    const bug = bugs.find((b) => b.id === result.bug!.id)!;
    data.matchedBugId = bug.id;
    if (result.verdict === "MATCHED") {
      const sev = report.attempt.website.requireSeverity ? scoreSeverity(report.severity, bug.severity) : { points: 0, note: "" };
      data.bugPoints = bug.points;
      data.qualityPoints = quality.points;
      data.severityPoints = sev.points;
      data.feedback = ["Valid finding — you found an issue in the area of “" + bug.learningTopic + "”.", sev.note, ...quality.notes].filter(Boolean).join(" ");
    } else {
      data.feedback = "A reviewer is checking whether this report matches a known issue. You'll see the outcome on your results page.";
    }
  } else {
    data.feedback =
      "We couldn't match this to a known issue in this challenge. Check that your steps and expected result are specific. If you're confident it's a real problem, you can ask for a review from your results page.";
  }
  await db.bugReport.update({ where: { id: reportId }, data });
}

/**
 * Recomputes dedup + totals for an attempt. Duplicate reports (same bug matched more than once) earn
 * no discovery points; the earliest valid report keeps the credit.
 */
export async function recomputeAttempt(attemptId: string, opts: { finalize?: boolean } = {}) {
  const attempt = await db.attempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: { website: { select: { id: true, requireSeverity: true } }, reports: { orderBy: { createdAt: "asc" } } },
  });
  const bugs = await db.bugRegistryItem.findMany({
    where: { websiteId: attempt.websiteId, version: attempt.websiteVersion, active: true },
    select: { points: true },
  });

  const seen = new Set<string>();
  for (const r of attempt.reports) {
    if (r.status === "MATCHED" && r.matchedBugId) {
      if (seen.has(r.matchedBugId)) {
        r.status = "DUPLICATE";
        await db.bugReport.update({
          where: { id: r.id },
          data: {
            status: "DUPLICATE",
            bugPoints: 0,
            qualityPoints: 0,
            severityPoints: 0,
            feedback: "Duplicate — this describes an issue you already reported, so it earns no extra discovery points.",
          },
        });
      } else seen.add(r.matchedBugId);
    }
  }

  const total = scoreAttempt(attempt.reports, maxScoreFor(bugs, attempt.website.requireSeverity));
  const wasFinal = attempt.status === "SCORED" || attempt.status === "CORRECTED";
  let status = attempt.status;
  if (opts.finalize || attempt.finishedAt) {
    status = total.pendingReview ? "UNDER_REVIEW" : wasFinal ? "CORRECTED" : "SCORED";
    // A first scoring after review is "SCORED"; later edits to a final score are "CORRECTED".
    if (!total.pendingReview && attempt.status === "UNDER_REVIEW") status = "SCORED";
  }
  await db.attempt.update({
    where: { id: attemptId },
    data: { score: total.score, maxScore: total.maxScore, passed: total.passed, status },
  });
  return { ...total, status };
}

export const REPORT_STATUS_LABEL: Record<string, string> = {
  SUBMITTED: "Submitted",
  MATCHED: "Valid finding",
  DUPLICATE: "Duplicate",
  UNSUPPORTED: "Not matched",
  NEEDS_REVIEW: "Under review",
};

export const ATTEMPT_STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: "In progress",
  PROCESSING: "Processing",
  UNDER_REVIEW: "Under review",
  SCORED: "Scored",
  CORRECTED: "Corrected",
};

export const PENALTY_TEXT = `Reports we can't match to a known issue cost ${SCORING.falsePositivePenalty} point each. Duplicates cost nothing but earn no extra credit.`;
