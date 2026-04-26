"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { isSupabaseReady, supabase } from "@/lib/supabase";

export interface Note {
  id: string;
  title: string;
  content: string; // HTML from TipTap
  posX: number;
  posY: number;
  color: NoteColor;
  connections: string[];
  createdAt: string;
  updatedAt: string;
}

export type NoteColor = "default" | "oxido" | "emerald" | "sky" | "violet" | "amber";

type NoteRow = {
  id: string;
  title: string;
  content: string;
  pos_x: number | string;
  pos_y: number | string;
  color: NoteColor;
  connections: string[] | null;
  created_at: string;
  updated_at: string;
};

function fromRow(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    posX: Number(row.pos_x),
    posY: Number(row.pos_y),
    color: row.color,
    connections: row.connections ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(note: Note): NoteRow {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    pos_x: note.posX,
    pos_y: note.posY,
    color: note.color,
    connections: note.connections,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  };
}

function toUpdateRow(patch: Partial<Omit<Note, "id" | "createdAt">>) {
  return {
    ...(patch.title !== undefined && { title: patch.title }),
    ...(patch.content !== undefined && { content: patch.content }),
    ...(patch.posX !== undefined && { pos_x: patch.posX }),
    ...(patch.posY !== undefined && { pos_y: patch.posY }),
    ...(patch.color !== undefined && { color: patch.color }),
    ...(patch.connections !== undefined && { connections: patch.connections }),
    ...(patch.updatedAt !== undefined && { updated_at: patch.updatedAt }),
  };
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const moveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    let cancelled = false;
    const timers = moveTimers.current;

    async function loadNotes() {
      if (!isSupabaseReady || !supabase) {
        console.warn("Supabase no está configurado. Las notas no se cargarán.");
        setHydrated(true);
        return;
      }

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Error cargando notas desde Supabase:", error);
        setNotes([]);
      } else {
        setNotes(((data ?? []) as NoteRow[]).map(fromRow));
      }

      setHydrated(true);
    }

    loadNotes();

    return () => {
      cancelled = true;
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  const createNote = useCallback(
    async (partial: Partial<Pick<Note, "title" | "content" | "posX" | "posY" | "color">>) => {
      if (!supabase) return null;

      const now = new Date().toISOString();
      const note: Note = {
        id: crypto.randomUUID(),
        title: partial.title ?? "Sin título",
        content: partial.content ?? "",
        posX: partial.posX ?? 200,
        posY: partial.posY ?? 150,
        color: partial.color ?? "default",
        connections: [],
        createdAt: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from("notes")
        .insert(toRow(note))
        .select("*")
        .single();

      if (error) {
        console.error("Error creando nota en Supabase:", error);
        return null;
      }

      const saved = fromRow(data as NoteRow);
      setNotes((prev) => [saved, ...prev]);
      return saved;
    },
    []
  );

  const updateNote = useCallback(
    async (id: string, patch: Partial<Omit<Note, "id" | "createdAt">>) => {
      if (!supabase) return;

      const nextPatch = { ...patch, updatedAt: new Date().toISOString() };
      setNotes((prev) => {
        const next = prev.map((n) =>
          n.id === id ? { ...n, ...nextPatch } : n
        );
        return next;
      });

      const { error } = await supabase
        .from("notes")
        .update(toUpdateRow(nextPatch))
        .eq("id", id);

      if (error) console.error("Error actualizando nota en Supabase:", error);
    },
    []
  );

  const deleteNote = useCallback(async (id: string) => {
    if (!supabase) return;
    const client = supabase;

    let notesWithUpdatedConnections: Note[] = [];
    setNotes((prev) => {
      const next = prev
        .filter((n) => n.id !== id)
        .map((n) => ({
          ...n,
          connections: n.connections.filter((c) => c !== id),
        }));
      notesWithUpdatedConnections = next.filter((note) =>
        prev.some(
          (oldNote) =>
            oldNote.id === note.id &&
            oldNote.connections.length !== note.connections.length
        )
      );
      return next;
    });

    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      console.error("Error eliminando nota en Supabase:", error);
      return;
    }

    await Promise.all(
      notesWithUpdatedConnections.map((note) =>
        client
          .from("notes")
          .update({ connections: note.connections, updated_at: new Date().toISOString() })
          .eq("id", note.id)
      )
    );
  }, []);

  const toggleConnection = useCallback(async (fromId: string, toId: string) => {
    if (!supabase) return;
    const client = supabase;

    let updatedNote: Note | null = null;
    setNotes((prev) => {
      const next = prev.map((n) => {
        if (n.id !== fromId) return n;
        const connected = n.connections.includes(toId);
        updatedNote = {
          ...n,
          connections: connected
            ? n.connections.filter((c) => c !== toId)
            : [...n.connections, toId],
          updatedAt: new Date().toISOString(),
        };
        return updatedNote;
      });
      return next;
    });

    const noteToUpdate = updatedNote as Note | null;
    if (!noteToUpdate) return;

    const { error } = await client
      .from("notes")
      .update({
        connections: noteToUpdate.connections,
        updated_at: noteToUpdate.updatedAt,
      })
      .eq("id", fromId);

    if (error) console.error("Error actualizando conexión en Supabase:", error);
  }, []);

  const moveNote = useCallback((id: string, posX: number, posY: number) => {
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id ? { ...n, posX, posY } : n
      );
      return next;
    });

    if (!supabase) return;
    const client = supabase;

    clearTimeout(moveTimers.current[id]);
    moveTimers.current[id] = setTimeout(async () => {
      const { error } = await client
        .from("notes")
        .update({
          pos_x: posX,
          pos_y: posY,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) console.error("Error moviendo nota en Supabase:", error);
    }, 400);
  }, []);

  return {
    notes,
    hydrated,
    createNote,
    updateNote,
    deleteNote,
    toggleConnection,
    moveNote,
  };
}
