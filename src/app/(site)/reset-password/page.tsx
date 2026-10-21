import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = { title: "Reset Password" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthShell title="Create a New Password." intro={<p>Choose a new password to secure your Tirat QA account.</p>}>
      {token ? (
        <ResetForm token={token} />
      ) : (
        <div className="text-center">
          <p className="text-muted">This reset link is invalid or has expired. Request a new one.</p>
          <div className="mt-6 flex justify-center">
            <Button href="/forgot-password">Request a new link</Button>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
