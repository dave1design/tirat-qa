"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Bot, Briefcase, ChevronLeft, ChevronRight, ClipboardCheck, Clock, LayoutGrid, List, Lock, Search, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

export interface CatalogLesson {
  key: string;
  href: string;
  n: string;
  title: string;
  minutes: number;
  track: "Foundations" | "Manual QA" | "Professional QA" | "Automation QA";
  level: number;
  levelTitle: string;
  pct: number; // best quiz score as a percentage
  state: "new" | "going" | "passed";
  locked: boolean; // the lesson before it has not been passed yet
  paid: boolean; // needs the one-time payment
}

const TRACK: Record<CatalogLesson["track"], { icon: LucideIcon; tile: string; bg: string }> = {
  Foundations: { icon: BookOpen, tile: "from-[#b6ec00] to-[#7fd200]", bg: "bg-[#f1f6dc]" },
  "Manual QA": { icon: ClipboardCheck, tile: "from-[#b9a4ff] to-[#8a6cff]", bg: "bg-[#ece8fb]" },
  "Professional QA": { icon: Briefcase, tile: "from-[#ffd36a] to-[#f5a524]", bg: "bg-[#f7f0dc]" },
  "Automation QA": { icon: Bot, tile: "from-[#7be0b8] to-[#2fbf8f]", bg: "bg-[#e1f2ea]" },
};

/** A small circular progress mark: the arc is the best quiz score. */
function Ring({ pct, done }: { pct: number; done: boolean }) {
  const r = 7;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 20 20" className="size-5 -rotate-90" aria-hidden>
      <circle cx="10" cy="10" r={r} fill="none" stroke="#e5e5e5" strokeWidth="3" />
      <circle cx="10" cy="10" r={r} fill="none" stroke={done ? "#16a34a" : "#0066ff"} strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
    </svg>
  );
}

function Card({ l, list }: { l: CatalogLesson; list: boolean }) {
  const t = useT();
  const tr = TRACK[l.track];
  const blocked = l.locked && !l.paid;
  const status =
    l.paid ? (
      <span className="inline-flex items-center gap-1 font-medium text-brand">
        <Lock className="size-3.5" aria-hidden /> {t("Paid")}
      </span>
    ) : blocked ? (
      <span className="inline-flex items-center gap-1 text-muted">
        <Lock className="size-3.5" aria-hidden /> {t("Locked")}
      </span>
    ) : l.state === "new" ? (
      <span className="text-muted">{t("Not started")}</span>
    ) : (
      <span className={cn("inline-flex items-center gap-1.5 font-medium", l.state === "passed" ? "text-ok" : "text-ink-2")}>
        <Ring pct={l.pct} done={l.state === "passed"} /> {l.pct}%
      </span>
    );

  const body = (
    <>
      <div className={cn("relative flex items-center justify-center rounded-xl", tr.bg, list ? "h-24 w-36 shrink-0" : "aspect-[16/10]")}>
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/80 px-1.5 py-0.5 text-[11px] font-medium text-ink-2">
          <Clock className="size-3" aria-hidden /> {t("{n} min", { n: l.minutes })}
        </span>
        <span className={cn("flex size-[68px] items-center justify-center rounded-[22px] bg-gradient-to-br text-white shadow-[0_8px_18px_-6px_rgba(0,0,0,0.35)]", tr.tile, list && "size-14 rounded-2xl")}>
          <tr.icon className="size-7" aria-hidden />
        </span>
      </div>
      <div className={cn("min-w-0", list ? "flex flex-1 flex-wrap items-center justify-between gap-x-6 gap-y-1" : "mt-3")}>
        <div className="min-w-0">
          <p className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-chip px-1.5 py-0.5 text-[11px] text-ink-2">{t(l.track)}</span>
            <span className="rounded-md bg-chip px-1.5 py-0.5 text-[11px] text-ink-2">
              {t("Level")} {l.level}
            </span>
          </p>
          <p className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.015em]">
            {l.n} {l.title}
          </p>
        </div>
        <p className={cn("flex items-center justify-between gap-2 text-[12.5px]", list ? "w-44 shrink-0" : "mt-3 border-t border-line pt-3")}>
          <span className="text-muted">
            {t("Quiz")}: {t("{n} questions", { n: 5 })}
          </span>
          {status}
        </p>
      </div>
    </>
  );
  const cls = cn("flex rounded-2xl border border-line bg-white p-2.5", list ? "items-center gap-4" : "h-full flex-col", blocked ? "opacity-60" : "transition-shadow hover:shadow-soft");
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

const select = "max-w-[210px] truncate rounded-xl border border-line bg-white px-3 py-2 text-[13.5px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand";

