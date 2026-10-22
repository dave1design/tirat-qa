"use client";

import { useFormStatus } from "react-dom";
import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

export interface FormState {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
  data?: Record<string, string>;
}

export function FormMessage({ state }: { state: FormState }) {
  const t = useT();
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={cn("rounded-2xl px-4 py-3 text-[15px]", state.ok ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad")}
    >
      {t(state.message)}
    </p>
  );
}

function Wrap({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  const t = useT();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-medium tracking-[-0.01em]">
        {t(label)}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {t(hint)}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-sm text-bad">
          {t(error)}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  name,
  error,
  hint,
  className,
  ...rest
}: { label: string; name: string; error?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const t = useT();
  const id = useId();
  return (
    <Wrap id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={cn("field", className)}
        {...rest}
        placeholder={rest.placeholder ? t(rest.placeholder) : undefined}
      />
    </Wrap>
  );
}

export function TextArea({
  label,
  name,
  error,
  hint,
  className,
  ...rest
}: { label: string; name: string; error?: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const t = useT();
  const id = useId();
  return (
    <Wrap id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={cn("field min-h-32 resize-y", className)}
        {...rest}
        placeholder={rest.placeholder ? t(rest.placeholder) : undefined}
      />
    </Wrap>
  );
}

export function SelectField({
  label,
  name,
  error,
  hint,
  children,
  ...rest
}: { label: string; name: string; error?: string; hint?: string; children: ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Wrap id={id} label={label} hint={hint} error={error}>
      <select id={id} name={name} aria-invalid={!!error} className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23707070%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10" {...rest}>
        {children}
      </select>
    </Wrap>
  );
}

export function Checkbox({ name, error, children, defaultChecked }: { name: string; error?: string; children: ReactNode; defaultChecked?: boolean }) {
  const t = useT();
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[15px] leading-snug text-ink-2">
        <input id={id} type="checkbox" name={name} defaultChecked={defaultChecked} aria-invalid={!!error} className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md border-line accent-ink" />
        <span>{typeof children === "string" ? t(children) : children}</span>
      </label>
      {error && (
        <p role="alert" className="text-sm text-bad">
          {t(error)}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingText = "Please wait…",
  className,
  variant = "dark",
  arrow,
}: {
  children: ReactNode;
  pendingText?: string;
  className?: string;
  variant?: "dark" | "brand" | "light";
  arrow?: boolean;
}) {
  const t = useT();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} arrow={arrow && !pending} disabled={pending} aria-busy={pending} className={className}>
      {pending ? t(pendingText) : typeof children === "string" ? t(children) : children}
    </Button>
  );
}
