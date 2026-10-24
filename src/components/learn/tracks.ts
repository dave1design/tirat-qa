import { BookOpen, Bot, Briefcase, ClipboardCheck, type LucideIcon } from "lucide-react";
import type { CatalogLesson } from "./LessonCard";

/** Icon and pastel colours of each learning track, shared by the lesson cards and the dashboard. */
export const TRACK: Record<CatalogLesson["track"], { icon: LucideIcon; tile: string; bg: string }> = {
  Foundations: { icon: BookOpen, tile: "from-[#b6ec00] to-[#7fd200]", bg: "bg-[#f1f6dc]" },
  "Manual QA": { icon: ClipboardCheck, tile: "from-[#b9a4ff] to-[#8a6cff]", bg: "bg-[#ece8fb]" },
  "Professional QA": { icon: Briefcase, tile: "from-[#ffd36a] to-[#f5a524]", bg: "bg-[#f7f0dc]" },
  "Automation QA": { icon: Bot, tile: "from-[#7be0b8] to-[#2fbf8f]", bg: "bg-[#e1f2ea]" },
};
