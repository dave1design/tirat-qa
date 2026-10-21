import { FileText, Layers, MessageSquareText, Puzzle, Target } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { SplitText } from "@/components/ui/SplitText";
import { AppTile, type Tone } from "@/components/ui/AppTile";
import type { LucideIcon } from "lucide-react";

const items: { n: string; title: string; text: string; icon: LucideIcon; tone: Tone }[] = [
  { n: "01", title: "Hands-On Practice", text: "Provide practice websites where learners can explore functionality and investigate potential issues.", icon: Target, tone: "blue" },
  { n: "02", title: "Structured Challenges", text: "Organize practice websites into levels that support progressive skill development.", icon: Layers, tone: "black" },
  { n: "03", title: "Better Bug Reporting", text: "Help learners develop the habit of documenting bugs clearly and consistently.", icon: FileText, tone: "lime" },
  { n: "04", title: "Feedback and Improvement", text: "Enable users to review their results and identify areas where they can improve.", icon: MessageSquareText, tone: "orange" },
];

/** Mission statement above four numbered cards inside a grey frame. */
export function ValuesGrid() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="values-title">
      <div className="container-x">
        <Reveal className="flex flex-col items-center text-center">
          <SectionTag index="2" icon={Puzzle} iconClass="text-orange" label="Our Mission" />
        </Reveal>
        <SplitText id="values-title" className="h-section mx-auto mt-6 max-w-[760px] text-balance text-center" parts={[{ text: "Make Practical QA Learning Accessible." }]} />
        <Reveal delay={100}>
          <p className="lead mx-auto mt-5 max-w-[620px] text-center">
            Our mission is to help people develop useful software testing skills through accessible, structured, and hands-on learning experiences.
          </p>
        </Reveal>

        <div className="mt-14 rounded-[40px] border border-line/70 bg-card p-2">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it, i) => (
              <li key={it.n}>
                <Reveal delay={i * 80} className="h-full">
                  <article className="group flex h-[320px] flex-col rounded-[32px] bg-white p-6 transition-shadow duration-500 hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.3)]">
                    <div className="flex items-start justify-between">
                      <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1.4)] group-hover:-rotate-12 group-hover:scale-110">
                        <AppTile icon={it.icon} tone={it.tone} size={58} />
                      </span>
                      <span className="font-mono text-[12px] text-muted">{it.n}</span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-[1.55rem] font-medium leading-tight tracking-[-0.035em]">{it.title}</h3>
                      <p className="mt-2.5 text-[15px] leading-snug text-muted">{it.text}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
