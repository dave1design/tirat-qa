import type { Metadata } from "next";
import Link from "next/link";
import { Puzzle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { loadLab } from "@/lib/lab";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { WebsiteGrid, type LabCard } from "@/components/lab/WebsiteGrid";
import { SkillsBand } from "@/components/lab/SkillsBand";
import { FinalCta } from "@/components/home/FinalCta";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Practice Lab",
  description: "Explore practice websites, investigate unexpected behavior and submit bug reports to build real-world software testing skills.",
};
export const dynamic = "force-dynamic";

/** How each live practice website is presented (category, colour, site drawing). */
const presentation: Record<string, Pick<LabCard, "category" | "visual" | "look">> = {
  "tirat-ecommerce": { category: "E-commerce", visual: "ecommerce", look: "lime" },
};

/** Full practice websites that are planned. They are shown as "Coming soon" and are not clickable. */
const planned: LabCard[] = [
  { key: "soon-lms", name: "Tirat Learning Management System", category: "Education", level: "Level 02", desc: "A learning platform: courses, enrollment, lessons and progress tracking.", skills: ["Enrollment", "Progress", "Quizzes"], visual: "lms", look: "teal", minutes: null, access: "Paid", status: "SOON", href: null },
  { key: "soon-projects", name: "Tirat Project Management", category: "Projects", level: "Level 02", desc: "A team workspace: boards, tasks, assignments and status changes.", skills: ["Task status", "Assignment", "Permissions"], visual: "projects", look: "blue", minutes: null, access: "Paid", status: "SOON", href: null },
  { key: "soon-booking", name: "Tirat Booking Platform", category: "Booking", level: "Level 02", desc: "An appointment system: services, availability, dates and confirmations.", skills: ["Date selection", "Validation", "Confirmation"], visual: "booking", look: "orange", minutes: null, access: "Paid", status: "SOON", href: null },
  { key: "soon-bank", name: "Tirat Banking App", category: "Finance", level: "Level 03", desc: "An account dashboard: balances, transfers, cards and transaction history.", skills: ["Calculations", "Edge cases", "State changes"], visual: "banking", look: "violet", minutes: null, access: "Paid", status: "SOON", href: null },
  { key: "soon-help", name: "Tirat Helpdesk", category: "Support", level: "Level 03", desc: "A customer support desk: tickets, priorities, assignment and replies.", skills: ["Ticket status", "Priority", "Search"], visual: "projects", look: "black", minutes: null, access: "Paid", status: "SOON", href: null },
];

