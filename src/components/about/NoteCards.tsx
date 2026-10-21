"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { BookOpen, FileText, ListChecks, MessageSquareText, Search, Target, type LucideIcon } from "lucide-react";
import { AppTile, type Tone } from "@/components/ui/AppTile";

/** Resting layout: angle `a` (deg), position in % of the area, card width in px. */
const cards: { t: string; d: string; icon: LucideIcon; tone: Tone; a: number; x: number; y: number; w: number; delay: number }[] = [
  { t: "Definitions", d: "Read once, easy to forget", icon: FileText, tone: "green", a: 84, x: 38, y: 12, w: 300, delay: 0 },
  { t: "Concepts", d: "Hard to apply without practice", icon: Search, tone: "orange", a: -16, x: 50, y: 22, w: 300, delay: -1.2 },
  { t: "Notes", d: "Where do I start testing?", icon: MessageSquareText, tone: "violet", a: 78, x: 20, y: 26, w: 300, delay: -3.1 },
  { t: "Lessons", d: "Watched, never practiced", icon: BookOpen, tone: "lime", a: 38, x: 14, y: 60, w: 320, delay: -4.2 },
  { t: "Theory", d: "No bugs found yet", icon: Target, tone: "gray", a: 30, x: 50, y: 66, w: 300, delay: -2 },
  { t: "Checklist", d: "Never tried on a real website", icon: ListChecks, tone: "orange", a: -12, x: 34, y: 46, w: 320, delay: -5 },
];

interface Drag {
  x: number; // dragged offset from the resting spot (px)
  y: number;
  rot: number; // extra tilt (deg) added while moving
  target: number;
  active: boolean;
  sx: number;
  sy: number;
  ox: number;
  oy: number;
}

/**
 * Note cards that rock slowly on their own. Pick one up and drag it anywhere in the panel: it tilts with the
 * direction you move it, and when you let go the tilt eases out while the card stays where you dropped it.
 */
export function NoteCards() {
  const inner = useRef<(HTMLDivElement | null)[]>([]);
  const outer = useRef<(HTMLDivElement | null)[]>([]);
  const area = useRef<HTMLDivElement>(null);
  const st = useRef<Drag[]>(cards.map(() => ({ x: 0, y: 0, rot: 0, target: 0, active: false, sx: 0, sy: 0, ox: 0, oy: 0 })));
  const raf = useRef(0);
  const z = useRef(10);

  const paint = (i: number) => {
    const s = st.current[i];
    const el = inner.current[i];
    if (el) el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg) scale(${s.active ? 1.06 : 1})`;
  };

  const loop = () => {
    let busy = false;
    st.current.forEach((s, i) => {
      s.target *= 0.86; // the push from your last movement fades out
      s.rot += (s.target - s.rot) * 0.22;
      if (Math.abs(s.rot) < 0.05 && Math.abs(s.target) < 0.05 && !s.active) {
        s.rot = 0;
        s.target = 0;
      } else busy = true;
      paint(i);
    });
    raf.current = busy ? requestAnimationFrame(loop) : 0;
  };
  const wake = () => {
    if (!raf.current) raf.current = requestAnimationFrame(loop);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const down = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const s = st.current[i];
    s.active = true;
    s.sx = e.clientX;
    s.sy = e.clientY;
    s.ox = s.x;
    s.oy = s.y;
    const o = outer.current[i];
    if (o) {
      o.style.zIndex = String(++z.current);
      o.style.animationPlayState = "paused";
    }
    wake();
  };

  const move = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current[i];
    if (!s.active) return;
    s.x = s.ox + (e.clientX - s.sx);
    s.y = s.oy + (e.clientY - s.sy);
    // tilt toward the direction of travel (horizontal motion rotates, vertical adds a little)
    s.target = Math.max(-28, Math.min(28, s.target + e.movementX * 0.9 + e.movementY * 0.25 * Math.sign(e.movementX || 1)));
    wake();
  };

  const up = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current[i];
    if (!s.active) return;
    s.active = false;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    const o = outer.current[i];
    if (o) o.style.animationPlayState = "running";
    wake();
  };

  return (
    <div ref={area} className="absolute inset-x-0 bottom-20 top-14">
      {cards.map((c, i) => (
        <div
          key={c.t}
          ref={(el) => {
            outer.current[i] = el;
          }}
          className="absolute animate-rock"
          style={{ left: `${c.x}%`, top: `${c.y}%`, ["--a" as string]: `${c.a}deg`, animationDelay: `${c.delay}s`, animationDuration: `${7 + (Math.abs(c.a) % 4)}s` } as CSSProperties}
        >
          <div
            ref={(el) => {
              inner.current[i] = el;
            }}
            onPointerDown={down(i)}
            onPointerMove={move(i)}
            onPointerUp={up(i)}
            onPointerCancel={up(i)}
            className="flex cursor-grab touch-none select-none items-center gap-3 rounded-[20px] border border-black/[0.04] bg-white p-2.5 pr-5 shadow-[0_14px_34px_-12px_rgba(0,0,0,0.25)] transition-shadow active:cursor-grabbing active:shadow-[0_24px_44px_-12px_rgba(0,0,0,0.35)]"
            style={{ width: c.w * 0.6 }}
          >
            <AppTile icon={c.icon} tone={c.tone} size={34} />
            <span className="min-w-0">
              <span className="block text-[14px] font-medium leading-tight tracking-[-0.02em]">{c.t}</span>
              <span className="block truncate text-[11.5px] text-muted">{c.d}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
