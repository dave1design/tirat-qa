"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { useT } from "@/lib/i18n/client";

type InlineYouTubeProps = { videoId: string; title: string; summary: string; variant?: "card" | "player" };

/**
 * The lesson video plays inside the page. It shows a poster first and loads the player only when the learner presses
 * play (privacy-enhanced host, 16:9, no autoplay on page load). The embed is told which site it is on, which YouTube
 * requires to play embedded videos, and a plain "open on YouTube" link stays available if a network blocks the player.
 */
export function InlineYouTube({ videoId, title, summary, variant = "card" }: InlineYouTubeProps) {
  const t = useT();
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const origin = typeof window === "undefined" ? "" : encodeURIComponent(window.location.origin);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1${origin ? `&origin=${origin}` : ""}`;

  const player = variant === "player";

  return (
    <figure>
      <div className={player ? "relative aspect-video w-full overflow-hidden bg-black" : "relative aspect-video w-full overflow-hidden rounded-2xl bg-[#141414]"}>
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={src}
            title={title}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t("Play video: {title}", { title })}
            className="group absolute inset-0 flex h-full w-full items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand"
          >
            {!posterFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                onError={() => setPosterFailed(true)}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
              />
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-12 text-left text-sm font-medium text-white">{title}</span>
            <span className="relative flex size-16 items-center justify-center rounded-full bg-white text-ink shadow-float transition-transform group-hover:scale-110">
              <Play className="ml-1 size-7" fill="currentColor" aria-hidden />
            </span>
          </button>
        )}
      </div>
      <figcaption className={player ? "flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-[#1c1d1f] px-4 py-2.5 text-[13px] text-white/70" : "mt-4 grid gap-2 text-[15px] leading-relaxed text-ink-2"}>
        {!player && (
          <p>
            <span className="font-medium text-ink">{t("In short.")}</span> {summary}
          </p>
        )}
        <p className={player ? "" : "text-sm text-muted"}>
          {t("Video not playing on your network?")}{" "}
          <a href={watchUrl} target="_blank" rel="noopener noreferrer" className={player ? "inline-flex items-center gap-1 font-medium text-white underline underline-offset-2" : "inline-flex items-center gap-1 font-medium text-brand underline underline-offset-2"}>
            {t("Open it on YouTube")} <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </p>
      </figcaption>
    </figure>
  );
}
