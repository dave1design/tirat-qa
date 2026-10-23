"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookOpen, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { useT } from "@/lib/i18n/client";
import type { NavUser } from "./Nav";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "?";

/** The signed-in person's avatar. Opens a small menu with their dashboard, the roadmap and log out. */
export function ProfileMenu({ user }: { user: NavUser }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const item = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-chip";

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label={t("Account menu")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 items-center justify-center rounded-full bg-brand text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {initials(user.name)}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 rounded-3xl border border-black/5 bg-white p-2 shadow-float">
          <div className="flex items-center gap-3 px-3 pb-3 pt-2">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-white">{initials(user.name)}</span>
            <span className="min-w-0">
              <span className="block truncate font-semibold leading-tight">{user.name}</span>
              <span className="block truncate text-[13px] text-muted">{user.email}</span>
            </span>
          </div>
          <div className="border-t border-line pt-1.5">
            <Link href="/dashboard" role="menuitem" onClick={() => setOpen(false)} className={item}>
              <LayoutDashboard className="size-4 text-muted" aria-hidden /> {t("Dashboard")}
            </Link>
            <Link href="/learn" role="menuitem" onClick={() => setOpen(false)} className={item}>
              <BookOpen className="size-4 text-muted" aria-hidden /> {t("Learning roadmap")}
            </Link>
            {user.isStaff && (
              <Link href="/admin" role="menuitem" onClick={() => setOpen(false)} className={item}>
                <ShieldCheck className="size-4 text-muted" aria-hidden /> {t("Admin")}
              </Link>
            )}
          </div>
          <form action={logoutAction} className="mt-1.5 border-t border-line pt-1.5">
            <button type="submit" role="menuitem" className={`${item} w-full text-left`}>
              <LogOut className="size-4 text-muted" aria-hidden /> {t("Log Out")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
