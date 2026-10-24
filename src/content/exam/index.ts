import type { ExamQuestion, LevelExam } from "./types";
import type { Locale } from "@/lib/i18n";
import { AM_EXAMS } from "./am";
import { TRANSLATE_LESSON_CONTENT } from "../curriculum/localize";
import { ANSWER_FIRST, answerFirst } from "@/lib/test-mode";
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
/** Each attempt draws 17 knowledge questions (Part A) and 13 interview questions (Part B) from the level's bank of 25 + 25. */
export const EXAM_PART_A = 17;
export const EXAM_PART_B = 13;
export const EXAM_TOTAL = EXAM_PART_A + EXAM_PART_B;
/** The score is shown out of 100 (share of correct answers); 80 passes, which is 24 of 30. */
export const examPoints = (correct: number, total: number) => (total ? Math.round((correct / total) * 100) : 0);
export const EXAM_BLUEPRINT_VERSION = "v2";

/** The whole question bank of a level (25 + 25), each with a stable id (`A1`..`A25`, `B1`..`B25`). */
export function examQuestions(levelN: number, locale: Locale = "en"): (ExamQuestion & { id: string })[] | null {
  const e = EXAMS[levelN];
  if (!e) return null;
  const am = TRANSLATE_LESSON_CONTENT && locale === "am" ? AM_EXAMS[levelN] : undefined;
  // Amharic text is laid over the English question by position; the answer key always comes from the English entry.
  const merge = (q: ExamQuestion, tr: { q: string; o: string[]; e: string } | undefined, id: string) => ({ ...q, ...(tr ? { q: tr.q, o: tr.o, e: tr.e } : {}), id });
  const all = [...e.partA.map((q, i) => merge(q, am?.partA[i], `A${i + 1}`)), ...e.partB.map((q, i) => merge(q, am?.partB[i], `B${i + 1}`))];
  return ANSWER_FIRST ? all.map((q) => ({ ...q, ...answerFirst(q.o, q.a) })) : all; // test mode: correct options come first
}
