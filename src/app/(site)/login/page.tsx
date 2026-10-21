import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/layout/AuthShell";
import { getCurrentUser } from "@/lib/auth";
import { safeNext } from "@/lib/utils";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log In" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; expired?: string }> }) {
  const sp = await searchParams;
  const next = sp.next ? safeNext(sp.next, "") : "";
  if (await getCurrentUser()) redirect(next || "/dashboard");
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Continue Your QA Journey."
      intro={<p>Log in to access your practice challenges, review your progress, and continue building your testing skills.</p>}
    >
      <LoginForm next={next || undefined} expired={sp.expired === "1"} />
    </AuthShell>
  );
}
