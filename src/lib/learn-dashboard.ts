import "server-only";
import { db } from "./db";
import { EXAM_PASS_POINTS } from "@/content/exam";
import type { LessonStatus } from "./learn-progress";

const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const shift = (d: Date, days: number) => new Date(d.getTime() + days * 86_400_000);

export interface LearningStats {
  points: number;
  labsDone: number;
  examsPassed: number;
  examBest: Map<number, number>;
  streak: number;
  /** Monday to Sunday of the current week: whether the learner did something that day. */
  week: boolean[];
  /** Day of the month for each day of that week, and how many lessons or exams were practised that day. */
  weekDates: number[];
  weekCounts: number[];
  /** Index of today in the Monday-first week arrays. */
  today: number;
  /** Lesson keys ("<level>/<slug>") from the most recently practised to the oldest. */
  recent: string[];
}

/**
 * Points are earned, not bought: 10 per correct quiz answer (best attempt), 20 for each finished lab and the best
 * score of every level exam. The streak counts consecutive days with a quiz, a lab or an exam (UTC days).
 */
export async function loadLearningStats(userId: string, progress: Map<string, LessonStatus>): Promise<LearningStats> {
  const [lessonRows, exams] = await Promise.all([
    db.lessonProgress.findMany({ where: { userId }, select: { lessonKey: true, updatedAt: true }, orderBy: { updatedAt: "desc" } }),
    db.examAttempt.findMany({ where: { userId }, select: { levelN: true, score: true, status: true, startedAt: true } }),
  ]);

  const examBest = new Map<number, number>();
  for (const e of exams) if (e.status === "SUBMITTED" && e.score != null) examBest.set(e.levelN, Math.max(examBest.get(e.levelN) ?? 0, e.score));

  let points = 0;
  let labsDone = 0;
  for (const s of progress.values()) {
    points += (s.bestScore ?? 0) * 10;
    if (s.labDone) {
      labsDone++;
      points += 20;
    }
  }
  for (const best of examBest.values()) points += best;

  const days = new Set([...lessonRows.map((r) => dayKey(r.updatedAt)), ...exams.map((e) => dayKey(e.startedAt))]);
  const now = new Date();
  let cursor = days.has(dayKey(now)) ? now : shift(now, -1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor = shift(cursor, -1);
  }
  const today = (now.getUTCDay() + 6) % 7; // Monday = 0
  const dayAt = (i: number) => shift(now, i - today);
  const week = Array.from({ length: 7 }, (_, i) => days.has(dayKey(dayAt(i))));
  const weekDates = Array.from({ length: 7 }, (_, i) => dayAt(i).getUTCDate());
  const perDay = new Map<string, number>();
  for (const k of [...lessonRows.map((r) => dayKey(r.updatedAt)), ...exams.map((e) => dayKey(e.startedAt))]) perDay.set(k, (perDay.get(k) ?? 0) + 1);
  const weekCounts = Array.from({ length: 7 }, (_, i) => perDay.get(dayKey(dayAt(i))) ?? 0);

  return { points, labsDone, examsPassed: [...examBest.values()].filter((v) => v >= EXAM_PASS_POINTS).length, examBest, streak, week, weekDates, weekCounts, today, recent: lessonRows.map((r) => r.lessonKey) };
}
