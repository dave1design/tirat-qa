import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

export function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title}>
        <p>{intro}</p>
      </PageHero>
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-[720px]">
            <p className="mb-10 rounded-2xl bg-card px-5 py-4 text-sm text-muted">
              <strong className="font-medium text-ink">Draft.</strong> This page is a content draft pending legal review. Sections marked “to be confirmed” must be
              completed to match the platform&apos;s actual practices before launch.
            </p>
            <div className="prose-tirat">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
