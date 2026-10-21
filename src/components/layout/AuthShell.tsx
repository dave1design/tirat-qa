import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function AuthShell({ eyebrow, title, children, intro }: { eyebrow?: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="hero-bg min-h-[calc(100vh-1px)] pb-20 pt-32 sm:pt-40">
      <div className="container-x">
        <Reveal className="mx-auto max-w-[480px]">
          {eyebrow && (
            <p className="mb-4 text-center">
              <span className="inline-flex h-[30px] items-center rounded-lg border border-line bg-white px-3 text-[12px] font-medium uppercase tracking-[0.06em]">{eyebrow}</span>
            </p>
          )}
          <h1 className="h-section text-center !text-[clamp(2rem,4.5vw,3rem)] text-balance">{title}</h1>
          {intro && <div className="lead mx-auto mt-4 text-center text-[1.05rem]">{intro}</div>}
          <div className="mt-8 rounded-[32px] border border-line bg-white p-6 shadow-soft sm:p-8">{children}</div>
        </Reveal>
      </div>
    </section>
  );
}
