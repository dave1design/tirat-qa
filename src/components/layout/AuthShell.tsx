import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { LogoMark } from "@/components/ui/Logo";
import { AuthBackdrop } from "./AuthBackdrop";

/**
 * Sign-in pages in the style of Pinterest's: one centered white card with the logo, a friendly headline, the form and a
 * switch link. The sign-up page puts a colourful tile collage behind the card.
 */
export function AuthShell({ title, children, intro, backdrop }: { title: string; intro?: ReactNode; children: ReactNode; backdrop?: boolean; eyebrow?: string }) {
  return (
    <section className="relative isolate min-h-[calc(100vh-1px)] bg-white px-3 pb-12 pt-28 sm:pt-32">
      {backdrop && <AuthBackdrop />}
      <Reveal className="mx-auto w-full max-w-[484px]">
        <div className="auth-card rounded-[32px] bg-white px-6 py-9 shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:px-10 sm:py-10">
          <div className="flex justify-center">
            <LogoMark size={48} />
          </div>
          <h1 className="mt-5 text-center text-[clamp(1.8rem,3.4vw,2.2rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-balance">{title}</h1>
          {intro && <div className="mx-auto mt-2 max-w-[340px] text-center text-[1rem] leading-snug text-muted">{intro}</div>}
          <div className="mt-6">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}
