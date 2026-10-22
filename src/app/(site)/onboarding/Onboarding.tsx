"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import { onboardingAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { EXPERIENCE_LEVELS, LEARNING_GOALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { FormState } from "@/components/ui/form";
import { useT } from "@/lib/i18n/client";

const initial: FormState = {};

export function Onboarding({ firstName }: { firstName: string }) {
  const t = useT();
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");
  const [state, action, pending] = useActionState(onboardingAction, initial);

  const done = state.ok;

  return (
    <section className="hero-bg min-h-screen pb-20 pt-32 sm:pt-44">
      <div className="container-x">
        <div className="mx-auto max-w-[640px]">
          {!done && (
            <p className="mb-6 text-center text-sm font-medium text-muted" aria-live="polite">
              {t("Step {n} of 3", { n: step })}
            </p>
          )}
          <div className="rounded-[36px] border border-line bg-white p-7 shadow-soft sm:p-10">
            {done ? (
              <div className="text-center" role="status">
                <h1 className="h-section !text-[clamp(2rem,4vw,2.75rem)] text-balance">{t("You're Ready to Practice!")}</h1>
                <p className="lead mt-4">{t("Your next step is to choose a practice level and start exploring a website.")}</p>
                <p className="lead mt-2">{t("Learn through experience, document what you find, and use your feedback to improve.")}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                  <Button href="/practice-lab">{t("Explore Practice Lab")}</Button>
                  <Button href="/learn" variant="light" arrow>
                    {t("Explore Learning Resources")}
                  </Button>
                </div>
              </div>
            ) : (
              <form action={action}>
                <input type="hidden" name="experienceLevel" value={experience} />
                <input type="hidden" name="learningGoal" value={goal} />

                {step === 1 && (
                  <div className="text-center">
                    <h1 className="h-section !text-[clamp(2rem,4vw,2.75rem)]">{t("Welcome to Tirat QA")}{firstName ? `, ${firstName}` : ""}!</h1>
                    <p className="lead mt-4">{t("You're here to build practical QA skills. We'll help you get started with hands-on website testing.")}</p>
                    <p className="lead mt-2">{t("Explore challenges, discover bugs, submit reports, and learn from your results.")}</p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                      <Button onClick={() => setStep(2)}>{t("Let's Get Started")}</Button>
                      <SkipButton label={t("Skip Introduction")} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h1 className="h-section !text-[clamp(1.8rem,3.6vw,2.4rem)] text-center">{t("Where Are You in Your QA Journey?")}</h1>
                    <p className="lead mt-3 text-center text-base">{t("Choose the option that best describes your experience.")}</p>
                    <div role="radiogroup" aria-label={t("Experience level")} className="mt-7 grid gap-3">
                      {EXPERIENCE_LEVELS.map((o) => (
                        <Choice key={o.value} selected={experience === o.value} onSelect={() => setExperience(o.value)} title={t(o.title)} text={t(o.text)} />
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                      <Button onClick={() => setStep(3)}>{t("Continue")}</Button>
                      <SkipButton label={t("Skip")} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h1 className="h-section !text-[clamp(1.8rem,3.6vw,2.4rem)] text-center">{t("What Would You Like to Improve?")}</h1>
                    <p className="lead mt-3 text-center text-base">{t("Choose the skill you want to focus on first.")}</p>
                    <div role="radiogroup" aria-label={t("Learning goal")} className="mt-7 grid gap-3">
                      {LEARNING_GOALS.map((o) => (
                        <Choice key={o.value} selected={goal === o.value} onSelect={() => setGoal(o.value)} title={t(o.title)} />
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                      <Button type="submit" disabled={pending} arrow>
                        {pending ? t("Saving…") : t("Go to My Practice Lab")}
                      </Button>
                      <SkipButton label={t("Skip")} />
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Submitting the form with whatever has been chosen so far completes onboarding. */
function SkipButton({ label }: { label: string }) {
  return (
    <Button type="submit" variant="ghost">
      {label}
    </Button>
  );
}

function Choice({ selected, onSelect, title, text }: { selected: boolean; onSelect: () => void; title: string; text?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-5 text-left transition-colors",
        selected ? "border-ink bg-card" : "border-line hover:bg-card/70",
      )}
    >
      <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full border", selected ? "border-ink bg-ink text-white" : "border-faint")}>
        {selected && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
      </span>
      <span>
        <span className="block font-medium tracking-[-0.02em]">{title}</span>
        {text && <span className="mt-0.5 block text-[15px] text-muted">{text}</span>}
      </span>
    </button>
  );
}
