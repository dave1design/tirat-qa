import Link from "next/link";
import { ClipboardList, FileSearch, GraduationCap, LayoutGrid, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionTag } from "@/components/ui/SectionTag";
import { Reveal } from "@/components/ui/Reveal";
import { LogoMark } from "@/components/ui/Logo";
import { plural } from "@/lib/utils";

export interface PreviewLevel {
  slug: string;
  number: number;
  name: string;
  difficulty: string;
  description: string;
  skills: string[];
  websites: { name: string; locked: boolean }[];
}

const gradients = ["from-[#3b82ff] to-[#0b2a8a]", "from-[#d9ff1f] to-[#6b8f00]", "from-[#8b7bff] to-[#2c1d8a]"];

export function PracticePreview({ levels }: { levels: PreviewLevel[] }) {
  return (
    <section className="overflow-hidden py-16 sm:py-24" aria-labelledby="lab-title">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <Reveal>
          <SectionTag index="3" icon={LayoutGrid} iconClass="text-green" label="Put Your Skills to the Test" />
          <h2 id="lab-title" className="h-section mt-6 text-balance">Real Practice. Better Testers.</h2>
          <p className="lead mt-6 max-w-[460px]">
            Explore practice websites designed to help you develop your software testing skills through hands-on challenges.
          </p>
          <p className="lead mt-3 max-w-[460px]">
            Each level brings together practice websites where you can investigate issues, submit bug reports, and learn from your results.
          </p>
          <div className="mt-8">
            <Button href="/practice-lab" arrow>Explore Practice Lab</Button>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:-mr-24">
          <div className="grid overflow-hidden rounded-[36px] bg-[#141414] text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] sm:grid-cols-[210px_1fr]">
            <aside className="hidden flex-col border-r border-white/10 p-4 sm:flex">
              <div className="flex items-center gap-2.5 p-2">
                <LogoMark size={40} className="!bg-white !text-ink" />
                <span className="text-lg font-semibold tracking-[-0.03em]">Tirat QA</span>
              </div>
              <p className="mt-6 px-2 text-xs text-white/50">Platform</p>
              <ul className="mt-2 grid gap-1 text-[15px]">
                <li className="flex items-center gap-2.5 rounded-xl bg-white/10 px-2.5 py-2"><LayoutGrid className="size-4" aria-hidden /> Practice Lab</li>
                <li className="flex items-center gap-2.5 px-2.5 py-2 text-white/70"><GraduationCap className="size-4" aria-hidden /> Learn</li>
                <li className="flex items-center gap-2.5 px-2.5 py-2 text-white/70"><FileSearch className="size-4" aria-hidden /> Results</li>
                <li className="flex items-center gap-2.5 px-2.5 py-2 text-white/70"><ClipboardList className="size-4" aria-hidden /> Bug Reports</li>
              </ul>
            </aside>
            <div className="min-h-[420px] p-5 sm:p-6">
              <p className="text-xs text-white/60">Practice Lab</p>
              {levels.length === 0 ? (
                <div className="mt-10 rounded-3xl bg-white/5 p-8 text-center">
                  <p className="text-xl font-medium tracking-[-0.02em]">Your Next Challenge Starts Here.</p>
                  <p className="mt-2 text-sm text-white/60">There are no practice websites available in this section yet. Check back soon for new challenges.</p>
                </div>
              ) : (
                <div className="mt-4 grid gap-4">
                  {levels.map((l, i) => (
                    <Link
                      key={l.slug}
                      href={`/practice-lab/${l.slug}`}
                      className="group block overflow-hidden rounded-3xl bg-white/[0.06] transition-colors hover:bg-white/10"
                    >
                      <div className={`relative h-36 bg-gradient-to-br ${gradients[i % gradients.length]}`}>
                        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-ink">
                          Level {String(l.number).padStart(2, "0")} <span className="text-muted">{l.difficulty}</span>
                        </span>
                        <span className="absolute right-3 top-3 rounded-full bg-black/30 px-3 py-1 text-xs backdrop-blur">{plural(l.websites.length, "website")}</span>
                      </div>
                      <div className="p-4">
                        <p className="text-lg font-medium tracking-[-0.02em]">Level {String(l.number).padStart(2, "0")} — {l.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-white/60">{l.description}</p>
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {l.websites.slice(0, 5).map((w) => (
                            <li key={w.name} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs">
                              {w.locked && <Lock className="size-3" aria-label="Paid access" />}
                              {w.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
