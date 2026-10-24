import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/layout/AuthShell";
import { getCurrentUser } from "@/lib/auth";
import { safeNext } from "@/lib/utils";
import { LoginForm } from "./LoginForm";
import { getT } from "@/lib/i18n/server";
import { socialProviders } from "@/lib/social";

export const metadata: Metadata = { title: "Log In" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; expired?: string; social?: string }> }) {
  const t = await getT();
  const sp = await searchParams;
  const next = sp.next ? safeNext(sp.next, "") : "";
  if (await getCurrentUser()) redirect(next || "/dashboard");
  return (
    <AuthShell
      title={t("Welcome to Tirat")}
      intro={<p>{t("Log in to continue building your testing skills.")}</p>}
    >
      <LoginForm next={next || undefined} expired={sp.expired === "1"} social={sp.social} providers={socialProviders()} />
    </AuthShell>
  );
}
