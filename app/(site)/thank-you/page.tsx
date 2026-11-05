import Link from "next/link";
import { getContent } from "@/lib/content-store";

export const metadata = {
  title: "Thank You",
  description: "Thank you for contacting California Law. An attorney will be in touch shortly.",
  robots: { index: false },
};

export default async function ThankYou() {
  const { firm } = await getContent();
  return (
    <main>
      <section className="page-hero" style={{ paddingBottom: 96 }}>
        <div className="container center">
          <div style={{ width: 74, height: 74, borderRadius: "50%", background: "var(--gold)", display: "inline-grid", placeItems: "center", marginBottom: 22 }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#0B1F38" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 style={{ margin: "0 auto" }}>Thank you - we&rsquo;ve received your message</h1>
          <p style={{ margin: "16px auto 0" }}>
            An attorney from California Law will reach out within one business hour. If your matter is urgent, please call us anytime at{" "}
            <a href={firm.phoneHref} style={{ color: "var(--gold-300)", fontWeight: 700 }}>{firm.phone}</a>.
          </p>
          <div style={{ marginTop: 30, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn--gold" href="/">Return Home</Link>
            <a className="btn btn--ghost" href={firm.phoneHref}>&#9742; Call Now</a>
          </div>
        </div>
      </section>
    </main>
  );
}
