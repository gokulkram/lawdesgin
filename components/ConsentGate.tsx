"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

// Renders its children (the analytics scripts) only once the visitor has accepted cookies.
export default function ConsentGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(getConsent() === "accepted");
    const on = (e: Event) => setOk((e as CustomEvent).detail === "accepted");
    window.addEventListener(CONSENT_EVENT, on);
    return () => window.removeEventListener(CONSENT_EVENT, on);
  }, []);
  return ok ? <>{children}</> : null;
}
