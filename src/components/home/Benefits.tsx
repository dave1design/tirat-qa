import { Layers } from "lucide-react";
import { Check, CircleAlert, Image as ImageIcon } from "lucide-react";
import { SectionTag } from "@/components/ui/SectionTag";
import { Reveal } from "@/components/ui/Reveal";

const Row = ({ label, tag, tone }: { label: string; tag: string; tone: string }) => (
  <div className="flex items-center justify-between gap-2 border-b border-line py-3 text-[15px] last:border-0">
    <span className="font-medium">{label}</span>
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{tag}</span>
  </div>
);

function FindBugsArt() {
  return (
    <div className="px-1">
      <Row label="Unexpected behavior" tag="Found" tone="bg-ok-soft text-ok" />
      <Row label="Functional issue" tag="Found" tone="bg-ok-soft text-ok" />
      <Row label="Usability problem" tag="Found" tone="bg-ok-soft text-ok" />
      <Row label="Edge case" tag="Keep looking" tone="bg-chip text-muted" />
    </div>
  );
}

function ReportArt() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <p className="text-[11px] font-medium uppercase tracking-wider text-faint">Bug title</p>
      <p className="mt-0.5 text-sm font-medium">Form accepts an invalid email</p>
      <div className="my-3 h-px bg-line" />
      {["Steps to reproduce", "Expected result", "Actual result"].map((l) => (
        <div key={l} className="mb-2.5 last:mb-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-faint">{l}</p>
          <div className="mt-1.5 h-2 w-4/5 rounded-full bg-chip" />
        </div>
      ))}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
        <ImageIcon className="size-3.5" aria-hidden /> Screenshot attached
      </div>
    </div>
  );
}

function FeedbackArt() {
  return (
    <div className="grid gap-2.5">
      <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-soft">
        <span className="flex size-7 items-center justify-center rounded-full bg-ok-soft text-ok">
          <Check className="size-4" aria-hidden />
        </span>
        <div className="text-sm">
          <p className="font-medium">Valid finding</p>
          <p className="text-xs text-muted">Clear steps and expected result</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-soft">
        <span className="flex size-7 items-center justify-center rounded-full bg-[#fff4e5] text-warn">
          <CircleAlert className="size-4" aria-hidden />
        </span>
        <div className="text-sm">
          <p className="font-medium">Missed finding</p>
          <p className="text-xs text-muted">Topic: form validation</p>
        </div>
      </div>
    </div>
  );
}

function ProgressArt() {
  const rows = [
    ["Completed", "w-full", "bg-ok"],
    ["In Progress", "w-3/5", "bg-brand"],
    ["Not Started", "w-[8%]", "bg-faint"],
  ];
  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-soft">
      {rows.map(([l, w, c]) => (
        <div key={l}>
          <p className="mb-1.5 text-xs font-medium text-muted">{l}</p>
          <div className="h-2 rounded-full bg-chip">
            <div className={`h-2 rounded-full ${w} ${c}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

const items = [
  { title: "Find Bugs with Confidence", text: "Explore practice websites and learn to recognize unexpected behavior, functional issues, and usability problems.", art: <FindBugsArt /> },
  { title: "Write Better Bug Reports", text: "Learn to describe issues clearly with reproduction steps, expected results, actual results, and supporting evidence.", art: <ReportArt /> },
  { title: "Learn Through Feedback", text: "Review your submitted reports, understand what you missed, and discover how to improve your testing approach.", art: <FeedbackArt /> },
  { title: "Track Your Progress", text: "Follow your completed challenges, review your results, and see how your practical testing skills develop over time.", art: <ProgressArt /> },
];

export function Benefits() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="benefits-title">
      <div className="container-x">
        <Reveal className="flex flex-col items-center text-center">
          <SectionTag index="1" icon={Layers} label="Why Tirat QA" />
          <h2 id="benefits-title" className="h-section mt-6 max-w-[760px] text-balance">
            Build Skills That Go Beyond Theory.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80} className={i % 2 === 1 ? "lg:mt-3" : ""}>
              <article className="flex h-full min-h-[440px] flex-col rounded-[32px] bg-card p-6">
                <h3 className="h-card !text-[1.45rem]">{it.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{it.text}</p>
                <div className="mt-auto pt-8">{it.art}</div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
