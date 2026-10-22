/**
 * Level exam question. Part A: single best answer (4 options). Part B: interview-style multi-select (5 options, at
 * least two correct). `l` is the lesson (1 to 3) the question draws on, used for the topic-gap report.
 */
export interface ExamQuestion {
  part: "A" | "B";
  l: 1 | 2 | 3;
  q: string;
  o: string[];
  a: number[];
  e: string;
}

export interface LevelExam {
  partA: ExamQuestion[];
  partB: ExamQuestion[];
}

type L = 1 | 2 | 3;

export const A = (l: L, q: string, o: [string, string, string, string], a: 0 | 1 | 2 | 3, e: string): ExamQuestion => ({ part: "A", l, q, o, a: [a], e });
export const B = (l: L, q: string, o: [string, string, string, string, string], a: number[], e: string): ExamQuestion => ({ part: "B", l, q, o, a, e });
