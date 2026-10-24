import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { BeforeAfter } from "@/components/about/BeforeAfter";
import { StoryTimeline } from "@/components/about/StoryTimeline";
import { ValuesGrid } from "@/components/about/ValuesGrid";
import { VisionBand } from "@/components/about/VisionBand";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = { title: "About", description: "Tirat makes software testing skills practical." };

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <BeforeAfter />
      <StoryTimeline />
      <ValuesGrid />
      <VisionBand />
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
