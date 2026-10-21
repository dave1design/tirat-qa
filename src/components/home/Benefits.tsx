"use client";

import { useState, type ReactNode } from "react";
import { Bug, Layers, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { SplitText } from "@/components/ui/SplitText";

/* ── Card mockups (styled after the reference's "Every Flow" cards) ── */

const findings = [
  { name: "Login form", value: "Critical", tone: "text-bad" },
  { name: "Registration", value: "Medium", tone: "text-muted" },
  { name: "Valid finding", value: "+10 pts", tone: "text-ok" },
  { name: "Search results", value: "Low", tone: "text-muted" },
];

/** Findings list whose rows fade out toward the bottom; rows nudge right on hover. */
function FindingsList() {
  return (
    <ul className="mt-auto mb-12">
      {findings.map((f, i) => (
        <li
          key={f.name}
          className="flex items-center justify-between border-b border-line py-[9px] text-[15px] transition-transform duration-300 last:border-0 group-hover/card:translate-x-1"
          style={{ opacity: Math.max(0.18, 1 - Math.max(0, i - 2) * 0.24), transitionDelay: `${i * 40}ms` }}
        >
          <span className={i < 3 ? "font-medium" : ""}>{f.name}</span>
          <span className={cn("text-[13px]", f.tone)}>{f.value}</span>
        </li>
      ))}
    </ul>
  );
}

/** A single report card with two ghost cards stacked beneath it, like the reference's bank-account card. */
function ReportStack() {
  return (
    <div className="relative mt-auto mb-11">
      <span className="absolute inset-x-6 -bottom-5 h-10 rounded-2xl bg-[#ececec]" />
      <span className="absolute inset-x-3 -bottom-3 h-10 rounded-2xl bg-[#f1f1f1] shadow-soft" />
      <div className="relative rounded-2xl bg-white p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover/card:-translate-y-2">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-ink text-white">
            <Bug className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-[15px] font-medium leading-tight">Bug report</p>
            <p className="font-mono text-[11px] text-faint">•••• TQ-4F21</p>
          </div>
        </div>
        <p className="mt-3 text-[17px] font-medium leading-snug tracking-[-0.02em]">Form accepts an invalid email</p>
        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-muted">
          <span className="size-1.5 rounded-full bg-ok" /> Submitted just now
        </p>
      </div>
    </div>
  );
}

const sheet = [
  { id: "TQ-01", status: "Valid", pts: "16", tone: "bg-ok-soft text-ok" },
  { id: "TQ-02", status: "Duplicate", pts: "0", tone: "bg-[#fff4e5] text-[#b45309]" },
  { id: "TQ-03", status: "Missed", pts: "–", tone: "bg-bad-soft text-bad" },
  { id: "TQ-04", status: "Valid", pts: "14", tone: "bg-ok-soft text-ok" },
];

/** Mini spreadsheet of results: formula bar, column letters, row numbers, status cells; rows highlight on hover. */
function ResultSheet() {
  const cell = "border-b border-r border-[#e6e6e6] px-1.5 py-[3px] leading-[14px]";
  return (
    <div className="mt-auto mb-12 -mx-2 overflow-hidden rounded-xl border border-[#e2e2e2] bg-white text-[11px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-2 border-b border-[#e2e2e2] bg-[#fafafa] px-2 py-1 font-mono text-[10px] text-muted">
        <span className="rounded bg-white px-1.5 py-0.5 text-ink shadow-sm">C6</span>
        <span className="italic text-faint">fx</span>
        <span>=SUM(C2:C5)</span>
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#f3f3f3] text-[10px] text-faint">
            <th className={cn(cell, "w-6 text-center font-normal")} />
            <th className={cn(cell, "text-center font-normal")}>A</th>
            <th className={cn(cell, "text-center font-normal")}>B</th>
            <th className={cn(cell, "text-center font-normal")}>C</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-semibold">
            <td className={cn(cell, "bg-[#f3f3f3] text-center text-[10px] font-normal text-faint")}>1</td>
            <td className={cell}>Report</td>
            <td className={cell}>Result</td>
            <td className={cell}>Points</td>
          </tr>
          {sheet.map((r, i) => (
            <tr key={r.id} className="transition-colors duration-300 hover:bg-[#eef4ff]">
              <td className={cn(cell, "bg-[#f3f3f3] text-center text-[10px] text-faint")}>{i + 2}</td>
              <td className={cn(cell, "font-mono text-[10px]")}>{r.id}</td>
              <td className={cell}>
                <span className={cn("rounded px-1 text-[10px] font-medium", r.tone)}>{r.status}</span>
              </td>
              <td className={cn(cell, "text-right tabular-nums")}>{r.pts}</td>
            </tr>
          ))}
          <tr>
            <td className={cn(cell, "bg-[#f3f3f3] text-center text-[10px] text-faint")}>6</td>
            <td className={cn(cell, "font-semibold")} colSpan={2}>
              Total
            </td>
            <td className={cn(cell, "relative text-right font-semibold tabular-nums outline outline-2 -outline-offset-2 outline-brand")}>
              30
              <span className="absolute -bottom-[3px] -right-[3px] size-[6px] bg-brand" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/** Chart card that bleeds off the right edge, bars growing in turn. */
function ProgressChart() {
  const bars = [32, 40, 36, 52, 46, 62, 70, 78, 92];
  return (
    <div className="mt-auto mb-12 -mr-10 rounded-2xl bg-white p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.18)]">
      <p className="text-[12px] text-muted">
        Practice progress <span aria-hidden>·</span> Level 01
      </p>
      <p className="mt-1 text-[20px] font-medium tracking-[-0.03em]">+3 completed</p>
      <div className="mt-3 flex h-[70px] items-end gap-2">
        {bars.map((h, i) => (
          <span
            key={i}
            className={cn("block w-7 shrink-0 origin-bottom animate-bar rounded-[4px]", i > 5 ? "bg-brand/30" : "bg-brand")}
            style={{ height: `${h}%`, animationDelay: `${i * 0.15}s`, animationDuration: `${2.4 + (i % 3) * 0.4}s` }}
          />
        ))}
      </div>
    </div>
  );
}

const items: { kicker: string; title: string; text: string; art: ReactNode; offset: string }[] = [
  { kicker: "Find bugs with", title: "Confidence", text: "Explore practice websites and learn to recognize unexpected behavior, functional issues, and usability problems.", art: <FindingsList />, offset: "" },
  { kicker: "Write better", title: "Bug Reports", text: "Learn to describe issues clearly with reproduction steps, expected results, actual results, and supporting evidence.", art: <ReportStack />, offset: "lg:mt-1" },
  { kicker: "Learn through", title: "Feedback", text: "Review your submitted reports, understand what you missed, and discover how to improve your testing approach.", art: <ResultSheet />, offset: "lg:mt-2.5" },
  { kicker: "Track your", title: "Progress", text: "Follow your completed challenges, review your results, and see how your practical testing skills develop over time.", art: <ProgressChart />, offset: "lg:mt-5" },
];

function BenefitCard({ kicker, title, text, art }: { kicker: string; title: string; text: string; art: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="group/card relative flex h-[360px] flex-col overflow-hidden rounded-[32px] bg-card px-6 pt-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
      <p className="text-[13px] text-muted">{kicker}</p>
      <h3 className="mt-1 text-[1.9rem] font-medium leading-tight tracking-[-0.035em]">{title}</h3>
      {art}

      {/* description panel, revealed by the + button */}
      <div
        className={cn(
          "absolute inset-x-3 bottom-3 rounded-[24px] bg-white p-5 pr-14 shadow-float transition-[opacity,transform] duration-400",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
        aria-hidden={!open}
      >
        <p className="text-[15px] leading-relaxed text-ink-2">{text}</p>
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? `Hide details about ${kicker} ${title}` : `Show details about ${kicker} ${title}`}
        className="absolute bottom-3.5 right-3.5 flex size-9 items-center justify-center rounded-full bg-white shadow-soft transition-transform duration-300 hover:scale-110"
      >
        <Plus className={cn("size-4 transition-transform duration-300", open && "rotate-45")} aria-hidden />
      </button>
    </article>
  );
}

export function Benefits() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="benefits-title">
      <div className="container-x">
        <Reveal className="flex flex-col items-center text-center">
          <SectionTag index="1" icon={Layers} label="Why Tirat QA" />
        </Reveal>
        <SplitText id="benefits-title" className="h-section mx-auto mt-6 max-w-[760px] text-balance text-center" parts={[{ text: "Build Skills That Go Beyond Theory." }]} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 90} className={it.offset}>
              <BenefitCard kicker={it.kicker} title={it.title} text={it.text} art={it.art} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
