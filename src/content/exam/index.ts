import type { ExamQuestion, LevelExam } from "./types";
import { exam1 } from "./level1";
import { exam2 } from "./level2";
import { exam3 } from "./level3";
import { exam4 } from "./level4";
import { exam5 } from "./level5";
import { exam6 } from "./level6";
import { exam7 } from "./level7";
import { exam8 } from "./level8";

export type { ExamQuestion, LevelExam } from "./types";

const EXAMS: Record<number, LevelExam> = { 1: exam1, 2: exam2, 3: exam3, 4: exam4, 5: exam5, 6: exam6, 7: exam7, 8: exam8 };

export const EXAM_MINUTES = 60;
export const EXAM_PASS_POINTS = 80;
export const POINTS_PER_QUESTION = 2;
export const EXAM_BLUEPRINT_VERSION = "v1";

/** The 50 questions of a level exam, each with a stable id (`A1`..`A25`, `B1`..`B25`). */
export function examQuestions(levelN: number): (ExamQuestion & { id: string })[] | null {
  const e = EXAMS[levelN];
  if (!e) return null;
  return [...e.partA.map((q, i) => ({ ...q, id: `A${i + 1}` })), ...e.partB.map((q, i) => ({ ...q, id: `B${i + 1}` }))];
}
