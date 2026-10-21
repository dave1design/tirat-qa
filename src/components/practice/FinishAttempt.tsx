"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { finishAttemptAction } from "@/actions/practice";

export function FinishAttempt({ attemptId, reportCount }: { attemptId: string; reportCount: number }) {
  const [confirm, setConfirm] = useState(false);
  if (!confirm) {
    return (
      <Button variant="light" onClick={() => setConfirm(true)}>
        Finish Testing
      </Button>
    );
  }
  return (
    <form action={finishAttemptAction.bind(null, attemptId)} className="rounded-3xl bg-card p-5" role="alertdialog" aria-label="Confirm finish testing">
      <p className="font-medium">Finish this attempt?</p>
      <p className="mt-1 text-sm text-muted">
        You&apos;ve submitted {reportCount} {reportCount === 1 ? "report" : "reports"}. You won&apos;t be able to add more to this attempt.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="submit">Yes, Show My Results</Button>
        <Button variant="ghost" onClick={() => setConfirm(false)}>
          Keep Testing
        </Button>
      </div>
    </form>
  );
}
