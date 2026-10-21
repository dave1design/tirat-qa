"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Scroll-linked entrance: the child starts tilted back, smaller and lower, and settles flat as it scrolls into view. */
export function ScrollTilt({ children, className }: { children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = o.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
      const e = 1 - Math.pow(1 - p, 3);
      i.style.transform = `perspective(1400px) rotateX(${(1 - e) * 16}deg) translateY(${(1 - e) * 70}px) scale(${0.9 + 0.1 * e})`;
      i.style.opacity = String(0.35 + 0.65 * e);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} style={{ transformOrigin: "50% 100%", willChange: "transform, opacity" }}>
        {children}
      </div>
    </div>
  );
}
