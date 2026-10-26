"use client";

import { useEffect, useRef, useState } from "react";

// Background video for the home hero, laid over the beach photo (which stays as the fallback and
// the poster). It only loads on screens wider than 768px, and never for visitors who ask for
// reduced motion or have data saver on, so phones keep the light photo. Fades in once playing.
// Clip: "Palm Trees on Beach at Beautiful Sunset" by Landon Yaple, Pexels (free licence).
const SRC_SMALL = "/videos/hero-beach-720.mp4";
const SRC_LARGE = "/videos/hero-beach-1080.mp4";

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const noMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-no-motion");
    if (noMotion || conn?.saveData || innerWidth <= 768) return;
    setSrc(innerWidth * devicePixelRatio > 1600 ? SRC_LARGE : SRC_SMALL);
  }, []);

  // Pause when the "pause motion" setting in the accessibility menu is switched on.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const mo = new MutationObserver(() => {
      if (document.documentElement.classList.contains("a11y-no-motion")) v.pause(); else v.play().catch(() => {});
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [src]);

  if (!src) return null;
  return (
    <video
      ref={ref}
      className={`hero__video${ready ? " is-ready" : ""}`}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setReady(true)}
    />
  );
}
