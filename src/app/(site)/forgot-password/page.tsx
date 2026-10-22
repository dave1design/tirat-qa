import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { ForgotForm } from "./ForgotForm";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Forgot Password" };

export default async function ForgotPasswordPage() {
  const t = await getT();
  return (
    <AuthShell
      title={t("Forgot Your Password?")}
      intro={<p>{t("It happens. Enter the email address associated with your account and we'll guide you through resetting your password.")}</p>}
    >
      <ForgotForm />
    </AuthShell>
  );
}
