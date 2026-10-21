"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { cn } from "@/lib/utils";

export interface TextPart {
  text: string;
  className?: string;
}

/** Headline that unblurs and rises word by word (staggered) once it enters the viewport. */
export function SplitText({
  parts,
  as: Tag = "h2",
  className,
  id,
  delay = 0,
  stagger = 60,
}: {
  parts: TextPart[];
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let n = 0;
  return (
    <Tag ref={ref} id={id} className={className}>
      {parts.map((part, pi) =>
        part.text
          .split(/\s+/)
          .filter(Boolean)
          .map((w, wi) => {
            const i = n++;
            return (
              <span key={`${pi}-${wi}`} className="reveal inline-block overflow-visible">
                <span
                  className={cn(
                    "inline-block transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(.2,.7,.2,1)]",
                    shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-[0.5em] opacity-0 blur-[8px]",
                    part.className,
                  )}
                  style={{ transitionDelay: shown ? `${delay + i * stagger}ms` : "0ms" }}
                >
                  {w}
                </span>
                {" "}
              </span>
            );
          }),
      )}
    </Tag>
  );
}
