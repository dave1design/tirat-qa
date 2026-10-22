/** One knowledge-check question. `a` is the index of the correct option (kept on the server until the quiz is submitted). */
export interface Question {
  q: string;
  o: [string, string, string, string];
  a: 0 | 1 | 2 | 3;
  e: string;
}

export interface Diagram {
  title: string;
  caption: string;
  alt: string;
  boxes: { t: string; d: string }[];
}

/** A small rules-based lab: sort scenarios into categories. `c` (the answer) stays on the server. */
export interface Lab {
  title: string;
  task: string;
  categories: string[];
  items: { t: string; c: number }[];
  takeaway: string;
  reflection: string;
}

export interface Video {
  id: string;
  title: string;
  summary: string;
}

export interface Lesson {
  slug: string;
  n: string; // "1.1"
  title: string;
  minutes: number;
  objectives: string[];
  notes: string;
  example: string;
  diagram: Diagram;
  lab: Lab;
  video: Video;
  quiz: Question[];
}

export interface Level {
  n: number;
  slug: string;
  title: string;
  track: "Foundations" | "Manual QA" | "Professional QA" | "Automation QA";
  goal: string;
  prerequisites: string;
  outcome: string;
  deliverable: string;
  interview: string[];
  milestone: string;
  lessons: Lesson[];
}

export const q = (question: string, o: [string, string, string, string], a: 0 | 1 | 2 | 3, e: string): Question => ({ q: question, o, a, e });
