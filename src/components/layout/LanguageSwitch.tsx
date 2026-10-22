"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "@/actions/locale";
import { useLocale } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

/** English / Amharic toggle. The choice is remembered in a cookie, so server pages render in the chosen language. */
export function LanguageSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();

  const pick = (next: "en" | "am") => {
    if (next === locale) return;
    start(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  };

  const item = (code: "en" | "am", label: string, aria: string) => (
    <button
      type="button"
      lang={code}
      aria-label={aria}
      aria-pressed={locale === code}
      onClick={() => pick(code)}
      className={cn(
        "rounded-full px-3 py-1.5 text-[13px] font-medium leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand",
        locale === code ? "bg-ink text-white" : "text-muted hover:text-ink",
      )}
    >
      {label}
    </button>
  );

  return (
    <div role="group" aria-label="Language" aria-busy={pending} className={cn("inline-flex items-center rounded-full bg-chip p-0.5", pending && "opacity-60", className)}>
      {item("en", "EN", "English")}
      {item("am", "አማ", "አማርኛ")}
    </div>
  );
}
