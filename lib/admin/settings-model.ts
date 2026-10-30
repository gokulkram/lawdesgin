// Site-wide SEO settings (site_settings row "seo") and redirect rules - shapes and checks shared by
// the admin forms, their Server Actions and the public site. Pure: no server-only imports.

export type SiteSeo = {
  /** Google Search Console HTML-tag verification code (the content="…" value). */
  googleVerification?: string;
  /** Bing Webmaster Tools code (msvalidate.01). */
  bingVerification?: string;
  /** Google Analytics 4 measurement ID, e.g. G-ABC123XYZ. */
  ga4Id?: string;
  /** Google Tag Manager container ID, e.g. GTM-ABC1234. */
  gtmId?: string;
  /** Ask search engines not to index anything (staging / pre-launch). Never leave on in production. */
  discourageIndexing?: boolean;
  /** Extra robots.txt Disallow paths, e.g. "/thank-you". */
  robotsDisallow?: string[];
};

export const GA4_RE = /^G-[A-Z0-9]{4,20}$/;
export const GTM_RE = /^GTM-[A-Z0-9]{4,12}$/;
const CODE_RE = /^[A-Za-z0-9_\-:=+/.]{6,120}$/;
const PATH_RE = /^\/[A-Za-z0-9\-_/.*$?=&%]*$/;

/** Problems with a settings object (empty list = valid). Also used to sanitise what the site renders. */
export function siteSeoErrors(s: SiteSeo): string[] {
  const out: string[] = [];
  if (s.googleVerification && !CODE_RE.test(s.googleVerification)) out.push("Google verification code looks wrong - paste only the content=\"…\" value.");
  if (s.bingVerification && !CODE_RE.test(s.bingVerification)) out.push("Bing verification code looks wrong - paste only the content=\"…\" value.");
  if (s.ga4Id && !GA4_RE.test(s.ga4Id)) out.push("GA4 measurement ID must look like G-ABC123XYZ.");
  if (s.gtmId && !GTM_RE.test(s.gtmId)) out.push("Tag Manager ID must look like GTM-ABC1234.");
  if (s.ga4Id && s.gtmId) out.push("Use either GA4 or Tag Manager, not both - add GA4 inside Tag Manager instead, or analytics will count every visit twice.");
  for (const p of s.robotsDisallow ?? []) if (!PATH_RE.test(p)) out.push(`Robots rule must be a path starting with /: ${p}`);
  if (s.discourageIndexing !== undefined && typeof s.discourageIndexing !== "boolean") out.push("Discourage indexing must be on or off.");
  return out;
}

/** Only the values that pass validation - what the public site may render. */
export function safeSiteSeo(s: unknown): SiteSeo {
  if (!s || typeof s !== "object") return {};
  const v = s as SiteSeo;
  return {
    ...(typeof v.googleVerification === "string" && CODE_RE.test(v.googleVerification) && { googleVerification: v.googleVerification }),
    ...(typeof v.bingVerification === "string" && CODE_RE.test(v.bingVerification) && { bingVerification: v.bingVerification }),
    ...(typeof v.ga4Id === "string" && GA4_RE.test(v.ga4Id) && { ga4Id: v.ga4Id }),
    ...(typeof v.gtmId === "string" && GTM_RE.test(v.gtmId) && { gtmId: v.gtmId }),
    ...(v.discourageIndexing === true && { discourageIndexing: true }),
    ...(Array.isArray(v.robotsDisallow) && { robotsDisallow: v.robotsDisallow.filter((p) => typeof p === "string" && PATH_RE.test(p)) }),
  };
}

// ---------------------------------------------------------------- redirects

export type Redirect = { id?: string; source: string; destination: string; permanent: boolean };

// URLs served by hand-built routes or the system - a redirect from them would never be reached.
const SYSTEM = /^\/(admin|api|_next)(\/|$)/;
const FIXED = ["/", "/about", "/contact", "/practice-areas", "/wrongful-death", "/resources", "/attorneys", "/privacy", "/disclaimer", "/site-map", "/thank-you", "/sitemap.xml", "/robots.txt", "/opengraph-image", "/favicon.ico"];

