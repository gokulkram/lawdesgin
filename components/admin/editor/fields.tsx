"use client";

// Form controls for the page editor. Each is controlled: value in, new value out via onChange.
import { useId } from "react";
import RichBlocksEditor from "@/components/admin/editor/RichBlocksEditor";

type Block = { p: string } | { ul: string[] } | { ol: string[] } | { callout: string };
export type Section = { heading: string; blocks: Block[] };
export type Faq = { q: string; a: string };
export type Steps = { heading: string; items: { title: string; text: string }[] };
export type Court = { name: string; address: string; url: string; note?: string };
export type Education = { school: string; degree: string; year?: string };
export type PageOption = { path: string; name: string; type: string };

// ---------------------------------------------------------------- list helpers

const move = <T,>(list: T[], i: number, by: number) => {
  const j = i + by;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
const replace = <T,>(list: T[], i: number, v: T) => list.map((x, k) => (k === i ? v : x));
const remove = <T,>(list: T[], i: number) => list.filter((_, k) => k !== i);

export function RowTools({ i, count, onMove, onRemove, label }: { i: number; count: number; onMove: (by: number) => void; onRemove: () => void; label: string }) {
  return (
    <div className="ed-tools">
      <button type="button" className="ed-icon" onClick={() => onMove(-1)} disabled={i === 0} aria-label={`Move ${label} up`} title="Move up">↑</button>
      <button type="button" className="ed-icon" onClick={() => onMove(1)} disabled={i === count - 1} aria-label={`Move ${label} down`} title="Move down">↓</button>
      <button type="button" className="ed-icon ed-icon--danger" onClick={onRemove} aria-label={`Remove ${label}`} title="Remove">✕</button>
    </div>
  );
}

// ---------------------------------------------------------------- basic fields

export function Field({
  label, value, onChange, hint, max, rows, readOnly, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; hint?: React.ReactNode; max?: number; rows?: number;
  readOnly?: boolean; placeholder?: string; type?: string;
}) {
  const id = useId();
  const over = max !== undefined && value.length > max;
  return (
    <div className="adm-field ed-field">
      <label htmlFor={id}>
        <span>{label}</span>
        {max !== undefined && <small className={over ? "ed-count is-over" : "ed-count"}>{value.length}/{max}</small>}
      </label>
      {rows ? (
        <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} placeholder={placeholder} />
      ) : (
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} placeholder={placeholder} />
      )}
      {hint && <small className="ed-hint">{hint}</small>}
    </div>
  );
}

export function Select({ label, value, options, onChange, disabled }: { label: string; value: string; options: readonly string[] | { value: string; label: string }[]; onChange: (v: string) => void; disabled?: boolean }) {
  const id = useId();
  const opts = (options as (string | { value: string; label: string })[]).map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <div className="adm-field ed-field">
      <label htmlFor={id}><span>{label}</span></label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export const INLINE_HINT = <>Use <code>**bold**</code> and <code>[link text](/page-url)</code>.</>;

/** A list of short strings, edited one per line. */
export function LinesField({ label, value, onChange, hint, rows = 5 }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: React.ReactNode; rows?: number }) {
  return (
    <Field
      label={label}
      rows={rows}
      value={value.join("\n")}
      onChange={(v) => onChange(v.split("\n"))}
      hint={<>One per line.{hint ? <> {hint}</> : null}</>}
    />
  );
}
/** Drop blank lines (call before saving). */
export const cleanLines = (v: string[]) => v.map((s) => s.trim()).filter(Boolean);

// ---------------------------------------------------------------- rich content blocks

// Section text: a rich text editor (components/admin/editor/RichBlocksEditor.tsx) that saves blocks.
export function BlocksEditor({ value, onChange }: { value: Block[]; onChange: (v: Block[]) => void }) {
  return <RichBlocksEditor value={value} onChange={onChange} />;
}

/** Drop blank list items (call before saving). */
export const cleanBlocks = (blocks: Block[]): Block[] =>
  blocks.map((b) => ("ul" in b ? { ul: cleanLines(b.ul) } : "ol" in b ? { ol: cleanLines(b.ol) } : b));

export function SectionsEditor({ value, onChange }: { value: Section[]; onChange: (v: Section[]) => void }) {
  return (
    <div className="ed-stack">
      {value.map((s, i) => (
        <fieldset className="ed-group" key={i}>
          <div className="ed-row">
            <legend>Section {i + 1}</legend>
            <RowTools i={i} count={value.length} label="section" onMove={(by) => onChange(move(value, i, by))} onRemove={() => onChange(remove(value, i))} />
          </div>
          <Field label="Heading (H2)" value={s.heading} onChange={(heading) => onChange(replace(value, i, { ...s, heading }))} />
          <BlocksEditor value={s.blocks} onChange={(blocks) => onChange(replace(value, i, { ...s, blocks }))} />
        </fieldset>
      ))}
      <button type="button" className="adm-btn adm-btn--sm" onClick={() => onChange([...value, { heading: "", blocks: [{ p: "" }] }])}>+ Add section</button>
    </div>
  );
}

export function FaqsEditor({ value, onChange }: { value: Faq[]; onChange: (v: Faq[]) => void }) {
  return (
    <div className="ed-stack">
      {value.map((f, i) => (
        <fieldset className="ed-group" key={i}>
          <div className="ed-row">
            <legend>Question {i + 1}</legend>
            <RowTools i={i} count={value.length} label="question" onMove={(by) => onChange(move(value, i, by))} onRemove={() => onChange(remove(value, i))} />
          </div>
          <Field label="Question" value={f.q} onChange={(q) => onChange(replace(value, i, { ...f, q }))} />
          <Field label="Answer" rows={3} value={f.a} onChange={(a) => onChange(replace(value, i, { ...f, a }))} hint={INLINE_HINT} />
        </fieldset>
      ))}
      <button type="button" className="adm-btn adm-btn--sm" onClick={() => onChange([...value, { q: "", a: "" }])}>+ Add question</button>
    </div>
  );
}

