"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { requestReviewAction } from "@/actions/practice";
import { useT } from "@/lib/i18n/client";

export function RequestReviewButton({ reportId }: { reportId: string }) {
  const t = useT();
  const [pending, start] = useTransition();
  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={() => start(() => requestReviewAction(reportId))}>
      {pending ? t("Requesting…") : t("Ask for a review")}
    </Button>
  );
}
