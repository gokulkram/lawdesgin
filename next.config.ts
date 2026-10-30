import type { NextConfig } from "next";

// Media-library images (Supabase Storage, public bucket "media") may be used with next/image.
const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : "";

const OLD_PAGES = ["about", "contact", "practice-areas", "wrongful-death", "thank-you"];

const nextConfig: NextConfig = {
  // Dev server only: allow opening the site from phones/other computers on the local network
  // (http://192.168.x.x:3000). Without this Next blocks the page's scripts there, so nothing interactive works.
  allowedDevOrigins: ["192.168.*.*"],
  // Versions the cached site content (lib/content-store.ts) per build. Next keeps its data cache in
  // .next/cache, which Vercel restores on every deploy - without this, a new deployment could serve
  // content cached by the previous one instead of what is in the database now.
  env: { CONTENT_CACHE_VERSION: process.env.VERCEL_DEPLOYMENT_ID || String(Date.now()) },
  // The page editor checks § citations against the verified fact sheet, read from disk at runtime.
  outputFileTracingIncludes: { "/admin/**": ["./content/FACTS.md"] },
  // 75 is the default; 90 is used for the office photos so they stay crisp.
  images: { qualities: [75, 90], ...(SUPABASE_HOST ? { remotePatterns: [{ protocol: "https", hostname: SUPABASE_HOST, pathname: "/storage/v1/object/public/media/**" }] } : {}) },
  // Keep links to the old static-site URLs (/about.html etc.) working.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      ...OLD_PAGES.map((p) => ({ source: `/${p}.html`, destination: `/${p}`, permanent: true })),
    ];
  },
};

export default nextConfig;
