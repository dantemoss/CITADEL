"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Landmark, Receipt, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  computeNetWorth,
  DEFAULT_SALARY,
  MOCK_EXPENSES,
  MOCK_HOLDINGS,
  portfolioMarketValue,
  type ExpenseCategory,
  type Holding,
} from "./mock-data";
import { Sparkline } from "./Sparkline";
// Mercado Pago: ver `useMercadoPagoSync.ts` — `syncWithProvider()` y hook listos para cablear UI.

const CARD =
  "relative overflow-hidden rounded-xl border border-white/[0.03] bg-[#09090b] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.045)]";

const mono = "font-mono font-medium tabular-nums tracking-tight";
const sans = "font-sans tracking-tight";

function formatArs(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatArsCompact(value: number): string {
  if (value >= 1_000_000_000)
    return `${(value / 1_000_000_000).toFixed(2).replace(".", ",")}B`;
  if (value >= 1_000_000)
    return `${(value / 1_000_000).toFixed(2).replace(".", ",")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(".", ",")}k`;
  return formatArs(value);
}

const categoryTone: Record<
  ExpenseCategory,
  { border: string; text: string; bg: string }
> = {
  Comida: {
    border: "border-emerald-500/15",
    text: "text-emerald-400/90",
    bg: "bg-emerald-500/[0.06]",
  },
  Transporte: {
    border: "border-sky-500/15",
    text: "text-sky-300/90",
    bg: "bg-sky-500/[0.06]",
  },
  Ocio: {
    border: "border-violet-500/15",
    text: "text-violet-300/90",
    bg: "bg-violet-500/[0.06]",
  },
  Fijo: {
    border: "border-amber-500/15",
    text: "text-amber-200/85",
    bg: "bg-amber-500/[0.06]",
  },
};

function OikosCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(CARD, "p-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

function HoldingRow({ row }: { row: Holding }) {
  const [hover, setHover] = React.useState(false);
  const mv = row.quantity * row.currentPrice;
  const up = row.series[row.series.length - 1] >= row.series[0];

  return (
    <div
      className="group relative border-b border-white/[0.03] last:border-b-0"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={cn(
          "grid cursor-default grid-cols-[5rem_1fr_7rem_8rem_6rem] items-center gap-3 py-3 text-sm transition-colors",
          hover && "bg-white/[0.02]"
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              sans,
              "text-[13px] font-semibold text-zinc-100"
            )}
          >
            {row.ticker}
          </span>
          {up ? (
            <TrendingUp
              className="h-3 w-3 shrink-0 text-emerald-500/80"
              aria-hidden
            />
          ) : (
            <TrendingDown
              className="h-3 w-3 shrink-0 text-rose-400/80"
              aria-hidden
            />
          )}
        </div>
        <div className={cn(mono, "text-right text-[13px] text-zinc-300")}>
          {row.quantity.toLocaleString("es-AR")}
        </div>
        <div className={cn(mono, "text-right text-[13px] text-zinc-300")}>
          {formatArs(row.currentPrice)}
        </div>
        <div className="flex justify-end">
          <Sparkline data={row.series} />
        </div>
        <div className={cn(mono, "text-right text-[12px] text-zinc-400")}>
          {formatArsCompact(mv)}
        </div>
      </div>
      <div
        className={cn(
          "overflow-hidden border-t border-white/[0.02] bg-black/20 transition-all duration-200 ease-out",
          hover ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p
          className={cn(
            sans,
            "px-3 py-2 text-[11px] text-zinc-500"
          )}
        >
          Valor de mercado{" "}
          <span className={cn(mono, "text-zinc-300")}>{formatArs(mv)}</span>
          <span className="text-zinc-600"> · </span>
          <span className="text-zinc-600">
            {row.quantity} × {formatArs(row.currentPrice)}
          </span>
        </p>
      </div>
    </div>
  );
}

export function OikosModule() {
  const [salary, setSalary] = React.useState(DEFAULT_SALARY);
  const liquidMock = 2_400_000;

  const portfolio = portfolioMarketValue(MOCK_HOLDINGS);
  const net = computeNetWorth(MOCK_HOLDINGS, liquidMock);

  const salaryStr = React.useMemo(() => {
    const raw = salary <= 0 ? "" : String(Math.round(salary));
    return raw.replace(/\D/g, "");
  }, [salary]);

  function onSalaryInput(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setSalary(0);
      return;
    }
    setSalary(Number(digits.slice(0, 12)));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(sans, "flex flex-col gap-4 text-zinc-300")}
    >
      <header className="flex flex-col gap-1 border-b border-white/[0.03] pb-5">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
          <Landmark className="h-3.5 w-3.5" />
          OIKOS · ARQ
        </div>
        <h1 className="text-3xl font-semibold tracking-tighter text-zinc-50 sm:text-4xl">
          Finanzas
        </h1>
        <p className="max-w-2xl text-sm text-zinc-500">
          Vista tipo terminal: patrimonio, flujo base y cartera ARQ. Datos
          mock; listo para API.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <OikosCard className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                Patrimonio neto
              </p>
              <p className={cn(mono, "mt-2 text-3xl text-zinc-50 sm:text-4xl")}>
                {formatArs(net)}
              </p>
              <p className="mt-2 text-xs text-zinc-600">
                Cartera {formatArsCompact(portfolio)} + liquidez{" "}
                {formatArsCompact(liquidMock)}
              </p>
            </div>
            <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2">
              <Wallet className="h-5 w-5 text-zinc-500" />
            </div>
          </div>
        </OikosCard>

        <OikosCard className="lg:col-span-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Sueldo base
          </p>
          <label className="mt-3 block">
            <span className="sr-only">Monto mensual</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
                ARS
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={
                  salaryStr
                    ? Number(salaryStr).toLocaleString("es-AR")
                    : ""
                }
                onChange={(e) => onSalaryInput(e.target.value)}
                className={cn(
                  mono,
                  "w-full rounded-lg border border-white/[0.05] bg-black/30 py-2.5 pl-12 pr-3 text-[15px] text-zinc-100 outline-none ring-0 transition-[border,box-shadow] placeholder:text-zinc-700 focus:border-white/[0.08] focus:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                )}
                placeholder="1.700.000"
              />
            </div>
          </label>
          <p className="mt-2 text-[11px] text-zinc-600">
            Referencia de ingreso recurrente (mock editable).
          </p>
        </OikosCard>

        <OikosCard className="lg:col-span-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Integraciones
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-600">
            <code className="rounded border border-white/[0.05] bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
              syncWithProvider()
            </code>{" "}
            preparado en hook; Mercado Pago pendiente de backend.
          </p>
          <button
            type="button"
            disabled
            title="Conectar cuando exista API"
            className={cn(
              sans,
              "mt-4 w-full cursor-not-allowed rounded-lg border border-white/[0.05] bg-white/[0.03] py-2 text-xs font-medium text-zinc-600 opacity-60"
            )}
          >
            Mercado Pago (pronto)
          </button>
        </OikosCard>
      </div>

      <OikosCard className="p-0 sm:p-0">
        <div className="flex items-center justify-between border-b border-white/[0.03] px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Cartera ARQ
            </p>
            <p className="mt-0.5 text-xs text-zinc-600">
              Tickers · posición · precio · tendencia
            </p>
          </div>
          <p className={cn(mono, "text-sm text-zinc-400")}>
            Σ {formatArsCompact(portfolio)}
          </p>
        </div>
        <div className="overflow-x-auto px-1 sm:px-2">
          <div className="min-w-[640px] px-2 sm:px-3">
            <div
              className={cn(
                sans,
                "grid grid-cols-[5rem_1fr_7rem_8rem_6rem] gap-3 border-b border-white/[0.04] py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600"
              )}
            >
              <span>Ticker</span>
              <span className="text-right">Cant.</span>
              <span className="text-right">Precio</span>
              <span className="text-right">Tend.</span>
              <span className="text-right">Mkt</span>
            </div>
            {MOCK_HOLDINGS.map((h) => (
              <HoldingRow key={h.ticker} row={h} />
            ))}
          </div>
        </div>
      </OikosCard>

      <OikosCard>
        <div className="mb-4 flex items-center gap-2">
          <Receipt className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-200">
            Libro de gastos
          </h2>
          <span className="text-[10px] text-zinc-600">(ledger)</span>
        </div>
        <ul className="space-y-2">
          {MOCK_EXPENSES.map((e) => {
            const tone = categoryTone[e.category];
            return (
              <li
                key={e.id}
                className="flex flex-col gap-2 rounded-lg border border-white/[0.03] bg-black/25 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-zinc-200">
                    {e.store}
                  </span>
                  <span
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      tone.border,
                      tone.text,
                      tone.bg
                    )}
                  >
                    {e.category}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 sm:justify-end">
                  <span className={cn(mono, "text-sm text-zinc-200")}>
                    −{formatArs(e.amount)}
                  </span>
                  <time
                    className="text-[11px] text-zinc-600"
                    dateTime={e.date}
                  >
                    {format(parseISO(e.date), "d MMM yyyy", { locale: es })}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>
      </OikosCard>
    </motion.div>
  );
}
