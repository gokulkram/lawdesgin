"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { MediaPicker } from "@/components/admin/media/MediaLibrary";
import { RowTools } from "@/components/admin/editor/fields";
import type { Credibility, Firm, Office, Stat, Testimonial } from "@/lib/admin/settings-model";
import { unverifiedCount } from "@/lib/admin/settings-model";
import { wordingWarnings } from "@/lib/admin/validate";
import { saveCredibility, saveFirmContact, saveOffice, type SettingsState } from "./actions";

function Result({ state }: { state: SettingsState }) {
  if (state?.error) return <p className="adm-alert adm-alert--error" role="alert">{state.error}</p>;
  if (state?.message) return <p className="adm-alert adm-alert--ok" role="status">{state.message}</p>;
  return null;
}

// Plain submit (no React form action), so typed values stay put if a save fails.
function useSubmit(save: (prev: SettingsState, form: FormData) => Promise<SettingsState>) {
  const [state, setState] = useState<SettingsState>(undefined);
  const [pending, start] = useTransition();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    start(async () => setState(await save(undefined, form)));
  };
  return { state, pending, onSubmit };
}

export function FirmForm({ firm, version }: { firm: Firm; version: string }) {
  const { state, pending, onSubmit } = useSubmit(saveFirmContact);
  const [heroImage, setHeroImage] = useState(firm.heroImage ?? "");
  return (
    <form onSubmit={onSubmit} className="adm-form adm-form--grid">
      <input type="hidden" name="version" value={version} />
      <label className="adm-field"><span>Main phone</span><input name="phone" defaultValue={firm.phone} placeholder="(800) 555-0100" required /></label>
      <label className="adm-field"><span>Email</span><input name="email" type="email" defaultValue={firm.email} required /></label>
      <label className="adm-field adm-field--wide">
        <span>Firm description (structured data for search engines)</span>
        <textarea name="description" rows={2} defaultValue={firm.description} required />
      </label>
      {firm.social.map((s) => (
        <label className="adm-field" key={s.label}><span>{s.label} page (https://…, empty = hidden)</span><input name={`social-${s.label}`} defaultValue={s.url} placeholder="https://" /></label>
      ))}
      <label className="adm-field adm-field--wide">
        <span>Contact form - “Type of case” options</span>
        <textarea name="caseTypes" rows={6} defaultValue={firm.caseTypes.join("\n")} />
        <small className="ed-hint">One per line.</small>
      </label>
      <label className="adm-field adm-field--wide"><span>Footer text</span><textarea name="footerAbout" rows={2} defaultValue={firm.footerAbout} /></label>
      <label className="adm-field adm-field--wide">
        <span>Footer disclaimer (attorney advertising)</span>
        <textarea name="footerDisclaimer" rows={3} defaultValue={firm.footerDisclaimer} />
      </label>
      <input type="hidden" name="heroImage" value={heroImage} />
      <div className="adm-field--wide">
        <MediaPicker
          label="Home page banner photo"
          value={heroImage}
          onChange={setHeroImage}
          hint="Empty = the built-in California beach photo. Use a landscape photo at least 1920 px wide with calm space on the left for the headline."
        />
      </div>
      <label className="ed-check adm-field--wide">
        <input type="checkbox" name="heroParallax" defaultChecked={firm.heroParallax !== false} /> Parallax effect on the home page banner (background scrolls slower than the page)
      </label>
      <div className="adm-field--wide"><button className="adm-btn adm-btn--primary" disabled={pending}>{pending ? "Saving…" : "Save firm details"}</button></div>
      <div className="adm-field--wide"><Result state={state} /></div>
    </form>
  );
}

export function OfficeForm({ office, version }: { office: Office; version: string }) {
  const { state, pending, onSubmit } = useSubmit(saveOffice);
  const [img, setImg] = useState(office.img);
  return (
    <form onSubmit={onSubmit} className="adm-form adm-form--grid">
      <input type="hidden" name="version" value={version} />
      <input type="hidden" name="id" value={office.id} />
      <input type="hidden" name="img" value={img} />
      <label className="adm-field"><span>Name</span><input name="label" defaultValue={office.label} required /></label>
      <label className="adm-field">
        <span>Type</span>
        <select name="kind" defaultValue={office.kind}><option>Main Office</option><option>Branch Office</option></select>
      </label>
      <label className="adm-field adm-field--wide"><span>Street address (must match the Google Business Profile exactly)</span><input name="street" defaultValue={office.street} /></label>
      <label className="adm-field"><span>City</span><input name="locality" defaultValue={office.locality} required /></label>
      <label className="adm-field"><span>ZIP code</span><input name="postalCode" defaultValue={office.postalCode} /></label>
      <label className="adm-field"><span>Phone</span><input name="phone" defaultValue={office.phone} required /></label>
      <div className="adm-field--wide">
        <MediaPicker label="Photo" value={img} onChange={setImg} hint="Shown on the office cards. Landscape, about 800×500." />
        {img !== `/images/office-${office.id}.webp` && (
          <button type="button" className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => setImg(`/images/office-${office.id}.webp`)}>Use the original photo</button>
        )}
      </div>
      <div className="adm-field--wide"><button className="adm-btn adm-btn--primary" disabled={pending}>{pending ? "Saving…" : `Save ${office.label}`}</button></div>
      <div className="adm-field--wide"><Result state={state} /></div>
    </form>
  );
}

