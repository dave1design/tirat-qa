import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionTag } from "@/components/ui/SectionTag";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { LEARN_CATEGORIES } from "@/lib/constants";
import { countLabel } from "@/lib/i18n";
import { getT } from "@/lib/i18n/server";

const tints = [
  "from-[#4d8dff] via-[#6aa0ff] to-[#9fc0ff]",
  "from-[#2f7bff] via-[#1a6bff] to-[#6aa6ff]",
  "from-[#d4ff1a] via-[#c6f000] to-[#e5ff6b]",
  "from-[#ff8a3d] via-[#ff7a22] to-[#ffb27a]",
];
const inks = ["text-white", "text-white", "text-ink", "text-white"];

export async function LearnPreview({ counts }: { counts: Record<string, number> }) {
  const t = await getT();
  return (
    <section className="py-16 sm:py-24" aria-labelledby="learn-title">
      <div className="container-x">
        <Reveal className="grid items-end gap-6 lg:grid-cols-2">
          <div>
            <SectionTag index="4" icon={BookOpen} iconClass="text-orange" label={t("Build Your Knowledge")} />
            <SplitText id="learn-title" className="h-section mt-6 max-w-[620px] text-balance" parts={[{ text: t("Understand the Principles Behind Every Bug.") }]} />
          </div>
          <div className="lg:text-right">
            <p className="lead ml-auto max-w-[520px]">
              {t("Strengthen your testing knowledge with practical guides and learning resources that help you approach each challenge with a clearer testing mindset.")}
            </p>
            <div className="mt-6 lg:flex lg:justify-end">
              <Button href="/learn" variant="light" arrow>{t("Explore Learning Resources")}</Button>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LEARN_CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <Link href="/learn#roadmap" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[32px]"><div className={`absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-110 ${tints[i]}`} />
                  <span className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.7),transparent_40%),repeating-linear-gradient(45deg,rgba(255,255,255,.18)_0_2px,transparent_2px_14px)]" />
                  <span className={`absolute left-5 top-5 font-mono text-[11px] uppercase tracking-wider ${inks[i]}`}>{t(c.name).split(" ").slice(-1)[0]}</span>
                  <span className={`absolute right-5 top-5 text-sm font-semibold tracking-[-0.03em] ${inks[i]}`}>tirat</span>
                  <span className="absolute -bottom-6 -right-4 text-[120px] font-semibold leading-none tracking-[-0.06em] text-white/25 transition-transform duration-700 group-hover:-translate-y-3 group-hover:-rotate-6">{c.index}</span>
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs font-medium text-muted">
                  {c.index}
                  <span aria-hidden>·</span>
                  {countLabel(t, counts[c.slug] ?? 0, "article")}
                </p>
                <h3 className="mt-2 text-xl font-medium leading-snug tracking-[-0.025em] group-hover:underline group-hover:underline-offset-4">{t(c.name)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{t(c.description)}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
