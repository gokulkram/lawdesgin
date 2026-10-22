"use server";

import { revalidatePath, updateTag } from "next/cache";
import { staffFor } from "@/lib/admin/auth";
import { credibilityErrors, firmErrors, phoneParts, type Credibility, type Firm, type Office } from "@/lib/admin/settings-model";
import { CONTENT_TAG } from "@/lib/content-store";
import { MEDIA_PREFIX } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

// Site settings - admins only (RLS: site_settings is admin-write). Each form changes only its own part
// of the stored value: it re-reads the row, replaces its keys, and writes back only if nobody saved
// in between (updated_at = the version the form was loaded with).

export type SettingsState = { error?: string; message?: string; version?: string } | undefined;

const CONFLICT = "Someone else saved these settings since you opened this page. Reload the page and make your change again.";
const str = (form: FormData, k: string) => String(form.get(k) ?? "").trim();

async function update<T>(key: "firm" | "credibility", version: string, change: (current: T) => T | string): Promise<SettingsState> {
  const me = await staffFor("admin");
  if (!me) return { error: "Only admins can change site settings." };
  const supabase = await createClient();
  const { data: row, error: readError } = await supabase.from("site_settings").select("value, updated_at").eq("key", key).single();
  if (readError || !row) return { error: readError?.message ?? "Settings not found." };
  if (row.updated_at !== version) return { error: CONFLICT };
  const next = change(row.value as T);
  if (typeof next === "string") return { error: next };
  const { data, error } = await supabase.from("site_settings").update({ value: next, updated_by: me.id }).eq("key", key).eq("updated_at", version).select("updated_at");
  if (error) return { error: error.message };
  if (!data?.length) return { error: CONFLICT };
  updateTag(CONTENT_TAG);
  revalidatePath("/admin/settings");
  return { message: "Saved - the website shows the change on its next page view.", version: data[0].updated_at };
}

export async function saveFirmContact(_prev: SettingsState, form: FormData): Promise<SettingsState> {
  return update<Firm>("firm", str(form, "version"), (firm) => {
    const phone = phoneParts(str(form, "phone"));
    const next: Firm = {
      ...firm,
      description: str(form, "description"),
      phone: str(form, "phone"),
      phoneTel: phone?.tel ?? "",
      phoneSchema: phone?.schema ?? "",
      email: str(form, "email"),
      social: firm.social.map((s) => ({ ...s, url: str(form, `social-${s.label}`) })),
      caseTypes: str(form, "caseTypes").split("\n").map((l) => l.trim()).filter(Boolean),
      footerAbout: str(form, "footerAbout"),
      footerDisclaimer: str(form, "footerDisclaimer"),
      heroParallax: form.get("heroParallax") === "on",
      heroImage: str(form, "heroImage"),
    };
    const errors = firmErrors(next, MEDIA_PREFIX);
    return errors.length ? errors.join(" ") : next;
  });
}

export async function saveOffice(_prev: SettingsState, form: FormData): Promise<SettingsState> {
  const id = str(form, "id");
  return update<Firm>("firm", str(form, "version"), (firm) => {
    if (!firm.offices.some((o) => o.id === id)) return "Unknown office.";
    const phone = phoneParts(str(form, "phone"));
    const offices = firm.offices.map((o): Office => (o.id !== id ? o : {
      ...o,
      label: str(form, "label"),
      kind: str(form, "kind") === "Main Office" ? "Main Office" : "Branch Office",
      street: str(form, "street"),
      locality: str(form, "locality"),
      postalCode: str(form, "postalCode"),
      phone: str(form, "phone"),
      tel: phone?.tel ?? "",
      img: str(form, "img"),
    }));
    const next = { ...firm, offices };
    const errors = firmErrors(next, MEDIA_PREFIX).filter((e) => e.includes(str(form, "label") || id) || e.startsWith(`Office ${id}`));
    return errors.length ? errors.join(" ") : next;
  });
}

export async function saveCredibility(version: string, value: Credibility): Promise<SettingsState> {
  return update<Credibility>("credibility", version, () => {
    const clean = (s: string) => String(s ?? "").trim();
    const next: Credibility = {
      homeStats: value.homeStats.map((s) => ({ value: clean(s.value), label: clean(s.label), verified: s.verified === true })),
      wrongfulDeathStats: value.wrongfulDeathStats.map((s) => ({ value: clean(s.value), label: clean(s.label), verified: s.verified === true })),
      testimonials: value.testimonials.map((t) => ({ quote: clean(t.quote), initials: clean(t.initials).toUpperCase(), who: clean(t.who), kind: clean(t.kind), verified: t.verified === true })),
    };
    const errors = credibilityErrors(next);
    return errors.length ? errors.join(" ") : next;
  });
}
