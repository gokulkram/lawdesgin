import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import A11yMenu from "@/components/A11yMenu";
import ConsentBar from "@/components/ConsentBar";
import ContactForm from "@/components/ContactForm";
import LeadDialog from "@/components/LeadDialog";
import ReviewNudge from "@/components/ReviewNudge";
import SmoothScroll from "@/components/SmoothScroll";
import type { HomeText } from "@/content/static-text";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/lib/content-store";
import { firmSchema } from "@/lib/schema";

// Site-wide settings from the admin panel (SEO): search-engine verification tags, and "discourage
// indexing" for staging sites. With no settings saved this adds nothing.
export async function generateMetadata(): Promise<Metadata> {
  const { siteSeo } = await getContent();
  const other: Record<string, string> = {};
  if (siteSeo.bingVerification) other["msvalidate.01"] = siteSeo.bingVerification;
  return {
    ...((siteSeo.googleVerification || siteSeo.bingVerification) && {
      verification: { ...(siteSeo.googleVerification && { google: siteSeo.googleVerification }), ...(siteSeo.bingVerification && { other }) },
    }),
    ...(siteSeo.discourageIndexing && { robots: { index: false, follow: false } }),
  };
}

// Shell for every public page. The admin panel (app/admin) sits outside this group so it gets
// no site header, footer or structured data.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  const home = c.staticText<HomeText>("/");
  return (
    <>
      <JsonLd data={firmSchema(c)} />
      <Header />
      {children}
      <Footer />
      {/* case-review popup for every page ("#lead-form" links open it); opens by itself on the home page ~32s after load */}
      <LeadDialog title={home.hero.formTitle} text={home.hero.formText} autoOpenOn={["/"]} autoOpenAfter={32000}>
        <ContactForm variant="lead" />
      </LeadDialog>
      <ReviewNudge />
      <SmoothScroll />
      <Reveal />
      <A11yMenu />
      <ConsentBar />
      <Analytics settings={c.siteSeo} />
    </>
  );
}
