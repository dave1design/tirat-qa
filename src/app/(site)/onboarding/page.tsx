import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { Onboarding } from "./Onboarding";

export const metadata: Metadata = { title: "Welcome", robots: { index: false } };

export default async function OnboardingPage() {
  const user = await requireUser("/onboarding");
  return <Onboarding firstName={user.name.split(" ")[0]} />;
}
