"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// React marks the DOM nodes it has hydrated with a "__reactFiber$..." key. Adding the "in" class to
// a node React hasn't hydrated yet makes the server HTML differ from what React expects (a
// hydration warning), so wait for it - but never longer than MAX_WAIT.
const isHydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));
const MAX_WAIT = 3000;

// Scroll-reveal: fades in `.reveal` elements. Re-runs on every client-side navigation.
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.in)");
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const start = Date.now();
    const show = (el: Element) => {
      if (isHydrated(el) || Date.now() - start > MAX_WAIT) { el.classList.add("in"); return; }
      const t = setTimeout(() => { timers.delete(t); show(el); }, 50);
      timers.add(t);
    };
    if (!("IntersectionObserver" in window)) {
      els.forEach(show);
      return () => timers.forEach(clearTimeout);
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [pathname]);

  return null;
}
