"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { afterConsentAnswered } from "@/lib/consent";

// Site-wide case-review form in a popup (native <dialog>: focus stays inside, Esc closes). Lives in
// the site layout, so every page has it. Any link to "#lead-form" opens it, and so does arriving on a
// page with #lead-form in the address. Without JavaScript the links still work: CSS shows the dialog
// as a :target overlay instead.
//
// autoOpenOn: pages where it also opens by itself, autoOpenAfter ms after the page loaded (and never
// before the visitor has answered the cookie bar) - once per visitor, first visit only. A visitor who already opened the form isn't
// interrupted. "Seen" is shared with the scroll card (components/ReviewNudge.tsx).
export const SEEN_KEY = "cl-lead-popup-seen";
const seen = () => { try { return localStorage.getItem(SEEN_KEY) !== null; } catch { return true; } }; // storage blocked: never auto-open
export const OPENED_THIS_VISIT_KEY = "cl-lead-opened";
const markSeen = () => {
  try { localStorage.setItem(SEEN_KEY, new Date().toISOString()); sessionStorage.setItem(OPENED_THIS_VISIT_KEY, "1"); } catch { /* storage blocked */ }
  window.dispatchEvent(new Event(OPENED_THIS_VISIT_KEY));
};

export default function LeadDialog({ title, text, autoOpenOn = [], autoOpenAfter = 5000, children }: {
  title: string; text: string; autoOpenOn?: string[]; autoOpenAfter?: number; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const auto = autoOpenOn.includes(pathname);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.dataset.ready = ""; // script is running: turns off the CSS :target fallback
    const open = () => {
      markSeen();
      if (dialog.open) return;
      dialog.showModal();
      // start in the first field with a mouse; on touch screens don't pop the keyboard up
      if (matchMedia("(pointer: fine)").matches) dialog.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
    };

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href="#lead-form"]');
      if (!link) return;
      e.preventDefault();
      open();
    };
    // a click on the dark backdrop (outside the card) closes it
    const onBackdrop = (e: MouseEvent) => { if (e.target === dialog) dialog.close(); };
    // drop #lead-form from the address once closed, so a reload doesn't reopen it
    const onClose = () => { if (location.hash === "#lead-form") history.replaceState(null, "", location.pathname + location.search); };
    // also when #lead-form is added to the address on this page, or the page loads with it
    const onHash = () => { if (location.hash === "#lead-form") open(); };

    document.addEventListener("click", onClick);
    dialog.addEventListener("click", onBackdrop);
    dialog.addEventListener("close", onClose);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
      dialog.removeEventListener("click", onBackdrop);
      dialog.removeEventListener("close", onClose);
    };
  }, []);

  // first-visit auto popup: autoOpenAfter ms after the page loaded; if the cookie bar is still
  // unanswered by then, a couple of seconds after it is answered
  // (not while the tab is in the background or the visitor is typing)
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !auto || seen()) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const autoOpen = () => {
      if (document.hidden) return document.addEventListener("visibilitychange", autoOpen, { once: true });
      if (seen() || document.querySelector("dialog[open]")) return;
      if (document.activeElement?.matches("input, textarea, select, [contenteditable=true]")) { timer = setTimeout(autoOpen, 3000); return; }
      markSeen();
      dialog.showModal();
    };
    const stopWaiting = afterConsentAnswered(() => {
      // performance.now() = ms since this page started loading
      timer = setTimeout(autoOpen, Math.max(autoOpenAfter - performance.now(), 2000));
    });
    return () => {
      stopWaiting();
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", autoOpen);
    };
  }, [auto, autoOpenAfter]);

  return (
    <dialog ref={ref} id="lead-form" className="lead-modal" aria-labelledby="lead-modal-title">
      <div className="lead-card lead-modal__card">
        {/* a link, so it also closes the no-JavaScript :target version */}
        <a href="#" className="lead-modal__close" aria-label="Close" onClick={(e) => { e.preventDefault(); ref.current?.close(); }}>&times;</a>
        <span className="lead-modal__eyebrow">Free &middot; Confidential &middot; 24/7</span>
        <h2 id="lead-modal-title">{title}</h2>
        <p className="muted">{text}</p>
        {children}
      </div>
    </dialog>
  );
}
