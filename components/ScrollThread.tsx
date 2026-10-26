"use client";

import { useEffect, useRef } from "react";
import BrandMark from "@/components/BrandMark";

// Decorative "thread" down the left margin of the home page: a thin line that fills as the visitor
// scrolls through its parent, with the brand mark riding on the filled tip. Wide screens only
// (globals.css); stays still for visitors who ask for reduced motion.
export default function ScrollThread() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const noMotion = () =>
      matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-no-motion");
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = host.getBoundingClientRect();
      const p = noMotion() ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / r.height));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return (
    <div className="thread" ref={ref} aria-hidden="true">
      <span className="thread__mark"><BrandMark size={30} /></span>
    </div>
  );
}
