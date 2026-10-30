import Image from "next/image";
import Link from "next/link";
import { Inline } from "@/components/RichText";
import { CtaBand, HeroContactCard, PageHero } from "@/components/Sections";
import type { AboutText } from "@/content/static-text";

// About page. Text comes from the database; layout and value icons are here.
const VALUE_ICONS = [
  <path key="1" d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />,
  <path key="2" d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />,
  <path key="3" d="M3 7h18M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M5 7l1 13h12l1-13" />,
];

export default function AboutView({ t, hasAttorneys }: { t: AboutText; hasAttorneys: boolean }) {
  return (
    <main>
      <PageHero trail={[["About", "/about"]]} title={t.hero.title} eyebrow="About the firm" panel={<HeroContactCard />}>
        {t.hero.text}
      </PageHero>

      <section className="section">
        <div className="container split">
          <div className="split__media reveal">
            <Image src="/images/about-attorney.webp" alt="California Law attorney" width={1000} height={667} sizes="(max-width: 900px) 100vw, 540px" loading="eager" fetchPriority="high" />
            <div className="tag"><strong>{t.story.tagStrong}</strong><span>{t.story.tagText}</span></div>
          </div>
          <div className="split__copy reveal">
            <span className="eyebrow">{t.story.eyebrow}</span>
            <h2>{t.story.title}</h2>
            {t.story.paragraphs.map((p, i) => <p key={i}><Inline text={p} /></p>)}
            {hasAttorneys && <p><Link href="/attorneys" style={{ color: "var(--navy-600)", fontWeight: 600 }}>Meet our attorneys &rarr;</Link></p>}
          </div>
        </div>
      </section>

      <section className="section bg-paper2">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">{t.values.eyebrow}</span>
            <h2>{t.values.title}</h2>
          </div>
          <div className="cards">
            {t.values.items.map((v, i) => (
              <article className="card reveal" key={i}>
                <div className="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{VALUE_ICONS[i]}</svg></div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand eyebrow={t.cta.eyebrow} title={t.cta.title} text={t.cta.text} cta={t.cta.button} />
    </main>
  );
}
