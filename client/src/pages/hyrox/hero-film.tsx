/**
 * HYROX Zone — the hero film: the official race-format film, full-width,
 * first thing on screen. Per the handoff, nothing overlaps or precedes it —
 * no chrome, labels, or copy on or around the video.
 *
 * Playback strategy ("needs YouTube reachability" production note):
 * - Privacy-enhanced youtube-nocookie.com embed, muted autoplay, looping
 *   (loop requires playlist=<id> on single videos).
 * - Reachability probe: the film's own thumbnail is loaded from i.ytimg.com
 *   in parallel with the iframe. If the probe errors, or nothing (probe or
 *   iframe) has loaded within the timeout, the iframe is swapped for a
 *   same-size fallback panel linking out to the watch page — instead of an
 *   indefinite black void on networks where YouTube is unreachable.
 * - prefers-reduced-motion: no autoplay (and no mute, so a deliberate play
 *   starts with sound); YouTube's own controls remain.
 *
 * To self-host later, replace the iframe branch with a <video> element —
 * everything else (band, sizing, fallback) stays.
 */
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HYROX_FILM } from "@/data/hyrox-zone";

const PROBE_SRC = `https://i.ytimg.com/vi/${HYROX_FILM.id}/hqdefault.jpg`;
const PROBE_TIMEOUT_MS = 6000;

const embedSrc = (autoplay: boolean) => {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    playsinline: "1",
    rel: "0",
    loop: "1",
    playlist: HYROX_FILM.id,
  });
  if (autoplay) params.set("mute", "1");
  return `https://www.youtube-nocookie.com/embed/${HYROX_FILM.id}?${params}`;
};

type FilmStatus = "loading" | "playable" | "unreachable";

export function ZoneHeroFilm() {
  const [autoplay] = useState(
    () =>
      !(
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      )
  );
  const [status, setStatus] = useState<FilmStatus>("loading");

  const confirmPlayable = () => setStatus("playable");

  useEffect(() => {
    if (status !== "loading") return;

    const probe = new Image();
    probe.onload = confirmPlayable;
    probe.onerror = () =>
      setStatus(s => (s === "playable" ? s : "unreachable"));
    probe.src = PROBE_SRC;

    const deadline = window.setTimeout(
      () => setStatus(s => (s === "loading" ? "unreachable" : s)),
      PROBE_TIMEOUT_MS
    );

    return () => {
      probe.onload = null;
      probe.onerror = null;
      window.clearTimeout(deadline);
    };
  }, [status]);

  return (
    <div
      style={{
        position: "relative",
        background: "#000",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
          aspectRatio: "16 / 9",
        }}
      >
        {status === "unreachable" ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              textAlign: "center",
              padding: 24,
              background: "var(--canvas-terminal)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.16em",
                color: "var(--fg-4)",
              }}
            >
              FILM UNAVAILABLE ON THIS NETWORK
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(18px, 3vw, 26px)",
                color: "var(--fg-1)",
                maxWidth: 520,
              }}
            >
              {HYROX_FILM.title}
            </span>
            <Button asChild variant="outline">
              <a
                href={HYROX_FILM.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube <ArrowUpRight size={14} />
              </a>
            </Button>
          </div>
        ) : (
          <iframe
            src={embedSrc(autoplay)}
            title={HYROX_FILM.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={confirmPlayable}
          />
        )}
      </div>
    </div>
  );
}
