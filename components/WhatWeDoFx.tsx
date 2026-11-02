"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Area = { label: string; desc: string; href: string; img: string };

const noMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-no-motion");

// Personal-injury scroll story: the heading and the current practice area stay pinned on the left
// while photos scroll up on the right. Each photo's parallax, zoom and dimming follow the scroll
// continuously (eased toward the target every frame), and the text slides in the direction of travel
// as each photo reaches the middle of the screen. On phones nothing is pinned - each photo carries
// its own text underneath.
export function AreaStory({ title, text, areas, moreLabel }: { title: string; text: string; areas: Area[]; moreLabel: string }) {
  const [active, setActive] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    const shots = Array.from(media.querySelectorAll<HTMLElement>(":scope > figure"));
    // eased values that chase the scroll-derived targets, so motion never steps
    const cur = shots.map(() => 1);
    let bar = 0;
    let frame = 0;
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    const tick = () => {
      frame = 0;
      const mid = innerHeight * 0.5;
      const still = noMotion();
      let a = 0;
      let moving = false;
      shots.forEach((f, i) => {
        const r = f.getBoundingClientRect();
        if (r.top < mid) a = i;
        // -1 (below centre) .. 0 (centred) .. 1 (above centre)
        const target = clamp((mid - (r.top + r.height / 2)) / (mid + r.height / 2), -1, 1);
        const p = still ? target : cur[i] + (target - cur[i]) * 0.14;
        if (Math.abs(target - p) > 0.0005) moving = true;
        cur[i] = p;
        const d = Math.abs(p);
        f.style.setProperty("--y", still ? "0%" : `${(p * 6).toFixed(3)}%`);
        f.style.setProperty("--s", still ? "1" : (1.14 + d * 0.06).toFixed(4));
        f.style.setProperty("--dim", Math.min(1, d * 1.6).toFixed(3));
      });
      // overall progress through the photos, for the thin bar on the left
      const first = shots[0].getBoundingClientRect();
      const last = shots[shots.length - 1].getBoundingClientRect();
      const span = last.top + last.height / 2 - (first.top + first.height / 2);
      const goal = span > 0 ? clamp((mid - (first.top + first.height / 2)) / span, 0, 1) : 0;
      bar = still ? goal : bar + (goal - bar) * 0.14;
      if (Math.abs(goal - bar) > 0.0005) moving = true;
      barRef.current?.style.setProperty("transform", `scaleX(${bar.toFixed(4)})`);
      setActive(a);
      if (moving) frame = requestAnimationFrame(tick);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", wake);
    return () => { removeEventListener("scroll", wake); removeEventListener("resize", wake); cancelAnimationFrame(frame); };
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
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
                <span className="pis__num">{pad(i + 1)}</span>
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
      <div className="pis__media" ref={mediaRef}>
        {areas.map((a, i) => (
          <figure className={`pis__shot${i === active ? " is-active" : ""}`} key={a.href}>
            <Link href={a.href} className="pis__img" tabIndex={-1} aria-hidden="true">
              <Image src={a.img} alt="" fill sizes="(max-width: 920px) 100vw, 55vw" />
            </Link>
            <figcaption className="pis__cap">
              <span className="pis__num">{pad(i + 1)}</span>
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
