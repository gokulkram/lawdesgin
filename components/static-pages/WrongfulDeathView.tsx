import Link from "next/link";
import { Fragment } from "react";
import { Blocks, Inline } from "@/components/RichText";
import { CtaBand, PageHero } from "@/components/Sections";
import type { WrongfulDeathText } from "@/content/static-text";
import { getContent } from "@/lib/content-store";

// Wrongful death overview (/wrongful-death). Text comes from the database; the case and guide lists
// below it are built from those pages.
const CASE_PATHS = ["/wrongful-death/car-accident", "/wrongful-death/truck-accident", "/wrongful-death/medical-malpractice", "/wrongful-death/workplace"];
const GUIDE_PATHS = ["/wrongful-death/who-can-file", "/wrongful-death/survival-action", "/wrongful-death/statute-of-limitations"];

export default async function WrongfulDeathView({ t }: { t: WrongfulDeathText }) {
  const content = await getContent();
  const CASES = CASE_PATHS.map((s) => content.service(s)!);
  const GUIDES = GUIDE_PATHS.map((s) => content.service(s)!);
  return (
    <main>
      <PageHero trail={[["Wrongful Death", "/wrongful-death"]]} title={t.hero.title}>
        {t.hero.text}
      </PageHero>

      <section className="section">
        <div className="container layout-2col">
          <div className="prose reveal">
            <p className="lead" style={{ color: "var(--ink)" }}><Inline text={t.intro} /></p>

            {t.body.map((s, i) => (
              <Fragment key={i}>
                <h2>{s.heading}</h2>
                <Blocks blocks={s.blocks} />
              </Fragment>
            ))}

            <h2>{t.casesTitle}</h2>
            <div className="related">
              {CASES.map((c) => (
                <Link key={c.slug} href={c.slug} className="related__item"><strong>{c.name}</strong><span>{c.summary}</span></Link>
              ))}
            </div>

            <h2>{t.guidesTitle}</h2>
            <div className="related">
              {[...GUIDES, ...content.articlesFor("/wrongful-death")].map((c) => (
                <Link key={c.slug} href={c.slug} className="related__item"><strong>{c.name}</strong><span>{c.summary}</span></Link>
              ))}
            </div>
          </div>

          <div className="aside-stack reveal">
            <aside className="sidebar">
              <h3>{t.sidebar.title}</h3>
              <p>{t.sidebar.text}</p>
              <a className="btn btn--gold btn--block" href="#lead-form" aria-haspopup="dialog">{t.sidebar.button}</a>
              <p style={{ marginTop: 18 }}>{t.sidebar.callText}</p>
              <p><a href={content.firm.phoneHref} style={{ color: "var(--gold-300)", fontWeight: 700, fontSize: "1.25rem" }}>{content.firm.phone}</a></p>
            </aside>
            {content.credibility.wrongfulDeathStats.length > 0 && (
              <aside className="sidebar-stats">
                <h4>{t.sidebar.statsTitle}</h4>
                <ul>
                  {content.credibility.wrongfulDeathStats.map((s) => (
                    <li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>
      </section>

      <CtaBand eyebrow={t.cta.eyebrow} title={t.cta.title} text={t.cta.text} cta={t.cta.button} />
    </main>
  );
}
