import "server-only";
import { levelsFor } from "@/content/curriculum";
import type { Locale } from "@/lib/i18n";
import type { SidebarLevel } from "@/components/learn/CourseSidebar";
import { isLessonPassed, type LessonStatus } from "./learn-progress";
import { isPaidLevel } from "./learn-access";

/** Every level with a status per lesson (locked = paid and not unlocked, or the lesson before it is not passed yet). */
export function buildSidebarLevels(locale: Locale, progress: Map<string, LessonStatus>, advanced: boolean, examLevels: Set<number>) {
  let before: string | null = null;
  let passedCount = 0;
  const levels: SidebarLevel[] = levelsFor(locale).map((lv) => ({
    n: lv.n,
    title: lv.title,
    examPassed: examLevels.has(lv.n),
    lessons: lv.lessons.map((l) => {
      const key = `${lv.n}/${l.slug}`;
      const passed = isLessonPassed(progress.get(key));
      if (passed) passedCount++;
      const locked = (isPaidLevel(lv.n) && !advanced) || (!!before && !isLessonPassed(progress.get(before)));
      before = key;
      return { slug: l.slug, n: l.n, title: l.title, minutes: l.minutes, passed, locked };
    }),
  }));
  return { levels, passedCount };
}
