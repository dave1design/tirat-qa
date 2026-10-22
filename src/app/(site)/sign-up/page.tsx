import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { getCurrentUser } from "@/lib/auth";
import { SignUpForm } from "./SignUpForm";
import { getT } from "@/lib/i18n/server";
import { socialProviders } from "@/lib/social";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  const t = await getT();
  // No redirect here: the sign-up action creates a session, and this page re-renders before the success screen is shown.
  const user = await getCurrentUser();
  return (
    <AuthShell
      backdrop
      title={t("Welcome to Tirat QA")}
      intro={<p>{t("Find bugs. Build real testing skills.")}</p>}
    >
      <SignUpForm signedInAs={user?.name ?? null} providers={socialProviders()} />
    </AuthShell>
  );
}
