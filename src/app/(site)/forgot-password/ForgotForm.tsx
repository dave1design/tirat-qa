"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/actions/auth";
import { FormMessage, SubmitButton, TextField, type FormState } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/client";

const initial: FormState = {};

export function ForgotForm() {
  const t = useT();
  const [state, action] = useActionState(forgotPasswordAction, initial);
  if (state.ok) {
    return (
      <div className="py-2 text-center" role="status">
        <h2 className="text-3xl font-semibold tracking-[-0.04em]">{t("Check Your Email")}</h2>
        <p className="mt-3 text-muted">{t("If an account exists for that email address, password reset instructions will be sent to you.")}</p>
        <p className="mt-2 text-muted">{t("Follow the instructions to create a new password.")}</p>
        <div className="mt-8 flex justify-center">
          <Button href="/login" variant="light">
            {t("Back to Log In")}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <form action={action} noValidate className="grid gap-5">
      <FormMessage state={state} />
      <TextField label="Email Address" name="email" type="email" placeholder="Enter your registered email address" autoComplete="email" defaultValue={state.values?.email} error={state.errors?.email} />
      <SubmitButton pendingText="Sending…" className="w-full">
        Send Reset Instructions
      </SubmitButton>
    </form>
  );
}
