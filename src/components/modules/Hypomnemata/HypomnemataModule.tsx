"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  PenTool,
  Search,
  Trash2,
  Edit3,
  X,
  Move,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Link2,
  LinkIcon,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNotes, type Note, type NoteColor } from "./useNotes";
import { NoteEditorModal } from "./NoteEditorModal";

// ─────────────────────────────────────────────────────────────
// Color map for note cards
// ─────────────────────────────────────────────────────────────
const NOTE_COLORS: Record<NoteColor, { card: string; header: string; dot: string }> = {
  default: {
    card: "border-white/[0.08] bg-[#111113]",
    header: "bg-white/[0.03]",
    dot: "bg-zinc-500",
  },
  oxido: {
    card: "border-red-800/40 bg-red-950/60",
    header: "bg-red-950/80",
    dot: "bg-red-500",
  },
  emerald: {
    card: "border-emerald-800/40 bg-emerald-950/60",
    header: "bg-emerald-950/80",
    dot: "bg-emerald-500",
  },
  sky: {
    card: "border-sky-800/40 bg-sky-950/60",
    header: "bg-sky-950/80",
    dot: "bg-sky-400",
  },
  violet: {
    card: "border-violet-800/40 bg-violet-950/60",
    header: "bg-violet-950/80",
    dot: "bg-violet-400",
  },
  amber: {
    card: "border-amber-800/40 bg-amber-950/60",
    header: "bg-amber-950/80",
    dot: "bg-amber-400",
  },
};

