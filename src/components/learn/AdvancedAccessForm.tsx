"use client";

import { useActionState } from "react";
import { requestAdvancedAccessAction } from "@/actions/learn-access";
import { FormMessage, SubmitButton, TextField, type FormState } from "@/components/ui/form";

const initial: FormState = {};

/** Submit the receipt reference for the one-time payment; the team confirms it and unlocks Levels 5 to 8. */
export function AdvancedAccessForm() {
  const [state, action] = useActionState(requestAdvancedAccessAction, initial);
  if (state.ok) {
    return (
      <p role="status" className="rounded-2xl bg-ok-soft px-4 py-3 text-ok">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action} noValidate className="grid gap-4">
      <FormMessage state={state} />
      <TextField label="Payment reference" name="reference" placeholder="Receipt or transaction number" defaultValue={state.values?.reference} error={state.errors?.reference} />
      <TextField label="Note (optional)" name="note" placeholder="Anything we should know?" />
      <SubmitButton pendingText="Sending…">Submit Payment Reference</SubmitButton>
    </form>
  );
}
