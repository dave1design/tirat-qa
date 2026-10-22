import { Bug, CheckCircle2, Flag } from "lucide-react";
import { AppTile } from "@/components/ui/AppTile";

/** Illustrated desk scene for the sign-in and sign-up pages: a tester at a laptop writing a bug report. */
export function AuthScene() {
  return (
    <div aria-hidden className="relative h-full min-h-[560px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#dbe8ff] via-[#b9d3ff] to-[#7fa9ff]">
      {/* soft light and wall shapes */}
      <span className="absolute -left-24 -top-24 size-[380px] rounded-full bg-white/50 blur-3xl" />
      <span className="absolute -bottom-20 right-[-60px] size-[320px] rounded-full bg-brand/30 blur-3xl" />

      {/* wall clock */}
      <span className="absolute left-[46%] top-[7%] flex size-[58px] items-center justify-center rounded-full border-[5px] border-[#1c2a4a] bg-white shadow-[0_10px_20px_rgba(10,30,90,0.25)]">
        <span className="absolute h-[18px] w-[3px] origin-bottom -translate-y-[9px] rounded bg-[#1c2a4a]" />
        <span className="absolute h-[14px] w-[3px] origin-bottom -translate-y-[7px] rotate-[110deg] rounded bg-[#1c2a4a]" />
      </span>

      {/* floating tiles */}
      <span className="absolute left-[9%] top-[17%] animate-float">
        <AppTile icon={Bug} tone="orange" size={58} />
      </span>
      <span className="absolute right-[10%] top-[24%] animate-float" style={{ animationDelay: "-2s" }}>
        <AppTile icon={Flag} tone="lime" size={50} />
      </span>
      <span className="absolute right-[18%] top-[50%] animate-float" style={{ animationDelay: "-4s" }}>
        <AppTile icon={CheckCircle2} tone="green" size={46} />
      </span>

      {/* the bug report floating above the laptop */}
      <div className="absolute left-1/2 top-[27%] w-[62%] max-w-[300px] -translate-x-1/2 animate-float rounded-2xl bg-white p-4 shadow-[0_24px_50px_-18px_rgba(10,30,90,0.5)]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-orange">Bug report</p>
        <p className="mt-1 text-[15px] font-semibold leading-snug">Form accepts an invalid email</p>
        <div className="mt-3 grid gap-1.5">
          <span className="block h-1.5 w-[88%] rounded-full bg-chip" />
          <span className="block h-1.5 w-[66%] rounded-full bg-chip" />
        </div>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-ok-soft px-2 py-0.5 text-[10px] font-semibold text-ok">
          <CheckCircle2 className="size-3" /> Valid finding
        </span>
      </div>

      {/* desk, laptop, mug and plant */}
      <svg viewBox="0 0 400 300" className="absolute inset-x-0 bottom-0 w-full" fill="none">
        <path d="M0 300V196c60-10 120-14 200-14s140 4 200 14v104z" fill="#274a9a" />
        {/* plant */}
        <path d="M322 208c-8-40-4-72 12-96 6 30 8 62-12 96z" fill="#5b8f7e" />
        <path d="M322 208c-26-30-34-58-30-84 20 22 32 50 30 84z" fill="#7bb3a0" />
        <path d="M322 208c22-26 38-48 44-74-24 16-40 40-44 74z" fill="#4a7d6c" />
        <path d="M304 208h40l-6 44h-28z" fill="#e4e8f2" />
        {/* chair back */}
        <rect x="150" y="104" width="86" height="92" rx="22" fill="#aeb9d6" />
        {/* person */}
        <circle cx="193" cy="86" r="22" fill="#f2c9a5" />
        <path d="M171 80c2-16 16-24 28-22 10 2 18 10 16 24-8-8-24-12-44-2z" fill="#4a2f1e" />
        <path d="M168 112h52l12 58-22 6-12-24-10 24-26-4z" fill="#a7e04f" />
        {/* desk */}
        <rect x="60" y="178" width="220" height="14" rx="7" fill="#1f3a7a" />
        <rect x="76" y="192" width="8" height="70" rx="3" fill="#f4f6fb" />
        <rect x="256" y="192" width="8" height="70" rx="3" fill="#f4f6fb" />
        {/* laptop */}
        <path d="M96 176l10-46h66l10 46z" fill="#cfd6e6" />
        <path d="M100 172l8-38h58l8 38z" fill="#0a47f0" opacity=".85" />
        <rect x="88" y="174" width="102" height="5" rx="2.5" fill="#aab4cc" />
        {/* mug */}
        <rect x="214" y="160" width="18" height="18" rx="4" fill="#6a58f5" />
        <path d="M232 165h6a5 5 0 0 1 0 10h-6" stroke="#6a58f5" strokeWidth="3" />
      </svg>
    </div>
  );
}
