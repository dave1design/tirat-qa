"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { SiteVisual, type VisualKind } from "./SiteVisual";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export interface LabCard {
  key: string;
  name: string;
  category: string;
  level: string;
  desc: string;
  skills: string[];
  visual: VisualKind;
  look: "black" | "blue" | "lime" | "orange" | "teal" | "violet";
  minutes: number | null;
  access: string; // "Free" | "200 ETB"
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "LOCKED" | "SOON";
  href: string | null;
}

const looks: Record<LabCard["look"], { bg: string; ink: string; fade: string }> = {
  black: { bg: "bg-[#141414]", ink: "text-white", fade: "from-[#141414]" },
  blue: { bg: "bg-gradient-to-br from-[#0a3fe0] to-[#0066ff]", ink: "text-white", fade: "from-[#0052e6]" },
  lime: { bg: "bg-gradient-to-br from-[#d6ff1a] to-[#bff000]", ink: "text-ink", fade: "from-[#c4f400]" },
  orange: { bg: "bg-gradient-to-br from-[#ff7a2a] to-[#ff5a0a]", ink: "text-white", fade: "from-[#ff6a14]" },
  teal: { bg: "bg-gradient-to-br from-[#2ee6c3] to-[#14d3a8]", ink: "text-ink", fade: "from-[#1fdcb6]" },
  violet: { bg: "bg-gradient-to-br from-[#7b6cff] to-[#5a46f0]", ink: "text-white", fade: "from-[#6a58f5]" },
};

const statusText: Record<LabCard["status"], string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  LOCKED: "Locked",
  SOON: "Coming soon",
};

function Card({ c, i }: { c: LabCard; i: number }) {
  const l = looks[c.look];
  const soon = c.status === "SOON";
  const body = (
    <>
      <div className={cn("relative h-[340px] overflow-hidden rounded-[32px]", l.bg, l.ink, soon && "saturate-[.8]")}>
        <span className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_20%_10%,#fff,transparent_45%)]" />
        <SiteVisual kind={c.visual} />
        <span className={cn("absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent", l.fade)} />
        <span className="absolute left-6 top-5 font-mono text-[12px] uppercase tracking-wider opacity-90">
          {c.category} · {c.level}
        </span>
        <span className="absolute right-5 top-4 flex items-center gap-1.5">
          {c.status === "LOCKED" && <Lock className="size-4" aria-label="Locked" />}
          {soon ? (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink">Coming soon</span>
          ) : (
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          )}
        </span>
        <h3 className="absolute bottom-5 left-6 right-6 text-[clamp(1.35rem,2.2vw,1.9rem)] font-semibold leading-[1.02] tracking-[-0.045em]">{c.name}</h3>
      </div>
      <h4 className="mt-5 min-h-[3.4rem] text-[1.15rem] font-medium leading-snug tracking-[-0.02em]">{c.desc}</h4>
      <p className="mt-1.5 text-[15px] leading-snug text-muted">{c.skills.join(" · ")}</p>
      <div className="mt-4 flex items-baseline gap-3 border-t border-line pt-3.5">
        <span className="text-[1.35rem] font-medium tracking-[-0.03em]">{c.minutes ? `${c.minutes} min` : "—"}</span>
        <span className="text-[13px] text-muted">estimated time</span>
        <span className="ml-auto flex gap-1.5">
          <span className="rounded-full bg-chip px-2.5 py-1 text-xs font-medium text-muted">{c.access}</span>
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", c.status === "IN_PROGRESS" ? "bg-[#e6efff] text-brand" : c.status === "COMPLETED" ? "bg-ok-soft text-ok" : "bg-chip text-muted")}>
            {statusText[c.status]}
          </span>
        </span>
      </div>
    </>
  );
  return (
    <Reveal delay={(i % 2) * 90}>
      {c.href ? (
        <Link href={c.href} className="group block outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 rounded-[36px]">
          {body}
        </Link>
      ) : (
        <div className="group block cursor-default">{body}</div>
      )}
    </Reveal>
  );
}

/** Category chips filter a two-column grid of big coloured website cards. */
export function WebsiteGrid({ cards }: { cards: LabCard[] }) {
  const cats = ["All", ...Array.from(new Set(cards.map((c) => c.category)))];
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? cards : cards.filter((c) => c.category === cat);
  return (
    <div>
      <div role="tablist" aria-label="Filter practice websites" className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={cn("rounded-full px-5 py-3 text-[15px] font-medium transition-colors", cat === c ? "bg-ink text-white" : "bg-chip text-ink hover:bg-[#e4e4e4]")}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-x-6 gap-y-14 md:grid-cols-2">
        {shown.map((c, i) => (
          <Card key={c.key} c={c} i={i} />
        ))}
      </div>
    </div>
  );
}