export const normalisePath = (p: string) => {
  const t = p.trim();
  if (/^https?:\/\//i.test(t)) return t;
  const path = ("/" + t.replace(/^\/+/, "")).replace(/\/+$/, "") || "/";
  return path.split("#")[0];
};

/**
 * Problems with a redirect, given the other redirects and the published page paths.
 * A published page always wins over a redirect, so redirecting from one is refused.
 */
export function redirectErrors(r: Redirect, others: Redirect[], publishedPaths: string[], knownPaths: string[]): string[] {
  const out: string[] = [];
  const src = r.source, dest = r.destination;
  if (!/^\/[^\s?#]*$/.test(src) || src === "/") out.push("The old URL must be a path on this site, like /old-page.");
  if (SYSTEM.test(src)) out.push("Admin and system URLs can't be redirected.");
  if (FIXED.includes(src)) out.push(`${src} is a fixed page of the site and can't be redirected.`);
  if (publishedPaths.includes(src)) out.push(`${src} is a live page. Unpublish it first - a live page always wins over a redirect.`);
  if (others.some((o) => o.source === src && o.id !== r.id)) out.push(`There is already a redirect from ${src}.`);
  const isUrl = /^https:\/\/[^\s]+$/.test(dest);
  if (!isUrl && !/^\/[^\s]*$/.test(dest)) out.push("The new URL must be a path on this site (/new-page) or an https:// address.");
  if (dest === src) out.push("A URL can't redirect to itself.");
  if (!isUrl) {
    const destPath = dest.split(/[?#]/)[0];
    if (others.some((o) => o.source === destPath && o.id !== r.id)) out.push(`${dest} is itself redirected - point straight to the final page instead of chaining redirects.`);
    else if (!FIXED.includes(destPath) && !knownPaths.includes(destPath)) out.push(`${dest} isn't a page on this site.`);
    else if (!FIXED.includes(destPath) && !publishedPaths.includes(destPath)) out.push(`${dest} isn't published, so visitors would land on a "not found" page.`);
  }
  if (others.some((o) => o.destination === src && o.id !== r.id)) out.push(`Another redirect already points to ${src} - change that one to point to ${dest} to avoid a chain.`);
  return out;
}

// ---------------------------------------------------------------- firm details + credibility

/** An office. The original six (OFFICE_IDS) have their own pages (/<id>) and can't be removed; offices
 *  added in Site settings have no page of their own and link to /contact. */
export type Office = {
  id: string;
  label: string;
  kind: "Main Office" | "Branch Office";
  street: string;
  locality: string;
  postalCode: string;
  /** As displayed, e.g. "(800) 555-0120". */
  phone: string;
  /** For tel: links and structured data, e.g. "+18005550120" (derived from phone on save). */
  tel: string;
  /** A /images/… path or a media-library URL. */
  img: string;
};

export type SocialLink = { label: string; short: string; url: string };

/** Firm details (site_settings row "firm"). Placeholders until the firm supplies real details. */
export type Firm = {
  /** Firm description for structured data. */
  description: string;
  /** Main phone as displayed, e.g. "(800) 555-0100". */
  phone: string;
  /** Derived on save: "+18005550100" (tel: links). */
  phoneTel: string;
  /** Derived on save: "+1-800-555-0100" (structured data). */
  phoneSchema: string;
  /** Second number, shown as "Toll free" next to the main one. Missing/empty = not shown. */
  tollFree?: string;
  email: string;
  /** Social profiles; links show in the footer (and structured data) only when a URL is set. */
  social: SocialLink[];
  offices: Office[];
  /** Options in the contact form's "Type of case" list. */
  caseTypes: string[];
  footerAbout: string;
  footerDisclaimer: string;
  /** Home page hero background scrolls slower than the page (parallax). Missing = on. */
  heroParallax?: boolean;
  /** Home page banner photo (media library URL). Missing/empty = the built-in beach photo. */
  heroImage?: string;
};

export type Stat = { value: string; label: string; verified: boolean };
export type Testimonial = { quote: string; initials: string; who: string; kind: string; verified: boolean };
/** Trust signals (site_settings row "credibility"). Each must be verified/approved before launch. */
export type Credibility = { homeStats: Stat[]; wrongfulDeathStats: Stat[]; testimonials: Testimonial[] };

/** US phone number → { tel: "+18005550100", schema: "+1-800-555-0100" }, or null if it isn't one. */
export function phoneParts(display: string): { tel: string; schema: string } | null {
  let d = display.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length !== 10) return null;
  return { tel: `+1${d}`, schema: `+1-${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` };
}

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;
/** Images the site may render: files in /public/images or the media library (configured host only). */
export const imageAllowed = (src: string, mediaPrefix: string) => /^\/images\/[\w\-./]+$/.test(src) && !src.includes("..") || (!!mediaPrefix && src.startsWith(mediaPrefix) && !src.slice(mediaPrefix.length).includes(".."));

export function firmErrors(f: Firm, mediaPrefix: string): string[] {
  const out: string[] = [];
  if (!f.description?.trim()) out.push("Firm description is empty.");
  if (!phoneParts(f.phone ?? "")) out.push("Main phone must be a 10-digit US number, e.g. (800) 555-0100.");
  if (f.tollFree && !phoneParts(f.tollFree)) out.push("Toll-free phone must be a 10-digit US number, e.g. (310) 920-9000.");
  if (!EMAIL_RE.test(f.email ?? "")) out.push("Email address looks wrong.");
  for (const s of f.social ?? []) if (s.url && !/^https:\/\/[^\s"<>]+$/.test(s.url)) out.push(`${s.label} link must start with https://`);
  for (const o of f.offices ?? []) {
    const name = o.label || o.id;
    if (!o.label?.trim()) out.push(`Office ${o.id}: name is empty.`);
    if (!o.locality?.trim()) out.push(`${name}: city is empty.`);
    if (!phoneParts(o.phone ?? "")) out.push(`${name}: phone must be a 10-digit US number.`);
    if (o.postalCode && !/^\d{5}(-\d{4})?$/.test(o.postalCode)) out.push(`${name}: ZIP code looks wrong.`);
    if (!imageAllowed(o.img ?? "", mediaPrefix)) out.push(`${name}: photo must be from the media library (or a /images/ file).`);
    if (o.kind !== "Main Office" && o.kind !== "Branch Office") out.push(`${name}: type must be Main Office or Branch Office.`);
  }
  if (f.heroImage && !imageAllowed(f.heroImage, mediaPrefix)) out.push("Home banner photo must be from the media library.");
  if (!(f.caseTypes ?? []).filter((t) => t.trim()).length) out.push("Add at least one case type for the contact form.");
  if (!f.footerAbout?.trim()) out.push("Footer text is empty.");
  if (!f.footerDisclaimer?.trim()) out.push("Footer disclaimer is empty - attorney advertising needs it.");
  return out;
}

export function credibilityErrors(c: Credibility): string[] {
  const out: string[] = [];
  for (const [list, name] of [[c.homeStats, "Home page figures"], [c.wrongfulDeathStats, "Wrongful death figures"]] as const) {
    list.forEach((s, i) => { if (!s.value?.trim() || !s.label?.trim()) out.push(`${name} ${i + 1}: needs a figure and a label.`); });
  }
  c.testimonials.forEach((t, i) => {
    if (!t.quote?.trim() || !t.who?.trim()) out.push(`Testimonial ${i + 1}: needs a quote and a name.`);
    if (t.initials && t.initials.length > 3) out.push(`Testimonial ${i + 1}: initials are 1–3 letters.`);
  });
  return out;
}

/** Placeholders still shown on the site (verified: false). */
export const unverifiedCount = (c: Credibility) => [...c.homeStats, ...c.wrongfulDeathStats, ...c.testimonials].filter((x) => !x.verified).length;
