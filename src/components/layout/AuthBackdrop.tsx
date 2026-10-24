import { BookOpen, Bug, ChartPie, ClipboardCheck, Compass, FileText, Flag, Layers, Search, Target, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tile = { h: number; bg: string; icon: LucideIcon; ink?: string };

const columns: Tile[][] = [
  [
    { h: 200, bg: "from-[#0a47f0] to-[#3d8bff]", icon: Bug },
    { h: 150, bg: "from-[#ffe3d1] to-[#ffc7a3]", icon: Flag, ink: "text-[#c2410c]" },
    { h: 230, bg: "from-[#1c1c1c] to-[#3a3a3a]", icon: Search },
  ],
  [
    { h: 150, bg: "from-[#d6ff1a] to-[#bff000]", icon: Trophy, ink: "text-ink" },
    { h: 240, bg: "from-[#4d94ff] to-[#0050cc]", icon: Layers },
    { h: 160, bg: "from-[#dfe9ff] to-[#b9d3ff]", icon: FileText, ink: "text-brand" },
  ],
  [
    { h: 230, bg: "from-[#12c957] to-[#0a9d41]", icon: ClipboardCheck },
    { h: 160, bg: "from-[#ff8a3d] to-[#ff5a0a]", icon: Target },
    { h: 200, bg: "from-[#e6efff] to-[#c7dcff]", icon: ChartPie, ink: "text-brand" },
  ],
  [
    { h: 160, bg: "from-[#2ee6c3] to-[#14d3a8]", icon: Compass, ink: "text-ink" },
    { h: 230, bg: "from-[#0a47f0] to-[#0066ff]", icon: BookOpen },
    { h: 150, bg: "from-[#ffe9a8] to-[#ffd24d]", icon: Bug, ink: "text-[#92400e]" },
  ],
  [
    { h: 220, bg: "from-[#3a3a3a] to-[#141414]", icon: Flag },
    { h: 150, bg: "from-[#d6ffe8] to-[#a8f0c8]", icon: ClipboardCheck, ink: "text-[#0a7a3a]" },
    { h: 240, bg: "from-[#ff7a2a] to-[#ff5a0a]", icon: Search },
  ],
];

/** Colourful tiles in columns behind the sign-up card, like a collage; the sign-in card floats above it. */
export function AuthBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#f3f3f3]">
      <div className="absolute -top-16 left-1/2 flex w-[1200px] -translate-x-1/2 justify-center gap-4 opacity-90">
        {columns.map((col, ci) => (
          <div key={ci} className="flex w-[220px] shrink-0 flex-col gap-4" style={{ marginTop: ci % 2 ? 56 : 0 }}>
            {[...col, ...col].map((t, ti) => (
              <div key={ti} className={`relative flex items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br ${t.bg}`} style={{ height: t.h }}>
                <t.icon className={`size-14 ${t.ink ?? "text-white"} opacity-80`} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-white/30" />
    </div>
  );
}
