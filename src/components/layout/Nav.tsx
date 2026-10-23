"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";
import { ProfileMenu } from "./ProfileMenu";
import { useT } from "@/lib/i18n/client";

const baseLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/learn", label: "Learn" },
  { href: "/practice-lab", label: "Practice Lab" },
  { href: "/contact", label: "Contact" },
];

export interface NavUser {
  name: string;
  email: string;
  isStaff: boolean;
}

/** Width/opacity collapse (animates a grid column between 1fr and 0fr) so items slide away smoothly. */
function Collapse({ hidden, className, children }: { hidden: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn("transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]", hidden ? "pointer-events-none grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100", className)}
      aria-hidden={hidden}
      {...(hidden ? { inert: true } : {})}
    >
      <div className="min-w-0 overflow-hidden whitespace-nowrap">{children}</div>
    </div>
  );
}

export function Nav({ user }: { user: NavUser | null }) {
  const t = useT();
  // signed in, the Learn item opens the learner's dashboard
  const links = user ? baseLinks.map((l) => (l.href === "/learn" ? { href: "/dashboard", label: "Learn" } : l)) : baseLinks;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false); // desktop: collapses to logo + button while scrolling down
  const [pending, setPending] = useState<string | null>(null); // highlights the clicked link immediately

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setCompact(false);
      else if (y > last + 4) setCompact(true);
      else if (y < last - 4) setCompact(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    if (href === "/dashboard") return p.startsWith("/dashboard") || p.startsWith("/learn");
    return href === "/" ? p === "/" : p.startsWith(href);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        aria-label={t("Main")}
        className={cn(
          "pointer-events-auto relative flex w-full items-center justify-between gap-2 rounded-full border border-black/5 bg-white/85 py-2 pl-3 pr-2 shadow-float backdrop-blur-xl transition-[max-width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]",
          compact ? "lg:max-w-[330px]" : "max-w-[860px]",
        )}
      >
        <Logo className="shrink-0 whitespace-nowrap [&>span:last-child]:text-xl [&>span:first-child]:!size-10" />

        <Collapse hidden={compact} className="hidden lg:grid">
        <ul className="flex items-center gap-0.5">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setPending(l.href)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "block rounded-full px-4 py-2 text-[15px] leading-6 font-medium tracking-[-0.01em] transition-colors",
                  isActive(l.href) ? "bg-chip text-ink" : "text-muted hover:text-ink",
                )}
              >
                {t(l.label)}
              </Link>
            </li>
          ))}
        </ul>
        </Collapse>

        <div className="flex items-center gap-1.5">
          {user ? (
            <ProfileMenu user={user} />
          ) : (
            <>
              <Collapse hidden={compact} className="hidden sm:grid">
                <Button href="/login" variant="ghost" size="sm">
                  {t("Log In")}
                </Button>
              </Collapse>
              <Button href="/sign-up" size="sm" arrow>
                {t("Sign Up")}
              </Button>
            </>
          )}
          <button
            type="button"
            aria-label={open ? t("Close menu") : t("Open menu")}
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
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2 border-t border-line pt-3">
            {user ? (
              <>
                {user.isStaff && (
                  <Button href="/admin" variant="light" className="flex-1">
                    {t("Admin")}
                  </Button>
                )}
                <form action={logoutAction} className="flex-1">
                  <Button type="submit" className="w-full">
                    {t("Log Out")}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button href="/login" variant="light" className="flex-1">
                  {t("Log In")}
                </Button>
                <Button href="/sign-up" className="flex-1">
                  {t("Sign Up")}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
