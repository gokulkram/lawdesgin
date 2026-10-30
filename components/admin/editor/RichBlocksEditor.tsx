"use client";

// Rich text editor (Tiptap) for page text. Only what the site can show is allowed - paragraphs,
// bold, links, bulleted and numbered lists, and callouts - so pasted Word/Google Docs formatting
// is cleaned up automatically. It saves the same blocks as before (lib/admin/blocks-doc.ts).
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { blocksToDoc, docToBlocks, type DocBlock } from "@/lib/admin/blocks-doc";
import { SAFE_HREF } from "@/components/RichText";

export default function RichBlocksEditor({ value, onChange, label = "Text" }: { value: DocBlock[]; onChange: (v: DocBlock[]) => void; label?: string }) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  // The last value this editor sent out, so a re-render with it doesn't reset the cursor.
  const sent = useRef(JSON.stringify(value));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false, code: false, codeBlock: false, italic: false, strike: false, underline: false,
        horizontalRule: false, hardBreak: false,
        link: {
          openOnClick: false,
          autolink: false,
          linkOnPaste: true,
          defaultProtocol: "https",
          isAllowedUri: (url) => SAFE_HREF.test(url),
          HTMLAttributes: { rel: null, target: null },
        },
      }),
    ],
    content: blocksToDoc(value),
    editorProps: { attributes: { class: "rte__content", "aria-label": label, "aria-multiline": "true", role: "textbox" } },
    onUpdate: ({ editor }) => {
      const next = docToBlocks(editor.getJSON());
      sent.current = JSON.stringify(next);
      onChangeRef.current(next);
    },
  });

  // Outside changes (section moved, page reloaded) replace the editor content.
  useEffect(() => {
    if (!editor) return;
    const s = JSON.stringify(value);
    if (s === sent.current) return;
    sent.current = s;
    editor.commands.setContent(blocksToDoc(value), { emitUpdate: false });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => e && ({
      bold: e.isActive("bold"),
      link: e.isActive("link"),
      ul: e.isActive("bulletList"),
      ol: e.isActive("orderedList"),
      callout: e.isActive("blockquote"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  if (!editor || !state) return <div className="rte rte--loading" aria-busy="true" />;

  const setLink = () => {
    const current = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address - a page on this site (/contact) or a full https:// address. Leave empty to remove the link.", current ?? "");
    if (url === null) return;
    const href = url.trim();
    if (!href) { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    if (!SAFE_HREF.test(href)) { window.alert("Use a site path starting with /, or an address starting with https://, mailto: or tel:"); return; }
    if (editor.state.selection.empty && !current) {
      editor.chain().focus().insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
  };

  const btn = (on: boolean, title: string, run: () => void, children: React.ReactNode, disabled = false) => (
    <button type="button" className={`rte__btn${on ? " is-on" : ""}`} title={title} aria-label={title} aria-pressed={on} disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} onClick={run}>{children}</button>
  );

  return (
    <div className="rte">
      <div className="rte__bar" role="toolbar" aria-label={`${label} formatting`}>
        {btn(state.bold, "Bold (Ctrl+B)", () => editor.chain().focus().toggleBold().run(), <strong>B</strong>)}
        {btn(state.link, "Link", setLink, <>&#128279; Link</>)}
        <span className="rte__sep" />
        {btn(state.ul, "Bulleted list", () => editor.chain().focus().toggleBulletList().run(), <>&bull; List</>)}
        {btn(state.ol, "Numbered list", () => editor.chain().focus().toggleOrderedList().run(), <>1. List</>)}
        {btn(state.callout, "Callout (highlighted note)", () => editor.chain().focus().toggleBlockquote().run(), <>&#10077; Callout</>)}
        <span className="rte__sep" />
        {btn(false, "Undo (Ctrl+Z)", () => editor.chain().focus().undo().run(), <>&#8630;</>, !state.canUndo)}
        {btn(false, "Redo (Ctrl+Y)", () => editor.chain().focus().redo().run(), <>&#8631;</>, !state.canRedo)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