/** Every lesson as a card: search, filter by level or status, sort, grid or list view and paging. */
export function LessonCatalog({ lessons }: { lessons: CatalogLesson[] }) {
  const t = useT();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("roadmap");
  const [list, setList] = useState(false);
  const [size, setSize] = useState(12);
  const [page, setPage] = useState(1);

  const levels = useMemo(() => [...new Map(lessons.map((l) => [l.level, l.levelTitle])).entries()], [lessons]);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = lessons.filter(
      (l) =>
        (level === "all" || l.level === Number(level)) &&
        (status === "all" || (status === "locked" ? l.locked || l.paid : status === l.state && !l.locked && !l.paid)) &&
        (!needle || `${l.n} ${l.title} ${l.track}`.toLowerCase().includes(needle)),
    );
    if (sort === "title") out.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "progress") out.sort((a, b) => b.pct - a.pct);
    else if (sort === "short") out.sort((a, b) => a.minutes - b.minutes);
    return out;
  }, [lessons, q, level, status, sort]);

  const pages = Math.max(1, Math.ceil(shown.length / size));
  const cur = Math.min(page, pages);
  const slice = shown.slice((cur - 1) * size, cur * size);
  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  return (
    <section aria-labelledby="catalog-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="catalog-title" className="flex items-center gap-2.5 text-[1.5rem] font-semibold tracking-[-0.03em]">
          {t("All lessons")} <span className="rounded-md bg-chip px-2 py-0.5 text-sm font-medium text-ink-2">{lessons.length}</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">{t("Search lessons")}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
            <input value={q} onChange={(e) => reset(setQ)(e.target.value)} placeholder={t("Search lessons")} className={cn(select, "w-44 pl-9 font-normal")} />
          </label>
          <select aria-label={t("Level")} value={level} onChange={(e) => reset(setLevel)(e.target.value)} className={select}>
            <option value="all">{t("All levels")}</option>
            {levels.map(([n, title]) => (
              <option key={n} value={n}>
                {t("Level")} {n}: {title}
              </option>
            ))}
          </select>
          <select aria-label={t("Status")} value={status} onChange={(e) => reset(setStatus)(e.target.value)} className={select}>
            <option value="all">{t("All statuses")}</option>
            <option value="new">{t("Not started")}</option>
            <option value="going">{t("In progress")}</option>
            <option value="passed">{t("Passed")}</option>
            <option value="locked">{t("Locked")}</option>
          </select>
          <select aria-label={t("Sort by")} value={sort} onChange={(e) => reset(setSort)(e.target.value)} className={select}>
            <option value="roadmap">{t("Roadmap order")}</option>
            <option value="title">{t("Title A to Z")}</option>
            <option value="progress">{t("Highest score")}</option>
            <option value="short">{t("Shortest first")}</option>
          </select>
          <div className="flex rounded-xl border border-line bg-white p-0.5" role="group" aria-label={t("View")}>
            {([false, true] as const).map((isList) => (
              <button
                key={String(isList)}
                type="button"
                aria-pressed={list === isList}
                aria-label={isList ? t("List view") : t("Grid view")}
                onClick={() => setList(isList)}
                className={cn("rounded-lg p-2", list === isList ? "bg-ink text-white" : "text-muted hover:text-ink")}
              >
                {isList ? <List className="size-4" aria-hidden /> : <LayoutGrid className="size-4" aria-hidden />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {slice.length === 0 ? (
        <p className="mt-6 rounded-3xl bg-card p-8 text-center text-muted">{t("No lessons match your filters.")}</p>
      ) : (
        <ul className={cn("mt-5 grid gap-3", list ? "grid-cols-1" : "grid-cols-[repeat(auto-fill,minmax(210px,1fr))]")}>
          {slice.map((l) => (
            <li key={l.key}>
              <Card l={l} list={list} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3">
          <select aria-label={t("Per page")} value={size} onChange={(e) => reset(setSize)(Number(e.target.value))} className={select}>
            {[8, 12, 24].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-muted">
            {t("Results")}: {shown.length === 0 ? 0 : (cur - 1) * size + 1} - {Math.min(cur * size, shown.length)} {t("of")} {shown.length}
          </span>
        </div>
        <nav aria-label={t("Pages")} className="flex items-center gap-1">
          <button type="button" disabled={cur <= 1} onClick={() => setPage(cur - 1)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted enabled:hover:text-ink disabled:opacity-40">
            <ChevronLeft className="size-4" aria-hidden /> {t("Previous")}
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" aria-current={p === cur ? "page" : undefined} onClick={() => setPage(p)} className={cn("size-8 rounded-lg font-medium", p === cur ? "border border-ink" : "text-muted hover:text-ink")}>
              {p}
            </button>
          ))}
          <button type="button" disabled={cur >= pages} onClick={() => setPage(cur + 1)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted enabled:hover:text-ink disabled:opacity-40">
            {t("Next")} <ChevronRight className="size-4" aria-hidden />
          </button>
        </nav>
      </div>
    </section>
  );
}
