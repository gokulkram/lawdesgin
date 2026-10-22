import Script from "next/script";
import ConsentGate from "@/components/ConsentGate";
import { GA4_RE, GTM_RE, type SiteSeo } from "@/lib/admin/settings-model";

// Google Analytics 4 or Tag Manager, from the site-wide SEO settings in the admin panel. The IDs are
// checked against strict patterns again here because they end up inside an inline script.
// Loaded only after the visitor accepts cookies (ConsentGate / ConsentBar).
export default function Analytics({ settings }: { settings: SiteSeo }) {
  const ga4 = settings.ga4Id && GA4_RE.test(settings.ga4Id) ? settings.ga4Id : null;
  const gtm = settings.gtmId && GTM_RE.test(settings.gtmId) ? settings.gtmId : null;
  if (gtm) {
    return (
      <ConsentGate>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
      </Script>
      </ConsentGate>
    );
  }
  if (ga4) {
    return (
      <ConsentGate>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`}
        </Script>
      </ConsentGate>
    );
  }
  return null;
}
