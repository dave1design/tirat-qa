import { Check, CircleDashed, Clock, Lock } from "lucide-react";
import type { SiteStatus } from "@/lib/lab";
import { SITE_STATUS_LABEL } from "@/lib/lab";
import { cn } from "@/lib/utils";

const styles: Record<SiteStatus, string> = {
  NOT_STARTED: "bg-chip text-muted",
  IN_PROGRESS: "bg-[#e6efff] text-brand",
  COMPLETED: "bg-ok-soft text-ok",
  LOCKED: "bg-chip text-ink-2",
};
const icons = { NOT_STARTED: CircleDashed, IN_PROGRESS: Clock, COMPLETED: Check, LOCKED: Lock };

/** Status is always icon + text, never colour alone. */
export function StatusBadge({ status, className }: { status: SiteStatus; className?: string }) {
  const Icon = icons[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", styles[status], className)}>
      <Icon className="size-3.5" aria-hidden />
      {SITE_STATUS_LABEL[status]}
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full bg-chip px-2.5 py-1 text-xs font-medium text-muted", className)}>{children}</span>;
}
