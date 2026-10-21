import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Flash({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null;
  return (
    <p role={error ? "alert" : "status"} className={cn("mb-6 rounded-2xl px-4 py-3 text-[15px]", error ? "bg-bad-soft text-bad" : "bg-ok-soft text-ok")}>
      {error ?? ok}
    </p>
  );
}

export function AdminHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">{title}</h1>
      {children}
    </div>
  );
}

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[28px] border border-line bg-white p-6", className)}>
      {title && <h2 className="mb-4 text-lg font-semibold tracking-[-0.02em]">{title}</h2>}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-[28px] bg-card p-6">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-4xl font-semibold tracking-[-0.05em]">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export const input = "field !py-2.5 !text-[15px]";
export const labelCls = "grid gap-1.5 text-sm font-medium";

export function Tag({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "green" | "blue" | "red" | "amber" }) {
  const tones = { gray: "bg-chip text-muted", green: "bg-ok-soft text-ok", blue: "bg-[#e6efff] text-brand", red: "bg-bad-soft text-bad", amber: "bg-[#fff4e5] text-[#b45309]" };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}
