"use client";

import { useActionState } from "react";
import { requestAccessAction } from "@/actions/practice";
import { FormMessage, SubmitButton, TextField, type FormState } from "@/components/ui/form";

const initial: FormState = {};

export function RequestAccessForm({ websiteId, levelId }: { websiteId: string; levelId: string }) {
  const [state, action] = useActionState(requestAccessAction.bind(null, websiteId, levelId), initial);
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
