import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta } from "@/components/home/FinalCta";
import { getCurrentUser } from "@/lib/auth";
import { isLessonPassed, isLevelUnlocked, LEARN_LOGIN, loadProgress } from "@/lib/learn-progress";
import { cn } from "@/lib/utils";
import { SignedInLearn } from "./SignedInLearn";
import { advancedPriceEtb, hasAdvancedAccess, isPaidLevel } from "@/lib/learn-access";
import { levelsFor, TOTAL_LESSONS } from "@/content/curriculum";
import { getLocale, getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Learn",
  description: "Software testing concepts, techniques and bug-reporting guides to help you approach every challenge with confidence.",
};
export const dynamic = "force-dynamic";

/** Signed in, /learn is the learning app (sidebar + lesson cards); guests keep the public roadmap. */
export default async function LearnPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const user = await getCurrentUser();
  if (user) return <SignedInLearn user={user} view={(await searchParams).view === "exams" ? "exams" : "lessons"} />;
  return <RoadmapPage />;
}

async function RoadmapPage() {
  const t = await getT();
  const LEVELS = levelsFor(await getLocale());
  const user = await getCurrentUser();
  const progress = await loadProgress(user?.id ?? null);
  const advanced = await hasAdvancedAccess(user);
  const passedCount = LEVELS.flatMap((l) => l.lessons.map((x) => progress.get(`${l.n}/${x.slug}`))).filter(isLessonPassed).length;

  const renderCard = (l: (typeof LEVELS)[number], i: number) => {
              const done = l.lessons.filter((x) => isLessonPassed(progress.get(`${l.n}/${x.slug}`))).length;
              // everyone starts at Level 1; the rest open one by one as the level before is passed
              // Levels 5 to 8 need one payment; a signed-in learner without it can still open the card to pay
              const paywalled = isPaidLevel(l.n) && !!user && !advanced;
              const locked = !paywalled && !(user ? isLevelUnlocked(l.n, progress) : l.n === 1);
              const href = !user ? LEARN_LOGIN : `/learn/levels/${l.n}`;
              const body = (
                <>
                      <div className={cn("flex items-center justify-between gap-3", locked && "opacity-60")}>
                        <span className="rounded-lg bg-brand px-2.5 py-1.5 text-sm font-medium text-white">{t("Level")} {l.n}</span>
                        <span className="flex items-center gap-2">
                          <span className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.06em]">{t(l.track)}</span>
                        </span>
                      </div>
                      <h3 className={cn("mt-6 text-[1.55rem] font-semibold leading-tight tracking-[-0.035em] text-balance", locked && "opacity-60")}>{t(l.title)}</h3>
                      <p className={cn("mt-3 text-[15.5px] leading-relaxed text-ink-2", locked && "opacity-60")}>{t(l.goal)}</p>
                      <ul className={cn("mt-5 grid gap-1.5 text-[14.5px] text-ink-2", locked && "opacity-60")}>
                        {l.lessons.map((x) => (
                          <li key={x.slug} className="flex gap-2">
                            <span className="font-medium text-muted">{x.n}</span> {t(x.title)}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex items-center justify-between pt-6 text-sm">
                        <span className="text-muted">
                          {locked ? t("Pass Level {n} to unlock it.", { n: l.n - 1 }) : user && !paywalled ? t("{done} of {total} quizzes passed", { done, total: l.lessons.length }) : t("{n} lessons · timed exam · interview prep", { n: l.lessons.length })}
                        </span>
                        {locked || paywalled ? (
                          <span className="inline-flex size-9 items-center justify-center rounded-full bg-white text-muted shadow-soft">
                            <Lock className="size-4" aria-label={t("Locked")} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-medium text-brand">
                            {user ? t("Open level") : t("Log in to start")} <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                          </span>
                        )}
                      </div>
                </>
              );
              const cls = cn("group flex h-full flex-col rounded-[32px] bg-card p-7 sm:p-8", locked ? "cursor-not-allowed" : "transition-colors hover:bg-chip");
              return (
                <li key={l.n} className="list-none">
                  <Reveal delay={(i % 2) * 80} className="h-full">
                    {locked ? (
                      <div aria-disabled="true" className={cls}>
                        {body}
                      </div>
                    ) : (
                      <Link href={href} className={cls}>
                        {body}
                      </Link>
                    )}
                  </Reveal>
                </li>
              );
  };

  return (
    <>
      <PageHero
        eyebrow={t("Learn the fundamentals")}
        title={t("Understand Testing. Think Like a Tester.")}
        actions={
          <>
            <Button href="#roadmap">{t("View the Learning Roadmap")}</Button>
            <Button href="/practice-lab" variant="light" arrow>
              {t("Go to Practice Lab")}
            </Button>
          </>
        }
      >
        <p>
          {t("Explore software testing concepts, practical techniques, and bug-reporting guides to help you approach every testing challenge with confidence.")}
        </p>
        <p>{t("Whether you're new to QA or improving your existing knowledge, start with the concepts that matter most.")}</p>
      </PageHero>

      <section id="roadmap" className="scroll-mt-24 pt-16 sm:pt-24" aria-labelledby="roadmap-title">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Reveal>
                <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-muted">
                  <span className="size-2 rounded-full bg-brand" /> {t("Learning roadmap")}
                </p>
              </Reveal>
              <h2 id="roadmap-title" className="h-section mt-4 max-w-[600px] text-balance">
                {t("From Foundations to Automation.")}
              </h2>
            </div>
            <Reveal delay={120}>
              <p className="lead lg:ml-auto lg:max-w-[520px]">
                {t("Eight progressive levels, {n} lessons. Each one is a short guided path: learn it, try it, then a five-question quiz.", { n: TOTAL_LESSONS })}
                {user ? ` ${t("You have passed {done} of {total} quizzes.", { done: passedCount, total: TOTAL_LESSONS })}` : ""}
              </p>
            </Reveal>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-2">{LEVELS.filter((l) => !isPaidLevel(l.n)).map(renderCard)}</ol>

          <section aria-labelledby="paid-title" className="mt-8 rounded-[44px] border-2 border-ink p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-5 px-2 pb-5 pt-1 sm:px-3">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-white">
                  <Lock className="size-3.5" aria-hidden /> {t("Paid levels")}
                </p>
                <h3 id="paid-title" className="mt-3 text-[1.7rem] font-semibold tracking-[-0.04em]">
                  {t("Levels 5 to 8 · one payment")}
                </h3>
                <p className="mt-1 text-[15.5px] text-muted">{t("Pay once and all four advanced levels are yours. No subscription.")}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-semibold tracking-[-0.04em]">{advancedPriceEtb().toLocaleString("en-US")} ETB</span>
                {advanced ? (
                  <span className="rounded-full bg-ok-soft px-4 py-2.5 text-sm font-medium text-ok">{t("Unlocked")}</span>
                ) : (
                  <Link href={user ? "/learn/levels/5" : LEARN_LOGIN} className="rounded-full bg-brand px-6 py-3.5 font-medium text-white hover:bg-brand-dark">
                    {t("Unlock Levels 5 to 8")}
                  </Link>
                )}
              </div>
            </div>
            <ol className="grid gap-4 md:grid-cols-2">{LEVELS.filter((l) => isPaidLevel(l.n)).map(renderCard)}</ol>
          </section>
        </div>
      </section>

      <FinalCta
        label="Practice"
        title="Ready to Put Your Knowledge into Action?"
        text="Reading is the beginning. Practice helps you apply what you've learned."
        primary={{ href: "/practice-lab", label: "Explore the Practice Lab" }}
        secondary={null}
      />
    </>
  );
}
