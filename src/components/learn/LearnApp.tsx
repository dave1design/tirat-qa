import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, FileCheck2, FlaskConical, LayoutDashboard, Lock, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getT } from "@/lib/i18n/server";
import { advancedPriceEtb } from "@/lib/learn-access";

export type LearnSection = "dashboard" | "lessons" | "exams" | "practice";

const NAV: { id: LearnSection; href: string; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "lessons", href: "/learn", label: "Lessons", icon: BookOpen },
  { id: "exams", href: "/learn?view=exams", label: "Level exams", icon: FileCheck2 },
  { id: "practice", href: "/practice-lab", label: "Practice Lab", icon: FlaskConical },
];

/**
 * The signed-in learning area: a left sidebar (a row of tabs on small screens) beside the page content, like a course
 * app. Used by the dashboard, the lesson catalogue and the level exams list.
 */
export async function LearnApp({ active, advanced, passed, total, children }: { active: LearnSection; advanced: boolean; passed: number; total: number; children: ReactNode }) {
  const t = await getT();
  const pct = total ? Math.round((passed / total) * 100) : 0;
  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-4 pb-24 pt-28 sm:pt-32 lg:flex-row lg:px-6">
      <aside className="lg:sticky lg:top-28 lg:w-[240px] lg:shrink-0 lg:self-start">
        <nav aria-label={t("Learning")} className="flex gap-1 overflow-x-auto rounded-3xl border border-line bg-white p-2 lg:flex-col lg:overflow-visible lg:p-3">
          <p className="hidden px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-[0.08em] text-faint lg:block">{t("Learning")}</p>
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              aria-current={active === n.id ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[15px] font-medium transition-colors",
                active === n.id ? "bg-chip text-ink" : "text-muted hover:bg-card hover:text-ink",
              )}
            >
              <n.icon className="size-[18px]" aria-hidden /> {t(n.label)}
            </Link>
          ))}
        </nav>

        <div className="mt-4 hidden rounded-3xl border border-line bg-white p-4 lg:block">
          <p className="text-sm font-medium">{t("Your progress")}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-chip" role="progressbar" aria-valuenow={passed} aria-valuemin={0} aria-valuemax={total}>
            <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">{t("{done} of {total} lessons passed", { done: passed, total })}</p>
        </div>

        {!advanced && (
          <Link href="/learn/levels/5" className="mt-4 hidden rounded-3xl border-2 border-ink bg-[#6c5cff] p-4 text-white lg:block">
            <span className="flex items-center gap-2 text-sm text-white/80">
              <Lock className="size-3.5" aria-hidden /> {t("Paid levels")}
            </span>
            <span className="mt-1 block font-semibold leading-snug">{t("Unlock Levels 5 to 8")}</span>
            <span className="mt-1 block text-sm text-white/80">{advancedPriceEtb().toLocaleString("en-US")} ETB · {t("one payment")}</span>
          </Link>
        )}
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
