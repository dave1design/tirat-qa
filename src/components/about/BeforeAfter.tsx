import { NoteCards } from "./NoteCards";
import { Reveal } from "@/components/ui/Reveal";
import { FlowArrow } from "./FlowArrow";
import { PracticeFlow } from "./PracticeFlow";
import { getT } from "@/lib/i18n/server";

/** Comparison panels with a blue arrow joining them: rocking notes (left, light) → the practice flow (right, dark). */
export async function BeforeAfter() {
  const t = await getT();
  return (
    <section className="py-12 sm:py-20" aria-label={t("Learning versus practicing")}>
      <div className="container-x">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <p className="lead">
            {t("Learning software testing concepts is important, but understanding how to apply them can be challenging without practical experience.")}
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="relative rounded-[44px] border border-line/70 bg-[#f6f6f6] p-2">
            <div className="grid gap-2 md:grid-cols-2">
              {/* ───── before ───── */}
              <div className="relative h-[500px] overflow-hidden rounded-[36px] bg-white">
                <div className="flex items-center justify-between p-6">
                  <span className="font-mono text-[12px] uppercase tracking-wider text-muted">{t("Learning testing")}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-chip px-3 py-1.5 text-[13px] font-medium text-muted">
                    <span className="size-2 rounded-full bg-orange" /> {t("Theory only")}
                  </span>
                </div>
                <NoteCards />
                <p className="absolute inset-x-6 bottom-6 text-center text-[14px] text-muted">{t("Concepts, definitions and notes — without anywhere to apply them.")}</p>
              </div>

              {/* ───── after ───── */}
              <div className="relative h-[500px] overflow-hidden rounded-[36px] bg-[#141414] text-white">
                <div className="flex items-center justify-between p-6">
                  <span className="font-mono text-[12px] uppercase tracking-wider text-white/55">{t("Practicing testing")}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium">
                    <span className="size-2 rounded-full bg-green" /> {t("Hands-on")}
                  </span>
                </div>
                <PracticeFlow />
                <p className="absolute inset-x-6 bottom-6 text-center text-[14px] text-white/60">{t("Investigate, identify, document and improve — on real practice websites.")}</p>
              </div>
            </div>

            {/* the arrow that joins the two panels: shuffles the notes, replays the flow */}
            <FlowArrow />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
