import { isLessonPassed, type LessonStatus } from "./learn-progress";
import { isPaidLevel } from "./learn-access";
import type { Level } from "@/content/curriculum";
import type { CatalogLesson } from "@/components/learn/LessonCard";

/** Every lesson as a catalogue card: progress, whether the one before it is still unpassed, and whether it is paid. */
export function buildCatalogLessons(levels: Level[], progress: Map<string, LessonStatus>, advanced: boolean): CatalogLesson[] {
  const flat = levels.flatMap((lv) => lv.lessons.map((l) => ({ lv, l })));
  return flat.map(({ lv, l }, i) => {
    const s = progress.get(`${lv.n}/${l.slug}`);
    const before = i > 0 ? flat[i - 1] : null;
    const paid = isPaidLevel(lv.n) && !advanced;
    return {
      key: `${lv.n}/${l.slug}`,
      href: paid ? `/learn/levels/${lv.n}` : `/learn/levels/${lv.n}/${l.slug}`,
      n: l.n,
      title: l.title,
      minutes: l.minutes,
      track: lv.track,
      level: lv.n,
      levelTitle: lv.title,
      pct: (s?.bestScore ?? 0) * 20,
      state: isLessonPassed(s) ? "passed" : s && s.attempts > 0 ? "going" : "new",
      locked: !!before && !isLessonPassed(progress.get(`${before.lv.n}/${before.l.slug}`)),
      paid,
    };
  });
}
