"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/actions/auth";
import { FormMessage, SubmitButton, TextField, type FormState } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { PASSWORD_HINT } from "@/lib/validation";

const initial: FormState = {};

export function ResetForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordAction, initial);
  if (state.ok) {
    return (
      <div className="py-2 text-center" role="status">
        <p className="text-lg font-medium">Your password has been updated successfully.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/login">Log In</Button>
        </div>
      </div>
    );
  }
  const e = state.errors ?? {};
  return (
    <form action={action} noValidate className="grid gap-5">
      <FormMessage state={state} />
      <input type="hidden" name="token" value={token} />
      <TextField label="New Password" name="password" type="password" placeholder="Enter your new password" autoComplete="new-password" hint={PASSWORD_HINT} error={e.password} />
      <TextField label="Confirm New Password" name="confirmPassword" type="password" placeholder="Re-enter your new password" autoComplete="new-password" error={e.confirmPassword} />
      <SubmitButton pendingText="Saving…" className="w-full">
        Reset Password
      </SubmitButton>
    </form>
  );
}
