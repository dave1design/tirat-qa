import "server-only";
import { db } from "./db";
import { ANSWER_FIRST } from "./test-mode";
import { EXAM_BLUEPRINT_VERSION, EXAM_MINUTES, EXAM_PASS_POINTS, POINTS_PER_QUESTION, examQuestions } from "@/content/exam";

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

/** A fresh attempt: the 25 + 25 questions in a random order inside each part, options shuffled per question. */
export function buildOrder(levelN: number): ExamOrder {
  const qs = examQuestions(levelN)!;
  const ids = [...shuffled(qs.filter((q) => q.part === "A")), ...shuffled(qs.filter((q) => q.part === "B"))].map((q) => q.id);
  const opts: Record<string, number[]> = {};
  for (const q of qs) opts[q.id] = ANSWER_FIRST ? q.o.map((_, i) => i) : shuffled(q.o.map((_, i) => i));
  return { qs: ids, opts };
}

export const newExpiry = () => new Date(Date.now() + EXAM_MINUTES * 60_000);

/** Multi-select is all-or-nothing: 2 points only when the chosen set exactly matches the key. */
export function scoreResponses(levelN: number, responses: Record<string, number[]>) {
  const qs = examQuestions(levelN)!;
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
      if (q.part === "A") partA += POINTS_PER_QUESTION;
      else partB += POINTS_PER_QUESTION;
    } else missed.push(q.id);
  }
  return { score: partA + partB, partA, partB, lessons, missed, passed: partA + partB >= EXAM_PASS_POINTS };
}

/** Locks the attempt and stores its score. Safe to call twice. */
export async function finalizeAttempt(attemptId: string, timedOut = false) {
  const attempt = await db.examAttempt.findUnique({ where: { id: attemptId } });
  if (!attempt) return null;
  if (attempt.status === "SUBMITTED") return attempt;
  const result = scoreResponses(attempt.levelN, JSON.parse(attempt.responses) as Record<string, number[]>);
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
