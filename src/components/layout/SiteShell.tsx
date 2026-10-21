import type { ReactNode } from "react";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export async function SiteShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav user={user ? { name: user.name, isStaff: isStaff(user.role) } : null} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

/** Top padding for inner pages so content clears the floating nav. */
export function PageTop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`pt-32 sm:pt-40 ${className}`}>{children}</div>;
}
