import { requireStaff } from "@/lib/admin/auth";
import type { Credibility, Firm } from "@/lib/admin/settings-model";
import { createClient } from "@/lib/supabase/server";
import { OFFICE_IDS } from "@/lib/firm";
import { AddOfficeForm, CredibilityForm, FirmForm, OfficeForm } from "./SettingsForms";

export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireStaff("admin");
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value, updated_at").in("key", ["firm", "credibility"]);
  const row = (k: string) => data?.find((r) => r.key === k);
  const firm = row("firm");
  const cred = row("credibility");
  if (!firm || !cred) {
    return <p className="adm-alert adm-alert--error">Firm details aren&rsquo;t in the database yet. Run <code>npm run content:import -- --settings</code>.</p>;
  }
  const f = firm.value as Firm;
  return (
    <>
      <h1 className="adm-h1">Site settings</h1>
      <p className="adm-muted">Firm details used everywhere on the website - header, footer, contact pages, forms and the information search engines read. Changes show on the site straight away.</p>

      <section className="adm-card">
        <h2 className="adm-h2">Firm details</h2>
        <FirmForm firm={f} version={firm.updated_at} />
      </section>

      <section className="adm-card">
        <h2 className="adm-h2">Offices</h2>
        <p className="adm-muted">
          Each address and phone number should match that office&rsquo;s Google Business Profile exactly. The address appears on the office
          page (with a map) and in the information search engines read once a street address is filled in. The original six offices have
          their own pages and can&rsquo;t be removed. Offices you add show on the office cards, in the contact form and on attorney
          profiles, and link to the contact page (they don&rsquo;t get a page of their own).
        </p>
        {f.offices.map((o) => (
          <details className="st-office" key={o.id}>
            <summary><strong>{o.label}</strong> <span className="adm-muted">- {o.kind}{o.street ? `, ${o.street}` : ", no street address yet"}</span></summary>
            <OfficeForm office={o} version={firm.updated_at} removable={!OFFICE_IDS.includes(o.id) && f.offices[0]?.id !== o.id} />
          </details>
        ))}
        <details className="st-office">
          <summary><strong>+ Add office</strong></summary>
          <AddOfficeForm version={firm.updated_at} phone={f.phone} />
        </details>
      </section>

      <section className="adm-card">
        <h2 className="adm-h2">Figures and testimonials</h2>
        <CredibilityForm value={cred.value as Credibility} version={cred.updated_at} />
      </section>
    </>
  );
}
