import Image from "next/image";
import Link from "next/link";
import HeroParallax from "@/components/HeroParallax";
import HeroVideo from "@/components/HeroVideo";
import ProcessTimeline from "@/components/ProcessTimeline";
import ScrollThread from "@/components/ScrollThread";
import { AreaStory, SlowScroll, type Area } from "@/components/WhatWeDoFx";
import { Inline } from "@/components/RichText";
import { CtaBand, Locations } from "@/components/Sections";
import Testimonials from "@/components/Testimonials";
import type { HomeText } from "@/content/static-text";
import { getContent } from "@/lib/content-store";

// Home page. Text comes from the database (editable in the admin panel); layout, icons and the
// practice-area links (fixed pages) are here.

// Practice-area rows in "What we do". The photos (except the first) are stand-ins taken from the
// office photos until area-specific photos are supplied.
const PI_AREAS: Area[] = [
  { label: "Car & Truck Accidents", desc: "Collisions, hit and run, big rigs and fleets", href: "/car-accident-lawyer", img: "/images/cta-background.webp" },
  { label: "Medical Malpractice", desc: "Surgical, diagnosis and birth injury", href: "/medical-malpractice-lawyer", img: "/images/office-bay-area.webp" },
  { label: "Workplace Injuries", desc: "Beyond workers’ comp", href: "/workplace-injury-lawyer", img: "/images/office-los-angeles.webp" },
  { label: "Slip & Fall", desc: "Unsafe property and premises liability", href: "/premises-liability-lawyer", img: "/images/office-orange-county.webp" },
  { label: "Catastrophic Injury", desc: "Brain, spinal cord and life-changing harm", href: "/catastrophic-injury-lawyer", img: "/images/office-san-diego.webp" },
];

const STEP_SVG = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
// One icon per step, in order (the step text is editable).
const STEP_ICONS = [
  <path key="1" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  <><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></>,
  <><path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8" /><path d="m16 16 6-6" /><path d="m8 8 6-6" /><path d="m9 7 8 8" /><path d="m21 11-8-8" /></>,
];

// "What we do" statement: splits after its first " - " (the text is edited in the admin panel).
// Part one is light sans, part two the gold serif italic; each line slides up in turn (.wwd-statement).
function Statement({ text }: { text: string }) {
  const m = text.match(/^(.+?)\s[-–—]\s+(.+)$/);
  if (!m) return <span className="wwd-statement__a"><span>{text}</span></span>;
  return (
    <>
      <span className="wwd-statement__a"><span>{m[1]}</span></span>{" "}
      <span className="wwd-statement__b"><span>{m[2]}</span></span>
    </>
  );
}

// Intro text in two columns: the first sentence, then the rest.
function splitIntro(text: string): string[] {
  const m = text.match(/^(.+?[.!?])\s+(.+)$/s);
  return m ? [m[1], m[2]] : [text];
}

// Checklist item "**We investigate fully** - preserving evidence..." -> ["We investigate fully", "Preserving evidence..."].
function splitCheck(item: string): [string, string] {
  const m = item.match(/^\*\*(.+?)\*\*\s*[-–—:]?\s*(.*)$/s);
  if (!m) return [item, ""];
  const rest = m[2].trim();
  return [m[1], rest.charAt(0).toUpperCase() + rest.slice(1)];
}

