"use client";

import { useState, useEffect, useCallback } from "react";

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

const STORAGE_KEY = "citadel:notes";

function load(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

function save(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {}
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setNotes(load());
    setHydrated(true);
  }, []);

  const createNote = useCallback(
    (partial: Partial<Pick<Note, "title" | "content" | "posX" | "posY" | "color">>) => {
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
      setNotes((prev) => {
        const next = [note, ...prev];
        save(next);
        return next;
      });
      return note;
    },
    []
  );

  const updateNote = useCallback(
    (id: string, patch: Partial<Omit<Note, "id" | "createdAt">>) => {
      setNotes((prev) => {
        const next = prev.map((n) =>
          n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n
        );
        save(next);
        return next;
      });
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev
        .filter((n) => n.id !== id)
        .map((n) => ({
          ...n,
          connections: n.connections.filter((c) => c !== id),
        }));
      save(next);
      return next;
    });
  }, []);

  const toggleConnection = useCallback((fromId: string, toId: string) => {
    setNotes((prev) => {
      const next = prev.map((n) => {
        if (n.id !== fromId) return n;
        const connected = n.connections.includes(toId);
        return {
          ...n,
          connections: connected
            ? n.connections.filter((c) => c !== toId)
            : [...n.connections, toId],
        };
      });
      save(next);
      return next;
    });
  }, []);

  const moveNote = useCallback((id: string, posX: number, posY: number) => {
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id ? { ...n, posX, posY } : n
      );
      save(next);
      return next;
    });
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
