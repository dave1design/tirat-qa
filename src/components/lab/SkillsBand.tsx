import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Check } from "lucide-react";

const skills = [
  { initials: "AU", color: "bg-lime text-ink", title: "Authentication", items: ["Form validation", "Authentication states", "Error messages"] },
  { initials: "FO", color: "bg-[#2ee6c3] text-ink", title: "Forms", items: ["Required fields", "Format validation", "Duplicate data"] },
  { initials: "EC", color: "bg-orange text-ink", title: "E-commerce", items: ["Search and filters", "Sorting", "Product details"] },
  { initials: "CA", color: "bg-[#b8cfff] text-ink", title: "Cart and checkout", items: ["Quantity", "Totals", "Address validation"] },
  { initials: "BK", color: "bg-[#e0795a] text-ink", title: "Booking", items: ["Date selection", "Validation", "Confirmation"] },
];

/** Dark band of five skill cards, each with an initials badge and a short check list. */
export function SkillsBand() {
  return (
    <section className="bg-[#141414] py-20 text-white sm:py-28" aria-labelledby="skills-title">
      <div className="container-x">
        <Reveal>
          <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-white/60">
            <span className="size-2 rounded-full bg-lime" /> By skill
          </p>
        </Reveal>
        <SplitText id="skills-title" className="h-section mt-4 max-w-[760px] text-balance" parts={[{ text: "Skills you'll practice." }]} />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {skills.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 70} className="h-full">
                <article className="group h-full rounded-[28px] border border-white/10 bg-white/[0.06] p-6 transition-colors hover:bg-white/[0.1]">
                  <span className={`flex size-[52px] items-center justify-center rounded-full text-[15px] font-medium transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 ${s.color}`}>{s.initials}</span>
                  <h3 className="mt-6 text-[1.3rem] font-medium tracking-[-0.03em]">{s.title}</h3>
                  <ul className="mt-4 grid gap-2.5">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-center gap-2.5 text-[15px] text-white/65">
                        <Check className="size-4 shrink-0 text-lime" strokeWidth={2.6} aria-hidden />
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
