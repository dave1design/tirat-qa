"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/actions/auth";
import { FormMessage, SubmitButton, TextField, type FormState } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";

const initial: FormState = {};

export function ForgotForm() {
  const [state, action] = useActionState(forgotPasswordAction, initial);
  if (state.ok) {
    return (
      <div className="py-2 text-center" role="status">
        <h2 className="text-3xl font-semibold tracking-[-0.04em]">Check Your Email</h2>
        <p className="mt-3 text-muted">If an account exists for that email address, password reset instructions will be sent to you.</p>
        <p className="mt-2 text-muted">Follow the instructions to create a new password.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/login" variant="light">
            Back to Log In
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
