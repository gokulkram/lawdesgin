"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Area = { label: string; desc: string; href: string; img: string };

const noMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-no-motion");

// Personal-injury scroll story (like octicase.com's "Wherever you work" section). On desktop the text
// column stays pinned on the left while a column of full-height photos scrolls up naturally on the
// right; when a photo's top passes the middle of the screen, the text slides to that practice area.
// Each photo drifts slightly inside its frame (parallax) and darkens a little toward the screen edges.
// On phones nothing is pinned - each photo is listed with its own text underneath.
export function AreaStory({ title, text, areas, moreLabel }: { title: string; text: string; areas: Area[]; moreLabel: string }) {
  const [active, setActive] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    const shots = Array.from(media.querySelectorAll<HTMLElement>(":scope > figure"));
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    let frame = 0;
    let shown = -1;
    const tick = () => {
      frame = 0;
      const mid = innerHeight / 2;
      const still = noMotion();
      let a = 0;
      shots.forEach((f, i) => {
        const r = f.getBoundingClientRect();
        if (r.top <= mid) a = i;
        if (r.bottom < -50 || r.top > innerHeight + 50) return; // off screen: leave as is
        // -1 (photo below the middle) .. 0 (centred) .. 1 (above)
        const p = clamp((mid - (r.top + r.height / 2)) / (innerHeight / 2 + r.height / 2), -1, 1);
        f.style.setProperty("--y", still ? "0%" : `${(p * 7).toFixed(3)}%`);
        // The photo crossing the middle of the screen (the active topic) is fully bright; the others
        // fade darker the further their nearest edge is from the middle, so the change is gradual.
        const gap = r.top > mid ? r.top - mid : mid > r.bottom ? mid - r.bottom : 0;
        f.style.setProperty("--dim", clamp(gap / (innerHeight * 0.15), 0, 1).toFixed(3));
      });
      // progress through the photos, for the thin bar on the left
      const first = shots[0].getBoundingClientRect(), last = shots[shots.length - 1].getBoundingClientRect();
      const span = last.bottom - first.top - innerHeight;
      const prog = span > 0 ? clamp((mid - first.top - innerHeight / 2) / span, 0, 1) : 0;
      barRef.current?.style.setProperty("transform", `scaleX(${prog.toFixed(4)})`);
      if (a !== shown) { shown = a; setActive(a); }
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", wake);
    return () => { removeEventListener("scroll", wake); removeEventListener("resize", wake); cancelAnimationFrame(frame); };
  }, []);
  return (
    <div className="pis">
      <div className="pis__side">
        <div className="pis__sticky">
          <h3 className="pis__title">{title}</h3>
          <p className="pis__intro">{text}</p>
          {/* Every panel stays mounted in one grid cell. Panels before the current one wait above it
              and later ones below, so the text always slides the way the page is scrolling. */}
          <div className="pis__active">
            {areas.map((a, i) => (
              <div className={`pis__panel ${i === active ? "is-active" : i < active ? "is-past" : "is-next"}`} key={a.href} aria-hidden={i !== active} inert={i !== active}>
                <div>
                  {/* heading + description are a mouse shortcut to the page; keyboard and screen
                      readers use the single "lawyers" link below instead of a duplicate */}
                  <Link href={a.href} className="pis__hit" tabIndex={-1} aria-hidden="true">
                    <strong>{a.label}</strong>
                    <p>{a.desc}</p>
                  </Link>
                  <Link href={a.href} className="pis__link">{a.label} lawyers &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="pis__progress" aria-hidden="true"><span ref={barRef} /></div>
          <Link className="wwd-more" href="/practice-areas">{moreLabel}</Link>
        </div>
      </div>
      {/* desktop: full-height photos that scroll past; phones: a plain list with captions */}
      <div className="pis__media" ref={mediaRef}>
        {areas.map((a, i) => (
          <figure className={`pis__shot${i === active ? " is-active" : ""}`} key={a.href}>
            <Link href={a.href} className="pis__img" tabIndex={-1} aria-hidden="true">
              <Image src={a.img} alt="" fill sizes="(max-width: 920px) 100vw, 55vw" />
            </Link>
            <figcaption className="pis__cap">
              <div>
                <Link href={a.href} className="pis__hit" tabIndex={-1} aria-hidden="true">
                  <strong>{a.label}</strong>
                  <p>{a.desc}</p>
                </Link>
                <Link href={a.href} className="pis__link">{a.label} lawyers &rarr;</Link>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

// Moves its child a little slower than the page scroll, for a layered feel.
export function SlowScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (noMotion()) { el.style.transform = ""; return; }
      const r = el.parentElement!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      let offset = (r.top + r.height / 2 - innerHeight / 2) * -0.08;
      // When this layer is taller than its frame (a photo with spare edges), never move it further
      // than that spare space, or the frame's background shows at the top or bottom.
      const room = (el.offsetHeight - r.height) / 2;
      if (room > 0) offset = Math.max(-room, Math.min(room, offset));
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
