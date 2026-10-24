import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getT } from "@/lib/i18n/server";

/** Light bar at the top of the lesson page: back to the level, "Lesson details / title", overall progress and exit. */
export async function PlayerTopBar({ levelN, lessonN, lessonTitle, passed, total }: { levelN: number; lessonN: string; lessonTitle: string; passed: number; total: number }) {
  const t = await getT();
  const pct = total ? Math.round((passed / total) * 100) : 0;
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line bg-white px-4 sm:gap-4 sm:px-6">
      <Link href={`/learn/levels/${levelN}`} aria-label={t("Back to the level")} className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line hover:bg-card">
        <ArrowLeft className="size-[18px]" aria-hidden />
      </Link>
      <p className="min-w-0 truncate text-[1.1rem] font-semibold tracking-[-0.02em] sm:text-[1.3rem]">
        <span className="hidden sm:inline">{t("Lesson details")} / </span>
        {lessonN} {lessonTitle}
      </p>
      <div className="ml-auto flex shrink-0 items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-1.5" title={t("Your progress")}>
          <svg viewBox="0 0 36 36" className="size-7 -rotate-90" role="img" aria-label={`${pct}%`}>
            <circle cx="18" cy="18" r={r} fill="none" stroke="#ececec" strokeWidth="4" />
            <circle cx="18" cy="18" r={r} fill="none" stroke="#0066ff" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
          </svg>
          <span className="text-[13.5px] font-medium">
            {passed}/{total}
          </span>
        </div>
        <Link href="/dashboard" className="rounded-xl bg-brand px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
          {t("Exit")}
        </Link>
      </div>
    </header>
  );
}
