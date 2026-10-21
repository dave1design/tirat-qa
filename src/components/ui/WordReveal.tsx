"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Scroll-linked word-by-word reveal (grey → ink). Optionally places an inline icon after the Nth word. */
export function WordReveal({
  text,
  icon,
  iconAfter = 1,
  className,
}: {
  text: string;
  icon?: ReactNode;
  iconAfter?: number;
  className?: string;
}) {
  const root = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.6)));
      const n = spans.length;
      spans.forEach((s, i) => {
        const t = Math.min(1, Math.max(0, p * (n + 4) - i) / 4);
        s.style.opacity = String(0.14 + 0.86 * t);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={root} className={cn("text-center", className)}>
      {words.map((w, i) => (
        <span key={i}>
          <span data-w style={{ opacity: 0.14 }} className="inline-block transition-opacity duration-150">
            {w}
          </span>{" "}
          {icon && i === iconAfter - 1 && <span className="mx-1 inline-block translate-y-[0.12em] align-baseline">{icon}</span>}
        </span>
      ))}
    </p>
  );
}
