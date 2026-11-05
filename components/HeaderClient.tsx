"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/firm";
import Logo from "@/components/Logo";

// Scroll distance (px) over which the header fades from see-through to frosted glass.
const FADE_DISTANCE = 220;

// "light" when the section under the header is a light colour, "dark" for navy sections and photos.
// Checks five points across the bar and takes the majority, so small gaps (between photo tiles,
// for example) don't make it flicker.
function toneUnder(header: HTMLElement): "light" | "dark" {
  const y = header.offsetHeight / 2;
  let light = 0;
  for (const x of [0.1, 0.3, 0.5, 0.7, 0.9]) if (toneAt(header, innerWidth * x, y) === "light") light++;
  return light >= 3 ? "light" : "dark";
}

// Goes down through everything stacked at (x, y) under the header, top to bottom: a photo or
// background image counts as dark (also when text sits on top of it), otherwise the first solid
// background colour decides.
function toneAt(header: HTMLElement, x: number, y: number): "light" | "dark" {
  for (const e of document.elementsFromPoint(x, y)) {
    if (header.contains(e)) continue;
    if (/^(IMG|VIDEO|CANVAS|PICTURE)$/.test(e.tagName)) return "dark";
    const cs = getComputedStyle(e);
    if (cs.backgroundImage.includes("url(")) return "dark";
    const m = cs.backgroundColor.match(/[\d.]+/g);
    if (m && (m[3] === undefined || +m[3] > 0.5)) {
      const [r, g, b] = m.map(Number);
      return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "light" : "dark";
    }
  }
  return "light";
}

// Firm phone comes from the server wrapper (components/Header.tsx).
// The header floats over the page (like octicase.com): see-through at the top, then a frosted-glass
// background fades in as you scroll (the --p CSS variable, 0 to 1). data-tone switches it between
// dark glass with white links and white glass with navy links, following the section underneath.
export default function HeaderClient({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  // false on pages that don't start with a dark hero: the header is then solid and reserves its own space
  const [overHero, setOverHero] = useState(true);

  // Free-review CTAs open the case-review popup (site layout), except on /contact, which has the form on the page.
  const ctaHref = pathname === "/contact" ? "#contact-form" : "#lead-form";

  useEffect(() => {
    const hero = document.querySelector(".hero, .page-hero");
    setOverHero(!!hero && hero.getBoundingClientRect().top + window.scrollY < 10);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = headerRef.current;
      if (!header) return;
      const p = Math.min(Math.max(window.scrollY / FADE_DISTANCE, 0), 1);
      header.style.setProperty("--p", p.toFixed(3));
      const tone = toneUnder(header);
      if (header.dataset.tone !== tone) header.dataset.tone = tone;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, [pathname]);

  // close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header ref={headerRef} className={`header${overHero && !open ? "" : " is-solid"}`}>
        <div className="container nav">
          <Link className="nav__logo" href="/" aria-label="California Law home">
            <Logo eager />
          </Link>
          <nav className={`nav__links${open ? " open" : ""}`} aria-label="Primary">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : undefined} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav__cta">
            <a className="nav__call" href={phoneHref} aria-label={`Call ${phone}`}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
              </svg>
              <span>{phone}</span>
            </a>
            <a className="nav__review" href={ctaHref}>Free Case Review - 24/7</a>
          </div>
          <button
            className={`nav__toggle${open ? " open" : ""}`}
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
      {/* pages without a hero: keep content from sliding under the fixed header */}
      {!overHero && <div className="header-spacer" aria-hidden="true" />}
    </>
  );
}
