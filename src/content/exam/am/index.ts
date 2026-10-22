/** Amharic exam text by level; position matches the English bank. A level without an entry is shown in English. */
import { am1 } from "./level1";
import { am2 } from "./level2";
import { am3 } from "./level3";
import { am4 } from "./level4";
import { am5 } from "./level5";
import { am6 } from "./level6";
import { am7 } from "./level7";
import { am8 } from "./level8";

export interface AmExamQ {
  q: string;
  o: string[];
  e: string;
}
export interface AmExam {
  partA: AmExamQ[];
  partB: AmExamQ[];
}

export const AM_EXAMS: Record<number, AmExam> = { 1: am1, 2: am2, 3: am3, 4: am4, 5: am5, 6: am6, 7: am7, 8: am8 };
