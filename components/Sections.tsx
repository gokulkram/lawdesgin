import Image from "next/image";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { getContent } from "@/lib/content-store";

const HeroArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const HeroCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
);

/** Splits a title so its last two words can take the gold serif accent (short titles stay plain). */
function splitTitle(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length < 4) return [title, ""];
  // Don't start the accent on a small word ("After *an Accident*" -> "After an *Accident*").
  const n = /^(a|an|the|and|or|for|of|to|in|on|at|after|with)$/i.test(words[words.length - 2]) ? 1 : 2;
  return [words.slice(0, -n).join(" "), words.slice(-n).join(" ")];
}

// Interior-page header: photo + navy wash, breadcrumb (with matching BreadcrumbList structured data),
// title with a gold accent and a curved bottom edge - the same look on every page.
// `trail` lists the pages after Home, ending with the current page: [["Wrongful Death", "/wrongful-death"], ...].
// "full" adds the case review buttons and an optional side `panel`; "compact" is a shorter header
// for reading pages (articles, legal pages, site map).
export async function PageHero({ trail, title, children, variant = "full", eyebrow, panel, actions = true }: {
  trail: [string, string][];
  title: string;
  children: React.ReactNode;
  variant?: "full" | "compact";
  eyebrow?: string;
  panel?: React.ReactNode;
  actions?: boolean;
}) {
  const { firm } = await getContent();
  const current = trail[trail.length - 1];
  const [start, accent] = splitTitle(title);
  const full = variant === "full";
  return (
    <section className={`page-hero${full ? "" : " page-hero--compact"}${full && panel ? " page-hero--split" : ""}`}>
      <JsonLd data={breadcrumbSchema([["Home", "/"], ...trail])} />
      <div className="container page-hero__inner">
        <div className="page-hero__copy">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {trail.slice(0, -1).map(([label, path]) => (
              <span key={path}> &nbsp;/&nbsp; <Link href={path}>{label}</Link></span>
            ))}
            {" "}&nbsp;/&nbsp; <span aria-current="page">{current[0]}</span>
          </nav>
          {eyebrow && <span className="eyebrow eyebrow--light page-hero__eyebrow">{eyebrow}</span>}
          <h1>{start}{accent && <> <span className="accent">{accent}</span></>}</h1>
          <p className="page-hero__sub">{children}</p>
          {full && actions && (
            <div className="page-hero__actions">
              <a className="btn btn--gold" href="#lead-form" aria-haspopup="dialog">Free Case Review</a>
              <a className="btn btn--ghost" href={firm.phoneHref}>&#9742; Call {firm.phone}</a>
            </div>
          )}
        </div>
        {full && panel}
      </div>
    </section>
  );
}

/** Hero side panel: numbered quick links (to sections on the page or to other pages). */
export function HeroLinks({ title, label, items, note }: { title: string; label: string; items: { name: string; href: string }[]; note?: string }) {
  return (
    <nav className="hero-panel" aria-label={label}>
      <span className="hero-panel__title">{title}</span>
      <ul className="hero-links">
        {items.map(({ name, href }, i) => (
          <li key={href}>
            <a href={href}>
              <span className="hero-links__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="hero-links__name">{name}</span>
              <HeroArrow />
            </a>
          </li>
        ))}
      </ul>
      {note && <span className="hero-panel__note">{note}</span>}
    </nav>
  );
}

const TRUST_POINTS = ["No fee unless we win", "Free, confidential case review", "Answering calls 24/7"];

/** Hero side panel for practice-area pages: call / case review card with short trust points. */
export async function HeroCaseCard({ title = "Talk to a lawyer today", phone }: { title?: string; phone?: { text: string; href: string } }) {
  const { firm } = await getContent();
  const call = phone ?? { text: firm.phone, href: firm.phoneHref };
  return (
    <aside className="hero-panel hero-case">
      <span className="hero-panel__title">{title}</span>
      <a className="hero-case__phone" href={call.href}>{call.text}</a>
      <ul className="hero-case__points">
        {TRUST_POINTS.map((p) => <li key={p}><HeroCheck />{p}</li>)}
      </ul>
      <a className="btn btn--gold btn--block" href="#lead-form" aria-haspopup="dialog">Free Case Review</a>
    </aside>
  );
}

/** Hero side panel for an office page: photo, city and phone. */
export function HeroOfficeCard({ office, address }: { office: { label: string; kind: string; phone: string; tel: string; img: string }; address: string }) {
  return (
    <aside className="hero-panel hero-office">
      {office.img && (
        <div className="hero-office__img">
          <Image src={office.img} alt={`California Law ${office.label} office`} fill sizes="(max-width: 900px) 100vw, 420px" priority />
        </div>
      )}
      <div className="hero-office__body">
        <span className="hero-panel__title">{office.kind}</span>
        <strong className="hero-office__name">California Law - {office.label}</strong>
        <span className="hero-office__addr">{address}</span>
        <a className="hero-case__phone" href={`tel:${office.tel}`}>{office.phone}</a>
        <a className="btn btn--gold btn--block" href="#lead-form" aria-haspopup="dialog">Free Case Review</a>
      </div>
    </aside>
  );
}

