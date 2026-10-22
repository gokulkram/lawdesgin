import Link from "next/link";
import HeroParallax from "@/components/HeroParallax";
import { Inline } from "@/components/RichText";
import { CtaBand, Locations } from "@/components/Sections";
import Testimonials from "@/components/Testimonials";
import type { HomeText } from "@/content/static-text";
import { getContent } from "@/lib/content-store";

// Home page. Text comes from the database (editable in the admin panel); layout, icons and the
// practice-area links (fixed pages) are here.

const Arrow = () => (
  <svg className="pa-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const Check = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 6L9 17l-5-5" /></svg>
);

const PI_AREAS = [
  { label: "Car & Truck Accidents", href: "/car-accident-lawyer", icon: <><path d="M3 13l2-5a3 3 0 0 1 2.8-2h8.4A3 3 0 0 1 19 8l2 5" /><path d="M5 17h14M6 13h12" /><circle cx="7.5" cy="17.5" r="1.5" /><circle cx="16.5" cy="17.5" r="1.5" /></> },
  { label: "Medical Malpractice", href: "/medical-malpractice-lawyer", icon: <path d="M12 3v18M5 8h14M7 8l-2 6a3 3 0 0 0 6 0L9 8M17 8l-2 6a3 3 0 0 0 6 0l-2-6" /> },
  { label: "Workplace Injuries", href: "/workplace-injury-lawyer", icon: <><path d="M10 2h4l1 4h-6zM9 6h6l1 14H8z" /><path d="M12 10v6" /></> },
  { label: "Slip & Fall", href: "/premises-liability-lawyer", icon: <path d="M4 20l6-6M9 11l4-4 4 4-4 4zM14 4l6 6" /> },
  { label: "Catastrophic Injury", href: "/catastrophic-injury-lawyer", icon: <><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></> },
];

const STEP_SVG = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
// One icon per step, in order (the step text is editable).
const STEP_ICONS = [
  <path key="1" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  <><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></>,
  <><path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8" /><path d="m16 16 6-6" /><path d="m8 8 6-6" /><path d="m9 7 8 8" /><path d="m21 11-8-8" /></>,
];

// Two-part heading: splits after its first " - " (the text is edited in the admin panel). The first
// part is the plain sans; the second is set in the serif italic accent, offset to the right and
// tucked up under the first so the two overlap a little (.split-head in globals.css).
function TwoLines({ text }: { text: string }) {
  const m = text.match(/^(.+?)\s[-–—]\s+(.+)$/); // the dash is drawn as the gold rule before part two
  if (!m) return <>{text}</>;
  return (
    <>
      <span className="split-head__a">{m[1]}</span>{" "}
      <span className="split-head__b">{m[2]}</span>
    </>
  );
}

// Hero background photo. Default: California beach at sunset (Unsplash, free licence), cropped per
// screen size so the sun stays in view. A banner picked under Site settings replaces it.
const HERO_ALT = "Palm trees on a California beach at sunset";
function HeroPhoto({ src }: { src?: string }) {
  /* eslint-disable @next/next/no-img-element -- plain <img>/<picture>: art-directed crops, loaded first */
  if (src) return <img className="hero__photo" src={src} alt={HERO_ALT} fetchPriority="high" />;
  return (
    <picture>
      <source media="(max-width: 700px)" srcSet="/images/hero-beach-mobile.webp" />
      <source media="(max-width: 1300px)" srcSet="/images/hero-beach-1280.webp" />
      <img className="hero__photo" src="/images/hero-beach.webp" alt={HERO_ALT} width={1920} height={920} fetchPriority="high" />
    </picture>
  );
  /* eslint-enable @next/next/no-img-element */
}

export default async function HomeView({ t }: { t: HomeText }) {
  const { firm } = await getContent();
  return (
    <main>
      {/* HERO (centered, full width) - the case-review form opens in a popup */}
      <section className="hero" id="contact">
        {firm.heroParallax === false
          ? <div className="hero__bg"><HeroPhoto src={firm.heroImage} /></div>
          : <HeroParallax><HeroPhoto src={firm.heroImage} /></HeroParallax>}
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="hero__badge">{t.hero.badge}</span>
            <h1>{t.hero.titleStart}<span className="accent">{t.hero.titleAccent}</span>{t.hero.titleEnd}</h1>
            <p className="hero__sub">{t.hero.text}</p>
            <div className="hero__actions">
              <a className="btn btn--gold" href="#lead-form" aria-haspopup="dialog">{t.hero.button}</a>
              <a className="btn btn--ghost" href={firm.phoneHref}>&#9742; Call {firm.phone}</a>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--wide center reveal">
            <span className="eyebrow">{t.intro.eyebrow}</span>
            <h2 className="split-head"><TwoLines text={t.intro.title} /></h2>
            <p className="lead" style={{ margin: "14px auto 0" }}>{t.intro.text}</p>
          </div>
          <div className="pillars">
            <article className="pillar reveal">
              <div className="pillar__head">
                <div className="ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></svg>
                </div>
                <div>
                  <h3>{t.injury.title}</h3>
                  <p className="pillar__sub">{t.injury.text}</p>
                </div>
              </div>
              <ul className="pillar__list">
                {PI_AREAS.map((a) => (
                  <li key={a.label}>
                    <Link href={a.href}>
                      <span className="pa-label">
                        <svg className="pa-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{a.icon}</svg>
                        {a.label}
                      </span>
                      <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="btn btn--outline" href="/practice-areas">{t.injury.button}</Link>
            </article>

            <article className="pillar pillar--focus reveal">
              <div className="pillar__head">
                <div className="ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" /></svg>
                </div>
                <div>
                  <span className="eyebrow eyebrow--light" style={{ marginBottom: 6 }}>{t.death.eyebrow}</span>
                  <h3>{t.death.title}</h3>
                  <p className="pillar__sub">{t.death.text}</p>
                </div>
              </div>
              <ul className="checklist">
                {t.death.checklist.map((item, i) => (
                  <li key={i}><Check /><span><Inline text={item} /></span></li>
                ))}
              </ul>
              <div className="pillar__promise"><Inline text={t.death.promise} /></div>
              <Link className="btn btn--gold" href="/wrongful-death">{t.death.button}</Link>
            </article>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section process">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">{t.process.eyebrow}</span>
            <h2>{t.process.title}</h2>
          </div>
          <div className="steps">
            <div className="steps__track reveal" aria-hidden="true"></div>
            {t.process.steps.map((s, idx) => (
              <div className="step reveal" key={idx} style={{ "--i": idx } as React.CSSProperties}>
                <div className="step__node" aria-hidden="true">{String(idx + 1).padStart(2, "0")}</div>
                <div className="step__card">
                  <div className="step__icon"><svg {...STEP_SVG}>{STEP_ICONS[idx]}</svg></div>
                  <span className="step__label">Step {idx + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <Locations />
      <CtaBand eyebrow={t.cta.eyebrow} title={t.cta.title} text={t.cta.text} cta={t.cta.button} ctaHref="#lead-form" />
    </main>
  );
}
