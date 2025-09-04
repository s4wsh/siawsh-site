"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// DO NOT CHANGE PUBLIC PROPS
// TODO(siawsh): Add `onPlay`, `onShare` callbacks (non-breaking) and basic analytics hooks.
type Props = {
  srcMp4?: string;
  srcWebm?: string;
  poster?: string;
  className?: string;
  shareUrl?: string;  // optional override; falls back to current page URL
  title?: string;     // optional share title
};

export default function RetroVideoPlayer({
  srcMp4,
  srcWebm,
  poster,
  className,
  shareUrl,
  title,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [copied, setCopied] = useState(false);

  // Keep state in sync with element events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolume = () => setMuted(v.muted);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("volumechange", onVolume);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("volumechange", onVolume);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  // Right-click toggles mute (and suppresses the system context menu)
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleMute();
  };

  const togglePiP = async () => {
    const v = videoRef.current as any;
    if (!v) return;
    try {
      if ((document as any).pictureInPictureElement) {
        await (document as any).exitPictureInPicture?.();
        return;
      }
      if (v.requestPictureInPicture) {
        await v.requestPictureInPicture();
        return;
      }
      // Safari fallback
      if (v.webkitSupportsPresentationMode && v.webkitSetPresentationMode) {
        const mode = v.webkitPresentationMode;
        v.webkitSetPresentationMode(
          mode === "picture-in-picture" ? "inline" : "picture-in-picture"
        );
      }
    } catch {
      /* ignore */
    }
  };

  const doShare = async () => {
    const url =
      shareUrl ||
      (typeof window !== "undefined" ? window.location.href : undefined);
    const shareTitle =
      title || (typeof document !== "undefined" ? document.title : "Siawsh Studio");
    try {
      if (url && (navigator as any).share) {
        await (navigator as any).share({ title: shareTitle, url });
        return;
      }
      if (url && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }
    } catch {
      /* ignore */
    }
  };

  // Keyboard: Space/Enter toggle play
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      togglePlay();
    }
  };

  // Tiny inline icon set (no external deps)
  const Icon = useMemo(
    () => ({
      Play: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
      ),
      Pause: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z" />
        </svg>
      ),
      Volume: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M5 10v4h4l5 5V5l-5 5H5z" />
        </svg>
      ),
      Mute: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.5 12 20 15.5 18.5 17 15 13.5 11.5 17 10 15.5 13.5 12 10 8.5 11.5 7 15 10.5 18.5 7 20 8.5zM5 10v4h4l5 5V5l-5 5H5z"
          />
        </svg>
      ),
      PiP: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3 5h18v14H3V5zm2 2v10h14V7H5zm8 2h6v5h-6V9z" />
        </svg>
      ),
      Share: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M14 9V5l7 7-7 7v-4H4v-6h10z" />
        </svg>
      ),
      Check: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
      ),
    }),
    []
  );

  return (
    <div
      className={`relative group rounded-2xl border border-mist/60 overflow-hidden ${className ?? ""}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Bezel/CRT-ish wrap */}
      <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_2px_0_rgba(255,255,255,0.06),inset_0_-3px_0_rgba(0,0,0,.6),0_20px_70px_rgba(0,0,0,.4)] rounded-2xl" />

      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        muted={muted}
        poster={poster}
        className="block w-full h-auto outline-none"
        onClick={togglePlay}
        onContextMenu={onContextMenu}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {srcWebm && <source src={srcWebm} type="video/webm" />}
        {srcMp4 && <source src={srcMp4} type="video/mp4" />}
      </video>

      {/* Bottom gradient for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100" />

      {/* Retro control panel – shows on hover/focus only */}
      <div
        className="absolute left-3 right-3 bottom-3 flex items-center justify-between gap-3 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0"
        role="toolbar"
        aria-label="Video controls"
      >
        {/* Left: transport */}
        <div
          className="flex items-center gap-2 rounded-xl px-2 py-2
                     bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b]
                     border border-white/10
                     [box-shadow:inset_0_1px_0_rgba(255,255,255,.08),inset_0_-2px_0_rgba(0,0,0,.7),0_8px_24px_rgba(0,0,0,.35)]"
        >
          {/* Play/Pause big button */}
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg
                       bg-gradient-to-b from-[#2a2a2a] to-[#101010]
                       border border-white/10
                       [box-shadow:inset_0_2px_0_rgba(255,255,255,.06),inset_0_-2px_0_rgba(0,0,0,.8),0_4px_10px_rgba(0,0,0,.4)]
                       active:translate-y-px"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Icon.Pause /> : <Icon.Play />}
          </button>

          {/* Status LED + hint */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                playing ? "bg-[oklch(72%_0.12_150)]" : "bg-[oklch(65%_0.12_25)]"
              } [box-shadow:0_0_10px_currentColor]`}
              aria-hidden
            />
            <span className="text-xs text-white/80">
              {playing ? "Playing" : "Paused"}
            </span>
          </div>
        </div>

        {/* Center: mute control + right-click hint */}
        <div
          className="flex items-center gap-2 rounded-xl px-2 py-2
                     bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b]
                     border border-white/10
                     [box-shadow:inset_0_1px_0_rgba(255,255,255,.08),inset_0_-2px_0_rgba(0,0,0,.7),0_8px_24px_rgba(0,0,0,.35)]"
        >
          <button
            type="button"
            onClick={toggleMute}
            className="inline-flex items-center gap-2 rounded-lg px-3 h-10
                       bg-gradient-to-b from-[#2a2a2a] to-[#101010]
                       border border-white/10
                       [box-shadow:inset_0_2px_0_rgba(255,255,255,.06),inset_0_-2px_0_rgba(0,0,0,.8)]
                       active:translate-y-px"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <Icon.Mute /> : <Icon.Volume />}
            <span className="text-sm">{muted ? "Unmute" : "Mute"}</span>
          </button>

          {/* Right-click tip appears only when muted */}
          {muted && (
            <span className="hidden md:inline text-[11px] text-white/70 select-none">
              Right-click video to unmute
            </span>
          )}
        </div>

        {/* Right: PiP + Share in a side */}
        <div
          className="flex items-center gap-2 rounded-xl px-2 py-2
                     bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b]
                     border border-white/10
                     [box-shadow:inset_0_1px_0_rgba(255,255,255,.08),inset_0_-2px_0_rgba(0,0,0,.7),0_8px_24px_rgba(0,0,0,.35)]"
        >
          <button
            type="button"
            onClick={togglePiP}
            className="inline-flex items-center gap-2 rounded-lg px-3 h-10
                       bg-gradient-to-b from-[#2a2a2a] to-[#101010]
                       border border-white/10
                       [box-shadow:inset_0_2px_0_rgba(255,255,255,.06),inset_0_-2px_0_rgba(0,0,0,.8)]
                       active:translate-y-px"
            aria-label="Picture in Picture"
          >
            <Icon.PiP />
            <span className="text-sm">PiP</span>
          </button>

          <button
            type="button"
            onClick={doShare}
            className="inline-flex items-center gap-2 rounded-lg px-3 h-10
                       bg-gradient-to-b from-[#2a2a2a] to-[#101010]
                       border border-white/10
                       [box-shadow:inset_0_2px_0_rgba(255,255,255,.06),inset_0_-2px_0_rgba(0,0,0,.8)]
                       active:translate-y-px"
            aria-label="Share"
          >
            <Icon.Share />
            <span className="text-sm">Share</span>
          </button>

          {copied && (
            <span className="ml-1 inline-flex items-center gap-1 text-[11px] rounded-md
                             bg-black/60 text-white px-2 h-6 border border-white/15">
              <Icon.Check /> Copied
            </span>
          )}
        </div>
      </div>

      {/* Hover badge (fun retro label) */}
      <div
        className={`pointer-events-none absolute top-3 left-3 rounded-md px-2 py-1 text-[10px] tracking-widest
                    border border-white/15 bg-black/55 text-white/85
                    [box-shadow:inset_0_1px_0_rgba(255,255,255,.08),0_6px_14px_rgba(0,0,0,.35)]
                    transition-opacity duration-200 ${hovering ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      >
        SIAWSH // VIDEO UNIT
      </div>
    </div>
  );
}
