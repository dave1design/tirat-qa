"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="rounded-[20px] border border-line bg-card/70">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${base}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-[20px] px-6 py-6 text-left text-base font-medium tracking-[-0.01em]"
              >
                {it.q}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-soft">
                  <Plus className={cn("size-4 transition-transform duration-300", isOpen && "rotate-45")} aria-hidden />
                </span>
              </button>
            </h3>
            <div id={`${base}-${i}`} role="region" className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <p className="px-6 pb-6 pr-16 text-muted">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
