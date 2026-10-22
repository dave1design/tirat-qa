import { ArrowRight } from "lucide-react";
import type { Diagram } from "@/content/curriculum";

const tints = ["bg-[#e8f6f2]", "bg-[#e9f0fb]", "bg-[#fdf2d6]", "bg-[#f9e8e6]", "bg-[#e8f6f2]", "bg-[#e9f0fb]"];

/** An original diagram: connected boxes, with alt text and a caption. */
export function LessonDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <figure>
      <div role="img" aria-label={diagram.alt} className="rounded-[28px] border border-line bg-[#f6f9fc] p-5 sm:p-7">
        <p className="text-lg font-semibold tracking-[-0.02em]">{diagram.title}</p>
        <ol className="mt-5 grid gap-3 sm:flex sm:items-stretch" aria-hidden>
          {diagram.boxes.map((b, i) => (
            <li key={b.t} className="flex flex-1 items-stretch gap-2 sm:gap-1.5">
              <div className={`flex-1 rounded-2xl border border-[#0f9b8a]/50 p-4 ${tints[i % tints.length]}`}>
                <p className="text-[15px] font-semibold leading-tight">{b.t}</p>
                <p className="mt-1.5 text-[13px] leading-snug text-ink-2">{b.d}</p>
              </div>
              {i < diagram.boxes.length - 1 && <ArrowRight className="hidden size-4 shrink-0 self-center text-[#0f9b8a] sm:block" aria-hidden />}
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs text-muted">Tirat QA lesson illustration</p>
      </div>
      <figcaption className="mt-3 text-center text-sm italic text-muted">{diagram.caption}</figcaption>
    </figure>
  );
}
