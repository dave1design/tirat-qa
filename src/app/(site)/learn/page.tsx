import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { FinalCta } from "@/components/home/FinalCta";
import { LEARN_CATEGORIES } from "@/lib/constants";
import { publishedArticles, TOPIC_ARTICLE } from "@/lib/learn";

export const metadata: Metadata = {
  title: "Learn",
  description: "Software testing concepts, techniques and bug-reporting guides to help you approach every challenge with confidence.",
};
export const dynamic = "force-dynamic";

const checklist = [
  "Explore the main navigation.",
  "Test buttons and links.",
  "Complete and submit forms.",
  "Check required fields and validation messages.",
  "Try unexpected or invalid inputs.",
  "Observe what happens after each action.",
  "Document any unexpected behavior.",
  "Write clear steps to reproduce each issue.",
];

export default async function LearnPage() {
  const articles = await publishedArticles();
  const published = new Set(articles.map((a) => a.slug));
  const hasChecklistArticle = published.has("your-first-website-testing-checklist");

  return (
    <>
      <PageHero
        eyebrow="Learn the fundamentals"
        title="Understand Testing. Think Like a Tester."
        actions={
          <>
            <Button href="#topics">Explore Learning Topics</Button>
            <Button href="/practice-lab" variant="light" arrow>
              Go to Practice Lab
            </Button>
          </>
        }
      >
        <p>
          Explore software testing concepts, practical techniques, and bug-reporting guides to help you approach every testing challenge with
          confidence.
        </p>
        <p>Whether you&apos;re new to QA or improving your existing knowledge, start with the concepts that matter most.</p>
      </PageHero>

      <section id="topics" className="scroll-mt-24 py-16 sm:py-24" aria-label="Learning categories">
        <div className="container-x grid gap-5">
          {LEARN_CATEGORIES.map((c) => {
            const inCategory = articles.filter((a) => a.category === c.slug);
            return (
              <Reveal key={c.slug}>
                <article id={c.slug} className="scroll-mt-28 grid gap-8 rounded-[36px] bg-card p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
                  <div className="flex flex-col">
                    <SectionTag index={c.index} label={c.name} icon={undefined} />
                    <h2 className="h-section mt-6 !text-[clamp(1.9rem,3.4vw,2.75rem)] text-balance">{c.name}</h2>
                    <p className="lead mt-4">{c.description}</p>
                    <div className="mt-8">
                      {inCategory.length > 0 ? (
                        <Button href={`/learn/${inCategory[0].slug}`} arrow>
                          {c.cta}
                        </Button>
                      ) : (
                        <p className="text-sm text-muted">Guides for this category are being written.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow text-muted">Topics</p>
                    <ul className="mt-4 grid gap-2">
                      {c.topics.map((t) => {
                        const slug = TOPIC_ARTICLE[t];
                        const live = slug && published.has(slug);
                        return (
                          <li key={t}>
                            {live ? (
                              <Link
                                href={`/learn/${slug}`}
                                className="group flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3.5 text-[15px] font-medium shadow-soft transition-transform hover:-translate-y-0.5"
                              >
                                {t}
                                <ArrowUpRight className="size-4 text-brand transition-transform group-hover:translate-x-0.5" aria-hidden />
                              </Link>
                            ) : (
                              <span className="flex items-center justify-between gap-3 rounded-2xl border border-line/80 px-5 py-3.5 text-[15px] text-muted">
                                {t}
                                <span className="text-xs text-faint">Coming soon</span>
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="pb-16 sm:pb-24" aria-labelledby="start-title">
        <div className="container-x">
          <Reveal>
            <div className="grid gap-10 rounded-[40px] bg-[#141414] p-8 text-white sm:p-12 lg:grid-cols-2">
              <div>
                <p className="eyebrow text-white/60">Start here</p>
                <h2 id="start-title" className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-balance">
                  Your First Website Testing Checklist
                </h2>
                <p className="mt-5 max-w-[440px] text-lg text-white/65">
                  Not sure where to begin? Use a simple checklist to guide your first website testing session.
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  <Button href="/practice-lab" variant="white">
                    Practice What You&apos;ve Learned
                  </Button>
                  {hasChecklistArticle && (
                    <Button href="/learn/your-first-website-testing-checklist" variant="ghost" arrow className="!text-white hover:!bg-white/10">
                      Read the guide
                    </Button>
                  )}
                </div>
              </div>
              <ul className="grid gap-2.5 self-center">
                {checklist.map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-3 text-[15px]">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
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