// Hero headline words, each in its own span so they can blur into focus one after another
// (.hero__title .w in globals.css). Spaces stay as plain text so the line wraps normally.
const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;
function BlurWords({ text, from }: { text: string; from: number }) {
  let n = from;
  return <>{text.split(/(\s+)/).map((part, i) => (/^\s+$/.test(part) || !part ? part : <span className="w" key={i} style={{ "--w": n++ } as React.CSSProperties}>{part}</span>))}</>;
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
          ? <div className="hero__bg"><HeroPhoto src={firm.heroImage} />{!firm.heroImage && <HeroVideo />}</div>
          : <HeroParallax><HeroPhoto src={firm.heroImage} />{!firm.heroImage && <HeroVideo />}</HeroParallax>}
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="hero__badge">{t.hero.badge}</span>
            <h1 className="hero__title">
              <BlurWords text={t.hero.titleStart} from={0} />
              <span className="accent"><BlurWords text={t.hero.titleAccent} from={countWords(t.hero.titleStart)} /></span>
              <BlurWords text={t.hero.titleEnd} from={countWords(t.hero.titleStart) + countWords(t.hero.titleAccent)} />
            </h1>
            <p className="hero__sub">{t.hero.text}</p>
            <div className="hero__actions">
              <a className="btn btn--gold" href="#lead-form" aria-haspopup="dialog">{t.hero.button}</a>
              <a className="btn btn--ghost" href={firm.phoneHref}>&#9742; Call {firm.phone}</a>
            </div>
            <p className="hero__note">Free Case Review - 24/7</p>
          </div>
        </div>
      </section>

      {/* everything between the hero and the closing card hangs on one scroll thread */}
      <div className="thread-host">
      <ScrollThread />

      {/* WHAT WE DO */}
      <section className="wwd" aria-labelledby="wwd-title">
        {/* 1. statement */}
        <div className="wwd-intro">
          <div className="container">
            <span className="eyebrow reveal">{t.intro.eyebrow}</span>
            <h2 id="wwd-title" className="wwd-statement reveal"><Statement text={t.intro.title} /></h2>
            <div className="wwd-intro__foot reveal">
              {splitIntro(t.intro.text).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>

        {/* 2. personal injury: rows + photo that follows the hovered row */}
        <div className="wwd-injury">
          <div className="container">
            <AreaStory title={t.injury.title} text={t.injury.text} areas={PI_AREAS} moreLabel={t.injury.button} />
          </div>
        </div>

        {/* 3. wrongful death */}
        <div className="wwd-death">
          <div className="container wwd-death__grid">
            <figure className="wwd-death__photo reveal">
              <div className="wwd-death__frame">
                <SlowScroll className="wwd-death__img">
                  <Image src="/images/about-attorney.webp" alt="An attorney listening to a client across a table" fill quality={90} sizes="(max-width: 920px) 100vw, 42vw" />
                </SlowScroll>
              </div>
              <figcaption><strong>We come to you</strong>Home and hospital visits when you can&rsquo;t travel.</figcaption>
            </figure>
            <div className="wwd-death__copy">
              <span className="eyebrow reveal">{t.death.eyebrow}</span>
              <h3 className="reveal">{t.death.title}</h3>
              <p className="wwd-death__lead reveal">{t.death.text}</p>
              <ul className="wwd-checks">
                {t.death.checklist.map((item, i) => {
                  const [head, rest] = splitCheck(item);
                  return (
                    <li key={i} className="reveal" style={{ "--i": i } as React.CSSProperties}>
                      <svg className="wwd-tick" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path pathLength={1} d="M20 6L9 17l-5-5" /></svg>
                      <strong>{head}</strong>
                      {rest && <span><Inline text={rest} /></span>}
                    </li>
                  );
                })}
              </ul>
              <div className="wwd-promise reveal">
                <p><Inline text={t.death.promise} /></p>
                <Link className="btn btn--gold" href="/wrongful-death">{t.death.button}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <ProcessTimeline
        eyebrow={t.process.eyebrow}
        title={t.process.title}
        steps={t.process.steps}
        icons={t.process.steps.map((_, i) => <svg key={i} {...STEP_SVG}>{STEP_ICONS[i % STEP_ICONS.length]}</svg>)}
        phone={firm.phone}
        phoneHref={firm.phoneHref}
      />

      <Testimonials />
      <Locations variant="tiles" />
      </div>
      <CtaBand eyebrow={t.cta.eyebrow} title={t.cta.title} text={t.cta.text} cta={t.cta.button} ctaHref="#lead-form" />
    </main>
  );
}
