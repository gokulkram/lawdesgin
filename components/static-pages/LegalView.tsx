import { Fragment } from "react";
import { Blocks } from "@/components/RichText";
import { PageHero } from "@/components/Sections";
import type { LegalText } from "@/content/static-text";
import { getContent } from "@/lib/content-store";

// Privacy Policy and Legal Disclaimer: headed sections of text from the database. Have the firm's
// counsel review both. The privacy policy must describe what the site actually does - update it when
// analytics, chat, call tracking or ad pixels are added. California Rule of Professional Conduct
// 7.2(c) also requires advertising to name a responsible lawyer or the firm with an office address -
// add it to the disclaimer (and footer) once the firm provides it.
export default async function LegalView({ t, path, crumb, contactSection = false }: { t: LegalText; path: string; crumb: string; contactSection?: boolean }) {
  const { firm } = await getContent();
  return (
    <main>
      <PageHero trail={[[crumb, path]]} title={t.hero.title} variant="compact">
        {t.hero.text}
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="prose" style={{ maxWidth: "75ch" }}>
            {t.updated && <p><em>Last updated: {t.updated}</em></p>}
            {t.body.map((s, i) => (
              <Fragment key={i}>
                <h2>{s.heading}</h2>
                <Blocks blocks={s.blocks} />
              </Fragment>
            ))}
            {contactSection && (
              <>
                <h2>Contact us</h2>
                <p>Questions about this policy or your information: email <a href={`mailto:${firm.email}`}>{firm.email}</a> or call <a href={firm.phoneHref}>{firm.phone}</a>.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
