import Link from "next/link";
import PracticeGroupNav from "@/components/PracticeGroupNav";
import { Inline } from "@/components/RichText";
import { CtaBand, HeroLinks, PageHero } from "@/components/Sections";
import ServiceIcon from "@/components/ServiceIcon";
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_INTROS, SERVICE_GROUPS } from "@/content/groups";
import type { ArticleContent } from "@/content/types";
import type { AttorneysText, HeroOnlyText, PracticeAreasText, ResourcesText } from "@/content/static-text";
import { getContent } from "@/lib/content-store";

// Hub pages: practice areas, guides, site map and the attorney team. The editable text comes from
// the database; the cards and lists are built from the pages themselves.

const groupId = (group: string) => group.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * The lead card of a card group is two columns wide, or full width when that leaves no single card
 * alone on the last row of the 3-column grid. `rest` = cards after the lead.
 */
function leadIsWide(rest: number) {
  const left = (n: number) => (n % 3 === 0 ? 0 : n % 3 === 2 ? 1 : 2); // 0 best, 2 = lone card
  return left(rest) < left(rest - 1);
}

/** Rough reading time of a guide (about 230 words a minute). */
function readMinutes(a: ArticleContent) {
  const words: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") words.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk([a.intro, a.steps, a.sections, a.faqs]);
  return Math.max(1, Math.round(words.join(" ").split(/\s+/).length / 230));
}

const formatDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export async function PracticeAreasView({ t }: { t: PracticeAreasText }) {
  const c = await getContent();
  // The wrongful death overview page isn't a practice-area page; show it first in its group.
  const overview = { slug: "/wrongful-death", name: "Wrongful Death", summary: t.overviewSummary };
  const groups = SERVICE_GROUPS.map(({ group }) => {
    const pages = c.servicesIn(group);
    return { group, id: groupId(group), items: group === "Wrongful Death" ? [overview, ...pages] : pages };
  });
  return (
    <main>
      <PageHero
        trail={[["Practice Areas", "/practice-areas"]]}
        title={t.hero.title}
        eyebrow="How we can help"
        panel={
          <HeroLinks
            title="Find your situation"
            label="Practice area groups"
            items={groups.map(({ group, id }) => ({ name: group, href: `#${id}` }))}
            note="Free, confidential case review - 24/7"
          />
        }
      >
        {t.hero.text}
      </PageHero>

      <div className="pa-body">
        <PracticeGroupNav groups={groups.map(({ group, id }) => ({ id, name: group }))} />

        {groups.map(({ group, id, items }, gi) => {
          // The first page of each group is its starting point: a wider navy card.
          const [lead, ...rest] = items;
          const wide = leadIsWide(rest.length);
          return (
            <section className="pa-sec" id={id} key={group} aria-labelledby={`${id}-title`}>
              <div className="container">
                <header className="pa-head reveal">
                  <div className="pa-head__title">
                    <span className="pa-head__num">{String(gi + 1).padStart(2, "0")}</span>
                    <h2 id={`${id}-title`}>{group}</h2>
                  </div>
                  <p>{t.groupIntros[gi]?.intro}</p>
                </header>
                <div className="svc-grid">
                  {lead && (
                    <article className={`svc-card svc-card--lead${wide ? " svc-card--wide" : ""} reveal`}>
                      <span className="svc-card__ico"><ServiceIcon slug={lead.slug} /></span>
                      <span className="svc-card__tag">Start here</span>
                      <h3><Link className="card__link" href={lead.slug}>{lead.name}</Link></h3>
                      <p>{lead.summary}</p>
                      <span className="svc-card__btn" aria-hidden="true">{t.moreLabel} <Arrow /></span>
                    </article>
                  )}
                  {rest.map((p) => (
                    <article className="svc-card reveal" key={p.slug}>
                      <span className="svc-card__ico"><ServiceIcon slug={p.slug} /></span>
                      <h3><Link className="card__link" href={p.slug}>{p.name}</Link></h3>
                      <p>{p.summary}</p>
                      <span className="svc-card__more" aria-hidden="true">{t.moreLabel} <span className="svc-card__arrow"><Arrow /></span></span>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section className="pa-sec pa-sec--last">
          <div className="container">
            <div className="pa-callout reveal">
              <div>
                <span className="eyebrow eyebrow--light">Not sure where you fit?</span>
                <h2>{t.notListed.title}</h2>
                <p><Inline text={t.notListed.text} /></p>
              </div>
              <div className="pa-callout__actions">
                <a className="btn btn--gold" href="#lead-form" aria-haspopup="dialog">Free Case Review</a>
                <a className="btn btn--ghost" href={c.firm.phoneHref}>&#9742; Call {c.firm.phone}</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <CtaBand eyebrow={t.cta.eyebrow} title={t.cta.title} text={t.cta.text} cta={t.cta.button} />
    </main>
  );
}

export async function ResourcesView({ t }: { t: ResourcesText }) {
  const { articles, firm } = await getContent();
  const cats = ARTICLE_CATEGORIES.filter((cat) => articles.some((a) => a.category === cat));
  return (
    <main>
      <PageHero
        trail={[["Resources", "/resources"]]}
        title={t.hero.title}
        eyebrow="Guides & answers"
        panel={<HeroLinks title="Browse by topic" label="Guide topics" items={cats.map((cat) => ({ name: cat, href: `#${groupId(cat)}` }))} />}
      >
        {t.hero.text}
      </PageHero>
      <div className="pa-body">
        <PracticeGroupNav groups={cats.map((cat) => ({ id: groupId(cat), name: cat }))} label="Jump to a guide topic" />

        {cats.map((cat, gi) => {
          const id = groupId(cat);
          const [lead, ...rest] = articles.filter((a) => a.category === cat);
          const icon = <ServiceIcon slug={`topic:${cat.toLowerCase()}`} />;
          const meta = (a: ArticleContent) => (
            <span className="svc-card__meta">{readMinutes(a)} min read <span aria-hidden="true">·</span> Updated {formatDate(a.updated)}</span>
          );
          return (
            <section className="pa-sec" id={id} key={cat} aria-labelledby={`${id}-title`}>
              <div className="container">
                <header className="pa-head reveal">
                  <div className="pa-head__title">
                    <span className="pa-head__num">{String(gi + 1).padStart(2, "0")}</span>
                    <h2 id={`${id}-title`}>{cat}</h2>
                  </div>
                  <p>{ARTICLE_CATEGORY_INTROS[cat]}</p>
                </header>
                <div className="svc-grid">
                  <article className={`svc-card svc-card--lead${leadIsWide(rest.length) ? " svc-card--wide" : ""} reveal`}>
                    <span className="svc-card__ico">{icon}</span>
                    <span className="svc-card__tag">Featured guide</span>
                    <h3><Link className="card__link" href={lead.slug}>{lead.h1}</Link></h3>
                    <p>{lead.summary}</p>
                    {meta(lead)}
                    <span className="svc-card__btn" aria-hidden="true">{t.moreLabel} <Arrow /></span>
                  </article>
                  {rest.map((a) => (
                    <article className="svc-card reveal" key={a.slug}>
                      <span className="svc-card__ico">{icon}</span>
                      {meta(a)}
                      <h3><Link className="card__link" href={a.slug}>{a.h1}</Link></h3>
                      <p>{a.summary}</p>
                      <span className="svc-card__more" aria-hidden="true">{t.moreLabel} <span className="svc-card__arrow"><Arrow /></span></span>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section className="pa-sec pa-sec--last">
          <div className="container">
            <div className="pa-callout reveal">
              <div>
                <span className="eyebrow eyebrow--light">Still have a question?</span>
                <h2>Ask a California injury lawyer</h2>
                <p>These guides are general information, not legal advice. For answers about your own situation, talk to us - free and confidential, 24/7.</p>
              </div>
              <div className="pa-callout__actions">
                <a className="btn btn--gold" href="#lead-form" aria-haspopup="dialog">Free Case Review</a>
                <a className="btn btn--ghost" href={firm.phoneHref}>&#9742; Call {firm.phone}</a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <CtaBand eyebrow={t.cta.eyebrow} title={t.cta.title} text={t.cta.text} cta={t.cta.button} />
    </main>
  );
}

const SITE_MAP_GROUPS = ["Wrongful Death", "Vehicle Accidents", "Serious Injuries", "Other Practice Areas", "Locations", "Resources", "Firm", "Legal"] as const;

export async function SiteMapView({ t }: { t: HeroOnlyText }) {
  const pages = (await getContent()).sitePages;
  return (
    <main>
      <PageHero trail={[["Site Map", "/site-map"]]} title={t.hero.title} variant="compact">
        {t.hero.text}
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="cards">
            {SITE_MAP_GROUPS.map((g) => (
              <article className="card" key={g}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: 14 }}>{g}</h2>
                <div className="prose">
                  <ul className="bul">
                    {pages.filter((p) => p.group === g).map((p) => (
                      <li key={p.path}><Link href={p.path}>{p.label}</Link></li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export async function AttorneysView({ t }: { t: AttorneysText }) {
  const { attorneys, firm } = await getContent();
  return (
    <main>
      <PageHero trail={[["Our Attorneys", "/attorneys"]]} title={t.hero.title} eyebrow="Our team">
        {t.hero.text}
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="cards">
            {attorneys.map((a) => (
              <article className="card attorney-card" key={a.slug}>
                {a.photo && <img src={a.photo} alt={a.name} width={320} height={320} loading="lazy" />}
                <h2 style={{ fontSize: "1.3rem" }}><Link className="card__link" href={`/attorneys/${a.slug}`}>{a.name}</Link></h2>
                <p>{a.title}</p>
                <p className="muted">{a.offices.map((id) => firm.offices.find((o) => o.id === id)?.label).filter(Boolean).join(" · ")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand eyebrow={t.cta.eyebrow} title={t.cta.title} text={t.cta.text} cta={t.cta.button} />
    </main>
  );
}
