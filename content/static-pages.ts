// SEED DATA ONLY - see content/services/index.ts. SEO and site-map entries for the hand-built pages
// (their text is seeded from content/static-text.ts). Imported into the database as pages of type "static";
// the site reads title, description and site-map label from there.
import type { PageGroup } from "@/content/groups";

export type StaticPageSeed = {
  path: string;
  /** Label on the HTML site map. */
  name: string;
  group: PageGroup;
  /** <title> without the " | California Law" suffix (unless titleAbsolute). */
  title: string;
  /** true = use the title as-is, without the site-name suffix (home page). */
  titleAbsolute?: boolean;
  description: string;
};

// Order = order on the site map within each group.
export const STATIC_PAGES: StaticPageSeed[] = [
  {
    path: "/",
    name: "Home",
    group: "Firm",
    title: "Personal Injury & Wrongful Death Lawyers | California Law",
    titleAbsolute: true,
    description: "California personal injury law firm focused on wrongful death cases, with six offices statewide. Compassionate, aggressive advocacy. No fee unless we win.",
  },
  {
    path: "/about",
    name: "About Us",
    group: "Firm",
    title: "About Our Personal Injury Firm",
    description: "Meet California Law: a personal injury and wrongful death firm built on one belief - injured people and grieving families deserve a relentless advocate.",
  },
  {
    path: "/contact",
    name: "Contact & Locations",
    group: "Firm",
    title: "Contact & Locations",
    description: "Contact California Law for a free consultation. Six offices across California, available 24/7. Call (800) 400-5050 or request a free case review online.",
  },
  {
    path: "/practice-areas",
    name: "All Practice Areas",
    group: "Firm",
    title: "Personal Injury Practice Areas",
    description: "Wrongful death, car and truck accidents, medical malpractice, workplace injuries, catastrophic injury and more - California personal injury lawyers.",
  },
  {
    path: "/wrongful-death",
    name: "Wrongful Death Overview",
    group: "Wrongful Death",
    title: "California Wrongful Death Attorneys",
    description: "California wrongful death attorneys for families who lost a loved one to negligence. Who can file, deadlines and compensation. Free consultation.",
  },
  {
    path: "/attorneys",
    name: "Our Attorneys",
    group: "Firm",
    title: "Our Attorneys",
    description: "Meet the California Law attorneys who handle personal injury and wrongful death cases across California - licensed by the State Bar of California.",
  },
  {
    path: "/resources",
    name: "All Guides",
    group: "Resources",
    title: "Injury Law Guides & Resources",
    description: "Plain-English guides to California injury claims: collision reports, insurance adjusters, medical bills, pain and suffering, fees, and how long cases take.",
  },
  {
    path: "/privacy",
    name: "Privacy Policy",
    group: "Legal",
    title: "Privacy Policy",
    description: "How California Law collects, uses, and protects the information you share through this website, including your rights under California law.",
  },
  {
    path: "/disclaimer",
    name: "Disclaimer",
    group: "Legal",
    title: "Legal Disclaimer",
    description: "Attorney advertising disclaimer for California Law: no legal advice, no attorney-client relationship, and prior results do not guarantee outcomes.",
  },
  {
    path: "/site-map",
    name: "Site Map",
    group: "Legal",
    title: "Site Map",
    description: "Every page on the California Law website: practice areas, firm information, contact details, and legal notices.",
  },
];