export default async function PracticeLabPage() {
  const t = await getT();
  const user = await getCurrentUser();
  const levels = await loadLab(user);

  const live: LabCard[] = levels.flatMap((l) =>
    l.sites.map((s) => {
      const p = presentation[s.slug] ?? { category: "Practice", visual: "ecommerce" as const, look: "blue" as const };
      return {
        key: s.id,
        name: s.name,
        category: p.category,
        level: `Level ${String(l.number).padStart(2, "0")}`,
        desc: s.description,
        skills: s.skillList,
        visual: p.visual,
        look: p.look,
        minutes: s.estimatedMinutes,
        access: s.accessRule === "FREE" ? "Free" : `${s.priceEtb} ETB`,
        status: s.status,
        href: `/practice-lab/${l.slug}/${s.slug}`,
      };
    }),
  );
  const tr = (c: LabCard): LabCard => ({
    ...c,
    name: t(c.name),
    category: t(c.category),
    desc: t(c.desc),
    skills: c.skills.map((k) => t(k)),
    level: c.level.startsWith("Level") ? `${t("Level")} ${c.level.slice(6)}` : c.level,
    access: c.access === "Free" || c.access === "Paid" ? t(c.access) : c.access,
  });
  const cards = [...live, ...planned].map(tr);

  const siteCount = live.length;
  const freeCount = live.filter((c) => c.access === "Free").length;
  const stats: [string, string][] = [
    [String(levels.length), t(levels.length === 1 ? "practice level available" : "practice levels available")],
    [String(siteCount), t(siteCount === 1 ? "practice website to test" : "practice websites to test")],
    [String(freeCount), t(freeCount === 1 ? "website free to start" : "websites free to start")],
  ];

  return (
    <>
      <section className="hero-bg pb-16 pt-36 sm:pb-24 sm:pt-44">
        <div className="container-x grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-1.5 text-sm font-medium">
                <span className="inline-flex h-[34px] items-center gap-2 rounded-lg bg-brand pl-2.5 pr-2 text-white">
                  Tirat QA <Puzzle className="size-[18px] text-lime" fill="currentColor" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="inline-flex h-[34px] items-center rounded-lg border border-line bg-white px-3 text-[12px] font-medium uppercase tracking-[0.06em]">{t("Hands-on QA training")}</span>
              </div>
            </Reveal>
            <SplitText
              as="h1"
              className="h-display mt-6 text-balance"
              stagger={90}
              parts={[{ text: t("Find the Bugs. Prove What") }, { text: t("You Found."), className: "text-brand" }]}
            />
            <Reveal delay={150}>
              <p className="lead mt-6 max-w-[560px]">
                {t("Explore practice websites, investigate unexpected behavior, and submit bug reports to develop your real-world software testing skills.")}
              </p>
              <p className="lead mt-3 max-w-[560px]">{t("Every challenge is an opportunity to think critically, test systematically, and improve.")}</p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <Button href="#websites">{t("Explore Practice Levels")}</Button>
                <Button href="/learn" variant="light" arrow>
                  {t("Go to Learn")}
                </Button>
              </div>
              <p className="mt-5 text-sm font-medium text-muted">{t("Choose a level. Test a website. Report your findings.")}</p>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <dl>
              {stats.map(([n, label], i) => (
                <div key={label} className={`flex flex-col-reverse border-t border-line py-6 ${i === stats.length - 1 ? "border-b" : ""}`}>
                  <dt className="mt-1 text-[15px] text-muted">{label}</dt>
                  <dd className="text-[clamp(2.6rem,5vw,3.75rem)] font-semibold leading-none tracking-[-0.05em]">{n}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section id="websites" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="websites-title">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Reveal>
                <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-muted">
                  <span className="size-2 rounded-full bg-brand" /> {t("Practice websites")}
                </p>
              </Reveal>
              <SplitText id="websites-title" className="h-section mt-4 max-w-[560px] text-balance" parts={[{ text: t("Choose Your Practice Level") }]} />
            </div>
            <Reveal delay={120}>
              <p className="lead lg:ml-auto lg:max-w-[520px]">
                {t("Start with the fundamentals or challenge yourself with more advanced testing scenarios as your skills develop.")}
              </p>
            </Reveal>
          </div>

          {cards.length === 0 ? (
            <div className="mt-12 rounded-[36px] bg-card p-12 text-center">
              <h3 className="text-3xl font-semibold tracking-[-0.04em]">{t("Your Next Challenge Starts Here.")}</h3>
              <p className="mt-3 text-muted">{t("There are no practice websites available in this section yet. Check back soon for new challenges.")}</p>
            </div>
          ) : (
            <div className="mt-10">
              <WebsiteGrid cards={cards} />
            </div>
          )}

          {levels.length > 0 && (
            <div className="mt-14 flex flex-wrap items-center gap-3 rounded-[28px] bg-card p-5 text-[15px]">
              <span className="font-medium">{t("Browse by level:")}</span>
              {levels.map((l) => (
                <Link key={l.id} href={`/practice-lab/${l.slug}`} className="rounded-full bg-white px-4 py-2 font-medium shadow-soft transition-colors hover:bg-chip">
                  {t("Level")} {String(l.number).padStart(2, "0")} — {t(l.name)}
                </Link>
              ))}
              {!user && (
                <Link href="/sign-up" className="ml-auto font-medium underline underline-offset-4">
                  {t("Create a free account to start")}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <SkillsBand />

      <FinalCta />
    </>
  );
}
