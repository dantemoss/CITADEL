"use client";

import { useState, useEffect, useCallback } from "react";
import { isSupabaseReady, supabase } from "@/lib/supabase";

export type ResourceType =
  | "page"
  | "youtube"
  | "github"
  | "instagram"
  | "library"
  | "tool"
  | "video"
  | "other";

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  description: string;
  tags: string[];
  favicon: string;
  thumbnail: string;
  createdAt: string;
}

type ResourceRow = {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  description: string | null;
  tags: string[] | null;
  favicon: string | null;
  thumbnail: string | null;
  created_at: string;
};

let resourcesCache: Resource[] | null = null;

function fromRow(row: ResourceRow): Resource {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    type: row.type,
    description: row.description ?? "",
    tags: row.tags ?? [],
    favicon: row.favicon ?? "",
    thumbnail: row.thumbnail ?? "",
    createdAt: row.created_at,
  };
}

function toRow(resource: Resource): ResourceRow {
  return {
    id: resource.id,
    title: resource.title,
    url: resource.url,
    type: resource.type,
    description: resource.description,
    tags: resource.tags,
    favicon: resource.favicon,
    thumbnail: resource.thumbnail,
    created_at: resource.createdAt,
  };
}

function toUpdateRow(patch: Partial<Omit<Resource, "id" | "createdAt">>) {
  return {
    ...(patch.title !== undefined && { title: patch.title }),
    ...(patch.url !== undefined && { url: patch.url }),
    ...(patch.type !== undefined && { type: patch.type }),
    ...(patch.description !== undefined && { description: patch.description }),
    ...(patch.tags !== undefined && { tags: patch.tags }),
    ...(patch.favicon !== undefined && { favicon: patch.favicon }),
    ...(patch.thumbnail !== undefined && { thumbnail: patch.thumbnail }),
  };
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (resourcesCache) {
      setResources(resourcesCache);
      setHydrated(true);
    }

    async function loadResources() {
      if (!isSupabaseReady || !supabase) {
        console.warn("Supabase no está configurado. Los recursos no se cargarán.");
        setHydrated(true);
        return;
      }

      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Error cargando recursos desde Supabase:", error);
        setResources([]);
      } else {
        const loadedResources = ((data ?? []) as ResourceRow[]).map(fromRow);
        resourcesCache = loadedResources;
        setResources(loadedResources);
      }

      setHydrated(true);
    }

    loadResources();

    return () => {
      cancelled = true;
    };
  }, []);

  const addResource = useCallback(
    async (resource: Omit<Resource, "id" | "createdAt">) => {
      if (!supabase) return null;

      const newResource: Resource = {
        ...resource,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("resources")
        .insert(toRow(newResource))
        .select("*")
        .single();

      if (error) {
        console.error("Error creando recurso en Supabase:", error);
        return null;
      }

      const saved = fromRow(data as ResourceRow);
      setResources((prev) => {
        const next = [saved, ...prev];
        resourcesCache = next;
        return next;
      });
      return saved;
    },
    []
  );

  const removeResource = useCallback(async (id: string) => {
    if (!supabase) return;

    setResources((prev) => {
      const next = prev.filter((r) => r.id !== id);
      resourcesCache = next;
      return next;
    });

    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) console.error("Error eliminando recurso en Supabase:", error);
  }, []);

  const updateResource = useCallback(
    async (id: string, patch: Partial<Omit<Resource, "id" | "createdAt">>) => {
      if (!supabase) return;

      setResources((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
        resourcesCache = next;
        return next;
      });

      const { error } = await supabase
        .from("resources")
        .update(toUpdateRow(patch))
        .eq("id", id);

      if (error) console.error("Error actualizando recurso en Supabase:", error);
    },
    []
  );

  return { resources, hydrated, addResource, removeResource, updateResource };
}
