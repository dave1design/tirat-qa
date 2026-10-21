import { Bug } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WordReveal } from "@/components/ui/WordReveal";
import { Reveal } from "@/components/ui/Reveal";
import { AppTile } from "@/components/ui/AppTile";


export function Intro() {
  return (
    <section className="py-28 sm:py-44" aria-labelledby="intro-eyebrow">
      <div className="container-x">
        <p id="intro-eyebrow" className="eyebrow mb-8 text-center text-muted">
          Welcome to Tirat QA
        </p>
        <WordReveal
          text="Learn QA by Doing, Not Just Watching. Reading about software testing is a good start. But becoming a better tester takes practice."
          icon={<AppTile icon={Bug} tone="blue" size={56} />}
          iconAfter={3}
          className="mx-auto max-w-[960px] text-balance text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.18] tracking-[-0.04em]"
        />
        <Reveal className="mx-auto mt-12 max-w-[640px] text-center">
          <p className="lead">
            Tirat QA gives you a dedicated environment to explore websites, investigate unexpected behavior, identify bugs, and write structured bug
            reports.
          </p>
          <p className="lead mt-4">
            Whether you&apos;re starting your QA journey or sharpening your existing skills, every challenge gives you an opportunity to improve.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/practice-lab" variant="light" arrow>
              Explore the Practice Lab
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
