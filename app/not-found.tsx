import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getContent } from "@/lib/content-store";

export const metadata = { title: "Page Not Found" };

// Rendered by the root layout, outside the (site) group, so it adds the site header and footer itself.
export default async function NotFound() {
  const { firm } = await getContent();
  return (
    <>
      <Header />
      <main>
        <section className="page-hero" style={{ paddingBottom: 96 }}>
          <div className="container center">
            <h1 style={{ margin: "0 auto" }}>We couldn&rsquo;t find that page</h1>
            <p style={{ margin: "16px auto 0" }}>
              It may have moved. If you need help with a case, call us anytime at{" "}
              <a href={firm.phoneHref} style={{ color: "var(--gold-300)", fontWeight: 700 }}>{firm.phone}</a>.
            </p>
            <div style={{ marginTop: 30, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn--gold" href="/">Return Home</Link>
              <Link className="btn btn--ghost" href="/practice-areas">Practice Areas</Link>
              <Link className="btn btn--ghost" href="/site-map">Site Map</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
