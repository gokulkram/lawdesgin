"use client";

import { useEffect, useRef } from "react";

// Hero parallax, two layers moving at different speeds as the page scrolls:
// - the background photo moves down at BG_SPEED of the scroll (so it scrolls up at half speed),
// - the hero text/buttons drift down a little and fade out, so they move faster than the photo.
// Off for visitors who ask for reduced motion (device setting, or "pause motion" in the
// accessibility menu).
const BG_SPEED = 0.5;
const TEXT_SPEED = 0.22;

export default function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = ref.current;
    const hero = bg?.parentElement;
    if (!bg || !hero) return;
    const text = hero.querySelector<HTMLElement>(".hero__inner");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    const reset = () => {
      bg.style.transform = "";
      if (text) { text.style.transform = ""; text.style.opacity = ""; }
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduced.matches || document.documentElement.classList.contains("a11y-no-motion")) return reset();
      const rect = hero.getBoundingClientRect();
      if (rect.bottom <= 0) return; // scrolled past: leave the last position
      const scrolled = Math.max(0, window.scrollY);
      bg.style.transform = `translate3d(0, ${scrolled * BG_SPEED}px, 0)`;
      if (text) {
        text.style.transform = `translate3d(0, ${scrolled * TEXT_SPEED}px, 0)`;
        text.style.opacity = String(Math.max(0, 1 - scrolled / (rect.height * 0.9)));
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      reset();
    };
  }, []);

  return <div ref={ref} className="hero__bg hero__bg--parallax">{children}</div>;
}
