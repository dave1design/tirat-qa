"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { COMPARE_EVENT } from "./compare-events";

/** The blue arrow joining the panels: shuffles the notes on the left and replays the practice flow on the right. */
export function FlowArrow() {
  const [turns, setTurns] = useState(0);
  return (
    <button
      type="button"
      aria-label="Shuffle the notes and replay the practice flow"
      onClick={() => {
        setTurns((t) => t + 1);
        window.dispatchEvent(new Event(COMPARE_EVENT));
      }}
      className="absolute left-1/2 top-1/2 z-10 flex size-[60px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-soft backdrop-blur transition-transform duration-300 hover:scale-105 active:scale-95 max-md:top-[calc(50%-2px)]"
    >
      <span className="flex size-[42px] animate-pop items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(0,102,255,0.45)]">
        <ChevronRight
          className="size-5 transition-transform duration-500 max-md:rotate-90"
          style={{ transform: `rotate(${turns * 360}deg)` }}
          strokeWidth={2.4}
          aria-hidden
        />
      </span>
    </button>
  );
}
