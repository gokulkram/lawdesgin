"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/admin/settings-model";
import { SlowScroll } from "@/components/WhatWeDoFx";

const DURATION = 7000; // ms each story stays before the next (also the timer bar's length)
const pad = (n: number) => String(n).padStart(2, "0");
const sentences = (text: string) => text.match(/[^.!?]+[.!?]+["”’]?\s*/g) ?? [text];

// Home-page client stories: the current story large on the left, every story in a list on the
// right. The active row's gold bar is the timer; when it fills, the next story shows. Auto-play
// stops while the visitor hovers, focuses inside, has paused it, or the section is off-screen,
// and never runs for visitors who ask for reduced motion (the bar's animation is turned off).
// Approved testimonials come from the server wrapper (components/Testimonials.tsx), never empty.
export default function TestimonialsClient({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [cycle, setCycle] = useState(0); // restarts the timer bar on manual navigation
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const n = items.length;

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (to: number) => { setI(((to % n) + n) % n); setCycle((c) => c + 1); };
  const playing = n > 1 && !paused && !hover && !focusIn && inView;
  const t = items[i];

  return (
    <section
      ref={ref}
      className="tst"
      id="testimonials"
      aria-labelledby="tst-title"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocusIn(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusIn(false); }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1);
      }}
    >
      <div className="container">
        <div className="tst__head reveal">
          <div>
            <span className="eyebrow eyebrow--light">Client Stories</span>
            <h2 id="tst-title">Families we&rsquo;ve stood beside</h2>
          </div>
          {n > 1 && (
            <div className="tst__controls">
              <button type="button" onClick={() => go(i - 1)} aria-label="Previous story">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
              </button>
              <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play stories" : "Pause stories"} aria-pressed={paused}>
                {paused
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>}
              </button>
              <button type="button" onClick={() => go(i + 1)} aria-label="Next story">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>
          )}
        </div>

        <div className="tst__grid">
          <div className="tst__stage reveal">
            <SlowScroll className="tst__mark"><span aria-hidden="true">&ldquo;</span></SlowScroll>
            <figure className="tst__slide" key={i} aria-live={playing ? "off" : "polite"}>
              <div className="tst__stars" role="img" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <blockquote>
                <p>{sentences(t.quote).map((s, k) => <span key={k} style={{ "--k": k } as React.CSSProperties}>{s}</span>)}</p>
              </blockquote>
              <figcaption>
                <strong>{t.who}</strong>
                <span>{t.kind}</span>
                {t.verified && <em className="tst__verified">Verified client</em>}
              </figcaption>
            </figure>
            {n > 1 && <div className="tst__count" aria-hidden="true"><b>{pad(i + 1)}</b> / {pad(n)}</div>}
          </div>

          {n > 1 && (
            <ul className="tst__list reveal" aria-label="All client stories">
              {items.map((s, idx) => (
                <li key={s.who}>
                  <button type="button" onClick={() => go(idx)} aria-current={idx === i ? "true" : undefined}>
                    <span className="tst__avatar" aria-hidden="true">{s.initials}</span>
                    <span className="tst__who"><strong>{s.who}</strong><span>{s.kind}</span></span>
                    {idx === i && (
                      <span className="tst__timer" aria-hidden="true">
                        <span
                          key={cycle}
                          style={{ animationDuration: `${DURATION}ms`, animationPlayState: playing ? "running" : "paused" }}
                          onAnimationEnd={() => setI((x) => (x + 1) % n)}
                        />
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="tst__note">Testimonials reflect individual clients&rsquo; experiences. Results depend on the facts of each case and are not a guarantee of a similar outcome.</p>
      </div>
    </section>
  );
}