export function StepsEditor({ value, onChange }: { value: Steps | undefined; onChange: (v: Steps | undefined) => void }) {
  if (!value) {
    return (
      <div>
        <p className="adm-muted">No “what to do” list on this page.</p>
        <button type="button" className="adm-btn adm-btn--sm" onClick={() => onChange({ heading: "", items: [{ title: "", text: "" }] })}>+ Add a “what to do” list</button>
      </div>
    );
  }
  return (
    <div className="ed-stack">
      <Field label="List heading" value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
      {value.items.map((s, i) => (
        <fieldset className="ed-group" key={i}>
          <div className="ed-row">
            <legend>Step {i + 1}</legend>
            <RowTools i={i} count={value.items.length} label="step" onMove={(by) => onChange({ ...value, items: move(value.items, i, by) })} onRemove={() => onChange({ ...value, items: remove(value.items, i) })} />
          </div>
          <Field label="Title" value={s.title} onChange={(title) => onChange({ ...value, items: replace(value.items, i, { ...s, title }) })} />
          <Field label="Text" rows={2} value={s.text} onChange={(text) => onChange({ ...value, items: replace(value.items, i, { ...s, text }) })} />
        </fieldset>
      ))}
      <div className="ed-add">
        <button type="button" className="adm-btn adm-btn--sm" onClick={() => onChange({ ...value, items: [...value.items, { title: "", text: "" }] })}>+ Add step</button>
        <button type="button" className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => onChange(undefined)}>Remove the whole list</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- page pickers

export function PagePicker({ label, value, options, onChange, hint }: { label: string; value: string[]; options: PageOption[]; onChange: (v: string[]) => void; hint?: string }) {
  const id = useId();
  const byPath = new Map(options.map((o) => [o.path, o]));
  const available = options.filter((o) => !value.includes(o.path));
  return (
    <div className="adm-field ed-field">
      <label htmlFor={id}><span>{label}</span></label>
      {value.length > 0 && (
        <ol className="ed-chips">
          {value.map((p, i) => (
            <li key={p} className="ed-chip">
              <span><strong>{byPath.get(p)?.name ?? "Missing page"}</strong> <small>{p}</small></span>
              <RowTools i={i} count={value.length} label={byPath.get(p)?.name ?? p} onMove={(by) => onChange(move(value, i, by))} onRemove={() => onChange(remove(value, i))} />
            </li>
          ))}
        </ol>
      )}
      <select id={id} value="" onChange={(e) => e.target.value && onChange([...value, e.target.value])}>
        <option value="">+ Add a page…</option>
        {available.map((o) => <option key={o.path} value={o.path}>{o.name} - {o.path}</option>)}
      </select>
      {hint && <small className="ed-hint">{hint}</small>}
    </div>
  );
}

export function CheckList({ label, value, options, onChange }: { label: string; value: string[]; options: { value: string; label: string }[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset className="adm-field ed-field ed-checks">
      <legend><span>{label}</span></legend>
      {options.map((o) => (
        <label key={o.value} className="ed-check">
          <input type="checkbox" checked={value.includes(o.value)} onChange={(e) => onChange(e.target.checked ? [...value, o.value] : value.filter((v) => v !== o.value))} />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}

// ---------------------------------------------------------------- office + attorney specifics

export function CourtsEditor({ value, onChange }: { value: Court[]; onChange: (v: Court[]) => void }) {
  return (
    <div className="ed-stack">
      {value.map((c, i) => (
        <fieldset className="ed-group" key={i}>
          <div className="ed-row">
            <legend>Courthouse {i + 1}</legend>
            <RowTools i={i} count={value.length} label="courthouse" onMove={(by) => onChange(move(value, i, by))} onRemove={() => onChange(remove(value, i))} />
          </div>
          <Field label="Official name" value={c.name} onChange={(name) => onChange(replace(value, i, { ...c, name }))} />
          <Field label="Address" value={c.address} onChange={(address) => onChange(replace(value, i, { ...c, address }))} />
          <Field label="Official website (https://…)" type="url" value={c.url} onChange={(url) => onChange(replace(value, i, { ...c, url }))} />
          <Field label="Note (optional)" value={c.note ?? ""} onChange={(note) => onChange(replace(value, i, { ...c, note }))} />
        </fieldset>
      ))}
      <button type="button" className="adm-btn adm-btn--sm" onClick={() => onChange([...value, { name: "", address: "", url: "" }])}>+ Add courthouse</button>
    </div>
  );
}

export function EducationEditor({ value, onChange }: { value: Education[]; onChange: (v: Education[]) => void }) {
  return (
    <div className="ed-stack">
      {value.map((e, i) => (
        <fieldset className="ed-group ed-group--inline" key={i}>
          <Field label="School" value={e.school} onChange={(school) => onChange(replace(value, i, { ...e, school }))} />
          <Field label="Degree" value={e.degree} onChange={(degree) => onChange(replace(value, i, { ...e, degree }))} />
          <Field label="Year" value={e.year ?? ""} onChange={(year) => onChange(replace(value, i, { ...e, year }))} />
          <RowTools i={i} count={value.length} label="education entry" onMove={(by) => onChange(move(value, i, by))} onRemove={() => onChange(remove(value, i))} />
        </fieldset>
      ))}
      <button type="button" className="adm-btn adm-btn--sm" onClick={() => onChange([...value, { school: "", degree: "" }])}>+ Add education</button>
    </div>
  );
}
