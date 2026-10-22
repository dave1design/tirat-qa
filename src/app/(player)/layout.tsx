import type { ReactNode } from "react";

/** The course player has its own chrome (a slim top bar and the course-content sidebar) instead of the site navigation. */
export default function PlayerLayout({ children }: { children: ReactNode }) {
  return <main id="main" className="min-h-dvh bg-white">{children}</main>;
}
