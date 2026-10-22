import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-inter", display: "swap" });
// Serif italic for accent words (hero headline, two-part section headings) - gives the type an
// editorial, law-firm voice next to the plain sans.
const serif = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"], style: ["italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: { default: `Personal Injury & Wrongful Death Lawyers | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/assets/icon-192.png", type: "image/png", sizes: "192x192" }],
    apple: "/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B1F38" };

// Runs before first paint: enables reveal-on-scroll styling (content stays visible
// without JS) and applies saved accessibility preferences so text size doesn't flash.
const bootScript = `(function(){var h=document.documentElement;h.classList.add("js");try{var s=JSON.parse(localStorage.getItem("wsl-a11y"));if(s){h.style.fontSize=["100%","112.5%","125%","137.5%"][s.text]||"100%";["contrast","links","readable","motion","cursor"].forEach(function(k){var c=k==="motion"?"no-motion":k;if(s[k])h.classList.add("a11y-"+c)})}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
