import { Compass } from "lucide-react";
import { SectionTag } from "@/components/ui/SectionTag";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { StepsTour } from "./StepsTour";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="how-title">
      <div className="container-x">
        <Reveal className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <SectionTag index="2" icon={Compass} label="Your Practice Journey" />
          <SplitText id="how-title" className="h-section mt-6 text-balance" parts={[{ text: "Four Steps to Better Testing." }]} />
        </Reveal>
        <div className="mt-14">
          <StepsTour />
        </div>
      </div>
    </section>
  );
}
