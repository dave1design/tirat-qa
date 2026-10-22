/** Amharic exam text by level; position matches the English bank. A level without an entry is shown in English. */
import { am1 } from "./level1";

export interface AmExamQ {
  q: string;
  o: string[];
  e: string;
}
export interface AmExam {
  partA: AmExamQ[];
  partB: AmExamQ[];
}

export const AM_EXAMS: Record<number, AmExam> = { 1: am1 };
