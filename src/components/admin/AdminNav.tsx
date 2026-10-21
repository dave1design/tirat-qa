"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminNav({ items }: { items: { href: string; label: string; badge?: number }[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((i) => {
        const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center justify-between gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors",
              active ? "bg-ink text-white" : "text-muted hover:bg-chip hover:text-ink",
            )}
          >
            {i.label}
            {!!i.badge && <span className={cn("rounded-full px-2 py-0.5 text-xs", active ? "bg-white/20" : "bg-brand text-white")}>{i.badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
