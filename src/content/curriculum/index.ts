import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import { level4 } from "./level4";
import { level5 } from "./level5";
import { level6 } from "./level6";
import { level7 } from "./level7";
import { level8 } from "./level8";
import type { Lesson, Level } from "./types";
import type { Locale } from "@/lib/i18n";
import { localizeLevel } from "./localize";

export type { Diagram, Lab, Lesson, Level, Question, Video } from "./types";

export const LEVELS: Level[] = [level1, level2, level3, level4, level5, level6, level7, level8];

/** All levels in the given language (English when no translation exists). */
export const levelsFor = (locale: Locale = "en") => (locale === "en" ? LEVELS : LEVELS.map((l) => localizeLevel(l, locale)));

export const getLevel = (n: number, locale: Locale = "en") => {
  const level = LEVELS.find((l) => l.n === n);
  return level ? localizeLevel(level, locale) : undefined;
};

export function findLesson(levelN: number, slug: string, locale: Locale = "en"): { level: Level; lesson: Lesson; index: number } | null {
  const level = getLevel(levelN, locale);
  const index = level ? level.lessons.findIndex((l) => l.slug === slug) : -1;
  return level && index >= 0 ? { level, lesson: level.lessons[index], index } : null;
}

/** The lesson before/after this one across the whole roadmap, for the previous/next links. */
export function neighbours(levelN: number, slug: string, locale: Locale = "en") {
  const flat = levelsFor(locale).flatMap((l) => l.lessons.map((lesson) => ({ levelN: l.n, lesson })));
  const i = flat.findIndex((f) => f.levelN === levelN && f.lesson.slug === slug);
  return { prev: flat[i - 1] ?? null, next: flat[i + 1] ?? null };
}

export const TOTAL_LESSONS = LEVELS.reduce((n, l) => n + l.lessons.length, 0);
