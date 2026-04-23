"use client";

import { useState, useEffect, useCallback } from "react";

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

const STORAGE_KEY = "citadel:resources";

function load(): Resource[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Resource[]) : [];
  } catch {
    return [];
  }
}

function save(resources: Resource[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  } catch {}
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setResources(load());
    setHydrated(true);
  }, []);

  const addResource = useCallback(
    (resource: Omit<Resource, "id" | "createdAt">) => {
      const newResource: Resource = {
        ...resource,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setResources((prev) => {
        const next = [newResource, ...prev];
        save(next);
        return next;
      });
      return newResource;
    },
    []
  );

  const removeResource = useCallback((id: string) => {
    setResources((prev) => {
      const next = prev.filter((r) => r.id !== id);
      save(next);
      return next;
    });
  }, []);

  const updateResource = useCallback(
    (id: string, patch: Partial<Omit<Resource, "id" | "createdAt">>) => {
      setResources((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
        save(next);
        return next;
      });
    },
    []
  );

  return { resources, hydrated, addResource, removeResource, updateResource };
}
