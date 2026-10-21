import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Benefits } from "@/components/home/Benefits";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PracticePreview } from "@/components/home/PracticePreview";
import { LearnPreview } from "@/components/home/LearnPreview";
import { SkillsMarquee } from "@/components/home/SkillsMarquee";
import { Audience } from "@/components/home/Audience";
import { FinalCta } from "@/components/home/FinalCta";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [levels, grouped] = await Promise.all([
    db.level.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: { websites: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, select: { name: true, accessRule: true } } },
    }),
    db.article.groupBy({ by: ["category"], where: { status: "PUBLISHED" }, _count: { _all: true } }),
  ]);

  const counts = Object.fromEntries(grouped.map((g) => [g.category, g._count._all]));

  return (
    <>
      <Hero />
      <Intro />
      <Benefits />
      <SkillsMarquee />
      <HowItWorks />
      <PracticePreview
        levels={levels
          .filter((l) => l.websites.length > 0)
          .map((l) => ({
            slug: l.slug,
            number: l.number,
            name: l.name,
            difficulty: l.difficulty,
            description: l.description,
            skills: parseJson<string[]>(l.skills, []),
            websites: l.websites.map((w) => ({ name: w.name, locked: w.accessRule === "PAID" || l.accessRule === "PAID" })),
          }))}
      />
      <LearnPreview counts={counts} />
      <Audience />
      <FinalCta />
    </>
  );
}
