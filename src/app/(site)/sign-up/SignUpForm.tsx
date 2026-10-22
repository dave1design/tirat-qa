"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction } from "@/actions/auth";
import { Checkbox, FormMessage, SubmitButton, TextField, type FormState } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { PASSWORD_HINT } from "@/lib/validation";
import { useT } from "@/lib/i18n/client";

const initial: FormState = {};

export function SignUpForm({ signedInAs }: { signedInAs: string | null }) {
  const t = useT();
  const [state, action] = useActionState(signUpAction, initial);

  if (state.ok) {
    return (
      <div className="py-4 text-center" role="status">
        <h2 className="text-3xl font-semibold tracking-[-0.04em]">{t("Welcome to Tirat QA!")}</h2>
        <p className="mt-3 text-muted">{t("Your account is ready. Let's personalize your experience and get you started with practice.")}</p>
        <div className="mt-8 flex justify-center">
          <Button href="/onboarding" arrow>
            {t("Continue to Onboarding")}
          </Button>
        </div>
      </div>
    );
  }

  if (signedInAs) {
    return (
      <div className="py-4 text-center">
        <p className="text-lg font-medium">{t("You're already logged in as {name}.", { name: signedInAs })}</p>
        <div className="mt-6 flex justify-center">
          <Button href="/dashboard" arrow>
            {t("Go to My Dashboard")}
          </Button>
        </div>
      </div>
    );
  }

  const e = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} noValidate className="grid gap-5">
      <FormMessage state={state} />
      <TextField label="Full Name" name="name" placeholder="Enter your full name" autoComplete="name" defaultValue={v.name} error={e.name} />
      <TextField label="Email Address" name="email" type="email" placeholder="Enter your email address" autoComplete="email" defaultValue={v.email} error={e.email} />
      <TextField label="Password" name="password" type="password" placeholder="Create a password" autoComplete="new-password" hint={PASSWORD_HINT} error={e.password} />
      <TextField label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter your password" autoComplete="new-password" error={e.confirmPassword} />
      <Checkbox name="terms" error={e.terms} defaultChecked={v.terms === "on"}>
        {t("I agree to the")}{" "}
        <Link href="/terms" className="font-medium text-ink underline underline-offset-2">
          {t("Terms of Service")}
        </Link>{" "}
        {t("and have read the")}{" "}
        <Link href="/privacy-policy" className="font-medium text-ink underline underline-offset-2">
          {t("Privacy Policy")}
        </Link>
        .
      </Checkbox>
      <SubmitButton pendingText="Creating account…" className="w-full">
        Create Account
      </SubmitButton>
      <p className="text-center text-[15px] text-muted">
        {t("Already have an account?")}{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-2">
          {t("Log In")}
        </Link>
      </p>
    </form>
  );
}
