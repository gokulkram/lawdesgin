"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Area = { label: string; desc: string; href: string; img: string };

const noMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-no-motion");

// Personal-injury scroll story: the heading, the current practice area and an index of all of them
// stay pinned on the left while full-height photos scroll up on the right; the text swaps (blurring
// in) as each photo reaches the middle of the screen. On phones nothing is pinned - each photo
// carries its own text underneath.
export function AreaStory({ title, text, areas, moreLabel }: { title: string; text: string; areas: Area[]; moreLabel: string }) {
  const [active, setActive] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const mark = innerHeight * 0.5;
      let a = 0;
      media.querySelectorAll<HTMLElement>(":scope > figure").forEach((f, i) => { if (f.getBoundingClientRect().top < mark) a = i; });
      setActive(a);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  const cur = areas[active];
  return (
    <div className="pis">
      <div className="pis__side">
        <div className="pis__sticky">
          <h3 className="pis__title">{title}</h3>
          <p className="pis__intro">{text}</p>
          <div className="pis__active" key={active}>
            <span className="pis__num">{pad(active + 1)}</span>
            <div>
              <strong>{cur.label}</strong>
              <p>{cur.desc}</p>
              <Link href={cur.href} className="pis__link">{cur.label} lawyers &rarr;</Link>
            </div>
          </div>
          <ol className="pis__index">
            {areas.map((a, i) => (
              <li key={a.href}>
                <Link href={a.href} aria-current={i === active ? "true" : undefined}><span>{pad(i + 1)}</span>{a.label}</Link>
              </li>
            ))}
          </ol>
          <Link className="wwd-more" href="/practice-areas">{moreLabel}</Link>
        </div>
      </div>
      <div className="pis__media" ref={mediaRef}>
        {areas.map((a, i) => (
          <figure className={`pis__shot${i === active ? " is-active" : ""}`} key={a.href}>
            <div className="pis__img"><Image src={a.img} alt="" fill sizes="(max-width: 920px) 100vw, 55vw" /></div>
            <figcaption className="pis__cap">
              <span className="pis__num">{pad(i + 1)}</span>
              <div>
                <strong>{a.label}</strong>
                <p>{a.desc}</p>
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
