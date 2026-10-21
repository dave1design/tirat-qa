import { BadgeCheck } from "lucide-react";
import { HangingIcons } from "./HangingIcons";
import { Button } from "@/components/ui/Button";
import { FolderCards } from "./FolderCards";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

export function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden pb-24 pt-[310px] sm:pb-28 sm:pt-[260px]">
      <HangingIcons />
      <div className="container-x relative">
        <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 text-sm font-medium">
              <span className="inline-flex h-[34px] items-center rounded-lg bg-brand px-2.5 text-lime">
                <BadgeCheck className="size-[18px]" fill="currentColor" stroke="#0066ff" strokeWidth={2} aria-hidden />
              </span>
              <span className="inline-flex h-[34px] items-center rounded-lg border border-line bg-white px-3 text-[12px] font-medium uppercase tracking-[0.06em]">
                Your QA journey starts here
              </span>
            </div>
          </Reveal>
          <div>
            <SplitText
              as="h1"
              className="h-display mt-7 text-balance"
              stagger={90}
              parts={[{ text: "Don't Just Learn Testing." }, { text: "Practice It.", className: "text-brand" }]}
            />
          </div>
          <Reveal delay={160}>
            <p className="lead mx-auto mt-6 max-w-[620px]">
              Discover bugs, test real-world scenarios, and build practical software testing skills through hands-on website challenges.
            </p>
            <p className="lead mx-auto mt-3 max-w-[620px]">Turn your QA knowledge into real testing experience, one bug at a time.</p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            <Button href="/practice-lab">Start Practicing</Button>
            <Button href="#how-it-works" variant="light" arrow>
              Explore How It Works
            </Button>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 text-sm font-medium text-muted">Learn. Test. Report. Improve.</p>
          </Reveal>
        </div>
      </div>
      <FolderCards />
    </section>
  );
}
