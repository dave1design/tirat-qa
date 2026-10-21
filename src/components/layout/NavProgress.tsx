"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Thin top progress bar that starts the instant an internal link is clicked and finishes when the new page arrives. */
export function NavProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [width, setWidth] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page or #anchor
      setState("loading");
      setWidth(12);
      if (timer.current) clearInterval(timer.current);
      timer.current = setInterval(() => setWidth((w) => w + (90 - w) * 0.12), 200); // eases toward 90%
    };
    // Capture phase: Next's <Link> calls preventDefault() during bubbling, before a bubbling listener would run.
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (state !== "loading") return;
    if (timer.current) clearInterval(timer.current);
    setWidth(100);
    setState("done");
    const t = setTimeout(() => {
      setState("idle");
      setWidth(0);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div
        className="h-full bg-brand shadow-[0_0_10px_rgba(0,102,255,0.6)] transition-[width,opacity] duration-300 ease-out"
        style={{ width: `${width}%`, opacity: state === "idle" ? 0 : 1 }}
      />
    </div>
  );
}
