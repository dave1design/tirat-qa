import type { Metadata } from "next";
import { Check, MessageCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Questions about Tirat QA, your account, the Practice Lab or your results? Send us a message." };

const categories = [
  { title: "Account Support", text: "Need help accessing your account or updating your details? Tell us what happened." },
  { title: "Practice Lab Support", text: "Experiencing an issue with a practice website or challenge? Describe the problem so we can investigate." },
  { title: "Results and Feedback", text: "Have a question about a submitted bug report or challenge result? Include the relevant challenge details." },
  { title: "Partnerships and Training", text: "Interested in discussing QA training, educational collaboration, or other opportunities? We'd like to hear from you." },
];

export default async function ContactPage() {
  const user = await getCurrentUser();
  return (
    <section className="hero-bg pb-8 pt-32 sm:pt-40">
      <div className="container-x">
        <div className="grid gap-10 rounded-[40px] bg-[#141414] p-7 text-white sm:p-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <Reveal>
            <SectionTag index="1" icon={MessageCircle} label="Contact Us" />
            <h1 className="mt-6 text-balance text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.045em]">We&apos;re Here to Help.</h1>
            <p className="mt-5 max-w-[460px] text-lg text-white/65">Have a question about Tirat QA, your account, the Practice Lab, or your results?</p>
            <p className="mt-3 max-w-[460px] text-lg text-white/65">Send us a message and tell us how we can help.</p>
            <ul className="mt-10 grid gap-5">
              {categories.map((c) => (
                <li key={c.title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-lime">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-medium tracking-[-0.02em]">{c.title}</h2>
                    <p className="mt-0.5 text-[15px] text-white/55">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[28px] bg-card p-6 text-ink sm:p-8">
              <ContactForm defaults={{ name: user?.name, email: user?.email }} />
            </div>
          </Reveal>
        </div>
        <p className="mx-auto mt-10 max-w-[560px] text-center text-muted">
          We&apos;re working to make QA practice more accessible, useful, and straightforward.
          <br />
          Thank you for being part of the Tirat QA journey.
        </p>
      </div>
    </section>
  );
}
