import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { getCurrentUser } from "@/lib/auth";
import { SignUpForm } from "./SignUpForm";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  const t = await getT();
  // No redirect here: the sign-up action creates a session, and this page re-renders before the success screen is shown.
  const user = await getCurrentUser();
  return (
    <AuthShell
      eyebrow={t("Start your QA journey")}
      title={t("Create Your Tirat QA Account.")}
      intro={
        <>
          <p>{t("Take your first step toward building practical software testing skills.")}</p>
          <p className="mt-2">{t("Create an account to access available challenges, submit bug reports, and track your progress.")}</p>
        </>
      }
    >
      <SignUpForm signedInAs={user?.name ?? null} />
    </AuthShell>
  );
}
