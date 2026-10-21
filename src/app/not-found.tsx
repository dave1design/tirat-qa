import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="hero-bg flex min-h-screen items-center pb-20 pt-32">
        <div className="container-x text-center">
          <p className="eyebrow text-muted">404</p>
          <h1 className="h-section mx-auto mt-4 max-w-[720px] text-balance">Looks Like You&apos;ve Taken a Wrong Turn.</h1>
          <p className="lead mx-auto mt-5 max-w-[520px]">The page you&apos;re looking for may have moved or may no longer exist.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <Button href="/">Back to Home</Button>
            <Button href="/practice-lab" variant="light" arrow>
              Explore Practice Lab
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
