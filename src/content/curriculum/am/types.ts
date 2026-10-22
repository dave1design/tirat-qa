/** Amharic text for one lesson. It is merged over the English lesson by position; the quiz answer key is not repeated here. */
export interface AmLesson {
  title: string;
  objectives: string[];
  notes: string;
  example: string;
  diagram: { title: string; caption: string; alt: string; boxes: { t: string; d: string }[] };
  lab: { title: string; task: string; categories: string[]; items: string[]; takeaway: string; reflection: string };
  video: { title?: string; summary: string };
  quiz: { q: string; o: [string, string, string, string]; e: string }[];
}

export interface AmLevel {
  title: string;
  goal: string;
  prerequisites: string;
  outcome: string;
  deliverable: string;
  milestone: string;
  interview: string[];
  lessons: AmLesson[];
}
