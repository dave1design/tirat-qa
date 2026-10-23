import Link from "next/link";
import { Check, ChevronRight, Lock } from "lucide-react";
import type { Level } from "@/content/curriculum";
import { getT } from "@/lib/i18n/server";
import { AdvancedAccessForm } from "./AdvancedAccessForm";

/** Shown instead of a level page when the learner has not paid for Levels 5 to 8 yet. */
export async function AdvancedPaywall({ levels, priceEtb, pendingRef }: { levels: Level[]; priceEtb: number; pendingRef: string | null }) {
  const t = await getT();
  const lessons = levels.reduce((n, l) => n + l.lessons.length, 0);
  return (
    <div className="pb-20">
      <section className="bg-ink pb-12 pt-32 text-white sm:pt-40 lg:pb-16">
        <div className="container-x max-w-[900px]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-medium text-[#9ec5ff]">
            <Link href="/learn#roadmap" className="hover:underline">{t("Learning roadmap")}</Link>
            <ChevronRight className="size-3.5 text-white/40" aria-hidden />
            <span>{t("Advanced levels")}</span>
          </nav>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm">
            <Lock className="size-4" aria-hidden /> {t("Paid levels")}
          </p>
          <h1 className="mt-4 text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance">{t("Unlock Levels 5 to 8 with one payment.")}</h1>
          <p className="mt-4 max-w-[640px] text-[18px] leading-snug text-white/80">
            {t("Levels 1 to 4 are free. The advanced levels are a single one-time payment, with no subscription and no extra charge per level.")}
          </p>
        </div>
      </section>

      <div className="container-x mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
        <section aria-labelledby="inc-title">
          <h2 id="inc-title" className="text-[1.5rem] font-semibold tracking-[-0.03em]">
            {t("What you get")}
          </h2>
          <p className="mt-2 text-sm text-muted">{t("{n} lessons", { n: lessons })} · {t("4 levels, each with a timed exam and interview preparation")}</p>
          <ul className="mt-6 grid gap-3">
            {levels.map((l) => (
              <li key={l.n} className="rounded-2xl border border-line p-5">
                <p className="font-semibold">
                  {t("Level")} {l.n}: {l.title}
                </p>
                <p className="mt-1 text-[15px] text-ink-2">{l.goal}</p>
                <ul className="mt-3 grid gap-1.5 text-[14.5px] text-ink-2">
                  {l.lessons.map((x) => (
                    <li key={x.slug} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={3} aria-hidden /> {x.n} {x.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-float">
            <p className="text-sm text-muted">{t("One payment, all four levels")}</p>
            <p className="mt-1 text-4xl font-semibold tracking-[-0.04em]">{priceEtb.toLocaleString("en-US")} ETB</p>
            <ol className="mt-5 grid gap-2.5 text-[14.5px] text-ink-2">
              <li>{t("1. Pay using the method shared by our team.")}</li>
              <li>{t("2. Enter the payment reference from your receipt below.")}</li>
              <li>{t("3. We confirm it and unlock Levels 5 to 8.")}</li>
            </ol>
            <div className="mt-6 border-t border-line pt-6">
              {pendingRef ? (
                <p role="status" className="rounded-2xl bg-card px-4 py-3 text-[15px]">
                  {t("Your payment is pending confirmation (reference {ref}). We'll unlock access as soon as it's verified.", { ref: pendingRef })}
                </p>
              ) : (
                <AdvancedAccessForm />
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
