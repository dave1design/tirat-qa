import "server-only";
import { db } from "./db";
import { EXAM_PASS_POINTS } from "@/content/exam";
import { LEVELS } from "@/content/curriculum";

export interface LessonStatus {
  bestScore: number | null;
  attempts: number;
  labDone: boolean;
  reflection: string;
}

/** Progress for one learner keyed by "<level>/<lesson-slug>". Empty for guests. */
export async function loadProgress(userId: string | null): Promise<Map<string, LessonStatus>> {
  const map = new Map<string, LessonStatus>();
  if (!userId) return map;
  const rows = await db.lessonProgress.findMany({ where: { userId } });
  for (const r of rows) map.set(r.lessonKey, { bestScore: r.bestScore, attempts: r.attempts, labDone: r.labDone, reflection: r.reflection });
  return map;
}

export const isLessonPassed = (s: LessonStatus | undefined) => (s?.bestScore ?? 0) >= 4;

/** Levels whose exam the learner has passed (one query, for the course sidebar). */
export async function passedExamLevels(userId: string | null): Promise<Set<number>> {
  if (!userId) return new Set();
  const rows = await db.examAttempt.findMany({ where: { userId, status: "SUBMITTED", score: { gte: EXAM_PASS_POINTS } }, select: { levelN: true }, distinct: ["levelN"] });
  return new Set(rows.map((r) => r.levelN));
}

/** Level 1 is always open; every later level opens when all lessons of the level before it are passed. */
export function isLevelUnlocked(levelN: number, progress: Map<string, LessonStatus>) {
  if (levelN <= 1) return true;
  const before = LEVELS.find((l) => l.n === levelN - 1);
  return !!before && before.lessons.every((l) => isLessonPassed(progress.get(`${before.n}/${l.slug}`)));
}

/** Where a guest is sent when they try to open learning content: sign in, then land on the dashboard. */
export const LEARN_LOGIN = "/login?next=%2Fdashboard";
