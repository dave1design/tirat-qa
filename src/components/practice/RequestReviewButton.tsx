"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { requestReviewAction } from "@/actions/practice";

export function RequestReviewButton({ reportId }: { reportId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={() => start(() => requestReviewAction(reportId))}>
      {pending ? "Requesting…" : "Ask for a review"}
    </Button>
  );
}
