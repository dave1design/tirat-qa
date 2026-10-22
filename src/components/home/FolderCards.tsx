import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, Bug, Check, Compass, FileText, Rocket, type LucideIcon } from "lucide-react";
import { AppTile, type Tone } from "@/components/ui/AppTile";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { getT } from "@/lib/i18n/server";

/* ── Mini contents for the papers inside each folder ── */

const Line = ({ w, className }: { w: string; className?: string }) => <span className={cn("block h-1.5 rounded-full bg-chip", className)} style={{ width: w }} />;

async function LessonPaper() {
  const t = await getT();
  return (
    <>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-brand">{t("Lesson")}</span>
      <span className="mt-1 block text-[11px] font-semibold leading-tight">{t("What is software testing?")}</span>
      <span className="mt-2 grid gap-1">
        <Line w="92%" />
        <Line w="80%" />
        <Line w="64%" />
      </span>
    </>
  );
}

async function ChecklistPaper() {
  const t = await getT();
  return (
    <span className="grid gap-1.5">
      {["Test links", "Check forms", "Try edge cases"].map((item) => (
        <span key={item} className="flex items-center gap-1.5 text-[10px] font-medium">
          <span className="flex size-3.5 items-center justify-center rounded-full bg-ok text-white">
            <Check className="size-2.5" strokeWidth={3} aria-hidden />
          </span>
          {t(item)}
        </span>
      ))}
    </span>
  );
}

function BrowserPaper() {
  return (
    <>
      <span className="flex gap-1">
        <span className="size-1.5 rounded-full bg-[#ff5f57]" />
        <span className="size-1.5 rounded-full bg-[#febc2e]" />
        <span className="size-1.5 rounded-full bg-[#28c840]" />
      </span>
      <span className="mt-2 block h-3.5 rounded-md border border-line" />
      <span className="relative mt-1.5 block h-3.5 rounded-md border-[1.5px] border-brand">
        <span className="absolute -right-1.5 -top-2 flex size-4 items-center justify-center rounded-full bg-orange text-white">
          <Bug className="size-2.5" aria-hidden />
        </span>
      </span>
      <span className="mt-1.5 block h-3.5 w-1/2 rounded-full bg-ink" />
    </>
  );
}

async function ReportPaper() {
  const t = await getT();
  return (
    <>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-orange">{t("Bug report")}</span>
      {["Title", "Steps", "Expected", "Actual"].map((l, i) => (
        <span key={l} className="mt-1.5 flex items-center gap-1.5">
          <span className="w-9 shrink-0 text-[8px] font-medium text-faint">{t(l)}</span>
          <Line w={["70%", "85%", "60%", "50%"][i]} />
        </span>
      ))}
    </>
  );
}

async function ScorePaper() {
  const t = await getT();
  return (
    <>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-ok">{t("Results")}</span>
      <span className="mt-1.5 flex items-end gap-1">
        {[40, 62, 50, 78, 92].map((h, i) => (
          <span key={i} className="block w-full rounded-sm bg-green" style={{ height: h * 0.32, opacity: 0.4 + i * 0.15 }} />
        ))}
      </span>
      <span className="mt-2 flex gap-1">
        <span className="rounded-full bg-ok-soft px-1.5 py-0.5 text-[8px] font-semibold text-ok">{t("Valid")}</span>
        <span className="rounded-full bg-bad-soft px-1.5 py-0.5 text-[8px] font-semibold text-bad">{t("Missed")}</span>
      </span>
    </>
  );
}

function FeedbackPaper() {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ok-soft text-ok">
        <Check className="size-3" strokeWidth={3} aria-hidden />
      </span>
      <span className="grid flex-1 gap-1">
        <Line w="90%" />
        <Line w="60%" />
      </span>
    </span>
  );
}

interface Folder {
  title: string;
  pill: string;
  href: string;
  icon: LucideIcon;
  tone: Tone;
  color: string;
  back: ReactNode; // paper at the back of the stack
  front: ReactNode; // paper nearest the flap
}

