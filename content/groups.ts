// Fixed groupings used by the hub pages (practice areas, resources) and the site map. Code, not
// page content - pages themselves live in the database (lib/content-store.ts).
import type { ArticleCategory, ServiceGroup } from "@/content/types";

// Order of the groups on the practice-areas page. Their introductions are editable text on that page.
export const SERVICE_GROUPS: { group: ServiceGroup }[] = [
  { group: "Wrongful Death" },
  { group: "Vehicle Accidents" },
  { group: "Serious Injuries" },
  { group: "Other Practice Areas" },
];

export const ARTICLE_CATEGORIES: ArticleCategory[] = ["After an Accident", "Insurance & Money", "Your Case", "Wrongful Death"];

/** One-line introductions for the guide topics on the resources page. */
export const ARTICLE_CATEGORY_INTROS: Record<ArticleCategory, string> = {
  "After an Accident": "The first days matter. What to do at the scene, which reports to get, and how to protect your claim.",
  "Insurance & Money": "Who pays, how much, and how to deal with insurance companies - yours and theirs.",
  "Your Case": "How a California injury claim works, from the first call to settlement or trial.",
  "Wrongful Death": "Answers for families: who can file, what the claim covers, and the deadlines that apply.",
};

/** Groups on the HTML site map (/site-map) and sitemap priorities. */
export type PageGroup = "Firm" | "Legal" | "Locations" | "Resources" | ServiceGroup;

/** Official State Bar of California profile for a license number. */
export const barProfileUrl = (barNumber: string) => `https://apps.calbar.ca.gov/attorney/Licensee/Detail/${barNumber}`;
