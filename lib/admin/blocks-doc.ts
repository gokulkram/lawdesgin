// Converts page text blocks ({ p }, { ul }, { ol }, { callout } with **bold** and [text](/link))
// to and from the rich text editor's document, so the editor saves the same format as before.
import type { JSONContent } from "@tiptap/core";

type Block = { p: string } | { ul: string[] } | { ol: string[] } | { callout: string };
type Mark = { type: "bold" } | { type: "link"; attrs: { href: string } };

const TOKEN = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;

/** "Call **now** or [read more](/x)" -> text nodes with bold/link marks. */
export function inlineToNodes(text: string): JSONContent[] {
  const out: JSONContent[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push({ type: "text", text: text.slice(last, m.index) });
    if (m[1]) out.push({ type: "text", text: m[1], marks: [{ type: "bold" }] });
    else out.push({ type: "text", text: m[2], marks: [{ type: "link", attrs: { href: m[3] } }] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) });
  return out;
}

const markKey = (marks?: JSONContent["marks"]) => {
  const link = marks?.find((m) => m.type === "link");
  if (link) return `link:${link.attrs?.href ?? ""}`; // the inline syntax can't nest, so a link wins over bold
  return marks?.some((m) => m.type === "bold") ? "bold" : "";
};

/** Text nodes -> "**bold**" / "[text](href)" string. Line breaks become spaces. */
export function nodesToInline(nodes: JSONContent[] = []): string {
  const runs: { key: string; text: string }[] = [];
  for (const n of nodes) {
    const text = n.type === "hardBreak" ? " " : n.text ?? "";
    const key = n.type === "hardBreak" ? "" : markKey(n.marks);
    const prev = runs[runs.length - 1];
    if (prev && prev.key === key) prev.text += text;
    else runs.push({ key, text });
  }
  return runs
    .map(({ key, text }) => {
      if (!key || !text.trim()) return text;
      // keep spaces outside the markers: "** bold**" would not render as bold
      const [, lead, core, trail] = text.match(/^(\s*)(.*?)(\s*)$/s)!;
      const wrapped = key === "bold" ? `**${core}**` : `[${core}](${key.slice(5)})`;
      return lead + wrapped + trail;
    })
    .join("");
}

const para = (text: string): JSONContent => {
  const content = inlineToNodes(text);
  return content.length ? { type: "paragraph", content } : { type: "paragraph" };
};
const list = (type: "bulletList" | "orderedList", items: string[]): JSONContent => ({
  type,
  content: (items.length ? items : [""]).map((t) => ({ type: "listItem", content: [para(t)] })),
});

export function blocksToDoc(blocks: Block[]): JSONContent {
  const content = blocks.map((b): JSONContent =>
    "p" in b ? para(b.p)
    : "callout" in b ? { type: "blockquote", content: [para(b.callout)] }
    : "ul" in b ? list("bulletList", b.ul)
    : list("orderedList", b.ol),
  );
  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}

// All paragraph texts inside a node (list items may hold nested lists - they are flattened).
const paragraphs = (n: JSONContent): string[] =>
  n.type === "paragraph" ? [nodesToInline(n.content)] : (n.content ?? []).flatMap(paragraphs);

const listItems = (n: JSONContent): string[] =>
  (n.content ?? []).flatMap((li) => {
    const own = (li.content ?? []).filter((c) => c.type === "paragraph").map((c) => nodesToInline(c.content)).join(" ");
    const nested = (li.content ?? []).filter((c) => c.type === "bulletList" || c.type === "orderedList").flatMap(listItems);
    return [own, ...nested];
  }).filter((t) => t.trim());

/** Editor document -> blocks. Empty paragraphs and list items are dropped. */
export function docToBlocks(doc: JSONContent): Block[] {
  const out: Block[] = [];
  for (const n of doc.content ?? []) {
    if (n.type === "paragraph") {
      const p = nodesToInline(n.content);
      if (p.trim()) out.push({ p });
    } else if (n.type === "blockquote") {
      for (const c of paragraphs(n)) if (c.trim()) out.push({ callout: c });
    } else if (n.type === "bulletList" || n.type === "orderedList") {
      const items = listItems(n);
      if (items.length) out.push(n.type === "bulletList" ? { ul: items } : { ol: items });
    } else {
      for (const p of paragraphs(n)) if (p.trim()) out.push({ p });
    }
  }
  return out;
}

export type { Block as DocBlock, Mark as DocMark };
