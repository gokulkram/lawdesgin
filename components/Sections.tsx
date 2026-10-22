import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { getContent } from "@/lib/content-store";

// Interior-page header with a visible breadcrumb and matching BreadcrumbList structured data.
// `trail` lists the pages after Home, ending with the current page: [["Wrongful Death", "/wrongful-death"], ...].
export function PageHero({ trail, title, children }: { trail: [string, string][]; title: string; children: React.ReactNode }) {
  const current = trail[trail.length - 1];
  return (
    <section className="page-hero">
      <JsonLd data={breadcrumbSchema([["Home", "/"], ...trail])} />
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {trail.slice(0, -1).map(([label, path]) => (
            <span key={path}> &nbsp;/&nbsp; <Link href={path}>{label}</Link></span>
          ))}
          {" "}&nbsp;/&nbsp; <span aria-current="page">{current[0]}</span>
        </nav>
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
    </section>
  );
}

export async function CtaBand({ eyebrow, title, text, cta, ctaHref = "#lead-form" }: { eyebrow: string; title: string; text: string; cta: string; ctaHref?: string }) {
  const { firm } = await getContent();
  return (
    <section className="section ctaband">
      <div className="container reveal">
        <span className="eyebrow eyebrow--light">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="actions">
          <a className="btn btn--gold" href={ctaHref} aria-haspopup={ctaHref === "#lead-form" ? "dialog" : undefined}>{cta}</a>
          <a className="btn btn--ghost" href={firm.phoneHref}>&#9742; {firm.phone}</a>
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

export async function Locations({ tight = false }: { tight?: boolean }) {
  const { firm } = await getContent();
  return (
    <section className={`section bg-paper2${tight ? " section--tight" : ""}`}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">{tight ? "Our Offices" : "Visit Us"}</span>
          <h2>Six California offices, one standard of care</h2>
          <p className="lead" style={{ margin: "14px auto 0" }}>From San Diego to Sacramento - and if you can&rsquo;t come to us, we make home and hospital visits anywhere in California.</p>
        </div>
        <div className="locations">
          {firm.offices.map((o) => (
            <div className="loc reveal" key={o.label}>
              <div className="loc__media">
                <Image src={o.img} alt="" width={800} height={500} sizes="(max-width: 620px) 100vw, (max-width: 920px) 50vw, 360px" />
                <span className="loc__label">{o.label}</span>
              </div>
              <div className="loc__body">
                <span className="loc__eyebrow">{o.kind}</span>
                <p><PinIcon /> {o.street ? `${o.street}, ` : ""}{o.locality}, CA{o.postalCode ? ` ${o.postalCode}` : ""}</p>
                <p><PhoneIcon /> <a href={`tel:${o.tel}`}>{o.phone}</a></p>
                <p><Link className="loc__more" href={`/${o.id}`}>{o.label} office &rarr;</Link></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
