import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import type { PageGroup } from "@/content/groups";
import type { ArticleContent, Attorney, LocationContent, ServiceContent, ServiceGroup } from "@/content/types";
import type { Seo } from "@/lib/admin/page-model";
import { phoneParts, safeSiteSeo, unverifiedCount, type Credibility, type Firm, type Redirect, type SiteSeo } from "@/lib/admin/settings-model";
import { createAdminClient } from "@/lib/supabase/admin";

// The site's content, read from the Supabase `pages` table (published copies only). Every public
// page, the sitemap and the structured data get their content from getContent().
//
// All published pages, the site-wide SEO settings and the redirects load together: the site is ~60
// pages that link to each other (related cards, hubs, site map), so one cached dataset under one tag
// is simplest. Saving in the admin panel
// calls revalidateTag(CONTENT_TAG), which refreshes every page that used it.
//
// Reads use the secret key on the server (never the cookie-based client, which would make every
// page dynamic). The loader throws on any error or an empty result, so a broken database fails the
// build and Vercel keeps serving the previous deployment instead of publishing an empty site.

export const CONTENT_TAG = "content";

type PageType = "service" | "local" | "location" | "article" | "attorney" | "static";
type Row = {
  path: string;
  type: PageType;
  published_content: Record<string, unknown>;
  published_seo: Seo;
  reviewed_by: string | null;
  reviewed_at: string | null;
  /** True only while the live text is exactly the text an attorney signed off (see migration 20261017). */
  published_is_reviewed: boolean;
};

type Data = { rows: Row[]; siteSeo: SiteSeo; redirects: Redirect[]; firm: Firm; credibility: Credibility };

const loadData = unstable_cache(
  async (): Promise<Data> => {
    const db = createAdminClient();
    const [pages, settings, redirects] = await Promise.all([
      db
        .from("pages")
        .select("path, type, published_content, published_seo, reviewed_by, reviewed_at, published_is_reviewed")
        .eq("status", "published")
        .not("published_content", "is", null)
        .order("type")
        .order("sort_order"),
      db.from("site_settings").select("key, value").in("key", ["seo", "firm", "credibility"]),
      db.from("redirects").select("source, destination, permanent"),
    ]);
    if (pages.error) throw new Error(`Loading site content from Supabase failed: ${pages.error.message}`);
    if (settings.error) throw new Error(`Loading site settings from Supabase failed: ${settings.error.message}`);
    const setting = (k: string) => settings.data?.find((r) => r.key === k)?.value;
    const firm = setting("firm") as Firm | undefined;
    const credibility = setting("credibility") as Credibility | undefined;
    if (!firm || !credibility) throw new Error('Firm details are missing in Supabase (site_settings "firm" / "credibility"). Run npm run content:import -- --settings.');
    const placeholders = unverifiedCount(credibility);
    if (placeholders) console.warn(`⚠ ${placeholders} placeholder statistic(s)/testimonial(s) are still unverified - replace or remove them in the admin panel (Site settings) before launch.`);
    if (redirects.error) throw new Error(`Loading redirects from Supabase failed: ${redirects.error.message}`);
    const rows = (pages.data ?? []) as Row[];
    for (const t of ["service", "location", "static"] as const) {
      if (!rows.some((r) => r.type === t)) throw new Error(`Site content looks empty: no published "${t}" pages in Supabase. Run npm run content:import.`);
    }
    // Missing settings are fine (= defaults); only values that pass validation reach the site.
    return { rows, siteSeo: safeSiteSeo(setting("seo")), redirects: (redirects.data ?? []) as Redirect[], firm, credibility };
  },
  // CONTENT_CACHE_VERSION (next.config.ts) changes every build, so each deployment starts from the database.
  ["site-content-v3", process.env.CONTENT_CACHE_VERSION ?? ""],
  { tags: [CONTENT_TAG] }
);

