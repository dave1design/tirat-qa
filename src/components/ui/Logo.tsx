import Link from "next/link";
import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 44 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-ink text-white", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Asterisk strokeWidth={3} style={{ width: size * 0.5, height: size * 0.5 }} />
    </span>
  );
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label="Tirat QA — home" className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={44} className={light ? "bg-white !text-ink" : undefined} />
      <span className={cn("text-[22px] font-semibold tracking-[-0.04em]", light ? "text-white" : "text-ink")}>Tirat QA</span>
    </Link>
  );
}
