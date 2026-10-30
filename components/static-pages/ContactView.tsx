import ContactForm from "@/components/ContactForm";
import { Inline } from "@/components/RichText";
import { HeroContactCard, Locations, PageHero } from "@/components/Sections";
import type { ContactText } from "@/content/static-text";
import { getContent } from "@/lib/content-store";

// Contact page. Text comes from the database; phone and email from the firm details.
export default async function ContactView({ t }: { t: ContactText }) {
  const { firm } = await getContent();
  return (
    <main>
      <PageHero trail={[["Contact", "/contact"]]} title={t.hero.title} eyebrow="Get in touch" actions={false} panel={<HeroContactCard />}>
        {t.hero.text}
      </PageHero>

      <section className="section">
        <div className="container layout-2col">
          <div className="reveal">
            <span className="eyebrow">{t.form.eyebrow}</span>
            <h2 style={{ marginBottom: 8 }}>{t.form.title}</h2>
            <p style={{ marginBottom: 24 }}>{t.form.text}</p>
            <div className="lead-card" id="contact-form" style={{ boxShadow: "var(--shadow-md)" }}>
              <ContactForm variant="page" />
            </div>
          </div>

          <aside className="sidebar reveal">
            <h3>{t.sidebar.title}</h3>
            <p>{t.sidebar.text}</p>
            {firm.tollFree && <p>Toll free<br /><a href={firm.tollFreeHref} style={{ color: "var(--gold-300)", fontWeight: 700, fontSize: "1.5rem" }}>{firm.tollFree}</a></p>}
            <p>{firm.tollFree && <>California<br /></>}<a href={firm.phoneHref} style={{ color: "var(--gold-300)", fontWeight: 700, fontSize: "1.5rem" }}>{firm.phone}</a></p>
            <p style={{ marginTop: 16 }}>{t.sidebar.emailLabel}</p>
            <p><a href={`mailto:${firm.email}`} style={{ color: "#fff", fontWeight: 600 }}>{firm.email}</a></p>
            <hr style={{ border: 0, borderTop: "1px solid rgba(255,255,255,.15)", margin: "22px 0" }} />
            <p className="sidebar__note" style={{ color: "#c3cfde" }}><Inline text={t.sidebar.visitText} /></p>
          </aside>
        </div>
      </section>

      <Locations variant="tiles" />
    </main>
  );
}
