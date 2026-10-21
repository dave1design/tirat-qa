"use client";

import { Button } from "@/components/ui/Button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="hero-bg flex min-h-screen items-center pb-20 pt-32">
      <div className="container-x text-center">
        <h1 className="h-section mx-auto max-w-[640px] text-balance">Something went wrong.</h1>
        <p className="lead mx-auto mt-5 max-w-[520px]">Something went wrong while loading this page. Please try again.</p>
        <div className="mt-8 flex justify-center">
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </section>
  );
}
