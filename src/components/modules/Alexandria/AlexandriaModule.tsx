"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Globe,
  Youtube,
  Github,
  Instagram,
  Package,
  Wrench,
  Video,
  Puzzle,
  Loader2,
  Tag,
  Filter,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useResources, type Resource, type ResourceType } from "./useResources";

// ─────────────────────────────────────────────────────────────
// Resource type config
// ─────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  ResourceType,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  page: {
    label: "Página",
    icon: Globe,
    color: "text-sky-400",
    bg: "bg-sky-500/[0.08]",
    border: "border-sky-500/20",
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    color: "text-red-400",
    bg: "bg-red-500/[0.08]",
    border: "border-red-500/20",
  },
  github: {
    label: "GitHub",
    icon: Github,
    color: "text-zinc-300",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.1]",
  },
  instagram: {
    label: "Instagram",
    icon: Instagram,
    color: "text-pink-400",
    bg: "bg-pink-500/[0.08]",
    border: "border-pink-500/20",
  },
  library: {
    label: "Librería",
    icon: Package,
    color: "text-emerald-400",
    bg: "bg-emerald-500/[0.08]",
    border: "border-emerald-500/20",
  },
  tool: {
    label: "Herramienta",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-500/[0.08]",
    border: "border-amber-500/20",
  },
  video: {
    label: "Video",
    icon: Video,
    color: "text-violet-400",
    bg: "bg-violet-500/[0.08]",
    border: "border-violet-500/20",
  },
  other: {
    label: "Otro",
    icon: Puzzle,
    color: "text-zinc-400",
    bg: "bg-white/[0.03]",
    border: "border-white/[0.06]",
  },
};

const ALL_TYPES = Object.keys(TYPE_CONFIG) as ResourceType[];

