import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { getT } from "@/lib/i18n/server";

/** Slim dark bar at the top of the course player: logo, which level you are in, overall progress and language. */
export async function PlayerTopBar({ levelN, levelTitle, passed, total }: { levelN: number; levelTitle: string; passed: number; total: number }) {
  const t = await getT();
  const pct = total ? Math.round((passed / total) * 100) : 0;
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-ink px-4 text-white sm:gap-4 sm:px-5">
      <Logo light className="[&>span:last-child]:text-[17px] [&>span:first-child]:!size-8 [&>span:first-child>svg]:!size-4 [&>span:last-child]:hidden sm:[&>span:last-child]:inline" />
      <span aria-hidden className="hidden h-6 w-px bg-white/25 sm:block" />
      <Link href={`/learn/levels/${levelN}`} className="flex min-w-0 items-center gap-1 text-[14.5px] font-medium hover:text-white/80">
        <ChevronLeft className="size-4 shrink-0" aria-hidden />
        <span className="truncate">
          {t("Level")} {levelN}: {levelTitle}
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2.5" title={t("Your progress")}>
          <svg viewBox="0 0 36 36" className="size-8 -rotate-90" role="img" aria-label={`${pct}%`}>
            <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="3.5" />
            <circle cx="18" cy="18" r={r} fill="none" stroke="#ccff00" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
          </svg>
          <span className="hidden text-[13.5px] leading-tight sm:block">
            <span className="block font-semibold">{t("Your progress")}</span>
            <span className="block text-white/65">
              {passed} / {total}
            </span>
          </span>
        </div>
        <Link href="/learn" className="rounded-full border border-white/35 px-4 py-1.5 text-[13.5px] font-medium hover:bg-white/10">
          {t("Exit")}
        </Link>
      </div>
    </header>
  );
}