/**
 * A content-file shaped object from a row: SEO title/description merged back in, plus the attorney
 * review - but only when the live text is the reviewed text, so a byline never vouches for edits.
 */
function toPage<T>(r: Row): T {
  return {
    ...r.published_content,
    ...(r.published_seo.title !== undefined && { title: r.published_seo.title }),
    ...(r.published_seo.description !== undefined && { description: r.published_seo.description }),
    ...(r.published_seo.titleAbsolute && { titleAbsolute: true }),
    ...(r.published_is_reviewed && r.reviewed_by && { reviewedBy: r.reviewed_by }),
    ...(r.published_is_reviewed && r.reviewed_at && { reviewed: r.reviewed_at }),
  } as T;
}

export type StaticPage = { path: string; name: string; group: PageGroup; title: string; titleAbsolute?: boolean; description: string };
/** Name + summary for linking to any content page ("related" cards). */
export type PageCard = { slug: string; name: string; summary: string };
export type SitePage = { path: string; label: string; group: PageGroup };

// Practice areas the firm handles (structured data "knowsAbout"), leaving out the wrongful-death
// reference guides (who can file, deadlines, ...).
const GUIDES = ["/wrongful-death/who-can-file", "/wrongful-death/survival-action", "/wrongful-death/statute-of-limitations"];

export class Content {
  readonly services: ServiceContent[];
  readonly local: ServiceContent[];
  readonly locations: LocationContent[];
  readonly articles: ArticleContent[];
  readonly attorneys: Attorney[];
  readonly statics: StaticPage[];
  readonly siteSeo: SiteSeo;
  /** Firm details (phone, email, offices, ...) and trust signals, edited under Site settings. */
  readonly firm: Firm & { phoneHref: string; tollFreeHref: string };
  readonly credibility: Credibility;
  /** Link for an office: its own page (/los-angeles) if it has one, otherwise /contact (offices added in Site settings). */
  readonly officeHref: (id: string) => string;
  private readonly byPath = new Map<string, unknown>();
  private readonly cards = new Map<string, PageCard>();
  private readonly seoByPath: Map<string, Seo>;
  private readonly redirectBySource: Map<string, Redirect>;

  constructor({ rows, siteSeo, redirects, firm, credibility }: Data) {
    this.siteSeo = siteSeo;
    const toll = firm.tollFree ? phoneParts(firm.tollFree) : null;
    this.firm = { ...firm, tollFree: toll ? firm.tollFree : "", phoneHref: `tel:${firm.phoneTel}`, tollFreeHref: toll ? `tel:${toll.tel}` : "" };
    this.credibility = credibility;
    this.seoByPath = new Map(rows.map((r) => [r.path, r.published_seo ?? {}]));
    this.redirectBySource = new Map(redirects.map((r) => [r.source, r]));
    const of = <T,>(t: PageType) => rows.filter((r) => r.type === t).map((r) => toPage<T>(r));
    this.services = of<ServiceContent>("service");
    this.local = of<ServiceContent>("local");
    this.locations = of<LocationContent>("location");
    const withPage = new Set(this.locations.map((l) => l.officeId));
    this.officeHref = (id: string) => (withPage.has(id) ? `/${id}` : "/contact");
    this.articles = of<ArticleContent>("article");
    this.attorneys = of<Attorney>("attorney");
    this.statics = rows.filter((r) => r.type === "static").map((r) => ({ path: r.path, ...toPage<Omit<StaticPage, "path">>(r) }));

    for (const p of [...this.services, ...this.local, ...this.locations, ...this.articles]) this.byPath.set(p.slug, p);
    for (const p of [...this.services, ...this.locations, ...this.articles]) this.cards.set(p.slug, { slug: p.slug, name: p.name, summary: p.summary });
    // City + service pages have short names ("Car Accidents") because their breadcrumb already shows
    // the city; when linked from elsewhere, prefix the city so they aren't confused with statewide pages.
    for (const p of this.local) {
      const city = this.locations.find((l) => l.officeId === p.location)?.name;
      this.cards.set(p.slug, { slug: p.slug, name: `${city ?? ""} ${p.name}`.trim(), summary: p.summary });
    }
    this.cards.set("/wrongful-death", {
      slug: "/wrongful-death",
      name: "Wrongful Death",
      summary: "When negligence takes a life, we help families seek accountability and the compensation they’re owed.",
    });
  }