// ─────────────────────────────────────────────────────────────
// Resource Card
// ─────────────────────────────────────────────────────────────
function ResourceCard({
  resource,
  onRemove,
}: {
  resource: Resource;
  onRemove: () => void;
}) {
  const cfg = TYPE_CONFIG[resource.type];
  const TypeIcon = cfg.icon;

  const domain = React.useMemo(() => {
    try {
      return new URL(resource.url).hostname.replace("www.", "");
    } catch {
      return resource.url;
    }
  }, [resource.url]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.05] bg-[#0d0d0f] transition-all hover:border-white/[0.1] hover:shadow-lg hover:shadow-black/20"
    >
      {/* Thumbnail / header */}
      <div className="relative h-32 overflow-hidden bg-[#0a0a0b]">
        {resource.thumbnail ? (
          <img
            src={resource.thumbnail}
            alt={resource.title}
            className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className={cn("flex h-full items-center justify-center", cfg.bg)}>
            <TypeIcon className={cn("h-10 w-10 opacity-30", cfg.color)} />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute left-2 top-2">
          <span
            className={cn(
              "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm",
              cfg.bg,
              cfg.border,
              cfg.color
            )}
          >
            <TypeIcon className="h-2.5 w-2.5" />
            {cfg.label}
          </span>
        </div>

        {/* Actions overlay */}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.1] bg-black/60 text-zinc-400 transition hover:text-zinc-100 backdrop-blur-sm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={onRemove}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.1] bg-black/60 text-zinc-400 transition hover:text-rose-400 backdrop-blur-sm"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Favicon */}
        {resource.favicon && (
          <div className="absolute bottom-2 left-2">
            <img
              src={resource.favicon}
              alt=""
              className="h-4 w-4 rounded-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-zinc-100">
            {resource.title}
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-zinc-600">{domain}</p>
        </div>

        {resource.description && (
          <p className="line-clamp-2 text-xs text-zinc-500">{resource.description}</p>
        )}

        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {resource.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/[0.05] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <time className="text-[10px] text-zinc-700">
          {format(parseISO(resource.createdAt), "d MMM yyyy", { locale: es })}
        </time>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Add Resource Modal
// ─────────────────────────────────────────────────────────────
function AddResourceModal({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (resource: Omit<Resource, "id" | "createdAt">) => void;
}) {
  const [url, setUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<ResourceType>("page");
  const [tagsInput, setTagsInput] = React.useState("");
  const [favicon, setFavicon] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState("");
  const [fetching, setFetching] = React.useState(false);
  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setUrl(""); setTitle(""); setDescription(""); setType("page");
      setTagsInput(""); setFavicon(""); setThumbnail(""); setFetched(false);
    }
  }, [open]);

  async function handleFetchMeta() {
    if (!url) return;
    setFetching(true);
    try {
      const res = await fetch("/api/fetch-url-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.title && !title) setTitle(data.title);
      if (data.description && !description) setDescription(data.description);
      if (data.favicon) setFavicon(data.favicon);
      if (data.thumbnail) setThumbnail(data.thumbnail);
      if (data.type) setType(data.type as ResourceType);
      setFetched(true);
    } catch {
      setFetched(true);
    } finally {
      setFetching(false);
    }
  }

  function handleAdd() {
    if (!url || !title) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onAdd({ url, title, description, type, tags, favicon, thumbnail });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg gap-0 rounded-2xl p-0 flex flex-col">
          {/* Header */}
          <DialogHeader className="shrink-0 border-b border-white/[0.06] px-6 py-4 pr-12">
            <DialogTitle>
              Agregar recurso
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            {/* URL */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setFetched(false); }}
                  placeholder="https://…"
                  className="flex-1 rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
                />
                <button
                  onClick={handleFetchMeta}
                  disabled={!url || fetching}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 text-xs text-zinc-400 transition hover:text-zinc-200 disabled:opacity-40"
                >
                  {fetching ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Globe className="h-3.5 w-3.5" />
                  )}
                  {fetched ? "Listo" : "Obtener info"}
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nombre del recurso"
                className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                Descripción (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="¿Por qué guardás este recurso?"
                className="w-full resize-none rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Type */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Tipo
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ResourceType)}
                  className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/[0.12]"
                >
                  {ALL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_CONFIG[t].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  <Tag className="h-2.5 w-2.5" />
                  Tags (coma)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="react, ui, free"
                  className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
                />
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={!url || !title}
              className="mt-1 w-full rounded-lg bg-[hsl(var(--oxido))] py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Guardar en biblioteca
            </button>
          </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Module
// ─────────────────────────────────────────────────────────────
export function AlexandriaModule() {
  const { resources, hydrated, addResource, removeResource } = useResources();
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<ResourceType | "all">("all");
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    let result = resources;
    if (filterType !== "all") result = result.filter((r) => r.type === filterType);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.url.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [resources, search, filterType]);

  const countByType = React.useMemo(() => {
    const counts: Partial<Record<ResourceType, number>> = {};
    for (const r of resources) counts[r.type] = (counts[r.type] ?? 0) + 1;
    return counts;
  }, [resources]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 font-sans text-zinc-300"
    >
      {/* Header */}
      <header className="flex flex-col gap-1 border-b border-white/[0.04] pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
            <Library className="h-3.5 w-3.5" />
            ALEXANDRIA · Recursos
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[hsl(var(--oxido))] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar recurso
          </button>
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tighter text-zinc-50 sm:text-4xl">
          Biblioteca de Alejandría
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500">
          Tu colección personal de recursos curados · páginas, videos, librerías, repos y más
        </p>
      </header>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, descripción, tag o URL…"
            className="w-full rounded-lg border border-white/[0.06] bg-black/40 py-2.5 pl-9 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <Filter className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
          <button
            onClick={() => setFilterType("all")}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs transition",
              filterType === "all"
                ? "border-white/[0.12] bg-white/[0.06] text-zinc-100"
                : "border-white/[0.05] text-zinc-500 hover:text-zinc-300"
            )}
          >
            Todos ({resources.length})
          </button>
          {ALL_TYPES.filter((t) => countByType[t]).map((t) => {
            const cfg = TYPE_CONFIG[t];
            const Icon = cfg.icon;
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs transition",
                  filterType === t
                    ? cn(cfg.bg, cfg.border, cfg.color)
                    : "border-white/[0.05] text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Icon className="h-3 w-3" />
                {cfg.label} ({countByType[t]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {!hydrated ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Library className="h-12 w-12 text-zinc-800" />
          <p className="text-sm font-medium text-zinc-400">
            {search || filterType !== "all"
              ? "Sin resultados para esa búsqueda"
              : "Tu biblioteca está vacía"}
          </p>
          {!search && filterType === "all" && (
            <>
              <p className="max-w-sm text-xs text-zinc-600">
                Empezá a guardar recursos útiles de internet. Páginas, videos, librerías, repos — todo en un solo lugar.
              </p>
              <button
                onClick={() => setAddOpen(true)}
                className="mt-2 flex items-center gap-2 rounded-lg bg-[hsl(var(--oxido))] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                Agregar primer recurso
              </button>
            </>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onRemove={() => removeResource(resource.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AddResourceModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={addResource}
      />
    </motion.div>
  );
}
