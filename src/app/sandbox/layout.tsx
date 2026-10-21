import type { Metadata } from "next";

// Practice applications are intentionally imperfect and must not be indexed.
export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Practice website" };

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-sans text-slate-900">{children}</div>;
}
