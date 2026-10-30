import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Blocks } from "@/components/RichText";
import { CtaBand, PageHero } from "@/components/Sections";
import { barProfileUrl } from "@/content/groups";
import type { Attorney } from "@/content/types";
import { getContent } from "@/lib/content-store";
import type { Seo } from "@/lib/admin/page-model";
import { attorneySchema, customJsonLd } from "@/lib/schema";

// Attorney bio page (/attorneys/<slug>): bio, practice areas, education, and the State Bar license
// linked to the official record. Also used by the admin preview.
export default async function AttorneyPage({ a, seo: draftSeo }: { a: Attorney; seo?: Seo }) {
  const c = await getContent();
  const seo = draftSeo ?? c.seo(`/attorneys/${a.slug}`);
  const offices = a.offices.map((id) => c.firm.offices.find((o) => o.id === id)).filter((o) => !!o);
  const areas = c.cardsFor(a.practiceAreas);
  return (
    <main>
      <JsonLd data={attorneySchema(a)} />
      <JsonLd data={customJsonLd(seo)} />
      <PageHero trail={[["Our Attorneys", "/attorneys"], [a.name, `/attorneys/${a.slug}`]]} title={a.name} eyebrow="Attorney profile">{a.title}</PageHero>
      <section className="section">
        <div className="container layout-2col">
          <article className="prose service">
            <Blocks blocks={a.bio} />
            {areas.length > 0 && (
              <>
                <h2>Practice areas</h2>
                <ul className="bul">{areas.map((c) => <li key={c.slug}><Link href={c.slug}>{c.name}</Link></li>)}</ul>
              </>
            )}
            <h2>Education</h2>
            <ul className="bul">{a.education.map((e) => <li key={e.school}>{e.degree}, {e.school}{e.year ? `, ${e.year}` : ""}</li>)}</ul>
            {a.memberships?.length ? (<><h2>Memberships</h2><ul className="bul">{a.memberships.map((m) => <li key={m}>{m}</li>)}</ul></>) : null}
          </article>
          <aside className="sidebar office-card">
            {a.photo && <img src={a.photo} alt={a.name} width={272} height={272} style={{ borderRadius: "var(--radius-sm)", marginBottom: 14 }} />}
            <h3>{a.name}</h3>
            <p>{a.title}</p>
            <p>State Bar of California <a href={barProfileUrl(a.barNumber)} target="_blank" rel="noopener" style={{ color: "var(--gold-300)" }}>#{a.barNumber}</a> &middot; admitted {a.admitted}</p>
            {offices.length > 0 && <p>{offices.map((o) => <Link key={o.id} href={c.officeHref(o.id)} style={{ color: "#fff", display: "block" }}>{o.label} office</Link>)}</p>}
            {a.languages?.length ? <p>Languages: {a.languages.join(", ")}</p> : null}
          </aside>
        </div>
      </section>
      <CtaBand eyebrow="No Fee Unless We Win" title={`Talk to ${a.name.split(" ")[0]}’s team`} text="The consultation is free, the call is confidential, and there’s no obligation." cta="Get a Free Case Review" />
    </main>
  );
}