const folders: Folder[] = [
  { title: "Learn", pill: "Free guides and resources", href: "/learn", icon: BookOpen, tone: "blue", color: "#0066ff", back: <ChecklistPaper />, front: <LessonPaper /> },
  { title: "Test", pill: "Practice websites", href: "/practice-lab", icon: Compass, tone: "violet", color: "#6c5cff", back: <ChecklistPaper />, front: <BrowserPaper /> },
  { title: "Report", pill: "Structured bug reports", href: "/learn/how-to-write-a-bug-report", icon: FileText, tone: "orange", color: "#ff6b1a", back: <BrowserPaper />, front: <ReportPaper /> },
  { title: "Improve", pill: "Results and feedback", href: "/dashboard", icon: Rocket, tone: "green", color: "#12c957", back: <FeedbackPaper />, front: <ScorePaper /> },
];

const paper = "absolute inset-x-[12%] top-0 h-[150px] rounded-2xl border border-black/[0.04] bg-white p-3 text-left shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1.2)]";

/**
 * Folder-style cards: papers sit tucked inside the folder; on hover/focus they slide up and fan out
 * while the front flap tips forward.
 */
export async function FolderCards() {
  const t = await getT();
  return (
    <div className="mx-auto mt-24 grid max-w-[1136px] grid-cols-2 gap-x-4 gap-y-12 px-5 sm:mt-40 lg:grid-cols-4 lg:gap-x-6">
      {folders.map((f, i) => (
        <Reveal key={f.title} delay={i * 90}>
          <Link href={f.href} className="group block rounded-[28px] text-center outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4">
            <div className="relative h-[180px] sm:h-[200px]" style={{ perspective: "900px" }}>
              {/* back of the folder, with its tab */}
              <div className="absolute inset-x-0 bottom-0 h-[84%] rounded-[24px] rounded-tl-none bg-gradient-to-b from-[#e4e4e4] to-[#d9d9d9]">
                <span className="absolute -top-4 left-0 h-6 w-[42%] rounded-t-[14px] bg-[#e4e4e4]" />
              </div>

              {/* papers inside: tucked in at rest, pulled out and fanned on hover */}
              <div className="absolute inset-x-0 bottom-0 h-[84%] overflow-visible">
                <div
                  className={cn(paper, "translate-y-2 -rotate-3 group-hover:-translate-x-3 group-hover:-translate-y-16 group-hover:-rotate-[10deg] group-focus-visible:-translate-y-16")}
                  aria-hidden
                >
                  {f.back}
                </div>
                <div
                  className={cn(paper, "translate-y-4 rotate-2 delay-75 group-hover:translate-x-3 group-hover:-translate-y-24 group-hover:rotate-[7deg] group-focus-visible:-translate-y-24")}
                  aria-hidden
                >
                  {f.front}
                </div>
              </div>

              {/* front flap */}
              <div
                className="absolute inset-x-0 bottom-0 h-[60%] origin-bottom rounded-[24px] border border-white/70 bg-gradient-to-b from-white/90 to-[#f6f6f6]/95 shadow-[0_-6px_20px_rgba(0,0,0,0.06),0_14px_30px_-12px_rgba(0,0,0,0.18)] backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:[transform:rotateX(-24deg)] group-focus-visible:[transform:rotateX(-24deg)]"
                aria-hidden
              >
                <span className="absolute left-4 top-4 size-3 rounded-full" style={{ background: f.color }} />
                <span className="absolute -top-5 right-3 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
                  <AppTile icon={f.icon} tone={f.tone} size={44} />
                </span>
                <span className="absolute inset-x-4 bottom-9 h-px bg-black/[0.07]" />
                <span className="absolute inset-x-4 bottom-5 h-px bg-black/[0.07]" />
              </div>
            </div>
            <p className="mt-5 text-xl tracking-[-0.03em]">{t(f.title)}</p>
            <p className="mx-auto mt-3 inline-block rounded-full bg-chip px-3 py-1.5 text-[13px] font-medium text-muted transition-colors group-hover:bg-ink group-hover:text-white">
              {t(f.pill)}
            </p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
