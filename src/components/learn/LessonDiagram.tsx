import { ArrowRight } from "lucide-react";
import type { Diagram } from "@/content/curriculum";

const tints = ["bg-[#e6efff]", "bg-[#d9e7ff]", "bg-[#e6efff]", "bg-[#d9e7ff]", "bg-[#e6efff]", "bg-[#d9e7ff]"];

/** An original diagram: connected boxes, with alt text and a caption. */
export function LessonDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <figure>
      <div role="img" aria-label={diagram.alt} className="rounded-2xl border border-line bg-[#f6f9ff] p-5 sm:p-7">
        <p className="text-lg font-semibold tracking-[-0.02em]">{diagram.title}</p>
        <ol className="mt-5 grid gap-3 sm:flex sm:items-stretch" aria-hidden>
          {diagram.boxes.map((b, i) => (
            <li key={b.t} className="flex flex-1 items-stretch gap-2 sm:gap-1.5">
              <div className={`flex-1 rounded-2xl border border-brand/30 p-4 ${tints[i % tints.length]}`}>
                <p className="text-[15px] font-semibold leading-tight">{b.t}</p>
                <p className="mt-1.5 text-[13px] leading-snug text-ink-2">{b.d}</p>
              </div>
              {i < diagram.boxes.length - 1 && <ArrowRight className="hidden size-4 shrink-0 self-center text-brand sm:block" aria-hidden />}
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs text-muted">Tirat</p>
      </div>
      <figcaption className="mt-3 text-center text-sm italic text-muted">{diagram.caption}</figcaption>
    </figure>
  );
}
