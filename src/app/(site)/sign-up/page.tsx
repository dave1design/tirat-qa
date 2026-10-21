import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { getCurrentUser } from "@/lib/auth";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  // No redirect here: the sign-up action creates a session, and this page re-renders before the success screen is shown.
  const user = await getCurrentUser();
  return (
    <AuthShell
      eyebrow="Start your QA journey"
      title="Create Your Tirat QA Account."
      intro={
        <>
          <p>Take your first step toward building practical software testing skills.</p>
          <p className="mt-2">Create an account to access available challenges, submit bug reports, and track your progress.</p>
        </>
      }
    >
      <SignUpForm signedInAs={user?.name ?? null} />
    </AuthShell>
  );
}
