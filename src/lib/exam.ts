import "server-only";
import { db } from "./db";
import { ANSWER_FIRST } from "./test-mode";
import { EXAM_BLUEPRINT_VERSION, EXAM_MINUTES, EXAM_PART_A, EXAM_PART_B, EXAM_PASS_POINTS, examPoints, examQuestions } from "@/content/exam";

export interface ExamOrder {
  qs: string[];
  opts: Record<string, number[]>;
}

const shuffled = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Picks `n` questions spread evenly over the three lessons (round robin over shuffled groups). */
function pick<T extends { l: number }>(qs: T[], n: number): T[] {
  const groups = [1, 2, 3].map((l) => shuffled(qs.filter((q) => q.l === l)));
  const out: T[] = [];
  for (let i = 0; out.length < n && groups.some((g) => g.length); i++) {
    const g = groups[i % 3];
    if (g.length) out.push(g.shift()!);
  }
  return out;
}

/** A fresh attempt: 17 knowledge + 13 interview questions drawn from the bank, shuffled inside each part, options shuffled per question. */
export function buildOrder(levelN: number): ExamOrder {
  const qs = examQuestions(levelN)!;
  const a = shuffled(pick(qs.filter((q) => q.part === "A"), EXAM_PART_A));
  const b = shuffled(pick(qs.filter((q) => q.part === "B"), EXAM_PART_B));
  const opts: Record<string, number[]> = {};
  for (const q of [...a, ...b]) opts[q.id] = ANSWER_FIRST ? q.o.map((_, i) => i) : shuffled(q.o.map((_, i) => i));
  return { qs: [...a, ...b].map((q) => q.id), opts };
}

export const newExpiry = () => new Date(Date.now() + EXAM_MINUTES * 60_000);

/**
 * Multi-select is all-or-nothing: a question counts only when the chosen set exactly matches the key. Only the questions
 * of this attempt (`ids`) are scored. The result is the share of correct answers out of 100, and partA / partB are the
 * number of correct answers in each part.
 */
export function scoreResponses(levelN: number, responses: Record<string, number[]>, ids: string[]) {
  const inAttempt = new Set(ids);
  const qs = examQuestions(levelN)!.filter((q) => inAttempt.has(q.id));
  let partA = 0;
  let partB = 0;
  const lessons: Record<number, { correct: number; total: number }> = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 } };
  const missed: string[] = [];
  for (const q of qs) {
    const chosen = [...new Set(responses[q.id] ?? [])].sort();
    const key = [...q.a].sort();
    const right = chosen.length === key.length && chosen.every((v, i) => v === key[i]);
    lessons[q.l].total++;
    if (right) {
      lessons[q.l].correct++;
      if (q.part === "A") partA++;
      else partB++;
    } else missed.push(q.id);
  }
  const score = examPoints(partA + partB, qs.length);
  return { score, partA, partB, totalA: qs.filter((q) => q.part === "A").length, totalB: qs.filter((q) => q.part === "B").length, lessons, missed, passed: score >= EXAM_PASS_POINTS };
}

/** Locks the attempt and stores its score. Safe to call twice. */
export async function finalizeAttempt(attemptId: string, timedOut = false) {
  const attempt = await db.examAttempt.findUnique({ where: { id: attemptId } });
  if (!attempt) return null;
  if (attempt.status === "SUBMITTED") return attempt;
  const result = scoreResponses(attempt.levelN, JSON.parse(attempt.responses) as Record<string, number[]>, (JSON.parse(attempt.order) as ExamOrder).qs);
  return db.examAttempt.update({
    where: { id: attemptId },
    data: { status: "SUBMITTED", submittedAt: new Date(), score: result.score, partAScore: result.partA, partBScore: result.partB, timedOut },
  });
}

export async function examSummary(userId: string, levelN: number) {
  const attempts = await db.examAttempt.findMany({ where: { userId, levelN }, orderBy: { startedAt: "desc" } });
  const submitted = attempts.filter((a) => a.status === "SUBMITTED");
  const active = attempts.find((a) => a.status === "IN_PROGRESS" && a.expiresAt.getTime() > Date.now()) ?? null;
  const best = submitted.reduce<number | null>((m, a) => Math.max(m ?? 0, a.score ?? 0), null);
  return { attempts: submitted, active, best, passed: (best ?? 0) >= EXAM_PASS_POINTS };
}

export { EXAM_BLUEPRINT_VERSION };
