import { Calendar, Check, ChevronRight, Lock, Mail, Search, ShoppingCart, Upload, User } from "lucide-react";
import type { ReactNode } from "react";

export type VisualKind = "login" | "register" | "products" | "cart" | "checkout" | "booking" | "board" | "upload";

const bar = (w: string, cls = "bg-black/10") => <span className={`block h-1.5 rounded-full ${cls}`} style={{ width: w }} />;
const field = (icon: ReactNode, w = "100%") => (
  <span className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-2.5 py-2" style={{ width: w }}>
    <span className="text-black/35">{icon}</span>
    {bar("55%")}
  </span>
);

/** Little website screens drawn in CSS, one per kind of practice site. They sit inside a tilted browser frame. */
const screens: Record<VisualKind, ReactNode> = {
  login: (
    <div className="grid gap-2.5 p-4">
      <span className="text-[13px] font-semibold">Sign in</span>
      {field(<Mail className="size-3.5" />)}
      {field(<Lock className="size-3.5" />)}
      <span className="mt-1 rounded-lg bg-ink py-2 text-center text-[11px] font-medium text-white">Sign in</span>
      <span className="text-center text-[10px] text-black/45 underline">Forgot password?</span>
    </div>
  ),
  register: (
    <div className="grid gap-2 p-4">
      <span className="text-[13px] font-semibold">Create your account</span>
      {field(<User className="size-3.5" />)}
      {field(<Mail className="size-3.5" />)}
      <span className="grid grid-cols-2 gap-2">
        {field(<Calendar className="size-3.5" />)}
        {field(<Lock className="size-3.5" />)}
      </span>
      <span className="flex items-center gap-1.5 text-[10px] text-black/55">
        <span className="size-3 rounded-[3px] border border-black/25" /> I agree to the terms
      </span>
      <span className="rounded-lg bg-brand py-2 text-center text-[11px] font-medium text-white">Create account</span>
    </div>
  ),
  products: (
    <div className="p-3">
      <span className="flex items-center gap-2 rounded-lg border border-black/10 px-2.5 py-1.5 text-[10px] text-black/40">
        <Search className="size-3" /> Search products…
      </span>
      <span className="mt-2.5 grid grid-cols-3 gap-2">
        {["bg-[#e8dcff]", "bg-[#d9f7e4]", "bg-[#ffe4d1]", "bg-[#dbe8ff]", "bg-[#f4f4a8]", "bg-[#ffd9e3]"].map((c, i) => (
          <span key={i} className="block">
            <span className={`block h-12 rounded-lg ${c}`} />
            {bar("70%", "mt-1.5 bg-black/15")}
            {bar("40%", "mt-1 bg-black/10")}
          </span>
        ))}
      </span>
    </div>
  ),
  cart: (
    <div className="grid gap-2 p-3.5">
      <span className="flex items-center gap-1.5 text-[13px] font-semibold">
        <ShoppingCart className="size-3.5" /> Your cart
      </span>
      {[0, 1].map((i) => (
        <span key={i} className="flex items-center gap-2 rounded-lg bg-black/[0.04] p-2">
          <span className="size-8 rounded-md bg-[#dbe8ff]" />
          <span className="flex-1">{bar("65%", "bg-black/20")}<span className="mt-1.5 block">{bar("35%")}</span></span>
          <span className="rounded border border-black/15 px-1.5 text-[10px]">− {i + 1} +</span>
        </span>
      ))}
      <span className="flex justify-between border-t border-black/10 pt-2 text-[11px] font-semibold">
        <span>Total</span>
        {bar("22%", "bg-black/30")}
      </span>
    </div>
  ),
  checkout: (
    <div className="grid gap-2.5 p-3.5">
      <span className="flex items-center justify-between text-[10px] font-medium text-black/50">
        {["Cart", "Address", "Payment"].map((s, i) => (
          <span key={s} className="flex items-center gap-1">
            <span className={`flex size-4 items-center justify-center rounded-full text-[9px] ${i < 2 ? "bg-ink text-white" : "border border-black/20"}`}>{i < 1 ? <Check className="size-2.5" /> : i + 1}</span>
            {s}
          </span>
        ))}
      </span>
      {field(<User className="size-3.5" />)}
      {field(<Mail className="size-3.5" />)}
      <span className="grid grid-cols-2 gap-2">{field(<Calendar className="size-3.5" />)}{field(<Lock className="size-3.5" />)}</span>
      <span className="rounded-lg bg-ink py-2 text-center text-[11px] font-medium text-white">Continue</span>
    </div>
  ),
  booking: (
    <div className="p-3.5">
      <span className="text-[13px] font-semibold">Book an appointment</span>
      <span className="mt-2.5 grid grid-cols-7 gap-1 text-center text-[9px]">
        {Array.from({ length: 21 }).map((_, i) => (
          <span key={i} className={`rounded-md py-1.5 ${i === 9 ? "bg-brand font-semibold text-white" : i % 6 === 0 ? "text-black/25" : "bg-black/[0.04]"}`}>
            {i + 1}
          </span>
        ))}
      </span>
      <span className="mt-2.5 block rounded-lg bg-ink py-2 text-center text-[11px] font-medium text-white">Confirm</span>
    </div>
  ),
  board: (
    <div className="grid grid-cols-3 gap-2 p-3">
      {["To do", "Doing", "Done"].map((c, ci) => (
        <span key={c} className="rounded-lg bg-black/[0.04] p-1.5">
          <span className="mb-1.5 block text-[9px] font-semibold text-black/55">{c}</span>
          {Array.from({ length: 3 - (ci === 1 ? 1 : 0) }).map((_, i) => (
            <span key={i} className="mb-1.5 block rounded-md bg-white p-1.5 shadow-sm">
              {bar("80%", "bg-black/20")}
              <span className="mt-1 block">{bar("50%")}</span>
            </span>
          ))}
        </span>
      ))}
    </div>
  ),
  upload: (
    <div className="grid gap-2.5 p-4">
      <span className="text-[13px] font-semibold">Upload a file</span>
      <span className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-black/15 py-5 text-[10px] text-black/45">
        <Upload className="size-4" /> Drop a PNG or PDF
      </span>
      <span className="flex items-center justify-between rounded-lg bg-black/[0.04] px-2.5 py-2 text-[10px]">
        report.pdf <ChevronRight className="size-3 text-black/40" />
      </span>
    </div>
  ),
};

export function SiteVisual({ kind }: { kind: VisualKind }) {
  return (
    <div className="absolute inset-x-[10%] top-[17%] origin-bottom rotate-[-3deg] overflow-hidden rounded-2xl bg-white text-ink shadow-[0_24px_50px_-18px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-2 group-hover:rotate-0 group-hover:scale-[1.03]">
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#f7f7f7] px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 h-3.5 flex-1 rounded-full bg-white" />
      </div>
      {screens[kind]}
    </div>
  );
}
