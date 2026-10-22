"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/lib/i18n/client";

export interface SocialConfig {
  google: boolean;
  telegram: string | null; // bot username
}

const GoogleMark = () => (
  <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
    <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.9 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

/** The Telegram Login Widget: Telegram draws its own button and sends the signed profile to our callback. */
function TelegramWidget({ bot }: { bot: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.async = true;
    s.setAttribute("data-telegram-login", bot);
    s.setAttribute("data-size", "large");
    s.setAttribute("data-radius", "16");
    s.setAttribute("data-userpic", "false");
    s.setAttribute("data-auth-url", `${window.location.origin}/api/auth/telegram/callback`);
    s.setAttribute("data-request-access", "write");
    el.appendChild(s);
    return () => {
      el.innerHTML = "";
    };
  }, [bot]);
  return <div ref={box} className="flex min-h-[44px] justify-center" />;
}

/** "OR" divider with the sign-in buttons that are configured. Renders nothing when no provider is set up. */
export function SocialButtons({ providers, next }: { providers: SocialConfig; next?: string }) {
  const t = useT();
  if (!providers.google && !providers.telegram) return null;
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 text-sm font-medium text-muted">
        <span className="h-px flex-1 bg-line" /> {t("OR")} <span className="h-px flex-1 bg-line" />
      </div>
      <div className="mt-5 grid gap-3">
        {providers.google && (
          <a
            href={`/api/auth/google${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="flex h-[52px] items-center justify-center gap-3 rounded-full border-2 border-[#cdcdcd] bg-white font-medium transition-colors hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <GoogleMark /> {t("Continue with Google")}
          </a>
        )}
        {providers.telegram && <TelegramWidget bot={providers.telegram} />}
      </div>
    </div>
  );
}
