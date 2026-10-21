"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/learn", label: "Learn" },
  { href: "/practice-lab", label: "Practice Lab" },
  { href: "/contact", label: "Contact" },
];

export interface NavUser {
  name: string;
  isStaff: boolean;
}

export function Nav({ user }: { user: NavUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null); // highlights the clicked link immediately

  useEffect(() => {
    setOpen(false);
    setPending(null);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    const p = pending ?? pathname;
    return href === "/" ? p === "/" : p.startsWith(href);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        aria-label="Main"
        className="pointer-events-auto relative flex w-full max-w-[860px] items-center justify-between gap-2 rounded-full border border-black/5 bg-white/85 py-2 pl-3 pr-2 shadow-float backdrop-blur-xl"
      >
        <Logo className="[&>span:last-child]:text-xl [&>span:first-child]:!size-10" />

        <ul className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setPending(l.href)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[15px] font-medium tracking-[-0.01em] transition-colors",
                  isActive(l.href) ? "bg-chip text-ink" : "text-muted hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              <Button href={user.isStaff ? "/admin" : "/dashboard"} variant="ghost" size="sm" className="hidden sm:inline-flex">
                {user.isStaff ? "Admin" : "Dashboard"}
              </Button>
              <form action={logoutAction} className="hidden sm:block">
                <Button type="submit" size="sm" variant="dark">
                  Log Out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Log In
              </Button>
              <Button href="/sign-up" size="sm" arrow>
                Sign Up
              </Button>
            </>
          )}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full bg-chip lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="pointer-events-auto fixed inset-x-3 top-[72px] rounded-[28px] border border-black/5 bg-white p-3 shadow-float lg:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setPending(l.href)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn("block rounded-2xl px-4 py-3.5 text-lg font-medium tracking-[-0.02em]", isActive(l.href) ? "bg-chip" : "hover:bg-card")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2 border-t border-line pt-3">
            {user ? (
              <>
                <Button href={user.isStaff ? "/admin" : "/dashboard"} variant="light" className="flex-1">
                  {user.isStaff ? "Admin" : "Dashboard"}
                </Button>
                <form action={logoutAction} className="flex-1">
                  <Button type="submit" className="w-full">
                    Log Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button href="/login" variant="light" className="flex-1">
                  Log In
                </Button>
                <Button href="/sign-up" className="flex-1">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
