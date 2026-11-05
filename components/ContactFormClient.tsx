"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

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

// Each blank is as wide as its text (the placeholder, the answer, or the chosen option) so there is no
// empty underline. Sizes only change on load, when a dropdown changes and when the visitor leaves a
// field - never while typing - so the sentence doesn't move under their fingers. A long answer scrolls
// inside its field while typing, then the field widens to show it on leaving.
let ruler: CanvasRenderingContext2D | null = null;
function fitField(el: HTMLInputElement | HTMLSelectElement) {
  const isSelect = el instanceof HTMLSelectElement;
  const text = isSelect ? el.options[el.selectedIndex]?.text ?? "" : el.value || el.placeholder;
  const cs = getComputedStyle(el);
  ruler ??= document.createElement("canvas").getContext("2d");
  if (!ruler) return;
  ruler.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + 4;
  el.style.width = `${Math.ceil(Math.max(ruler.measureText(text).width, 48) + pad)}px`;
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
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  // size every blank to its text on load (also picks up browser autofill)
  useEffect(() => {
    sentenceRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select").forEach(fitField);
  }, []);
  const fit = (e: { currentTarget: HTMLInputElement | HTMLSelectElement }) => fitField(e.currentTarget);
  const telHref = `tel:${firmPhone.replace(/[^\d+]/g, "")}`;

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
    <input id={`${p}-name`} name="name" type="text" required autoComplete="name" placeholder="your name" aria-invalid={bad("name")} disabled={locked} onInput={clear("name")} onBlur={fit} />);
  const caseType = slot("case_type", "Type of case",
    <select id={`${p}-case_type`} name="case_type" required defaultValue="" aria-invalid={bad("case_type")} disabled={locked} onChange={(e) => { fitField(e.currentTarget); clear("case_type")(); }}>
      <option value="" disabled>choose one</option>
      {caseTypes.map((t) => <option key={t} value={t}>{t.toLowerCase()}</option>)}
    </select>, true);
  const phone = slot("phone", "Phone number",
    <input id={`${p}-phone`} name="phone" type="tel" required autoComplete="tel" placeholder="(555) 555-0123" aria-invalid={bad("phone")} disabled={locked} onInput={clear("phone")} onBlur={fit} />);
  const email = slot("email", "Email address",
    <input id={`${p}-email`} name="email" type="email" required autoComplete="email" placeholder="you@example.com" aria-invalid={bad("email")} disabled={locked} onInput={clear("email")} onBlur={fit} />, true);
  const office = slot("office", "Preferred office",
    <select id={`${p}-office`} name="office" disabled={locked} defaultValue="No preference" onChange={fit}>
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
        {/* one flowing paragraph; mad__keep only ties each blank to its lead-in word and punctuation,
            so a line never starts with a lone blank or a stray comma */}
        <p className="mad__line" ref={sentenceRef}>
          My name <span className="mad__keep">is {name}<span className="mad__punct">,</span></span> and I need help{" "}
          <span className="mad__keep">with {caseType}<span className="mad__punct">.</span></span> You can call{" "}
          <span className="mad__keep">me at {phone}</span> or email{" "}
          <span className="mad__keep">me at {email}<span className="mad__punct">.</span></span>
          {variant === "page" && <> The office nearest <span className="mad__keep">me is {office}<span className="mad__punct">.</span></span></>}
        </p>
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

      <button className="btn btn--navy btn--block mad__send" type="submit" disabled={disabled}>
        {status === "sending" ? "Sending…" : <>Send my case for review <span className="mad__arrow" aria-hidden="true">&rarr;</span></>}
      </button>
      <p className="form-note mad__note">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
        Free &amp; confidential &middot; No attorney client relationship &middot; Call <a href={telHref}>{firmPhone}</a>
      </p>
    </form>
  );
}
