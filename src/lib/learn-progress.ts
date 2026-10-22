import "server-only";
import { db } from "./db";

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
