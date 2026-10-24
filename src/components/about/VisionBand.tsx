import { Briefcase, GraduationCap, Repeat, Rocket, Users, Eye } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import type { LucideIcon } from "lucide-react";
import { getT } from "@/lib/i18n/server";

const serve: { t: string; icon: LucideIcon }[] = [
  { t: "People beginning their QA journey.", icon: Rocket },
  { t: "University and college students.", icon: GraduationCap },
  { t: "Aspiring software testers.", icon: Users },
  { t: "Junior QA professionals.", icon: Briefcase },
  { t: "Career changers exploring software testing.", icon: Repeat },
];

/** Full-bleed dark band: vision statement left/right, then a "who we serve" pill row. */
export async function VisionBand() {
  const t = await getT();
  return (
    <section className="bg-[#141414] py-20 text-white sm:py-28" aria-labelledby="vision-title">
      <div className="container-x">
        <Reveal>
          <div className="inline-flex items-center gap-1.5 text-sm font-medium">
            <span className="inline-flex h-[34px] items-center gap-2 rounded-lg bg-brand pl-2.5 pr-2">
              3 <Eye className="size-[18px] text-lime" fill="currentColor" strokeWidth={1.5} aria-hidden />
            </span>
            <span className="inline-flex h-[34px] items-center rounded-lg border border-white/15 bg-white/5 px-3">{t("Our Vision")}</span>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <SplitText id="vision-title" className="h-section max-w-[640px] text-balance" parts={[{ text: t("A Future with More Confident Testers.") }]} />
          <Reveal delay={120}>
            <p className="text-[clamp(1.05rem,1.5vw,1.25rem)] leading-snug tracking-[-0.02em] text-white/60">
              {t("We envision a world where aspiring software testers can build practical skills, improve their problem-solving abilities, and prepare for real-world testing challenges.")}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="font-mono text-[12px] uppercase tracking-wider text-white/50">{t("Who we serve")}</p>
          <p className="mt-2 text-[15px] text-white/60">{t("Tirat is designed for:")}</p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {serve.map((s, i) => (
              <li key={s.t}>
                <Reveal delay={i * 70}>
                  <span className="group inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-[15px] font-medium transition-colors hover:bg-white/[0.12]">
                    <s.icon className="size-[18px] text-white/70 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-lime" aria-hidden />
                    {t(s.t)}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
