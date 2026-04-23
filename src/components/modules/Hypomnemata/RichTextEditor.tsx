"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Highlighter,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const COLORS = [
  { label: "Blanco", value: "#e4e4e7" },
  { label: "Zinc", value: "#a1a1aa" },
  { label: "Rojo", value: "#f87171" },
  { label: "Naranja", value: "#fb923c" },
  { label: "Amarillo", value: "#fbbf24" },
  { label: "Verde", value: "#4ade80" },
  { label: "Azul", value: "#60a5fa" },
  { label: "Violeta", value: "#a78bfa" },
];

function ToolbarButton({
  active,
  onClick,
  title,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md text-xs transition",
        active
          ? "bg-white/[0.12] text-zinc-100"
          : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none min-h-[200px] px-4 py-3 text-zinc-200 focus:outline-none [&_p]:my-1 [&_h2]:mt-3 [&_h3]:mt-2 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-600 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-400 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4",
      },
    },
  });

  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);

  if (!editor) return null;

  return (
    <div className="flex flex-col rounded-lg border border-white/[0.08] bg-[#0a0a0b] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.06] px-2 py-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrita"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Cursiva"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Subrayar"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Tachado"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Código"
        >
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-white/[0.08]" />

        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Título 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Título 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista numerada"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Cita"
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-white/[0.08]" />

        {/* Color picker */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setColorPickerOpen((v) => !v)}
            title="Color de texto"
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-bold leading-none">A</span>
              <div
                className="h-[3px] w-full rounded-full"
                style={{
                  backgroundColor:
                    editor.getAttributes("textStyle").color ?? "#e4e4e7",
                }}
              />
            </div>
          </ToolbarButton>
          {colorPickerOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 flex gap-1 rounded-lg border border-white/[0.1] bg-[#111113] p-2 shadow-xl">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  title={c.label}
                  onClick={() => {
                    editor.chain().focus().setColor(c.value).run();
                    setColorPickerOpen(false);
                  }}
                  className="h-5 w-5 rounded-full border border-white/10 transition hover:scale-110"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight */}
        <ToolbarButton
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight({ color: "#7c3aed33" }).run()}
          title="Resaltar"
        >
          <Highlighter className="h-3.5 w-3.5" />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-white/[0.08]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
