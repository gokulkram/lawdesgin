// Visitor's cookie/tracking choice, kept in this browser. Read by the consent bar, the analytics
// gate and the popups (which wait until the visitor has answered the bar).
export type Consent = "accepted" | "declined";

export const CONSENT_KEY = "cl-consent";
export const CONSENT_EVENT = "cl-consent-change";
/** Fired by the footer "Cookie preferences" link: shows the consent bar again. */
export const CONSENT_REOPEN_EVENT = "cl-consent-reopen";

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage blocked: applies to this page view only */ }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
}

/** Runs `fn` once the visitor has answered the consent bar (right away if they already have). */
export function afterConsentAnswered(fn: () => void): () => void {
  if (getConsent()) { fn(); return () => {}; }
  const on = () => fn();
  window.addEventListener(CONSENT_EVENT, on, { once: true });
  return () => window.removeEventListener(CONSENT_EVENT, on);
}
