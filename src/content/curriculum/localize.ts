import type { Locale } from "@/lib/i18n";
import type { Lesson, Level } from "./types";
import type { AmLevel } from "./am/types";
import { AM_LEVELS } from "./am";

function mergeLesson(en: Lesson, am: AmLevel["lessons"][number] | undefined): Lesson {
  if (!am) return en;
  return {
    ...en,
    title: am.title,
    objectives: am.objectives,
    notes: am.notes,
    example: am.example,
    diagram: { ...en.diagram, ...am.diagram },
    lab: {
      ...en.lab,
      title: am.lab.title,
      task: am.lab.task,
      categories: am.lab.categories,
      items: en.lab.items.map((it, i) => ({ ...it, t: am.lab.items[i] ?? it.t })),
      takeaway: am.lab.takeaway,
      reflection: am.lab.reflection,
    },
    video: { ...en.video, title: am.video.title ?? en.video.title, summary: am.video.summary },
    quiz: en.quiz.map((qu, i) => (am.quiz[i] ? { ...qu, q: am.quiz[i].q, o: am.quiz[i].o, e: am.quiz[i].e } : qu)),
  };
}

/**
 * Lessons, quizzes and labs stay in English: the language switch changes the system (menus, buttons, pages) only.
 * The Amharic lesson text is kept in ./am; set this to true to show it again.
 */
export const TRANSLATE_LESSON_CONTENT = false;

/** The English level, with Amharic text laid over it when lesson translation is switched on. */
export function localizeLevel(level: Level, locale: Locale): Level {
  const am = TRANSLATE_LESSON_CONTENT && locale === "am" ? AM_LEVELS[level.n] : undefined;
  if (!am) return level;
  return {
    ...level,
    title: am.title,
    goal: am.goal,
    prerequisites: am.prerequisites,
    outcome: am.outcome,
    deliverable: am.deliverable,
    milestone: am.milestone,
    interview: am.interview,
    lessons: level.lessons.map((l, i) => mergeLesson(l, am.lessons[i])),
  };
}
