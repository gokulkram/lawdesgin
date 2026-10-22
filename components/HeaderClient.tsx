"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/firm";
import Logo from "@/components/Logo";

// Firm phone/email come from the server wrapper (components/Header.tsx).
export default function HeaderClient({ phone, phoneHref, email }: { phone: string; phoneHref: string; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  // Free-review CTAs open the case-review popup (site layout), except on /contact, which has the form on the page.
  const ctaHref = pathname === "/contact" ? "#contact-form" : "#lead-form";

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="topbar__left">
            <span>&#9742; <a href={phoneHref}>{phone}</a></span>
            <span>&#9993; <a href={`mailto:${email}`}>{email}</a></span>
          </div>
          <a className="topbar__cta" href={ctaHref}>Free Case Review - 24/7</a>
        </div>
      </div>

      <header className={`header${stuck ? " is-stuck" : ""}`}>
        <div className="container nav">
          <Link className="nav__logo" href="/" aria-label="California Law home">
            <Logo eager />
          </Link>
          <nav className={`nav__links${open ? " open" : ""}`} aria-label="Primary">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : undefined} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav__cta">
            <a className="nav__call" href={phoneHref} aria-label={`Call ${phone}`}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
              </svg>
              <span>{phone}</span>
            </a>
          </div>
          <button
            className={`nav__toggle${open ? " open" : ""}`}
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
    </>
  );
}
