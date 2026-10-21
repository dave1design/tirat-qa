import { GraduationCap, Repeat, Rocket, Users } from "lucide-react";
import { SectionTag } from "@/components/ui/SectionTag";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { AppTile } from "@/components/ui/AppTile";

const people = [
  { title: "Aspiring QA Testers", text: "Start learning practical testing skills and build a foundation for your QA career.", icon: Rocket, tone: "blue" as const },
  { title: "Students and Career Changers", text: "Move beyond theory and develop skills through hands-on practice.", icon: GraduationCap, tone: "violet" as const },
  { title: "Junior QA Professionals", text: "Strengthen your testing techniques, improve your bug reports, and challenge yourself with new scenarios.", icon: Users, tone: "green" as const },
];

export function Audience() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="audience-title">
      <div className="container-x">
        <Reveal className="flex flex-col items-center text-center">
          <SectionTag index="5" icon={Repeat} iconClass="text-lime" label="Built for Your Journey" />
          <SplitText id="audience-title" className="h-section mt-6 max-w-[760px] text-balance" parts={[{ text: "Wherever You Start, Keep Improving." }]} />
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {people.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <article className="group flex h-full flex-col rounded-[28px] border border-line bg-card/70 p-7 transition-[transform,box-shadow,background] duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
                <span className="inline-block transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110"><AppTile icon={p.icon} tone={p.tone} size={52} /></span>
                <h3 className="mt-14 text-[1.5rem] font-medium leading-tight tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
