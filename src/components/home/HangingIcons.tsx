"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Bug, ChartPie, ClipboardCheck, Flag, Search, ToggleRight, type LucideIcon } from "lucide-react";
import { AppTile, type Tone } from "@/components/ui/AppTile";

interface Hang {
  x: number; // % from left
  len: number; // rope length in px (anchor → tile top)
  start: number; // initial swing angle in degrees
  icon: LucideIcon;
  tone: Tone;
}

const SIZE = 60;
const hangs: Hang[] = [
  { x: 21, len: 410, start: -9, icon: Bug, tone: "orange" },
  { x: 29.2, len: 237, start: 10, icon: Search, tone: "black" },
  { x: 48.6, len: 153, start: -12, icon: ChartPie, tone: "violet" },
  { x: 70.5, len: 240, start: 8, icon: ArrowUpRight, tone: "green" },
  { x: 81, len: 398, start: -7, icon: ToggleRight, tone: "blue" },
  { x: 25, len: 588, start: 6, icon: ClipboardCheck, tone: "green" },
  { x: 74.2, len: 586, start: -6, icon: Flag, tone: "lime" },
];

const G = 2400; // px/s² — pendulum frequency is sqrt(G / length)
const DAMPING = 0.55;
const MAX_ANGLE = 85;

interface State {
  phi: number; // radians, rotation of the rope (clockwise positive)
  omega: number;
  dragging: boolean;
  last: { phi: number; t: number } | null;
}

/** Pendulum ropes: grab an icon, drag it anywhere, let go and it swings back left and right. */
export function HangingIcons() {
  const anchors = useRef<(HTMLSpanElement | null)[]>([]);
  const ropes = useRef<(HTMLDivElement | null)[]>([]);
  const tiles = useRef<(HTMLSpanElement | null)[]>([]);
  const state = useRef<State[]>(hangs.map((h) => ({ phi: (h.start * Math.PI) / 180, omega: 0, dragging: false, last: null })));
  const raf = useRef(0);
  const prev = useRef(0);

  const paint = (i: number) => {
    const deg = (state.current[i].phi * 180) / Math.PI;
    const rope = ropes.current[i];
    const tile = tiles.current[i];
    if (rope) rope.style.transform = `rotate(${deg}deg)`;
    if (tile) tile.style.transform = `rotate(${-deg}deg)`; // icon stays upright
  };

  const tick = (now: number) => {
    const dt = Math.min(0.032, (now - prev.current) / 1000 || 0.016);
    prev.current = now;
    let moving = false;
    state.current.forEach((s, i) => {
      if (!s.dragging) {
        const L = hangs[i].len;
        s.omega += (-(G / L) * Math.sin(s.phi) - DAMPING * s.omega) * dt;
        s.phi += s.omega * dt;
        if (Math.abs(s.phi) < 0.0008 && Math.abs(s.omega) < 0.004) {
          s.phi = 0;
          s.omega = 0;
        }
      }
      if (s.dragging || s.phi !== 0 || s.omega !== 0) moving = true;
      paint(i);
    });
    raf.current = moving ? requestAnimationFrame(tick) : 0;
  };

  const wake = () => {
    if (!raf.current) {
      prev.current = performance.now();
      raf.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) state.current.forEach((s) => (s.phi = 0));
    state.current.forEach((_, i) => paint(i));
    if (!reduce) wake();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDown = (i: number) => (e: React.PointerEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const s = state.current[i];
    s.dragging = true;
    s.omega = 0;
    s.last = { phi: s.phi, t: performance.now() };
    wake();
  };

  const onMove = (i: number) => (e: React.PointerEvent<HTMLSpanElement>) => {
    const s = state.current[i];
    if (!s.dragging) return;
    const a = anchors.current[i]!.getBoundingClientRect();
    const dx = e.clientX - a.left;
    const dy = Math.max(10, e.clientY - a.top - SIZE / 2);
    const max = (MAX_ANGLE * Math.PI) / 180;
    const phi = Math.max(-max, Math.min(max, Math.atan2(-dx, dy)));
    const now = performance.now();
    if (s.last) {
      const dt = (now - s.last.t) / 1000;
      if (dt > 0.001) s.omega = 0.6 * s.omega + 0.4 * ((phi - s.last.phi) / dt);
    }
    s.last = { phi, t: now };
    s.phi = phi;
  };

  const onUp = (i: number) => () => {
    const s = state.current[i];
    if (!s.dragging) return;
    s.dragging = false;
    s.last = null;
    s.omega = Math.max(-3.2, Math.min(3.2, s.omega)); // cap the throw so it never goes wild
    wake();
  };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-[760px] sm:block">
      {hangs.map((h, i) => (
        <span key={i} ref={(el) => { anchors.current[i] = el; }} className="absolute top-0" style={{ left: `${h.x}%` }}>
          <div ref={(el) => { ropes.current[i] = el; }} className="absolute left-0 top-0 w-0 will-change-transform" style={{ height: h.len + SIZE, transformOrigin: "0 0" }}>
            <span className="absolute left-0 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-black/10 to-black/30" style={{ height: h.len }} />
            <span
              className="pointer-events-auto absolute left-0 -translate-x-1/2 cursor-grab touch-none select-none active:cursor-grabbing"
              style={{ top: h.len }}
              onPointerDown={onDown(i)}
              onPointerMove={onMove(i)}
              onPointerUp={onUp(i)}
              onPointerCancel={onUp(i)}
            >
              <span ref={(el) => { tiles.current[i] = el; }} className="block transition-transform duration-75 hover:scale-105">
                <AppTile icon={h.icon} tone={h.tone} size={SIZE} />
              </span>
            </span>
          </div>
        </span>
      ))}
    </div>
  );
}
