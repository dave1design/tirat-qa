"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { Checkbox, FormMessage, SubmitButton, TextField, type FormState } from "@/components/ui/form";

const initial: FormState = {};

export function LoginForm({ next, expired }: { next?: string; expired?: boolean }) {
  const [state, action] = useActionState(loginAction, initial);
  const e = state.errors ?? {};
  const message = state.message ?? (expired ? "Your session has expired. Please log in again." : undefined);
  return (
    <form action={action} noValidate className="grid gap-5">
      <FormMessage state={{ ...state, message }} />
      {next && <input type="hidden" name="next" value={next} />}
      <TextField label="Email Address" name="email" type="email" placeholder="Enter your email address" autoComplete="email" defaultValue={state.values?.email} error={e.email} />
      <TextField label="Password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" error={e.password} />
      <div className="flex items-center justify-between gap-4">
        <Checkbox name="remember">Remember me</Checkbox>
        <Link href="/forgot-password" className="text-[15px] font-medium text-ink underline underline-offset-2">
          Forgot password?
        </Link>
      </div>
      <SubmitButton pendingText="Logging in…" className="w-full">
        Log In
      </SubmitButton>
      <p className="text-center text-[15px] text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-ink underline underline-offset-2">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
