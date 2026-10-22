"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { OPENED_THIS_VISIT_KEY, SEEN_KEY } from "@/components/LeadDialog";
import { afterConsentAnswered } from "@/lib/consent";

// "Free case evaluation" card that slides in (bottom right) once the visitor scrolls past the hero
// (about one screen down on pages without one). Not a blocking popup: its button opens the
// case-review popup. Hidden for the rest of the visit once closed or once the form was opened, and on
// pages that already show the form. One prompt at a time: it waits until the cookie bar is answered,
// and on the home page of a first visit it stays away until the timed popup has had its turn.
const DISMISS_KEY = "cl-nudge-dismissed";
const HIDDEN_ON = ["/contact", "/thank-you"];
const flag = (k: string) => { try { return sessionStorage.getItem(k) !== null; } catch { return false; } };
const popupSeen = () => { try { return localStorage.getItem(SEEN_KEY) !== null; } catch { return true; } };

export default function ReviewNudge() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShow(false);
    if (HIDDEN_ON.includes(pathname)) { setDone(true); return; }
    const off = () => flag(DISMISS_KEY) || flag(OPENED_THIS_VISIT_KEY);
    setDone(off());
    const onOpened = () => setDone(true);
    window.addEventListener(OPENED_THIS_VISIT_KEY, onOpened);

    let ready = false; // cookie bar answered
    let frame = 0;
    const check = () => {
      frame = 0;
      if (!ready || (pathname === "/" && !popupSeen())) return setShow(false);
      const hero = document.querySelector(".hero, .page-hero");
      const past = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > window.innerHeight * 0.9;
      setShow(past && !document.querySelector("dialog[open]"));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    const stopWaiting = afterConsentAnswered(() => { ready = true; onScroll(); });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stopWaiting();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(OPENED_THIS_VISIT_KEY, onOpened);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* storage blocked */ }
    setDone(true);
  };

  if (done) return null;
  return (
    <aside className={`nudge${show ? " is-shown" : ""}`} aria-label="Free case evaluation" aria-hidden={!show} inert={!show}>
      <span className="nudge__pulse" aria-hidden="true"></span>
      <div className="nudge__body">
        <strong className="nudge__title">Free case evaluation</strong>
        <span className="nudge__text">Talk to a California attorney - free and confidential.</span>
      </div>
      <a className="nudge__btn" href="#lead-form" aria-haspopup="dialog">Start</a>
      <button type="button" className="nudge__close" aria-label="Close" onClick={dismiss}>&times;</button>
    </aside>
  );
}
