import type { Metadata } from "next";
import { BookOpenCheck, Eye, FileText, Layers, MessageSquareText, Target } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { AppTile } from "@/components/ui/AppTile";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = { title: "About", description: "Tirat QA makes software testing skills practical." };

const doing = [
  { icon: Target, tone: "blue" as const, title: "Hands-On Practice", text: "Provide practice websites where learners can explore functionality and investigate potential issues." },
  { icon: Layers, tone: "violet" as const, title: "Structured Challenges", text: "Organize practice websites into levels that support progressive skill development." },
  { icon: FileText, tone: "orange" as const, title: "Better Bug Reporting", text: "Help learners develop the habit of documenting bugs clearly and consistently." },
  { icon: MessageSquareText, tone: "green" as const, title: "Feedback and Improvement", text: "Enable users to review their results and identify areas where they can improve." },
];

const serve = [
  "People beginning their QA journey.",
  "University and college students.",
  "Aspiring software testers.",
  "Junior QA professionals.",
  "Career changers exploring software testing.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Tirat QA"
        title="Making Software Testing Skills Practical."
        actions={
          <Button href="/practice-lab" arrow>
            Start Practicing
          </Button>
        }
      >
        <p>
          Tirat QA is a hands-on software quality assurance practice platform designed to help aspiring and junior QA testers develop practical
          testing skills.
        </p>
        <p>We believe testing is a skill you develop by doing, observing, investigating, and learning from your results.</p>
      </PageHero>

      <section className="py-20 sm:py-28" aria-labelledby="story-title">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionTag index="1" icon={BookOpenCheck} label="Our Story" />
            <h2 id="story-title" className="h-section mt-6 text-balance">
              From Learning Testing to Practicing Testing.
            </h2>
          </Reveal>
          <Reveal delay={100} className="lead grid gap-5 self-end">
            <p>
              Learning software testing concepts is important, but understanding how to apply them can be challenging without practical experience.
            </p>
            <p>
              Tirat QA aims to bridge that gap by providing practice websites where learners can investigate behavior, identify bugs, document their
              findings, and review feedback.
            </p>
            <p>Our goal is to make practical QA training more accessible and give learners a structured way to build their confidence.</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28" aria-label="Mission and vision">
        <div className="container-x grid gap-4 md:grid-cols-2">
          {[
            {
              icon: Target,
              tone: "blue" as const,
              label: "Our Mission",
              title: "Make Practical QA Learning Accessible.",
              text: "Our mission is to help people develop useful software testing skills through accessible, structured, and hands-on learning experiences.",
            },
            {
              icon: Eye,
              tone: "lime" as const,
              label: "Our Vision",
              title: "A Future with More Confident Testers.",
              text: "We envision a world where aspiring software testers can build practical skills, improve their problem-solving abilities, and prepare for real-world testing challenges.",
            },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 100}>
              <article className="flex h-full flex-col rounded-[36px] bg-card p-8 sm:p-10">
                <AppTile icon={c.icon} tone={c.tone} size={52} />
                <p className="eyebrow mt-10 text-muted">{c.label}</p>
                <h3 className="mt-3 text-balance text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-[1.1] tracking-[-0.035em]">{c.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-muted">{c.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-20 sm:pb-28" aria-labelledby="do-title">
        <div className="container-x">
          <Reveal className="flex flex-col items-center text-center">
            <SectionTag index="2" icon={Layers} label="What We Do" />
            <h2 id="do-title" className="h-section mt-6 max-w-[700px] text-balance">
              Practice, Report, Learn, Improve.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {doing.map((d, i) => (
              <Reveal key={d.title} delay={i * 80}>
                <article className="h-full rounded-[28px] border border-line bg-card/70 p-6">
                  <AppTile icon={d.icon} tone={d.tone} size={48} />
                  <h3 className="mt-10 text-xl font-medium tracking-[-0.03em]">{d.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{d.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8" aria-labelledby="serve-title">
        <div className="container-x">
          <div className="grid gap-8 rounded-[36px] bg-card p-8 sm:p-12 lg:grid-cols-2">
            <Reveal>
              <SectionTag index="3" icon={Target} label="Who We Serve" />
              <h2 id="serve-title" className="h-section mt-6 text-balance">
                Tirat QA is designed for:
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <ul className="grid gap-3">
                {serve.map((s) => (
                  <li key={s} className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-base font-medium shadow-soft">
                    <span className="size-2 rounded-full bg-brand" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta
        label="Get Started"
        title="Start Building Your Testing Skills."
        text="Your journey toward better testing starts with practice."
        primary={{ href: "/practice-lab", label: "Explore the Practice Lab" }}
        secondary={null}
      />
    </>
  );
}
