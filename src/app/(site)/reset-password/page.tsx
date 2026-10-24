import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { ResetForm } from "./ResetForm";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Reset Password" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const t = await getT();
  const { token } = await searchParams;
  return (
    <AuthShell title={t("Create a New Password.")} intro={<p>{t("Choose a new password to secure your Tirat account.")}</p>}>
      {token ? (
        <ResetForm token={token} />
      ) : (
        <div className="text-center">
          <p className="text-muted">{t("This reset link is invalid or has expired. Request a new one.")}</p>
          <div className="mt-6 flex justify-center">
            <Button href="/forgot-password">{t("Request a new link")}</Button>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
