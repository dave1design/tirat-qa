"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { finishAttemptAction } from "@/actions/practice";
import { useT } from "@/lib/i18n/client";

export function FinishAttempt({ attemptId, reportCount }: { attemptId: string; reportCount: number }) {
  const t = useT();
  const [confirm, setConfirm] = useState(false);
  if (!confirm) {
    return (
      <Button variant="light" onClick={() => setConfirm(true)}>
        {t("Finish Testing")}
      </Button>
    );
  }
  return (
    <form action={finishAttemptAction.bind(null, attemptId)} className="rounded-3xl bg-card p-5" role="alertdialog" aria-label={t("Confirm finish testing")}>
      <p className="font-medium">{t("Finish this attempt?")}</p>
      <p className="mt-1 text-sm text-muted">
        {t(reportCount === 1 ? "You've submitted {n} report. You won't be able to add more to this attempt." : "You've submitted {n} reports. You won't be able to add more to this attempt.", { n: reportCount })}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="submit">{t("Yes, Show My Results")}</Button>
        <Button variant="ghost" onClick={() => setConfirm(false)}>
          {t("Keep Testing")}
        </Button>
      </div>
    </form>
  );
}
