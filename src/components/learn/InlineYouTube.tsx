import { ExternalLink } from "lucide-react";

type InlineYouTubeProps = { videoId: string; title: string; summary: string };

/**
 * The lesson video plays inside the page: privacy-enhanced host, lazy loaded, 16:9, never autoplays.
 * The summary and the labelled source link stay available if the embed is blocked.
 */
export function InlineYouTube({ videoId, title, summary }: InlineYouTubeProps) {
  return (
    <figure>
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-[#141414]">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <figcaption className="mt-4 grid gap-2 text-[15px] leading-relaxed text-ink-2">
        <p>
          <span className="font-medium text-ink">Lesson summary.</span> {summary}
        </p>
        <p className="text-sm text-muted">
          Video blocked on your network?{" "}
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-brand underline underline-offset-2"
          >
            Source: {title} <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </p>
      </figcaption>
    </figure>
  );
}