// ─────────────────────────────────────────────────────────────
// Canvas Note Card
// ─────────────────────────────────────────────────────────────
function NoteCardCanvas({
  note,
  onEdit,
  onDelete,
  onMove,
  connectMode,
  onConnectClick,
}: {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (x: number, y: number) => void;
  connectMode: boolean;
  onConnectClick: () => void;
}) {
  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ mouseX: 0, mouseY: 0, noteX: 0, noteY: 0 });
  const colors = NOTE_COLORS[note.color];

  function onMouseDown(e: React.MouseEvent) {
    if (connectMode) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      noteX: note.posX,
      noteY: note.posY,
    };

    function onMouseMove(ev: MouseEvent) {
      if (!isDragging.current) return;
      const dx = ev.clientX - dragStart.current.mouseX;
      const dy = ev.clientY - dragStart.current.mouseY;
      onMove(dragStart.current.noteX + dx, dragStart.current.noteY + dy);
    }

    function onMouseUp() {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  const plainText = React.useMemo(() => stripHtml(note.content), [note.content]);

  return (
    <div
      className={cn(
        "group absolute w-64 rounded-xl border shadow-lg backdrop-blur-sm cursor-grab active:cursor-grabbing select-none transition-shadow hover:shadow-xl",
        colors.card,
        connectMode && "cursor-pointer ring-2 ring-[hsl(var(--oxido))]/50 hover:ring-[hsl(var(--oxido))]"
      )}
      style={{ left: note.posX, top: note.posY }}
      onMouseDown={onMouseDown}
      onClick={connectMode ? onConnectClick : undefined}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between rounded-t-xl px-3 py-2",
          colors.header
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn("h-2 w-2 rounded-full shrink-0", colors.dot)} />
          <span className="truncate text-xs font-semibold text-zinc-100">
            {note.title}
          </span>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {note.connections.length > 0 && (
            <span className="mr-1 flex items-center gap-0.5 text-[10px] text-zinc-500">
              <Link2 className="h-2.5 w-2.5" />
              {note.connections.length}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="rounded p-1 text-zinc-500 hover:text-zinc-200 transition"
          >
            <Edit3 className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="rounded p-1 text-zinc-500 hover:text-rose-400 transition"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content preview */}
      {plainText && (
        <div className="px-3 py-2.5">
          <p className="line-clamp-4 text-[12px] leading-relaxed text-zinc-400">
            {plainText}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 pb-2 pt-1 text-[10px] text-zinc-600">
        {format(parseISO(note.createdAt), "d MMM yyyy · HH:mm", { locale: es })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Connections SVG Overlay
// ─────────────────────────────────────────────────────────────
function ConnectionLines({ notes }: { notes: Note[] }) {
  const noteMap = React.useMemo(
    () => Object.fromEntries(notes.map((n) => [n.id, n])),
    [notes]
  );

  const lines: { key: string; x1: number; y1: number; x2: number; y2: number }[] = [];
  const seen = new Set<string>();

  for (const note of notes) {
    for (const connId of note.connections) {
      const pairKey = [note.id, connId].sort().join("-");
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);
      const target = noteMap[connId];
      if (!target) continue;
      lines.push({
        key: pairKey,
        x1: note.posX + 128,
        y1: note.posY + 24,
        x2: target.posX + 128,
        y2: target.posY + 24,
      });
    }
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 overflow-visible"
      style={{ width: 0, height: 0 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="hsl(var(--oxido))" opacity="0.6" />
        </marker>
      </defs>
      {lines.map((l) => (
        <line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="hsl(var(--oxido))"
          strokeOpacity={0.4}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          markerEnd="url(#arrowhead)"
        />
      ))}
    </svg>
  );
}

// Strip HTML tags to plain text (SSR-safe)
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

// ─────────────────────────────────────────────────────────────
// Main Module
// ─────────────────────────────────────────────────────────────
export function HypomnemataModule() {
  const { notes, hydrated, createNote, updateNote, deleteNote, toggleConnection, moveNote } =
    useNotes();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);
  const [search, setSearch] = React.useState("");
  const [view, setView] = React.useState<"canvas" | "list">("canvas");

  // Canvas pan state
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const isPanning = React.useRef(false);
  const panStart = React.useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 });
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Connect mode
  const [connectMode, setConnectMode] = React.useState(false);
  const [connectSource, setConnectSource] = React.useState<string | null>(null);

  const filteredNotes = React.useMemo(() => {
    if (!search) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  // ── Canvas pan handlers ──
  function onCanvasMouseDown(e: React.MouseEvent) {
    if (connectMode) return;
    if ((e.target as HTMLElement) !== canvasRef.current) return;
    isPanning.current = true;
    panStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };

    function onMove(ev: MouseEvent) {
      if (!isPanning.current) return;
      setPan({
        x: panStart.current.panX + (ev.clientX - panStart.current.mouseX),
        y: panStart.current.panY + (ev.clientY - panStart.current.mouseY),
      });
    }
    function onUp() {
      isPanning.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function onCanvasDoubleClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement) !== canvasRef.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    setEditingNote(null);
    setModalOpen(true);
    (window as any).__citadel_newNotePos = { x, y };
  }

  function handleSaveNote(data: { title: string; content: string; color: NoteColor }) {
    if (editingNote) {
      updateNote(editingNote.id, data);
    } else {
      const pos = (window as any).__citadel_newNotePos ?? { x: 200 + Math.random() * 200, y: 150 + Math.random() * 100 };
      createNote({ ...data, posX: pos.x, posY: pos.y });
    }
  }

  function handleConnectClick(noteId: string) {
    if (!connectSource) {
      setConnectSource(noteId);
    } else if (connectSource !== noteId) {
      toggleConnection(connectSource, noteId);
      setConnectSource(null);
      setConnectMode(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-0 font-sans">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
            <PenTool className="h-3.5 w-3.5" />
            HYPOMNEMATA · Notas
          </div>
          <h1 className="mt-0.5 text-3xl font-semibold tracking-tighter text-zinc-50">
            Brain Dump
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex gap-1 rounded-lg border border-white/[0.05] bg-black/30 p-1">
            {(["canvas", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition",
                  view === v
                    ? "bg-white/[0.08] text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {v === "canvas" ? "Canvas" : "Lista"}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setEditingNote(null);
              setModalOpen(true);
              (window as any).__citadel_newNotePos = {
                x: 200 + Math.random() * 300,
                y: 150 + Math.random() * 200,
              };
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[hsl(var(--oxido))] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva idea
          </button>
        </div>
      </div>

      {/* List View */}
      {view === "list" && (
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pt-4 scrollbar-stoic">
          <div className="relative shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ideas…"
              className="w-full rounded-lg border border-white/[0.06] bg-black/40 py-2.5 pl-9 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
            />
          </div>

          {!hydrated ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-white/[0.03]" />
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <PenTool className="h-10 w-10 text-zinc-700" />
              <p className="text-sm text-zinc-500">
                {search ? "Sin resultados" : "No hay ideas aún"}
              </p>
              {!search && (
                <p className="max-w-xs text-xs text-zinc-600">
                  Creá tu primera idea con el botón &quot;Nueva idea&quot; o hacé doble clic en el canvas.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => {
                const colors = NOTE_COLORS[note.color];
                  const plain = stripHtml(note.content);
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all hover:brightness-110",
                      colors.card
                    )}
                    onClick={() => {
                      setEditingNote(note);
                      setModalOpen(true);
                    }}
                  >
                    <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", colors.dot)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-zinc-100">
                          {note.title}
                        </p>
                        <time className="shrink-0 text-[10px] text-zinc-600">
                          {format(parseISO(note.createdAt), "d MMM · HH:mm", { locale: es })}
                        </time>
                      </div>
                      {plain && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                          {plain}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="shrink-0 rounded-md p-1 text-zinc-600 opacity-0 transition hover:text-rose-400 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Canvas View */}
      {view === "canvas" && (
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-white/[0.04] bg-[#080809] mt-4">
          {/* Canvas controls */}
          <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-black/60 text-zinc-400 transition hover:text-zinc-100"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-black/60 text-zinc-400 transition hover:text-zinc-100"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => { setPan({ x: 0, y: 0 }); setZoom(1); }}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-black/60 text-zinc-400 transition hover:text-zinc-100"
              title="Restablecer vista"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setConnectMode((v) => !v);
                setConnectSource(null);
              }}
              title="Modo conexión"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border transition",
                connectMode
                  ? "border-[hsl(var(--oxido))]/50 bg-[hsl(var(--oxido))]/20 text-[hsl(var(--oxido))]"
                  : "border-white/[0.08] bg-black/60 text-zinc-400 hover:text-zinc-100"
              )}
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Hint */}
          <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 select-none">
            <p className="rounded-full border border-white/[0.05] bg-black/60 px-3 py-1 text-[11px] text-zinc-600 backdrop-blur-sm">
              {connectMode
                ? connectSource
                  ? "Hacé clic en otra nota para conectar"
                  : "Hacé clic en una nota para seleccionar origen"
                : "Doble clic para crear · Arrastrá notas · Pan con click"}
            </p>
          </div>

          {/* Zoom indicator */}
          <div className="absolute left-3 top-3 z-10 rounded-md border border-white/[0.05] bg-black/60 px-2 py-1 font-mono text-[10px] text-zinc-600">
            {Math.round(zoom * 100)}%
          </div>

          {/* Infinite canvas */}
          <div
            ref={canvasRef}
            className="h-full w-full cursor-grab active:cursor-grabbing"
            onMouseDown={onCanvasMouseDown}
            onDoubleClick={onCanvasDoubleClick}
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <div
              className="absolute origin-top-left"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            >
              {/* SVG connections */}
              <ConnectionLines notes={notes} />

              {/* Note cards */}
              {notes.map((note) => (
                <NoteCardCanvas
                  key={note.id}
                  note={note}
                  onEdit={() => {
                    setEditingNote(note);
                    setModalOpen(true);
                  }}
                  onDelete={() => deleteNote(note.id)}
                  onMove={(x, y) => moveNote(note.id, x, y)}
                  connectMode={connectMode}
                  onConnectClick={() => handleConnectClick(note.id)}
                />
              ))}
            </div>
          </div>

          {/* Empty state overlay */}
          {hydrated && notes.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
              <PenTool className="h-12 w-12 text-zinc-800" />
              <p className="text-sm text-zinc-600">Hacé doble clic para crear tu primera idea</p>
            </div>
          )}
        </div>
      )}

      {/* Note Editor Modal */}
      <NoteEditorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        note={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  );
}
