"use client";

import { useEffect, useRef, useState } from "react";

type Step = { title: string; text: string };

const pad = (n: number) => String(n).padStart(2, "0");

// "How it works" on the home page: a sticky heading + step counter on the left, and a vertical
// timeline on the right whose gold line fills as you scroll. The step at the middle of the screen
// lights up; steps above it stay lit with a tick. Visitors who ask for reduced motion see every
// step lit and the line full.
export default function ProcessTimeline({ eyebrow, title, steps, icons, phone, phoneHref }: {
  eyebrow: string; title: string; steps: Step[]; icons: React.ReactNode[]; phone: string; phoneHref: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const noMotion = () =>
      matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-no-motion");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (noMotion()) { setActive(steps.length - 1); setProgress(1); return; }
      const mark = innerHeight * 0.55; // the "reading line" on screen
      const r = list.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, (mark - r.top) / r.height)));
      let a = -1;
      list.querySelectorAll<HTMLElement>(":scope > li").forEach((li, i) => {
        if (li.getBoundingClientRect().top < mark) a = i;
      });
      setActive(a);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, [steps.length]);

  const shown = Math.max(0, active);
  return (
    <section className="hiw" aria-labelledby="hiw-title">
      <div className="container">
        <p className="sec-rule reveal" aria-hidden="true"><span>{eyebrow}</span></p>
      </div>
      <div className="container hiw__grid">
        <div className="hiw__side">
          <div className="hiw__sticky">
            <h2 id="hiw-title">{title}</h2>
            <div className="hiw__count" aria-hidden="true">
              <span className="hiw__now" key={shown}>{pad(shown + 1)}</span>
              <span className="hiw__of">/ {pad(steps.length)}</span>
            </div>
            <div className="hiw__bar" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
            <div className="hiw__actions">
              <a className="btn btn--gold" href="#lead-form" aria-haspopup="dialog">Start with a free consultation</a>
              <a className="hiw__phone" href={phoneHref}>or call {phone}</a>
            </div>
          </div>
        </div>

        <ol className="hiw__steps" ref={listRef} style={{ "--p": progress } as React.CSSProperties}>
          {steps.map((s, i) => (
            <li key={i} className={i < active ? "is-done" : i === active ? "is-active" : undefined}>
              <span className="hiw__num" aria-hidden="true">{pad(i + 1)}</span>
              <div className="hiw__body">
                <div className="hiw__icon" aria-hidden="true">{icons[i]}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              <svg className="hiw__tick" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
