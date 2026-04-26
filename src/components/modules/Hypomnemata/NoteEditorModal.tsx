"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RichTextEditor } from "./RichTextEditor";
import type { Note, NoteColor } from "./useNotes";

const COLOR_OPTIONS: { value: NoteColor; label: string; class: string }[] = [
  { value: "default", label: "Default", class: "bg-zinc-800 border-zinc-700" },
  { value: "oxido", label: "Óxido", class: "bg-red-950 border-red-800" },
  { value: "emerald", label: "Esmeralda", class: "bg-emerald-950 border-emerald-800" },
  { value: "sky", label: "Cielo", class: "bg-sky-950 border-sky-800" },
  { value: "violet", label: "Violeta", class: "bg-violet-950 border-violet-800" },
  { value: "amber", label: "Ámbar", class: "bg-amber-950 border-amber-800" },
];

interface NoteEditorModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  note?: Note | null;
  onSave: (data: { title: string; content: string; color: NoteColor }) => void;
}

export function NoteEditorModal({ open, onOpenChange, note, onSave }: NoteEditorModalProps) {
  const [title, setTitle] = React.useState(note?.title ?? "");
  const [content, setContent] = React.useState(note?.content ?? "");
  const [color, setColor] = React.useState<NoteColor>(note?.color ?? "default");
  const [showPalette, setShowPalette] = React.useState(false);
  const titleRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setTitle(note?.title ?? "");
      setContent(note?.content ?? "");
      setColor(note?.color ?? "default");
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open, note]);

  function handleSave() {
    onSave({ title: title || "Sin título", content, color });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl gap-0 rounded-2xl p-0 flex flex-col">
          <DialogTitle className="sr-only">
            {note ? "Editar idea" : "Nueva idea"}
          </DialogTitle>
          {/* Header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] px-6 py-4 pr-14">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la idea…"
              className="flex-1 bg-transparent text-lg font-semibold text-zinc-50 outline-none placeholder:text-zinc-600"
            />
            <div className="flex items-center gap-2">
              {/* Color picker */}
              <div className="relative">
                <button
                  onClick={() => setShowPalette((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] p-1.5 text-zinc-500 transition hover:text-zinc-200"
                  title="Color"
                >
                  <Palette className="h-4 w-4" />
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full border",
                      COLOR_OPTIONS.find((c) => c.value === color)?.class
                    )}
                  />
                </button>
                <AnimatePresence>
                  {showPalette && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 top-full z-50 mt-1 flex gap-2 rounded-xl border border-white/[0.1] bg-[#111113] p-3 shadow-xl"
                    >
                      {COLOR_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          title={opt.label}
                          onClick={() => {
                            setColor(opt.value);
                            setShowPalette(false);
                          }}
                          className={cn(
                            "h-6 w-6 rounded-full border-2 transition hover:scale-110",
                            opt.class,
                            color === opt.value && "ring-2 ring-white/40 ring-offset-1 ring-offset-[#111113]"
                          )}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-y-auto p-4">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Escribí tu idea…"
            />
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between border-t border-white/[0.06] px-6 py-4">
            <p className="text-xs text-zinc-600">
              {note
                ? `Editando · ${new Date(note.updatedAt).toLocaleString("es-AR")}`
                : "Nueva idea"}
            </p>
            <div className="flex gap-2">
              <DialogClose className="rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-zinc-500 transition hover:text-zinc-200">
                Cancelar
              </DialogClose>
              <button
                onClick={handleSave}
                className="rounded-lg bg-[hsl(var(--oxido))] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                {note ? "Guardar cambios" : "Crear idea"}
              </button>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}
