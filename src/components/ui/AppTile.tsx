import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  blue: "from-[#3b82ff] to-[#0050e6]",
  green: "from-[#2ee06f] to-[#0bb84a]",
  orange: "from-[#ff8a3d] to-[#ff5a0a]",
  violet: "from-[#4d94ff] to-[#0050cc]",
  lime: "from-[#d9ff1f] to-[#b8f000]",
  black: "from-[#2b2b2b] to-[#0e0e0e]",
  gray: "from-[#8a8a8a] to-[#5c5c5c]",
  white: "from-white to-[#f1f1f1]",
} as const;
export type Tone = keyof typeof tones;

/** Glossy app-icon tile used for the hanging hero icons, orbit and card art. */
export function AppTile({
  icon: Icon,
  tone = "blue",
  size = 60,
  className,
  iconClass,
}: {
  icon: LucideIcon;
  tone?: Tone;
  size?: number;
  className?: string;
  iconClass?: string;
}) {
  const dark = tone === "lime" || tone === "white";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-gradient-to-b shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.35)]",
        tones[tone],
        className,
      )}
      style={{ width: size, height: size, borderRadius: size * 0.3 }}
      aria-hidden
    >
      <Icon className={cn(dark ? "text-ink" : "text-white", iconClass)} style={{ width: size * 0.48, height: size * 0.48 }} strokeWidth={2.2} />
    </span>
  );
}
