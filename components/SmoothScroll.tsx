"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;

// Smooth page scrolling (Lenis, like octicase.com): mouse-wheel steps glide instead of jumping, so
// the scroll effects (thread, header glass, photo story) move smoothly with the page. Off for
// visitors who ask for reduced motion, in their system or in the site's accessibility menu.
// Popups that scroll on their own carry data-lenis-prevent.
export default function SmoothScroll() {
  const pathname = usePathname();
  const toTop = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const wanted = () => !media.matches && !root.classList.contains("a11y-no-motion");
    const sync = () => {
      if (wanted() && !lenis) {
        lenis = new Lenis({ autoRaf: true, lerp: 0.1, allowNestedScroll: true });
      } else if (!wanted() && lenis) {
        lenis.destroy();
        lenis = null;
      }
    };
    sync();
    media.addEventListener("change", sync);
    const watch = new MutationObserver(sync); // the accessibility menu toggles a11y-no-motion
    watch.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => {
      media.removeEventListener("change", sync);
      watch.disconnect();
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Lenis keeps its own scroll target, which would carry over to the next page and override the
  // jump to its top. So a click on a link to another page stops any glide and remembers to start the
  // new page at the top (back/forward keep the browser's remembered position).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a || !lenis) return;
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      const url = new URL((a as HTMLAnchorElement).href, location.href);
      if (url.origin === location.origin && url.pathname !== location.pathname && !url.hash) toTop.current = true;
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!toTop.current) return;
    toTop.current = false;
    const frame = requestAnimationFrame(() => {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
