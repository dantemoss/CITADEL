"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  ChevronDown,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePortfolio } from "./usePortfolio";
import type { Holding, LiveQuote, StockSearchResult, Transaction } from "./types";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function fmt(val: number, currency = "USD") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function fmtCompact(val: number, currency = "USD") {
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";
  if (abs >= 1_000_000_000)
    return `${sign}${currency} ${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000)
    return `${sign}${currency} ${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)
    return `${sign}${currency} ${(abs / 1_000).toFixed(1)}K`;
  return fmt(val, currency);
}

function getLogoUrl(ticker: string) {
  const domain = ticker
    .replace(".BA", "")
    .replace(".NYSE", "")
    .toLowerCase();
  return `https://logo.clearbit.com/${domain}.com`;
}

const CARD =
  "rounded-xl border border-white/[0.05] bg-[#0a0a0b] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]";

// ─────────────────────────────────────────────────────────────
// Stock Search
// ─────────────────────────────────────────────────────────────

function StockSearch({
  onSelect,
}: {
  onSelect: (r: StockSearchResult) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<StockSearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const debounce = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    clearTimeout(debounce.current);
    if (query.length < 1) {
      setResults([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar acción o ETF (ej: AAPL, GGAL.BA)"
          className="w-full rounded-lg border border-white/[0.06] bg-black/40 py-2.5 pl-9 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12] focus:bg-black/60"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-600" />
        )}
      </div>
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#111113] shadow-xl"
          >
            {results.map((r) => (
              <button
                key={r.symbol}
                type="button"
                onClick={() => {
                  onSelect(r);
                  setQuery("");
                  setResults([]);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-white/[0.04]"
              >
                <span className="font-mono text-xs font-semibold text-zinc-100">
                  {r.symbol}
                </span>
                <span className="flex-1 truncate text-zinc-400">{r.shortname}</span>
                <span className="text-[10px] text-zinc-600">{r.exchange}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Add Holding Modal
// ─────────────────────────────────────────────────────────────

function AddHoldingModal({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (holding: Omit<Holding, "id" | "createdAt">) => void;
}) {
  const [selected, setSelected] = React.useState<StockSearchResult | null>(null);
  const [quantity, setQuantity] = React.useState("");
  const [buyPrice, setBuyPrice] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");

  function handleAdd() {
    if (!selected || !quantity || !buyPrice) return;
    onAdd({
      ticker: selected.symbol,
      companyName: selected.shortname,
      logoUrl: getLogoUrl(selected.symbol),
      quantity: parseFloat(quantity),
      avgBuyPrice: parseFloat(buyPrice),
      currency,
    });
    setSelected(null);
    setQuantity("");
    setBuyPrice("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md gap-0 rounded-xl p-0 flex flex-col">
          <DialogHeader className="shrink-0 border-b border-white/[0.06] px-6 py-4 pr-12">
            <DialogTitle>
              Agregar posición
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                Buscar ticker
              </label>
              {selected ? (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2.5">
                  <div>
                    <span className="font-mono text-sm font-semibold text-zinc-100">
                      {selected.symbol}
                    </span>
                    <span className="ml-2 text-xs text-zinc-400">
                      {selected.shortname}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <StockSearch onSelect={(r) => setSelected(r)} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                  className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Precio compra
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="150.00"
                  className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                Moneda
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/[0.12]"
              >
                <option value="USD">USD · Dólar</option>
                <option value="ARS">ARS · Peso Arg.</option>
                <option value="BRL">BRL · Real</option>
                <option value="EUR">EUR · Euro</option>
              </select>
            </div>

            <button
              onClick={handleAdd}
              disabled={!selected || !quantity || !buyPrice}
              className="mt-1 w-full rounded-lg bg-[hsl(var(--oxido))] py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Agregar al portfolio
            </button>
          </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Transaction Modal
// ─────────────────────────────────────────────────────────────

function TransactionModal({
  open,
  onOpenChange,
  holding,
  currentPrice,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  holding: Holding | null;
  currentPrice: number;
  onAdd: (txn: Omit<Transaction, "id" | "createdAt">) => void;
}) {
  const [type, setType] = React.useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = React.useState("");
  const [price, setPrice] = React.useState(String(currentPrice || ""));
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (currentPrice > 0) setPrice(String(currentPrice));
  }, [currentPrice]);

  if (!holding) return null;

  function handleAdd() {
    if (!holding || !quantity || !price) return;
    onAdd({
      holdingId: holding.id,
      ticker: holding.ticker,
      type,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      date,
      note: note || undefined,
    });
    setQuantity("");
    setNote("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md gap-0 rounded-xl p-0 flex flex-col">
          <DialogHeader className="shrink-0 border-b border-white/[0.06] px-6 py-4 pr-12">
            <DialogTitle>
              Movimiento · {holding.ticker}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(["buy", "sell"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-lg border py-2 text-sm font-medium transition",
                    type === t && t === "buy"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : type === t && t === "sell"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                      : "border-white/[0.05] text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {t === "buy" ? "Compra" : "Venta"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="10"
                  className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Precio
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/[0.12]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/[0.12] [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                Nota (opcional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="ej: dividendo reinvertido"
                className="w-full rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/[0.12]"
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={!quantity || !price}
              className="mt-1 w-full rounded-lg bg-[hsl(var(--oxido))] py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Registrar movimiento
            </button>
          </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Portfolio Row
// ─────────────────────────────────────────────────────────────

function HoldingRow({
  holding,
  quote,
  onTransaction,
  onRemove,
}: {
  holding: Holding;
  quote: LiveQuote | null;
  onTransaction: () => void;
  onRemove: () => void;
}) {
  const price = quote?.price ?? holding.avgBuyPrice;
  const marketValue = holding.quantity * price;
  const costBasis = holding.quantity * holding.avgBuyPrice;
  const pnl = marketValue - costBasis;
  const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
  const isUp = pnl >= 0;
  const dayChange = quote?.changePercent ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="group grid grid-cols-[2.5rem_1fr_7rem_7rem_7rem_7rem_5rem] items-center gap-3 border-b border-white/[0.03] px-4 py-3 text-sm last:border-b-0 hover:bg-white/[0.015] transition-colors"
    >
      {/* Logo */}
      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-white/[0.05]">
        <img
          src={holding.logoUrl}
          alt={holding.ticker}
          className="h-6 w-6 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.parentElement!.innerHTML = `<span class="font-mono text-[10px] font-bold text-zinc-400">${holding.ticker.slice(0, 3)}</span>`;
          }}
        />
      </div>

      {/* Name */}
      <div className="min-w-0">
        <p className="truncate font-mono text-xs font-semibold text-zinc-100">
          {holding.ticker}
        </p>
        <p className="truncate text-[11px] text-zinc-500">{holding.companyName}</p>
      </div>

      {/* Price */}
      <div className="text-right">
        {quote ? (
          <>
            <p className="font-mono text-xs font-medium text-zinc-100">
              {fmt(price, holding.currency)}
            </p>
            <p
              className={cn(
                "text-[11px] font-medium",
                dayChange >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {dayChange >= 0 ? "+" : ""}
              {dayChange.toFixed(2)}%
            </p>
          </>
        ) : (
          <div className="h-8 w-full animate-pulse rounded bg-white/[0.04]" />
        )}
      </div>

      {/* Quantity */}
      <div className="text-right">
        <p className="font-mono text-xs text-zinc-300">
          {holding.quantity.toLocaleString("es-AR", { maximumFractionDigits: 4 })}
        </p>
        <p className="text-[11px] text-zinc-600">unidades</p>
      </div>

      {/* Cost basis */}
      <div className="text-right">
        <p className="font-mono text-xs text-zinc-400">
          {fmt(holding.avgBuyPrice, holding.currency)}
        </p>
        <p className="text-[11px] text-zinc-600">precio promedio</p>
      </div>

      {/* Market value */}
      <div className="text-right">
        <p className="font-mono text-xs font-medium text-zinc-200">
          {fmtCompact(marketValue, holding.currency)}
        </p>
        <p
          className={cn(
            "flex items-center justify-end gap-0.5 text-[11px] font-medium",
            isUp ? "text-emerald-400" : "text-rose-400"
          )}
        >
          {isUp ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(pnlPct).toFixed(2)}%
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onTransaction}
          title="Registrar movimiento"
          className="rounded-md p-1.5 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRemove}
          title="Eliminar"
          className="rounded-md p-1.5 text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Transaction Log Tab
// ─────────────────────────────────────────────────────────────

function TransactionLog({
  transactions,
}: {
  transactions: import("./types").Transaction[];
}) {
  const [filterMonth, setFilterMonth] = React.useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  const filtered = React.useMemo(() => {
    if (!filterMonth) return transactions;
    const [y, m] = filterMonth.split("-").map(Number);
    const start = startOfMonth(new Date(y, m - 1));
    const end = endOfMonth(start);
    return transactions.filter((t) =>
      isWithinInterval(parseISO(t.date), { start, end })
    );
  }, [transactions, filterMonth]);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-white/[0.12] [color-scheme:dark]"
        />
        <span className="text-xs text-zinc-600">
          {sorted.length} movimiento{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <AlertCircle className="h-8 w-8 text-zinc-700" />
          <p className="text-sm text-zinc-500">Sin movimientos en este período</p>
        </div>
      ) : (
        <div className={cn(CARD, "overflow-hidden p-0")}>
          <div className="grid grid-cols-[7rem_5rem_1fr_7rem_7rem] gap-3 border-b border-white/[0.04] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            <span>Fecha</span>
            <span>Tipo</span>
            <span>Ticker</span>
            <span className="text-right">Cant.</span>
            <span className="text-right">Precio</span>
          </div>
          {sorted.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[7rem_5rem_1fr_7rem_7rem] items-center gap-3 border-b border-white/[0.02] px-4 py-3 text-sm last:border-b-0"
            >
              <span className="text-xs text-zinc-500">
                {format(parseISO(t.date), "d MMM yyyy", { locale: es })}
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide w-fit",
                  t.type === "buy"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                )}
              >
                {t.type === "buy" ? "Compra" : "Venta"}
              </span>
              <div>
                <p className="font-mono text-xs font-semibold text-zinc-200">
                  {t.ticker}
                </p>
                {t.note && (
                  <p className="text-[11px] text-zinc-600">{t.note}</p>
                )}
              </div>
              <span className="text-right font-mono text-xs text-zinc-300">
                {t.quantity.toLocaleString("es-AR", { maximumFractionDigits: 4 })}
              </span>
              <span className="text-right font-mono text-xs text-zinc-300">
                {fmt(t.price, "USD")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Module
// ─────────────────────────────────────────────────────────────

export function OikosModule() {
  const { holdings, transactions, hydrated, addHolding, removeHolding, addTransaction } =
    usePortfolio();
  const [quotes, setQuotes] = React.useState<Record<string, LiveQuote>>({});
  const [quotesLoading, setQuotesLoading] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [txnHolding, setTxnHolding] = React.useState<Holding | null>(null);
  const [activeTab, setActiveTab] = React.useState<"portfolio" | "transactions">("portfolio");
  const refreshRef = React.useRef<ReturnType<typeof setInterval>>();

  async function fetchQuotes(holdingsList: Holding[]) {
    if (holdingsList.length === 0) return;
    setQuotesLoading(true);
    try {
      const symbols = holdingsList.map((h) => h.ticker).join(",");
      const res = await fetch(`/api/stocks/quotes?symbols=${encodeURIComponent(symbols)}`);
      const data = await res.json();
      setQuotes(data.quotes ?? {});
    } catch {
      // silently fail — show cached prices
    } finally {
      setQuotesLoading(false);
    }
  }

  React.useEffect(() => {
    if (!hydrated) return;
    fetchQuotes(holdings);
    clearInterval(refreshRef.current);
    if (holdings.length > 0) {
      refreshRef.current = setInterval(() => fetchQuotes(holdings), 30_000);
    }
    return () => clearInterval(refreshRef.current);
  }, [hydrated, holdings.length]);

  // ── Totals ──
  const totals = React.useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;
    for (const h of holdings) {
      const q = quotes[h.ticker];
      const price = q?.price ?? h.avgBuyPrice;
      totalValue += h.quantity * price;
      totalCost += h.quantity * h.avgBuyPrice;
    }
    const pnl = totalValue - totalCost;
    const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
    return { totalValue, totalCost, pnl, pnlPct };
  }, [holdings, quotes]);

  const todayPnl = React.useMemo(() => {
    let val = 0;
    for (const h of holdings) {
      const q = quotes[h.ticker];
      if (!q) continue;
      val += h.quantity * q.change;
    }
    return val;
  }, [holdings, quotes]);

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
            <Landmark className="h-3.5 w-3.5" />
            OIKOS · Portfolio
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchQuotes(holdings)}
              disabled={quotesLoading || holdings.length === 0}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-500 transition hover:text-zinc-200 disabled:opacity-40"
            >
              <RefreshCw className={cn("h-3 w-3", quotesLoading && "animate-spin")} />
              {quotesLoading ? "Actualizando…" : "Actualizar"}
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[hsl(var(--oxido))] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar posición
            </button>
          </div>
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tighter text-zinc-50 sm:text-4xl">
          Finanzas
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500">
          Portfolio en tiempo real · cotizaciones Yahoo Finance · actualización cada 30s
        </p>
      </header>

      {/* KPI Cards */}
      {!hydrated ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={cn(CARD, "h-24 animate-pulse")} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className={cn(CARD, "p-5")}>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Valor de mercado
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-zinc-50">
              {fmtCompact(totals.totalValue)}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Costo base {fmtCompact(totals.totalCost)}
            </p>
          </div>

          <div className={cn(CARD, "p-5")}>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              P&amp;L Total
            </p>
            <p
              className={cn(
                "mt-2 flex items-center gap-1 font-mono text-2xl font-semibold tabular-nums",
                totals.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {totals.pnl >= 0 ? (
                <TrendingUp className="h-5 w-5 shrink-0" />
              ) : (
                <TrendingDown className="h-5 w-5 shrink-0" />
              )}
              {fmtCompact(totals.pnl)}
            </p>
            <p
              className={cn(
                "mt-1 text-xs",
                totals.pnl >= 0 ? "text-emerald-500/80" : "text-rose-500/80"
              )}
            >
              {totals.pnl >= 0 ? "+" : ""}
              {totals.pnlPct.toFixed(2)}% vs costo base
            </p>
          </div>

          <div className={cn(CARD, "p-5")}>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Resultado hoy
            </p>
            <p
              className={cn(
                "mt-2 font-mono text-2xl font-semibold tabular-nums",
                todayPnl >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {todayPnl >= 0 ? "+" : ""}
              {fmtCompact(todayPnl)}
            </p>
            <p className="mt-1 text-xs text-zinc-600">variación del día</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-white/[0.05] bg-black/30 p-1 w-fit">
        {(["portfolio", "transactions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-md px-4 py-1.5 text-xs font-medium transition",
              activeTab === tab
                ? "bg-white/[0.08] text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab === "portfolio" ? "Portfolio" : "Movimientos"}
          </button>
        ))}
      </div>

      {/* Portfolio Table */}
      {activeTab === "portfolio" && (
        <>
          {!hydrated || holdings.length === 0 ? (
            <div className={cn(CARD, "flex flex-col items-center gap-3 py-16 text-center")}>
              <Landmark className="h-10 w-10 text-zinc-700" />
              <p className="text-sm font-medium text-zinc-400">
                Tu portfolio está vacío
              </p>
              <p className="max-w-xs text-xs text-zinc-600">
                Agregá tu primera posición con el botón &quot;Agregar posición&quot;. Las cotizaciones se actualizan en tiempo real.
              </p>
              <button
                onClick={() => setAddOpen(true)}
                className="mt-2 flex items-center gap-2 rounded-lg bg-[hsl(var(--oxido))] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                Agregar primera posición
              </button>
            </div>
          ) : (
            <div className={cn(CARD, "overflow-hidden p-0")}>
              <div className="grid grid-cols-[2.5rem_1fr_7rem_7rem_7rem_7rem_5rem] gap-3 border-b border-white/[0.04] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                <span />
                <span>Activo</span>
                <span className="text-right">Precio</span>
                <span className="text-right">Cantidad</span>
                <span className="text-right">P. Promedio</span>
                <span className="text-right">Valor Mkt</span>
                <span />
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                  {holdings.map((h) => (
                    <HoldingRow
                      key={h.id}
                      holding={h}
                      quote={quotes[h.ticker] ?? null}
                      onTransaction={() => setTxnHolding(h)}
                      onRemove={() => removeHolding(h.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <TransactionLog transactions={transactions} />
      )}

      {/* Modals */}
      <AddHoldingModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={addHolding}
      />
      <TransactionModal
        open={!!txnHolding}
        onOpenChange={(v) => !v && setTxnHolding(null)}
        holding={txnHolding}
        currentPrice={txnHolding ? (quotes[txnHolding.ticker]?.price ?? txnHolding.avgBuyPrice) : 0}
        onAdd={addTransaction}
      />
    </motion.div>
  );
}
