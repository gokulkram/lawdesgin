"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONSENT_REOPEN_EVENT, getConsent, setConsent, type Consent } from "@/lib/consent";

// Cookie / tracking notice. Non-blocking bar at the bottom of the screen, quick to get past:
// Accept, Decline, the × or Esc while in the bar (× and Esc count as Decline). Analytics only loads after
// Accept (components/ConsentGate.tsx). Rendered after mount only, so the server HTML never
// differs from what the browser shows. "Cookie preferences" in the footer brings it back so a
// visitor can change their mind. The wording should be approved by the firm.
export default function ConsentBar() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShow(getConsent() === null);
    const reopen = () => setShow(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  // keep other fixed buttons (accessibility, case-review card) above the bar while it is shown
  useEffect(() => {
    const root = document.documentElement;
    if (!show || !ref.current) { root.style.removeProperty("--consent-h"); return; }
    const el = ref.current;
    const sync = () => root.style.setProperty("--consent-h", `${el.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    // Esc declines only while focus is in the bar (so Esc for a menu or popup elsewhere doesn't)
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") answer("declined"); };
    el.addEventListener("keydown", onKey);
    return () => { ro.disconnect(); el.removeEventListener("keydown", onKey); root.style.removeProperty("--consent-h"); };
  }, [show]);

  const answer = (v: Consent) => { setConsent(v); setShow(false); };

  if (!show) return null;
  return (
    <div ref={ref} className="consent" role="region" aria-label="Cookie notice">
      <div className="container consent__inner">
        <p className="consent__text">
          <strong>Your privacy.</strong> We use cookies and similar tools to run this site, measure visits and improve our
          advertising. <Link href="/privacy">Privacy policy</Link>
        </p>
        <div className="consent__actions">
          <button type="button" className="consent__btn consent__btn--ghost" onClick={() => answer("declined")}>Decline</button>
          <button type="button" className="consent__btn" onClick={() => answer("accepted")}>Accept</button>
        </div>
        <button type="button" className="consent__close" aria-label="Close (decline)" onClick={() => answer("declined")}>&times;</button>
      </div>
    </div>
  );
}
