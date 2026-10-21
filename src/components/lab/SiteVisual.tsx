import { BookOpen, Calendar, CreditCard, LayoutGrid, Search, ShoppingBag, Wallet } from "lucide-react";
import type { ReactNode } from "react";

export type VisualKind = "ecommerce" | "lms" | "projects" | "booking" | "banking";

const bar = (w: string, cls = "bg-black/12") => <span className={`block h-1.5 rounded-full ${cls}`} style={{ width: w }} />;

/** Top navigation bar shared by the drawings: logo, a few links and a call-to-action. */
function Nav({ icon, name, links }: { icon: ReactNode; name: string; links: string[] }) {
  return (
    <div className="flex items-center gap-3 border-b border-black/[0.06] px-3 py-2">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold">
        <span className="flex size-5 items-center justify-center rounded-md bg-ink text-white">{icon}</span>
        {name}
      </span>
      <span className="ml-1 hidden gap-2.5 text-[9px] text-black/50 sm:flex">
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </span>
      <span className="ml-auto rounded-full bg-ink px-2 py-1 text-[9px] font-medium text-white">Sign in</span>
    </div>
  );
}

/** Whole-website screens drawn in CSS (not single forms): each one shows a full site with navigation and content. */
const screens: Record<VisualKind, ReactNode> = {
  ecommerce: (
    <>
      <Nav icon={<ShoppingBag className="size-3" />} name="Tirat E-commerce" links={["Shop", "Sign in", "Create account"]} />
      <div className="p-3">
        <span className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#e8dcff] to-[#d9f7e4] px-3 py-3">
          <span>
            <span className="block text-[12px] font-semibold">New season</span>
            {bar("90px", "mt-1.5 bg-black/20")}
          </span>
          <span className="rounded-full bg-ink px-2 py-1 text-[9px] text-white">Shop now</span>
        </span>
        <span className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-black/10 px-2 py-1.5 text-[9px] text-black/40">
          <Search className="size-3" /> Search products…
        </span>
        <span className="mt-2.5 grid grid-cols-4 gap-2">
          {["bg-[#e8dcff]", "bg-[#d9f7e4]", "bg-[#ffe4d1]", "bg-[#dbe8ff]"].map((c, i) => (
            <span key={i}>
              <span className={`block h-11 rounded-lg ${c}`} />
              <span className="mt-1.5 block">{bar("75%", "bg-black/20")}</span>
              <span className="mt-1 block">{bar("40%")}</span>
            </span>
          ))}
        </span>
      </div>
    </>
  ),
  lms: (
    <>
      <Nav icon={<BookOpen className="size-3" />} name="Tirat LMS" links={["Courses", "My learning", "Grades"]} />
      <div className="grid grid-cols-[64px_1fr] gap-2.5 p-3">
        <span className="grid content-start gap-1.5">
          {["Dashboard", "Courses", "Quizzes", "Grades"].map((l, i) => (
            <span key={l} className={`rounded-md px-1.5 py-1 text-[8px] font-medium ${i === 1 ? "bg-ink text-white" : "bg-black/[0.04] text-black/55"}`}>
              {l}
            </span>
          ))}
        </span>
        <span className="grid gap-2">
          {[78, 45, 20].map((p, i) => (
            <span key={i} className="flex items-center gap-2 rounded-lg border border-black/[0.07] p-2">
              <span className={`size-8 shrink-0 rounded-md ${["bg-[#dbe8ff]", "bg-[#d9f7e4]", "bg-[#ffe4d1]"][i]}`} />
              <span className="flex-1">
                {bar("70%", "bg-black/25")}
                <span className="mt-1.5 block h-1.5 rounded-full bg-black/[0.07]">
                  <span className="block h-1.5 rounded-full bg-brand" style={{ width: `${p}%` }} />
                </span>
              </span>
              <span className="text-[9px] font-medium text-black/50">{p}%</span>
            </span>
          ))}
        </span>
      </div>
    </>
  ),
  projects: (
    <>
      <Nav icon={<LayoutGrid className="size-3" />} name="Tirat Projects" links={["Board", "Timeline", "Team"]} />
      <div className="grid grid-cols-3 gap-2 p-3">
        {["To do", "In progress", "Done"].map((c, ci) => (
          <span key={c} className="rounded-lg bg-black/[0.04] p-1.5">
            <span className="mb-1.5 block text-[9px] font-semibold text-black/55">{c}</span>
            {Array.from({ length: 3 - (ci === 1 ? 1 : 0) }).map((_, i) => (
              <span key={i} className="mb-1.5 block rounded-md bg-white p-1.5 shadow-sm">
                {bar("80%", "bg-black/20")}
                <span className="mt-1.5 flex items-center justify-between">
                  {bar("35%")}
                  <span className={`size-3.5 rounded-full ${["bg-orange", "bg-brand", "bg-green"][(i + ci) % 3]}`} />
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </>
  ),
  booking: (
    <>
      <Nav icon={<Calendar className="size-3" />} name="Tirat Booking" links={["Services", "Schedule", "My bookings"]} />
      <div className="grid grid-cols-[1fr_84px] gap-3 p-3">
        <span className="grid grid-cols-7 gap-1 text-center text-[8px]">
          {Array.from({ length: 21 }).map((_, i) => (
            <span key={i} className={`rounded-md py-1.5 ${i === 9 ? "bg-brand font-semibold text-white" : i % 6 === 0 ? "text-black/25" : "bg-black/[0.04]"}`}>
              {i + 1}
            </span>
          ))}
        </span>
        <span className="grid content-start gap-1.5">
          {["09:00", "10:30", "13:00"].map((t, i) => (
            <span key={t} className={`rounded-md border px-1.5 py-1.5 text-center text-[9px] ${i === 1 ? "border-ink bg-ink text-white" : "border-black/10"}`}>
              {t}
            </span>
          ))}
          <span className="rounded-md bg-brand py-1.5 text-center text-[9px] font-medium text-white">Confirm</span>
        </span>
      </div>
    </>
  ),
  banking: (
    <>
      <Nav icon={<Wallet className="size-3" />} name="Tirat Bank" links={["Accounts", "Transfers", "Cards"]} />
      <div className="grid grid-cols-2 gap-2.5 p-3">
        <span className="rounded-xl bg-ink p-2.5 text-white">
          <span className="text-[8px] text-white/60">Checking</span>
          <span className="mt-1 block text-[15px] font-semibold tracking-tight">$12,480</span>
          <CreditCard className="mt-3 size-3.5 text-white/60" />
        </span>
        <span className="grid gap-1.5 rounded-xl border border-black/[0.07] p-2.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex items-center justify-between">
              {bar("55%", "bg-black/20")}
              <span className={`text-[8px] font-medium ${i === 1 ? "text-ok" : "text-black/55"}`}>{i === 1 ? "+$240" : "-$18"}</span>
            </span>
          ))}
        </span>
      </div>
    </>
  ),
};

export function SiteVisual({ kind }: { kind: VisualKind }) {
  return (
    <div className="absolute inset-x-[8%] top-[15%] origin-bottom rotate-[-3deg] overflow-hidden rounded-2xl bg-white text-ink shadow-[0_24px_50px_-18px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-2 group-hover:rotate-0 group-hover:scale-[1.03]">
      {screens[kind]}
    </div>
  );
}
