import { BookOpen, Bot, Briefcase, ClipboardCheck, type LucideIcon } from "lucide-react";
import type { CatalogLesson } from "./LessonCard";

/** Icon and pastel colours of each learning track, shared by the lesson cards and the dashboard. */
export const TRACK: Record<CatalogLesson["track"], { icon: LucideIcon; tile: string; bg: string }> = {
  Foundations: { icon: BookOpen, tile: "from-[#4d94ff] to-[#0050cc]", bg: "bg-[#e6efff]" },
  "Manual QA": { icon: ClipboardCheck, tile: "from-[#4d94ff] to-[#0050cc]", bg: "bg-[#e6efff]" },
  "Professional QA": { icon: Briefcase, tile: "from-[#4d94ff] to-[#0050cc]", bg: "bg-[#e6efff]" },
  "Automation QA": { icon: Bot, tile: "from-[#4d94ff] to-[#0050cc]", bg: "bg-[#e6efff]" },
};
