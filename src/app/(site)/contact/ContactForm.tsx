"use client";

import { useActionState } from "react";
import { contactAction } from "@/actions/contact";
import { FormMessage, SubmitButton, TextArea, TextField, type FormState } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/client";

const initial: FormState = {};

export function ContactForm({ defaults }: { defaults?: { name?: string; email?: string } }) {
  const t = useT();
  const [state, action] = useActionState(contactAction, initial);

  if (state.ok) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
        <h3 className="text-3xl font-semibold tracking-[-0.04em]">{t("Message Sent Successfully")}</h3>
        <p className="mt-3 text-muted">{t("Thank you for contacting Tirat QA. Your message has been received.")}</p>
        <div className="mt-8">
          <Button href="/">{t("Back to Home")}</Button>
        </div>
      </div>
    );
  }

  const e = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} noValidate className="grid gap-4">
      <h3 className="text-xl font-medium tracking-[-0.03em]">{t("Send Us a Message")}</h3>
      <FormMessage
        state={
          state.message
            ? state
            : Object.keys(e).length
              ? { message: "We couldn't send your message. Please check your details and try again." }
              : {}
        }
      />
      <TextField label="Full Name" name="name" placeholder="Enter your full name" autoComplete="name" defaultValue={v.name ?? defaults?.name} error={e.name} />
      <TextField label="Email Address" name="email" type="email" placeholder="Enter your email address" autoComplete="email" defaultValue={v.email ?? defaults?.email} error={e.email} />
      <TextField label="Subject" name="subject" placeholder="What is your message about?" defaultValue={v.subject} error={e.subject} />
      <TextArea label="Message" name="message" placeholder="Tell us how we can help..." defaultValue={v.message} error={e.message} />
      <SubmitButton pendingText="Sending…" arrow className="w-full">
        Send Message
      </SubmitButton>
    </form>
  );
}
