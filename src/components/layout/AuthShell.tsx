import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/ui/Logo";
import { AuthScene } from "./AuthScene";

/** Sign-in style pages: an illustrated panel beside a white card with the logo, headline and form. */
export function AuthShell({ eyebrow, title, children, intro }: { eyebrow?: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="hero-bg min-h-[calc(100vh-1px)] px-3 pb-10 pt-28 sm:px-5 sm:pt-32">
      <Reveal className="mx-auto max-w-[1120px]">
        <div className="grid gap-3 rounded-[40px] border border-line bg-white/70 p-3 shadow-soft backdrop-blur lg:grid-cols-[1.05fr_1fr]">
          <div className="hidden lg:block">
            <AuthScene />
          </div>
          <div className="auth-card flex flex-col justify-center rounded-[32px] bg-white px-6 py-10 sm:px-12 sm:py-14">
            <div className="flex justify-center">
              <Logo />
            </div>
            {eyebrow && (
              <p className="mt-6 text-center">
                <span className="inline-flex h-[30px] items-center rounded-lg border border-line bg-white px-3 text-[12px] font-medium uppercase tracking-[0.06em]">{eyebrow}</span>
              </p>
            )}
            <h1 className="h-section mt-6 text-center !text-[clamp(2rem,4vw,2.9rem)] text-balance">{title}</h1>
            {intro && <div className="lead mx-auto mt-4 max-w-[400px] text-center !text-[0.98rem]">{intro}</div>}
            <div className="mx-auto mt-8 w-full max-w-[400px]">{children}</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