  /** Statewide practice-area page (incl. /wrongful-death/...). */
  service = (slug: string) => this.services.find((s) => s.slug === slug);
  /** Practice-area or city + service page (anything rendered by ServicePage). */
  servicePage = (slug: string) => this.service(slug) ?? this.local.find((s) => s.slug === slug);
  location = (slug: string) => this.locations.find((l) => l.slug === slug);
  article = (slug: string) => this.articles.find((a) => a.slug === slug);
  attorney = (slug?: string) => (slug ? this.attorneys.find((a) => a.slug === slug) : undefined);
  card = (slug: string) => this.cards.get(slug);
  cardsFor = (slugs: string[]) => slugs.map((s) => this.cards.get(s)).filter((c): c is PageCard => !!c);
  localPagesFor = (officeId: string) => this.local.filter((p) => p.location === officeId);
  /** Guides that support a practice-area page ("Helpful guides" on that page). */
  articlesFor = (serviceSlug: string) => this.articles.filter((a) => a.services.includes(serviceSlug));
  servicesIn = (group: ServiceGroup) => this.services.filter((p) => p.group === group);

  /** The published SEO settings of any page ({} if none). */
  seo = (path: string): Seo => this.seoByPath.get(path) ?? {};
  /** Redirect for a URL that has no live page. Pages always win: routes ask only before notFound(). */
  redirectFor = (path: string) => this.redirectBySource.get(path);

  /** A hand-built page's SEO and site-map entry. Throws if it was never imported - fix the data, don't guess. */
  staticPage(path: string): StaticPage {
    const p = this.statics.find((s) => s.path === path);
    if (!p) throw new Error(`No published static page "${path}" in Supabase. Run npm run content:import.`);
    return p;
  }

  /** The editable text of a main page (lib/admin/static-model.ts); T is its type from content/static-text.ts. */
  staticText<T>(path: string): T {
    return this.staticPage(path) as unknown as T;
  }

  /** Practice areas for structured data ("knowsAbout"). */
  get knowsAbout() {
    return ["Wrongful death", ...this.services.filter((p) => !GUIDES.includes(p.slug)).map((p) => p.name)];
  }

  /** Every indexable page, in site-map order. Feeds /sitemap.xml and the HTML site map. */
  get sitePages(): SitePage[] {
    const s = (path: string) => {
      const p = this.staticPage(path);
      return { path, label: p.name, group: p.group };
    };
    return [
      s("/"),
      s("/about"),
      s("/contact"),
      s("/practice-areas"),
      s("/wrongful-death"),
      ...this.services.map((p) => ({ path: p.slug, label: p.name, group: p.group })),
      ...this.locations.flatMap((l) => [
        { path: l.slug, label: `${l.name} Office`, group: "Locations" as const },
        ...this.localPagesFor(l.officeId).map((p) => ({ path: p.slug, label: `${l.name}: ${p.name}`, group: "Locations" as const })),
      ]),
      ...(this.attorneys.length ? [s("/attorneys"), ...this.attorneys.map((a) => ({ path: `/attorneys/${a.slug}`, label: a.name, group: "Firm" as const }))] : []),
      s("/resources"),
      ...this.articles.map((a) => ({ path: a.slug, label: a.name, group: "Resources" as const })),
      s("/privacy"),
      s("/disclaimer"),
      s("/site-map"),
    ];
  }
}

/** The site's published content. Cached across requests (tag "content"), built once per request. */
export const getContent = cache(async () => new Content(await loadData()));
