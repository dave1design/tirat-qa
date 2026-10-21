import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/learn", label: "Learn" },
      { href: "/practice-lab", label: "Practice Lab" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log In" },
      { href: "/sign-up", label: "Sign Up" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer-frame mx-3 mb-3 rounded-[40px] bg-card px-6 pb-8 pt-12 sm:mx-4 sm:px-10 sm:pt-14 lg:rounded-[48px]">
      <div className="mx-auto grid max-w-[1136px] gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-5 font-medium tracking-[-0.02em]">Practice. Find bugs. Improve.</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            Build practical software testing skills through hands-on website challenges.
          </p>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-[15px] font-medium">{c.title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-[1136px] flex-col gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Tirat QA. All rights reserved.</p>
        <p>Tirat QA — Practice. Find bugs. Improve.</p>
      </div>
    </footer>
  );
}
