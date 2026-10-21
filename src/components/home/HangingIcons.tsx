"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Bug, ChartPie, ClipboardCheck, Flag, Search, ToggleRight, type LucideIcon } from "lucide-react";
import { AppTile, type Tone } from "@/components/ui/AppTile";

interface Hang {
  x: number; // % from left
  len: number; // rope length in px (anchor → top of tile)
  start: number; // initial swing angle in degrees
  icon: LucideIcon;
  tone: Tone;
}

const SIZE = 60;
const hangs: Hang[] = [
  { x: 21, len: 410, start: -14, icon: Bug, tone: "orange" },
  { x: 29.2, len: 237, start: 16, icon: Search, tone: "black" },
  { x: 48.6, len: 153, start: -18, icon: ChartPie, tone: "violet" },
  { x: 70.5, len: 240, start: 12, icon: ArrowUpRight, tone: "green" },
  { x: 81, len: 398, start: -10, icon: ToggleRight, tone: "blue" },
  { x: 25, len: 588, start: 9, icon: ClipboardCheck, tone: "green" },
  { x: 74.2, len: 586, start: -9, icon: Flag, tone: "lime" },
];

const SEGMENTS = 16;
const GRAVITY = 2600; // px/s²
const TILE_WEIGHT = 2.4; // the icon is heavier than the rope, so it hangs straight when still
const DAMPING = 0.992;
const ITERATIONS = 14;
const STEP = 1 / 120;

interface Rope {
  ax: number; // anchor x in container px
  x: Float64Array;
  y: Float64Array;
  px: Float64Array;
  py: Float64Array;
  seg: number;
  grab: { dx: number; dy: number } | null;
  asleep: number; // consecutive calm frames
}

function makeRope(h: Hang, ax: number, swing: boolean): Rope {
  const n = SEGMENTS + 1;
  const r: Rope = { ax, x: new Float64Array(n), y: new Float64Array(n), px: new Float64Array(n), py: new Float64Array(n), seg: h.len / SEGMENTS, grab: null, asleep: 0 };
  const a = swing ? (h.start * Math.PI) / 180 : 0;
  for (let i = 0; i < n; i++) {
    r.x[i] = r.px[i] = ax + Math.sin(a) * r.seg * i;
    r.y[i] = r.py[i] = Math.cos(a) * r.seg * i;
  }
  return r;
}

