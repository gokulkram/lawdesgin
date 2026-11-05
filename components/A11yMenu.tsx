"use client";

import { useEffect, useRef, useState } from "react";

// Accessibility menu: floating button + panel. Preferences persist in localStorage;
// the boot script in app/layout.tsx applies them before first paint.

const KEY = "wsl-a11y";
const TEXT_STEPS = ["100%", "112.5%", "125%", "137.5%"];
const TOGGLES = [
  { key: "contrast", label: "High contrast", cls: "a11y-contrast" },
  { key: "links", label: "Highlight links", cls: "a11y-links" },
  { key: "readable", label: "Readable font", cls: "a11y-readable" },
  { key: "motion", label: "Pause motion", cls: "a11y-no-motion" },
  { key: "cursor", label: "Big cursor", cls: "a11y-cursor" },
] as const;

type ToggleKey = (typeof TOGGLES)[number]["key"];
type Prefs = { text: number } & Record<ToggleKey, boolean>;

const DEFAULTS: Prefs = { text: 0, contrast: false, links: false, readable: false, motion: false, cursor: false };

function load(): Prefs {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") {
      const out = { ...DEFAULTS };
      for (const k of Object.keys(DEFAULTS) as (keyof Prefs)[]) if (k in saved) (out as Record<string, unknown>)[k] = saved[k];
      return out;
    }
  } catch {}
  return DEFAULTS;
}

export default function A11yMenu() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefs(load());
    setLoaded(true);
  }, []);

  // apply + persist (skip until saved prefs are read, so defaults don't overwrite them)
  useEffect(() => {
    if (!loaded) return;
    const h = document.documentElement;
    h.style.fontSize = TEXT_STEPS[prefs.text] || "100%";
    TOGGLES.forEach((t) => h.classList.toggle(t.cls, !!prefs[t.key]));
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs, loaded]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    const onOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !fabRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onOutside, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onOutside, true);
    };
  }, [open]);

  const setText = (d: number) => setPrefs((p) => ({ ...p, text: Math.max(0, Math.min(TEXT_STEPS.length - 1, p.text + d)) }));

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        className="a11y__fab"
        aria-label="Accessibility menu"
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="3.6" r="2.1" fill="currentColor" />
          <path d="M12 7c-2.1 0-5.2 1-7.2 1l.3 2c1.6 0 3.2-.4 4.3-.7V13l-2.6 7.1 1.9.7L11.9 15l3.3 5.9 1.9-.7L14.6 13V9.3c1.1.3 2.7.7 4.3.7l.3-2c-2 0-5.1-1-7.2-1z" fill="currentColor" />
        </svg>
      </button>

      <div ref={panelRef} className="a11y__panel" id="a11y-panel" role="dialog" aria-label="Accessibility settings" hidden={!open} data-lenis-prevent>
        <div className="a11y__head">
          <h2 className="a11y__title">Accessibility</h2>
          <button
            type="button"
            className="a11y__close"
            aria-label="Close accessibility menu"
            onClick={() => {
              setOpen(false);
              fabRef.current?.focus();
            }}
          >
            &times;
          </button>
        </div>
        <div className="a11y__row">
          <span className="a11y__lbl">Text size</span>
          <span className="a11y__stepper">
            <button type="button" aria-label="Decrease text size" onClick={() => setText(-1)}>A&minus;</button>
            <span className="a11y__level" aria-live="polite">{prefs.text}</span>
            <button type="button" aria-label="Increase text size" onClick={() => setText(1)}>A+</button>
          </span>
        </div>
        <div className="a11y__grid">
          {TOGGLES.map((t) => (
            <button
              key={t.key}
              type="button"
              className="a11y__opt"
              aria-pressed={prefs[t.key]}
              onClick={() => setPrefs((p) => ({ ...p, [t.key]: !p[t.key] }))}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button type="button" className="a11y__reset" onClick={() => setPrefs(DEFAULTS)}>Reset all settings</button>
      </div>
    </>
  );
}
