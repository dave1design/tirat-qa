import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Blue numbered chip + white label chip, used above every section heading in the reference design. */
export function SectionTag({
  index,
  icon: Icon,
  iconClass = "text-lime",
  label,
  className,
}: {
  index: string;
  icon?: LucideIcon;
  iconClass?: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-sm font-medium", className)}>
      <span className="inline-flex h-[34px] items-center gap-2 rounded-lg bg-brand pl-2.5 pr-2 text-white">
        {index}
        {Icon && <Icon className={cn("size-[18px]", iconClass)} fill="currentColor" strokeWidth={1.5} aria-hidden />}
      </span>
      <span className="inline-flex h-[34px] items-center rounded-lg border border-line bg-white px-3 text-ink">{label}</span>
    </div>
  );
}
