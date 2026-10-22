import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import { level4 } from "./level4";
import { level5 } from "./level5";
import { level6 } from "./level6";
import { level7 } from "./level7";
import { level8 } from "./level8";
import type { Lesson, Level } from "./types";

export type { Diagram, Lab, Lesson, Level, Question, Video } from "./types";

export const LEVELS: Level[] = [level1, level2, level3, level4, level5, level6, level7, level8];

export const getLevel = (n: number) => LEVELS.find((l) => l.n === n);

export function findLesson(levelN: number, slug: string): { level: Level; lesson: Lesson; index: number } | null {
  const level = getLevel(levelN);
  const index = level ? level.lessons.findIndex((l) => l.slug === slug) : -1;
  return level && index >= 0 ? { level, lesson: level.lessons[index], index } : null;
}

/** The lesson before/after this one across the whole roadmap, for the previous/next links. */
export function neighbours(levelN: number, slug: string) {
  const flat = LEVELS.flatMap((l) => l.lessons.map((lesson) => ({ levelN: l.n, lesson })));
  const i = flat.findIndex((f) => f.levelN === levelN && f.lesson.slug === slug);
  return { prev: flat[i - 1] ?? null, next: flat[i + 1] ?? null };
}

export const TOTAL_LESSONS = LEVELS.reduce((n, l) => n + l.lessons.length, 0);
