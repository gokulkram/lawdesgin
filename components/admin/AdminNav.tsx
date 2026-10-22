"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import type { StaffRole } from "@/lib/admin/auth";

type Item = { href: string; label: string; roles?: StaffRole[]; soon?: boolean };

// Modules marked `soon` are planned and shown disabled until built.
const ITEMS: Item[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/redirects", label: "Redirects" },
  { href: "/admin/settings", label: "Site settings", roles: ["admin"] },
  { href: "/admin/users", label: "Users", roles: ["admin"] },
  { href: "/admin/account", label: "My account" },
];

export default function AdminNav({ role }: { role: StaffRole }) {
  const pathname = usePathname();
  return (
    <nav className="adm-nav" aria-label="Admin">
      {ITEMS.filter((i) => !i.roles || i.roles.includes(role)).map((i) =>
        i.soon ? (
          <span key={i.href} className="adm-nav__item is-soon" aria-disabled="true">
            {i.label} <small>Soon</small>
          </span>
        ) : (
          <Link
            key={i.href}
            href={i.href}
            className={`adm-nav__item${(i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href)) ? " is-active" : ""}`}
          >
            {i.label}
            <PendingSpinner />
          </Link>
        )
      )}
    </nav>
  );
}

// Shows a small spinner on the clicked item until the new page is ready, so a slow page load
// (e.g. first visit in dev while the page compiles) doesn't look like a dead click.
function PendingSpinner() {
  const { pending } = useLinkStatus();
  return <span aria-hidden className={`adm-nav__spin${pending ? " is-pending" : ""}`} />;
}
