"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, LayoutGrid, List, Search } from "lucide-react";
import { LessonCard, type CatalogLesson } from "./LessonCard";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

const select = "max-w-[210px] appearance-none truncate rounded-xl border border-line bg-white py-2 pl-3 pr-9 text-[13.5px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand";

/** A dropdown with our own chevron, kept inside the box (the native arrow is hidden). */
function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative inline-flex">
      <select {...props} className={select}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </span>
  );
}

/** Every lesson as a card: search, filter by level or status, sort, grid or list view and paging. */
export function LessonCatalog({ lessons, initialQuery = "" }: { lessons: CatalogLesson[]; initialQuery?: string }) {
  const t = useT();
  const [q, setQ] = useState(initialQuery);
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
          <Select aria-label={t("Level")} value={level} onChange={(e) => reset(setLevel)(e.target.value)}>
            <option value="all">{t("All levels")}</option>
            {levels.map(([n, title]) => (
              <option key={n} value={n}>
                {t("Level")} {n}: {title}
              </option>
            ))}
          </Select>
          <Select aria-label={t("Status")} value={status} onChange={(e) => reset(setStatus)(e.target.value)}>
            <option value="all">{t("All statuses")}</option>
            <option value="new">{t("Not started")}</option>
            <option value="going">{t("In progress")}</option>
            <option value="passed">{t("Passed")}</option>
            <option value="locked">{t("Locked")}</option>
          </Select>
          <Select aria-label={t("Sort by")} value={sort} onChange={(e) => reset(setSort)(e.target.value)}>
            <option value="roadmap">{t("Roadmap order")}</option>
            <option value="title">{t("Title A to Z")}</option>
            <option value="progress">{t("Highest score")}</option>
            <option value="short">{t("Shortest first")}</option>
          </Select>
          <div className="flex rounded-full border border-line bg-white p-0.5" role="group" aria-label={t("View")}>
            {([false, true] as const).map((isList) => (
              <button
                key={String(isList)}
                type="button"
                aria-pressed={list === isList}
                aria-label={isList ? t("List view") : t("Grid view")}
                onClick={() => setList(isList)}
                className={cn("rounded-full p-2", list === isList ? "bg-brand text-white" : "text-muted hover:text-ink")}
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
              <LessonCard l={l} list={list} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3">
          <Select aria-label={t("Per page")} value={size} onChange={(e) => reset(setSize)(Number(e.target.value))}>
            {[8, 12, 24].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
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
