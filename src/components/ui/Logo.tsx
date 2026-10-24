import Link from "next/link";
import { cn } from "@/lib/utils";

/** The Tirat mark in a circle: the white figure on blue, cropped from public/logo-mark.png (600 × 640). */
export function LogoMark({ className, size = 44 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full", className)} style={{ width: size, height: size }} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.png" alt="" className="h-full w-full object-cover" />
    </span>
  );
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label="Tirat — home" className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={44} />
      <span className={cn("text-[22px] font-semibold tracking-[-0.04em]", light ? "text-white" : "text-ink")}>Tirat</span>
    </Link>
  );
}