/** Hero side panel for About / Contact: phone numbers, email and hours. */
export async function HeroContactCard({ title = "Reach us anytime" }: { title?: string }) {
  const { firm } = await getContent();
  return (
    <aside className="hero-panel hero-contact">
      <span className="hero-panel__title">{title}</span>
      <dl>
        <div><dt>Call</dt><dd><a className="hero-case__phone" href={firm.phoneHref}>{firm.phone}</a></dd></div>
        {firm.tollFree && <div><dt>Toll free</dt><dd><a href={firm.tollFreeHref}>{firm.tollFree}</a></dd></div>}
        <div><dt>Email</dt><dd><a href={`mailto:${firm.email}`}>{firm.email}</a></dd></div>
        <div><dt>Hours</dt><dd>Open 24/7 - free case review</dd></div>
      </dl>
    </aside>
  );
}

export async function CtaBand({ eyebrow, title, text, cta, ctaHref = "#lead-form" }: { eyebrow: string; title: string; text: string; cta: string; ctaHref?: string }) {
  const { firm } = await getContent();
  // Full-width dark band (beach photo behind a navy wash); a notch cut into its top edge holds the
  // brand mark, and the content lines up with the page container.
  return (
    <section className="ctaband">
      <div className="ctaband__card">
        <span className="ctaband__notch"><BrandMark size={34} /></span>
        <div className="container ctaband__inner reveal">
          <div className="ctaband__lead">
            <span className="eyebrow eyebrow--light">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <div className="ctaband__side">
            <p>{text}</p>
            <div className="actions">
              <a className="btn btn--gold" href={ctaHref} aria-haspopup={ctaHref === "#lead-form" ? "dialog" : undefined}>{cta}</a>
              <a className="btn btn--ghost" href={firm.phoneHref}>&#9742; {firm.phone}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
);

// Short city code shown large on each office tile; falls back to the label's initials.
const OFFICE_CODES: Record<string, string> = { "los-angeles": "LA", "orange-county": "OC", "san-diego": "SD", "bay-area": "SF", sacramento: "SAC", "inland-empire": "IE" };
const officeCode = (id: string, label: string) => OFFICE_CODES[id] ?? label.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();

const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const countWord = (n: number) => COUNT_WORDS[n] ?? String(n);

// variant "tiles": dark band with a strip of photo tiles (home page).
// variant "cards" (default): cards with address and phone (contact page).
export async function Locations({ tight = false, variant = "cards" }: { tight?: boolean; variant?: "cards" | "tiles" }) {
  const { firm, officeHref } = await getContent();
  const heading = `${countWord(firm.offices.length)} California office${firm.offices.length === 1 ? "" : "s"}, one standard of care`;
  if (variant === "tiles") {
    return (
      <section className="offices" id="offices" aria-labelledby="offices-title">
        <div className="container">
          <div className="offices-head reveal">
            <div>
              <span className="eyebrow">Visit Us</span>
              <h2 id="offices-title">{heading}</h2>
            </div>
            <p>Meet us at the office nearest you, or we&rsquo;ll come to your home or hospital room anywhere in California.</p>
          </div>
          <div className="office-row">
            {firm.offices.map((o) => (
              <Link className="office reveal" href={officeHref(o.id)} key={o.id} aria-label={`${o.label} office`}>
                <Image src={o.img} alt="" fill quality={90} sizes="(max-width: 600px) 50vw, (max-width: 1240px) 33vw, 320px" />
                <span className="office__code" aria-hidden="true">{officeCode(o.id, o.label)}</span>
                <div>
                  <strong>{o.label}</strong>
                  <span>{/main/i.test(o.kind) ? "Main office" : o.locality}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className={`section bg-paper2${tight ? " section--tight" : ""}`}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">{tight ? "Our Offices" : "Visit Us"}</span>
          <h2>{heading}</h2>
          <p className="lead" style={{ margin: "14px auto 0" }}>From San Diego to Sacramento - and if you can&rsquo;t come to us, we make home and hospital visits anywhere in California.</p>
        </div>
        <div className="locations">
          {firm.offices.map((o) => (
            <div className="loc reveal" key={o.label}>
              <div className="loc__media">
                <Image src={o.img} alt="" width={800} height={500} quality={90} sizes="(max-width: 620px) 100vw, (max-width: 920px) 50vw, 360px" />
                <span className="loc__label">{o.label}</span>
              </div>
              <div className="loc__body">
                <span className="loc__eyebrow">{o.kind}</span>
                <p><PinIcon /> {o.street ? `${o.street}, ` : ""}{o.locality}, CA{o.postalCode ? ` ${o.postalCode}` : ""}</p>
                <p><PhoneIcon /> <a href={`tel:${o.tel}`}>{o.phone}</a></p>
                <p><Link className="loc__more" href={officeHref(o.id)}>{o.label} office &rarr;</Link></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
