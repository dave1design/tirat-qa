"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Bug, ChartPie, ClipboardCheck, Compass, Layers } from "lucide-react";
import { AppTile } from "@/components/ui/AppTile";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ---- mock UIs shown inside each stacked panel ---- */

function LevelMock() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">Practice Lab</p>
        <span className="rounded-full bg-chip px-2.5 py-1 text-xs font-medium">Beginner</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Level 01 — Beginner</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["Functional testing", "Form validation", "Navigation testing"].map((s) => (
          <span key={s} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">{s}</span>
        ))}
      </div>
      <Link href="/practice-lab" className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">View Level</Link>
    </div>
  );
}

function SiteMock() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      <div className="flex items-center gap-1.5 border-b border-line bg-card px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" /><span className="size-2.5 rounded-full bg-[#febc2e]" /><span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 h-5 flex-1 rounded-full bg-white text-center text-[11px] leading-5 text-faint">practice website</span>
      </div>
      <div className="grid gap-3 p-6">
        <div className="h-3 w-24 rounded-full bg-chip" />
        <div className="h-10 rounded-xl border border-line" />
        <div className="relative h-10 rounded-xl border-2 border-brand">
          <span className="absolute -right-2 -top-3 flex size-7 items-center justify-center rounded-full bg-orange text-white shadow"><Bug className="size-3.5" aria-hidden /></span>
        </div>
        <div className="h-10 w-1/2 rounded-full bg-ink" />
      </div>
    </div>
  );
}

function ReportMock() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <p className="text-sm font-medium text-muted">Report a Bug</p>
      {[["Bug Title", "w-2/3"], ["Steps to Reproduce", "w-full"], ["Expected Result", "w-4/5"], ["Actual Result", "w-3/5"]].map(([l, w]) => (
        <div key={l} className="mt-4">
          <p className="text-xs font-medium">{l}</p>
          <div className="mt-1.5 rounded-xl border border-line p-2.5"><div className={`h-2 rounded-full bg-chip ${w}`} /></div>
        </div>
      ))}
      <span className="mt-5 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-medium text-white">Submit Bug Report</span>
    </div>
  );
}

function ResultMock() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <p className="text-sm font-medium text-muted">Your Testing Results</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[["Valid", "text-ok bg-ok-soft"], ["Duplicate", "text-warn bg-[#fff4e5]"], ["Missed", "text-bad bg-bad-soft"]].map(([l, c]) => (
          <div key={l} className={`rounded-2xl px-2 py-4 text-sm font-medium ${c}`}>{l}</div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-card p-4 text-sm text-muted">Feedback explains what you found, what you missed and how to improve next time.</div>
    </div>
  );
}

const panels: { n: string; title: string; text: string; icon: typeof Layers; tone: "blue" | "violet" | "orange" | "green"; mock: ReactNode }[] = [
  { n: "01", title: "Choose Your Level", text: "Select a practice level that matches your experience and the skills you want to develop.", icon: Layers, tone: "blue", mock: <LevelMock /> },
  { n: "02", title: "Test a Website", text: "Explore the website, interact with its features, and investigate anything that doesn't behave as expected.", icon: Compass, tone: "violet", mock: <SiteMock /> },
  { n: "03", title: "Report the Bugs", text: "Document your findings in clear, structured bug reports that explain the problem and how to reproduce it.", icon: ClipboardCheck, tone: "orange", mock: <ReportMock /> },
  { n: "04", title: "Review and Improve", text: "Receive results and feedback, learn from your mistakes, and continue practicing with greater confidence.", icon: ChartPie, tone: "green", mock: <ResultMock /> },
];

export function StepsTour() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.45;
      let idx = 0;
      refs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) idx = i;
      });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-8">
      <nav aria-label="Practice journey steps" className="hidden lg:block">
        <ol className="sticky top-32 border-l border-line">
          {panels.map((p, i) => (
            <li key={p.n} className="relative">
              {i === active && <span className="absolute -left-px top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-ink" />}
              <a
                href={`#step-${p.n}`}
                aria-current={i === active ? "step" : undefined}
                className={cn("block py-2.5 pl-5 text-[15px] font-medium transition-colors", i === active ? "text-ink" : "text-faint hover:text-muted")}
              >
                {p.n}. {p.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div>
        {panels.map((p, i) => (
          <section
            key={p.n}
            id={`step-${p.n}`}
            ref={(el) => { refs.current[i] = el; }}
            style={{ zIndex: i + 1 }}
            className="sticky top-24 mb-6 scroll-mt-28 rounded-[36px] border border-line bg-card p-6 shadow-soft sm:p-8 lg:mb-10"
          >
            <div className="flex items-center gap-4">
              <AppTile icon={p.icon} tone={p.tone} size={48} />
              <h3 className="text-[1.7rem] font-medium tracking-[-0.03em]">
                <span className="mr-2 text-faint">{p.n}.</span>
                {p.title}
              </h3>
            </div>
            <div className="mt-6 min-h-[270px]">{p.mock}</div>
            <p className="mt-6 max-w-[520px] text-base text-muted">{p.text}</p>
          </section>
        ))}
        <div className="mt-8 flex justify-center">
          <Button href="/practice-lab" arrow>
            Start Your First Challenge
          </Button>
        </div>
      </div>
    </div>
  );
}


