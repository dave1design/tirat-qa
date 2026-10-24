"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Clock, Lock, Search, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import { LessonCover } from "./LessonCover";

export type Track = "Foundations" | "Manual QA" | "Professional QA" | "Automation QA";

export interface CatalogLevel {
  n: number;
  title: string;
  goal: string;
  track: Track;
  lessons: number;
  minutes: number;
  done: number;
  coverN: string; // lesson number whose cover picture represents the level, e.g. "1.1"
  href: string;
  locked: boolean; // an earlier level is not finished yet
  paid: boolean; // needs the one-time payment
}

const TRACKS: Track[] = ["Foundations", "Manual QA", "Professional QA", "Automation QA"];

function LevelCard({ l }: { l: CatalogLevel }) {
  const t = useT();
  const blocked = l.locked && !l.paid;
  const complete = l.done === l.lessons;
  const status = l.paid ? (
    <span className="inline-flex items-center gap-1 font-medium text-brand">
      <Lock className="size-3.5" aria-hidden /> {t("Paid")}
    </span>
  ) : blocked ? (
    <span className="inline-flex items-center gap-1 text-muted">
      <Lock className="size-3.5" aria-hidden /> {t("Locked")}
    </span>
  ) : complete ? (
    <span className="inline-flex items-center gap-1 font-medium text-ok">
      <Check className="size-3.5" strokeWidth={3} aria-hidden /> {t("Completed")}
    </span>
  ) : l.done > 0 ? (
    <span className="font-medium text-ink-2">{t("In progress")}</span>
  ) : (
    <span className="text-muted">{t("Not started")}</span>
  );

  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
        <LessonCover n={l.coverN} track={l.track} className="absolute inset-0 h-full w-full" />
        <span className="absolute left-2 top-2 rounded-md bg-white/85 px-1.5 py-0.5 text-[11px] font-semibold text-ink-2 shadow-sm">
          {t("Level")} {l.n}
        </span>
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/85 px-1.5 py-0.5 text-[11px] font-medium text-ink-2 shadow-sm">
          <Clock className="size-3" aria-hidden /> {t("{n} min", { n: l.minutes })}
        </span>
      </div>
      <p className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-chip px-1.5 py-0.5 text-[11px] text-ink-2">{t(l.track)}</span>
        <span className="inline-flex items-center gap-1 rounded-md bg-chip px-1.5 py-0.5 text-[11px] text-ink-2">
          <Video className="size-3" aria-hidden /> {t("{n} lessons", { n: l.lessons })}
        </span>
      </p>
      <p className="mt-2 text-[15.5px] font-semibold leading-snug tracking-[-0.015em]">{l.title}</p>
      <p className="mt-1 line-clamp-2 text-[13.5px] leading-snug text-muted">{l.goal}</p>
      <div className="mt-auto pt-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-chip" role="progressbar" aria-valuenow={l.done} aria-valuemin={0} aria-valuemax={l.lessons}>
          <div className="h-full rounded-full bg-brand" style={{ width: `${(l.done / l.lessons) * 100}%` }} />
        </div>
        <p className="mt-2 flex items-center justify-between border-t border-line pt-2.5 text-[12.5px]">
          <span className="text-muted">
            {l.done}/{l.lessons} {t("Lessons")}
          </span>
          {status}
        </p>
      </div>
    </>
  );
  const cls = cn("flex h-full flex-col rounded-2xl border border-line bg-white p-2.5", blocked ? "opacity-60" : "transition-shadow hover:shadow-soft");
  return blocked ? (
    <div aria-disabled="true" className={cls}>
      {body}
    </div>
  ) : (
    <Link href={l.href} className={cls}>
      {body}
    </Link>
  );
}

/** The levels of the roadmap as cards, grouped by track. Each card opens the level's details, which lead to its lessons. */
export function LevelCatalog({ levels }: { levels: CatalogLevel[] }) {
  const t = useT();
  const [q, setQ] = useState("");
  const [track, setTrack] = useState<"all" | Track>("all");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return levels.filter((l) => (track === "all" || l.track === track) && (!needle || `${l.n} ${l.title} ${l.goal} ${l.track}`.toLowerCase().includes(needle)));
  }, [levels, q, track]);

  const groups = TRACKS.map((tr) => ({ track: tr, items: shown.filter((l) => l.track === tr) })).filter((g) => g.items.length);

  return (
    <section aria-labelledby="levels-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="levels-title" className="flex items-center gap-2.5 text-[1.5rem] font-semibold tracking-[-0.03em]">
          {t("All levels")} <span className="rounded-md bg-chip px-2 py-0.5 text-sm font-medium text-ink-2">{levels.length}</span>
        </h2>
        <label className="relative">
          <span className="sr-only">{t("Search lessons")}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search lessons")} className="w-56 rounded-full border border-line bg-white py-2 pl-9 pr-3 text-[13.5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand" />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t("Track")}>
        {(["all", ...TRACKS] as const).map((tr) => (
          <button
            key={tr}
            type="button"
            aria-pressed={track === tr}
            onClick={() => setTrack(tr)}
            className={cn("rounded-full border px-4 py-1.5 text-[13.5px] font-medium transition-colors", track === tr ? "border-brand bg-brand text-white" : "border-line bg-white text-ink-2 hover:bg-card")}
          >
            {tr === "all" ? t("All") : t(tr)}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-card p-8 text-center text-muted">{t("No lessons match your filters.")}</p>
      ) : (
        groups.map((g) => (
          <div key={g.track} className="mt-8">
            <h3 className="flex items-center gap-2 text-[1.15rem] font-semibold tracking-[-0.02em]">
              {t(g.track)} <span className="text-sm font-normal text-muted">· {t(g.items.length === 1 ? "{n} level" : "{n} levels", { n: g.items.length })}</span>
            </h3>
            <ul className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
              {g.items.map((l) => (
                <li key={l.n}>
                  <LevelCard l={l} />
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