/** Smooth path through the rope's points (midpoint quadratic curves). */
function ropePath(r: Rope) {
  const n = r.x.length;
  let d = `M${r.x[0].toFixed(1)} ${r.y[0].toFixed(1)}`;
  for (let i = 1; i < n - 1; i++) {
    const mx = (r.x[i] + r.x[i + 1]) / 2;
    const my = (r.y[i] + r.y[i + 1]) / 2;
    d += ` Q${r.x[i].toFixed(1)} ${r.y[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  d += ` L${r.x[n - 1].toFixed(1)} ${r.y[n - 1].toFixed(1)}`;
  return d;
}

/**
 * Real ropes: each one is a chain of Verlet-integrated points with fixed-length links, pinned at the top.
 * Grab an icon and drag — the rope bends and trails behind. Let go and it whips, swings and settles.
 */
export function HangingIcons() {
  const box = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const tiles = useRef<(HTMLSpanElement | null)[]>([]);
  const ropes = useRef<Rope[]>([]);
  const raf = useRef(0);
  const last = useRef(0);
  const acc = useRef(0);

  const paint = () => {
    ropes.current.forEach((r, i) => {
      const n = r.x.length - 1;
      paths.current[i]?.setAttribute("d", ropePath(r));
      const dx = r.x[n] - r.x[n - 2];
      const dy = r.y[n] - r.y[n - 2];
      const deg = (Math.atan2(-dx, Math.max(1, dy)) * 180) / Math.PI;
      const t = tiles.current[i];
      if (t) t.style.transform = `translate(${r.x[n] - SIZE / 2}px, ${r.y[n]}px) rotate(${deg}deg)`;
    });
  };

  const stepRope = (r: Rope, dt: number) => {
    const n = r.x.length;
    const g = GRAVITY * dt * dt;
    for (let i = 1; i < n; i++) {
      if (i === n - 1 && r.grab) continue; // the held end is driven by the pointer
      const vx = (r.x[i] - r.px[i]) * DAMPING;
      const vy = (r.y[i] - r.py[i]) * DAMPING;
      r.px[i] = r.x[i];
      r.py[i] = r.y[i];
      r.x[i] += vx;
      r.y[i] += vy + g * (i === n - 1 ? TILE_WEIGHT : 1);
    }
    r.x[0] = r.px[0] = r.ax;
    r.y[0] = r.py[0] = 0;
    for (let k = 0; k < ITERATIONS; k++) {
      for (let i = 0; i < n - 1; i++) {
        const dx = r.x[i + 1] - r.x[i];
        const dy = r.y[i + 1] - r.y[i];
        const dist = Math.hypot(dx, dy) || 0.0001;
        const diff = (dist - r.seg) / dist;
        const pinA = i === 0;
        const pinB = i + 1 === n - 1 && !!r.grab;
        if (pinA && pinB) continue;
        const wa = pinA ? 0 : pinB ? 1 : 0.5;
        const wb = pinB ? 0 : pinA ? 1 : 0.5;
        r.x[i] += dx * diff * wa;
        r.y[i] += dy * diff * wa;
        r.x[i + 1] -= dx * diff * wb;
        r.y[i + 1] -= dy * diff * wb;
      }
    }
  };

  const tick = (now: number) => {
    const frame = Math.min(0.05, (now - last.current) / 1000 || 0.016);
    last.current = now;
    acc.current += frame;
    while (acc.current >= STEP) {
      ropes.current.forEach((r) => stepRope(r, STEP));
      acc.current -= STEP;
    }
    let busy = false;
    ropes.current.forEach((r) => {
      let e = 0;
      for (let i = 1; i < r.x.length; i++) e = Math.max(e, Math.abs(r.x[i] - r.px[i]) + Math.abs(r.y[i] - r.py[i]));
      r.asleep = e < 0.02 && !r.grab ? r.asleep + 1 : 0;
      if (r.asleep < 90) busy = true;
    });
    paint();
    raf.current = busy ? requestAnimationFrame(tick) : 0;
  };

  const wake = () => {
    ropes.current.forEach((r) => (r.asleep = 0));
    if (!raf.current) {
      last.current = performance.now();
      raf.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    const el = box.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const init = () => {
      const w = el.offsetWidth;
      if (w === 0) return; // hidden on small screens
      ropes.current = hangs.map((h) => makeRope(h, (w * h.x) / 100, !reduce));
      paint();
      wake();
    };
    init();
    const ro = new ResizeObserver(init);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toLocal = (e: React.PointerEvent) => {
    const b = box.current!.getBoundingClientRect();
    return { x: e.clientX - b.left, y: e.clientY - b.top };
  };

  const onDown = (i: number) => (e: React.PointerEvent<HTMLSpanElement>) => {
    const r = ropes.current[i];
    if (!r) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toLocal(e);
    const n = r.x.length - 1;
    r.grab = { dx: r.x[n] - p.x, dy: r.y[n] - p.y }; // keep the spot you grabbed under the cursor
    wake();
  };

  const onMove = (i: number) => (e: React.PointerEvent<HTMLSpanElement>) => {
    const r = ropes.current[i];
    if (!r?.grab) return;
    const p = toLocal(e);
    const n = r.x.length - 1;
    let tx = p.x + r.grab.dx - r.ax;
    let ty = p.y + r.grab.dy;
    const max = r.seg * SEGMENTS; // can't pull the rope longer than it is
    const d = Math.hypot(tx, ty);
    if (d > max) {
      tx = (tx / d) * max;
      ty = (ty / d) * max;
    }
    r.x[n] = r.ax + tx;
    r.y[n] = ty;
    r.px[n] = r.x[n];
    r.py[n] = r.y[n];
  };

  const onUp = (i: number) => (e: React.PointerEvent<HTMLSpanElement>) => {
    const r = ropes.current[i];
    if (!r?.grab) return;
    r.grab = null;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    wake();
  };

  return (
    <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-[760px] sm:block">
      <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        {hangs.map((_, i) => (
          <path key={i} ref={(el) => { paths.current[i] = el; }} stroke="#9b9b9b" strokeWidth="1.6" strokeLinecap="round" />
        ))}
      </svg>
      {hangs.map((h, i) => (
        <span
          key={i}
          ref={(el) => { tiles.current[i] = el; }}
          onPointerDown={onDown(i)}
          onPointerMove={onMove(i)}
          onPointerUp={onUp(i)}
          onPointerCancel={onUp(i)}
          className="pointer-events-auto absolute left-0 top-0 cursor-grab touch-none select-none will-change-transform active:cursor-grabbing"
          style={{ transformOrigin: "50% 0", width: SIZE, transform: `translate(${-SIZE}px, 0)` }}
        >
          <AppTile icon={h.icon} tone={h.tone} size={SIZE} />
        </span>
      ))}
    </div>
  );
}
