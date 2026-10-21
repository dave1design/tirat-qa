import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { levelAccessLabel, loadLab } from "@/lib/lab";
import { plural } from "@/lib/utils";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "@/components/ui/StatusBadge";

export const metadata: Metadata = {
  title: "Practice Lab",
  description: "Explore practice websites, investigate unexpected behavior and submit bug reports to build real-world software testing skills.",
};
export const dynamic = "force-dynamic";

export default async function PracticeLabPage() {
  const user = await getCurrentUser();
  const levels = await loadLab(user);

  return (
    <>
      <PageHero
        eyebrow="Hands-on QA training"
        title="Find the Bugs. Prove What You Found."
        actions={<Button href="#levels">Explore Practice Levels</Button>}
      >
        <p>
          Explore practice websites, investigate unexpected behavior, and submit bug reports to develop your real-world software testing skills.
        </p>
        <p>Every challenge is an opportunity to think critically, test systematically, and improve.</p>
        <p className="text-sm font-medium">Choose a level. Test a website. Report your findings.</p>
      </PageHero>

      <section id="levels" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="levels-title">
        <div className="container-x">
          <Reveal className="max-w-[640px]">
            <h2 id="levels-title" className="h-section text-balance">Choose Your Practice Level</h2>
            <p className="lead mt-4">Start with the fundamentals or challenge yourself with more advanced testing scenarios as your skills develop.</p>
          </Reveal>

          {levels.length === 0 ? (
            <div className="mt-12 rounded-[36px] bg-card p-12 text-center">
              <h3 className="text-3xl font-semibold tracking-[-0.04em]">Your Next Challenge Starts Here.</h3>
              <p className="mt-3 text-muted">There are no practice websites available in this section yet.</p>
              <p className="text-muted">Check back soon for new challenges.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {levels.map((l, i) => (
                <Reveal key={l.id} delay={i * 80}>
                  <article className="flex h-full flex-col rounded-[36px] bg-card p-7 sm:p-9">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex h-[34px] items-center rounded-lg bg-brand px-3 text-sm font-medium text-white">Level {String(l.number).padStart(2, "0")}</span>
                      <Pill>{l.difficulty}</Pill>
                      <Pill>{plural(l.sites.length, "website")}</Pill>
                      <Pill>{levelAccessLabel(l.sites)}</Pill>
                    </div>
                    <h3 className="mt-6 text-[clamp(1.7rem,3vw,2.3rem)] font-semibold leading-[1.08] tracking-[-0.04em]">
                      Level {String(l.number).padStart(2, "0")} — {l.name}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted">{l.description}</p>
                    <p className="mt-6 text-sm font-medium">Skills covered</p>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {l.skillList.map((s) => (
                        <li key={s} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px]">{s}</li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8">
                      <Button href={`/practice-lab/${l.slug}`} arrow>View Level</Button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          {!user && levels.length > 0 && (
            <p className="mt-8 text-center text-muted">
              <Link href="/sign-up" className="inline-flex items-center gap-1 font-medium text-ink underline underline-offset-4">
                Create a free account <ArrowUpRight className="size-4" aria-hidden />
              </Link>{" "}
              to start testing and save your results.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