function StatsEditor({ title, value, onChange }: { title: string; value: Stat[]; onChange: (v: Stat[]) => void }) {
  const set = (i: number, s: Stat) => onChange(value.map((x, k) => (k === i ? s : x)));
  const move = (i: number, by: number) => { const j = i + by; if (j < 0 || j >= value.length) return; const n = [...value]; [n[i], n[j]] = [n[j], n[i]]; onChange(n); };
  return (
    <div className="ed-stack">
      <h3 className="ed-h3">{title}</h3>
      {value.map((s, i) => (
        <fieldset className={`ed-group ed-group--stat${s.verified ? "" : " is-unverified"}`} key={i}>
          <label className="adm-field"><span>Figure</span><input value={s.value} onChange={(e) => set(i, { ...s, value: e.target.value })} /></label>
          <label className="adm-field"><span>Label</span><input value={s.label} onChange={(e) => set(i, { ...s, label: e.target.value })} /></label>
          <label className="ed-check"><input type="checkbox" checked={s.verified} onChange={(e) => set(i, { ...s, verified: e.target.checked })} /> Verified</label>
          <RowTools i={i} count={value.length} label="figure" onMove={(by) => move(i, by)} onRemove={() => onChange(value.filter((_, k) => k !== i))} />
        </fieldset>
      ))}
      <div><button type="button" className="adm-btn adm-btn--sm" onClick={() => onChange([...value, { value: "", label: "", verified: false }])}>+ Add figure</button></div>
    </div>
  );
}

export function CredibilityForm({ value: initial, version: initialVersion }: { value: Credibility; version: string }) {
  const [value, setValue] = useState(initial);
  const [version, setVersion] = useState(initialVersion);
  const [state, setState] = useState<SettingsState>(undefined);
  const [pending, start] = useTransition();
  useEffect(() => setVersion(initialVersion), [initialVersion]);
  const placeholders = unverifiedCount(value);
  const warnings = useMemo(() => wordingWarnings([...value.homeStats, ...value.wrongfulDeathStats].map((s) => `${s.value} ${s.label}`).concat(value.testimonials.map((t) => t.quote))), [value]);
  const setT = (i: number, t: Testimonial) => setValue((v) => ({ ...v, testimonials: v.testimonials.map((x, k) => (k === i ? t : x)) }));
  const moveT = (i: number, by: number) => setValue((v) => { const j = i + by; if (j < 0 || j >= v.testimonials.length) return v; const n = [...v.testimonials]; [n[i], n[j]] = [n[j], n[i]]; return { ...v, testimonials: n }; });

  return (
    <div className="adm-form">
      {placeholders > 0 && (
        <p className="adm-alert adm-alert--error">
          <strong>{placeholders} item{placeholders === 1 ? " is" : "s are"} not verified.</strong> Replace each with a verified figure or an
          approved client review, or delete it, before launch - California Rules of Professional Conduct 7.1–7.2 prohibit misleading claims.
        </p>
      )}
      {warnings.length > 0 && <ul className="ed-issues">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>}
      <StatsEditor title="Home page figures (trust bar)" value={value.homeStats} onChange={(homeStats) => setValue((v) => ({ ...v, homeStats }))} />
      <StatsEditor title="Wrongful death page figures (sidebar)" value={value.wrongfulDeathStats} onChange={(wrongfulDeathStats) => setValue((v) => ({ ...v, wrongfulDeathStats }))} />
      <h3 className="ed-h3">Testimonials (home page)</h3>
      <p className="adm-muted">Only reviews the client approved for publication. Leave the list empty to hide the section.</p>
      {value.testimonials.map((t, i) => (
        <fieldset className={`ed-group${t.verified ? "" : " is-unverified"}`} key={i}>
          <div className="ed-row"><legend>Testimonial {i + 1}</legend><RowTools i={i} count={value.testimonials.length} label="testimonial" onMove={(by) => moveT(i, by)} onRemove={() => setValue((v) => ({ ...v, testimonials: v.testimonials.filter((_, k) => k !== i) }))} /></div>
          <label className="adm-field"><span>Quote</span><textarea rows={3} value={t.quote} onChange={(e) => setT(i, { ...t, quote: e.target.value })} /></label>
          <div className="adm-form--grid adm-form">
            <label className="adm-field"><span>Name as shown</span><input value={t.who} onChange={(e) => setT(i, { ...t, who: e.target.value })} /></label>
            <label className="adm-field"><span>Initials (avatar)</span><input value={t.initials} maxLength={3} onChange={(e) => setT(i, { ...t, initials: e.target.value })} /></label>
            <label className="adm-field"><span>Type of case</span><input value={t.kind} onChange={(e) => setT(i, { ...t, kind: e.target.value })} /></label>
          </div>
          <label className="ed-check"><input type="checkbox" checked={t.verified} onChange={(e) => setT(i, { ...t, verified: e.target.checked })} /> Approved by the client for publication</label>
        </fieldset>
      ))}
      <div><button type="button" className="adm-btn adm-btn--sm" onClick={() => setValue((v) => ({ ...v, testimonials: [...v.testimonials, { quote: "", initials: "", who: "", kind: "", verified: false }] }))}>+ Add testimonial</button></div>
      <div>
        <button type="button" className="adm-btn adm-btn--primary" disabled={pending} onClick={() => start(async () => {
          const r = await saveCredibility(version, value);
          setState(r);
          if (r?.version) setVersion(r.version);
        })}>{pending ? "Saving…" : "Save figures and testimonials"}</button>
      </div>
      <Result state={state} />
    </div>
  );
}
