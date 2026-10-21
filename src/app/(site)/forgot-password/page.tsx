import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { ForgotForm } from "./ForgotForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot Your Password?"
      intro={<p>It happens. Enter the email address associated with your account and we&apos;ll guide you through resetting your password.</p>}
    >
      <ForgotForm />
    </AuthShell>
  );
}
