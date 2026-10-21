"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction } from "@/actions/auth";
import { Checkbox, FormMessage, SubmitButton, TextField, type FormState } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { PASSWORD_HINT } from "@/lib/validation";

const initial: FormState = {};

export function SignUpForm({ signedInAs }: { signedInAs: string | null }) {
  const [state, action] = useActionState(signUpAction, initial);

  if (state.ok) {
    return (
      <div className="py-4 text-center" role="status">
        <h2 className="text-3xl font-semibold tracking-[-0.04em]">Welcome to Tirat QA!</h2>
        <p className="mt-3 text-muted">Your account is ready. Let&apos;s personalize your experience and get you started with practice.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/onboarding" arrow>
            Continue to Onboarding
          </Button>
        </div>
      </div>
    );
  }

  if (signedInAs) {
    return (
      <div className="py-4 text-center">
        <p className="text-lg font-medium">You&apos;re already logged in as {signedInAs}.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/dashboard" arrow>
            Go to My Dashboard
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
        I agree to the{" "}
        <Link href="/terms" className="font-medium text-ink underline underline-offset-2">
          Terms of Service
        </Link>{" "}
        and have read the{" "}
        <Link href="/privacy-policy" className="font-medium text-ink underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <SubmitButton pendingText="Creating account…" className="w-full">
        Create Account
      </SubmitButton>
      <p className="text-center text-[15px] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-2">
          Log In
        </Link>
      </p>
    </form>
  );
}
