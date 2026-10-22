"use client";

import { CONSENT_REOPEN_EVENT } from "@/lib/consent";

// Footer link that shows the cookie bar again, so visitors can change their choice.
export default function CookiePrefsLink() {
  return (
    <button type="button" className="footer__linkbtn" onClick={() => window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))}>
      Cookie preferences
    </button>
  );
}
