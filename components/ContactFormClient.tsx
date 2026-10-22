"use client";

import { useState, type FormEvent, type ReactNode } from "react";

// Case-review form. Posts natively to /api/contact (works without JS, redirects to
// /thank-you); with JS it validates, submits via fetch and shows an inline message.

type Variant = "lead" | "page";

function isValid(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  // case type is a group of radio "chips": valid once one of them is picked
  if (el.type === "radio") return !!el.form?.querySelector(`input[name="${el.name}"]:checked`);
  const val = (el.value || "").trim();
  if (!val) return false;
  if (el.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  if (el.type === "tel") return val.replace(/\D/g, "").length >= 7;
  return true;
}

// What to say when a required field is missing or wrong (shown under the sentence).
const ERRORS: Record<string, string> = {
  name: "Add your name.",
  case_type: "Choose what your case is about.",
  phone: "Add a phone number we can reach you on.",
  email: "Add a valid email address.",
  message: "Add a few words about what happened.",
};
const ORDER = ["name", "case_type", "phone", "email", "message"];

// Case types, offices and phone come from the server wrapper (components/ContactForm.tsx).
export default function ContactFormClient({ variant, caseTypes, offices, phone: firmPhone }: { variant: Variant; caseTypes: string[]; offices: string[]; phone: string }) {
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const p = variant === "lead" ? "f" : "c";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const required = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[required]"));
    const bad = required.filter((el) => !isValid(el)).filter((el, i, all) => all.findIndex((x) => x.name === el.name) === i);
    setInvalid(new Set(bad.map((el) => el.name)));
    if (bad.length) {
      bad[0].focus();
      return;
    }

    setStatus("sending");
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      form.querySelector(".form-success")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch {
      setStatus("error");
      form.querySelector(".form-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // clear a field's error as the user types
  const clear = (name: string) => () =>
    invalid.has(name) &&
    setInvalid((s) => {
      const n = new Set(s);
      n.delete(name);
      return n;
    });

  const disabled = status === "sending" || status === "sent";
  const locked = status === "sent";

  // The form reads as a sentence the visitor completes; each blank is a real, labelled field.
  const slot = (field: string, label: string, input: ReactNode, wide = false) => (
    <span className={`mad__slot${wide ? " mad__slot--wide" : ""}${invalid.has(field) ? " is-invalid" : ""}`}>
      <label className="vh" htmlFor={`${p}-${field}`}>{label}</label>
      {input}
    </span>
  );
  const bad = (field: string) => (invalid.has(field) ? true : undefined);

  const name = slot("name", "Your full name",
    <input id={`${p}-name`} name="name" type="text" required autoComplete="name" placeholder="your name" aria-invalid={bad("name")} disabled={locked} onInput={clear("name")} />);
  const caseType = slot("case_type", "Type of case",
    <select id={`${p}-case_type`} name="case_type" required defaultValue="" aria-invalid={bad("case_type")} disabled={locked} onChange={clear("case_type")}>
      <option value="" disabled>choose one</option>
      {caseTypes.map((t) => <option key={t} value={t}>{t.toLowerCase()}</option>)}
    </select>, true);
  const phone = slot("phone", "Phone number",
    <input id={`${p}-phone`} name="phone" type="tel" required autoComplete="tel" placeholder="(555) 555-0123" aria-invalid={bad("phone")} disabled={locked} onInput={clear("phone")} />);
  const email = slot("email", "Email address",
    <input id={`${p}-email`} name="email" type="email" required autoComplete="email" placeholder="you@example.com" aria-invalid={bad("email")} disabled={locked} onInput={clear("email")} />, true);
  const office = slot("office", "Preferred office",
    <select id={`${p}-office`} name="office" disabled={locked} defaultValue="No preference">
      <option value="No preference">any office</option>
      {offices.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>, true);

  const errors = ORDER.filter((f) => invalid.has(f));

  return (
    <form name={variant === "lead" ? "lead-contact" : "contact-page"} method="POST" action="/api/contact" noValidate onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value={variant === "lead" ? "lead-contact" : "contact-page"} />
      <p hidden aria-hidden="true">
        <label>
          Don&rsquo;t fill this out if you&rsquo;re human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className={`form-success${status === "sent" ? " show" : ""}`} role="status">
        Thank you - your request has been received. An attorney will contact you shortly.
      </div>
      <div className={`form-error${status === "error" ? " show" : ""}`} role="alert">
        Sorry, something went wrong sending your message. Please call us at {firmPhone.replace(" ", " ")}.
      </div>

      <div className="mad">
        <p className="mad__line">My name is {name}, and I need help with {caseType}.</p>
        <p className="mad__line">You can call me at {phone} or email me at {email}.</p>
        {variant === "page" && <p className="mad__line">The office nearest me is {office}.</p>}
      </div>

      {variant === "page" && (
        <div className={`mad__story${invalid.has("message") ? " is-invalid" : ""}`}>
          <label htmlFor="c-message">What happened?</label>
          <textarea id="c-message" name="message" required placeholder="Share as much or as little as you like." aria-invalid={bad("message")} disabled={locked} onInput={clear("message")}></textarea>
        </div>
      )}

      {errors.length > 0 && (
        <ul className="mad__errors" role="alert">
          {errors.map((f) => <li key={f}>{ERRORS[f]}</li>)}
        </ul>
      )}

      <button className="btn btn--gold btn--block" type="submit" disabled={disabled}>
        {status === "sending" ? "Sending…" : "Send my case for review"}
      </button>
      <p className="form-note">Free and confidential. Sending this doesn&rsquo;t create an attorney-client relationship.</p>
    </form>
  );
}
