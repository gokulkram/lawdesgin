"use client";

// Slim bar that sticks under the site header on the practice-areas page and highlights the group
// being read. Plain anchor links, so it works without JavaScript too.
import { useEffect, useRef, useState } from "react";

export default function PracticeGroupNav({ groups, label = "Jump to a practice area group" }: { groups: { id: string; name: string }[]; label?: string }) {
  const [active, setActive] = useState(groups[0]?.id);
  const [top, setTop] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Sit directly under the fixed site header, whatever its height (it shrinks as the page scrolls).
    const header = document.querySelector<HTMLElement>(".header");
    const measure = () => setTop(header ? Math.round(header.getBoundingClientRect().height) : 0);
    measure();
    window.addEventListener("resize", measure);

    const sections = groups.map((g) => document.getElementById(g.id)).filter((el): el is HTMLElement => !!el);
    const onScroll = () => {
      measure();
      const line = (header?.getBoundingClientRect().height ?? 0) + 120;
      let current = groups[0]?.id;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, [groups]);

  // Keep the active tab in view when the bar scrolls sideways (phones).
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const list = listRef.current;
    if (el && list && list.scrollWidth > list.clientWidth) list.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="pa-tabs" style={{ top }} aria-label={label}>
      <div className="container">
        <ul ref={listRef}>
          {groups.map((g, i) => (
            <li key={g.id}>
              <a href={`#${g.id}`} data-id={g.id} className={active === g.id ? "is-active" : undefined} aria-current={active === g.id ? "true" : undefined}>
                <span className="pa-tabs__num">{String(i + 1).padStart(2, "0")}</span>{g.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
