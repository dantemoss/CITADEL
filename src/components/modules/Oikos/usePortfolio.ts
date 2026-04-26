"use client";

import { useState, useEffect, useCallback } from "react";
import { isSupabaseReady, supabase } from "@/lib/supabase";
import type { Holding, Transaction } from "./types";

type HoldingRow = {
  id: string;
  ticker: string;
  company_name: string;
  logo_url: string | null;
  quantity: number | string;
  avg_buy_price: number | string;
  currency: string;
  created_at: string;
};

type TransactionRow = {
  id: string;
  holding_id: string;
  ticker: string;
  type: "buy" | "sell";
  quantity: number | string;
  price: number | string;
  date: string;
  note: string | null;
  created_at: string;
};

let holdingsCache: Holding[] | null = null;
let transactionsCache: Transaction[] | null = null;

function holdingFromRow(row: HoldingRow): Holding {
  return {
    id: row.id,
    ticker: row.ticker,
    companyName: row.company_name,
    logoUrl: row.logo_url ?? "",
    quantity: Number(row.quantity),
    avgBuyPrice: Number(row.avg_buy_price),
    currency: row.currency,
    createdAt: row.created_at,
  };
}

function transactionFromRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    holdingId: row.holding_id,
    ticker: row.ticker,
    type: row.type,
    quantity: Number(row.quantity),
    price: Number(row.price),
    date: row.date,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

function holdingToRow(holding: Holding): HoldingRow {
  return {
    id: holding.id,
    ticker: holding.ticker,
    company_name: holding.companyName,
    logo_url: holding.logoUrl,
    quantity: holding.quantity,
    avg_buy_price: holding.avgBuyPrice,
    currency: holding.currency,
    created_at: holding.createdAt,
  };
}

function transactionToRow(transaction: Transaction): TransactionRow {
  return {
    id: transaction.id,
    holding_id: transaction.holdingId,
    ticker: transaction.ticker,
    type: transaction.type,
    quantity: transaction.quantity,
    price: transaction.price,
    date: transaction.date,
    note: transaction.note ?? null,
    created_at: transaction.createdAt,
  };
}

function holdingUpdateRow(patch: Partial<Omit<Holding, "id" | "createdAt">>) {
  return {
    ...(patch.ticker !== undefined && { ticker: patch.ticker }),
    ...(patch.companyName !== undefined && { company_name: patch.companyName }),
    ...(patch.logoUrl !== undefined && { logo_url: patch.logoUrl }),
    ...(patch.quantity !== undefined && { quantity: patch.quantity }),
    ...(patch.avgBuyPrice !== undefined && { avg_buy_price: patch.avgBuyPrice }),
    ...(patch.currency !== undefined && { currency: patch.currency }),
  };
}

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (holdingsCache && transactionsCache) {
      setHoldings(holdingsCache);
      setTransactions(transactionsCache);
      setHydrated(true);
    }

    async function loadPortfolio() {
      if (!isSupabaseReady || !supabase) {
        console.warn("Supabase no está configurado. El portfolio no se cargará.");
        setHydrated(true);
        return;
      }

      const [holdingsResult, transactionsResult] = await Promise.all([
        supabase
          .from("portfolio_holdings")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("portfolio_transactions")
          .select("*")
          .order("date", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);

      if (cancelled) return;

      if (holdingsResult.error) {
        console.error("Error cargando holdings desde Supabase:", holdingsResult.error);
        setHoldings([]);
      } else {
        const loadedHoldings = ((holdingsResult.data ?? []) as HoldingRow[]).map(holdingFromRow);
        holdingsCache = loadedHoldings;
        setHoldings(loadedHoldings);
      }

      if (transactionsResult.error) {
        console.error("Error cargando movimientos desde Supabase:", transactionsResult.error);
        setTransactions([]);
      } else {
        const loadedTransactions = ((transactionsResult.data ?? []) as TransactionRow[]).map(
          transactionFromRow
        );
        transactionsCache = loadedTransactions;
        setTransactions(loadedTransactions);
      }

      setHydrated(true);
    }

    loadPortfolio();

    return () => {
      cancelled = true;
    };
  }, []);

  const addHolding = useCallback(
    async (holding: Omit<Holding, "id" | "createdAt">) => {
      if (!supabase) return null;

      const newHolding: Holding = {
        ...holding,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("portfolio_holdings")
        .insert(holdingToRow(newHolding))
        .select("*")
        .single();

      if (error) {
        console.error("Error creando holding en Supabase:", error);
        return null;
      }

      const saved = holdingFromRow(data as HoldingRow);
      setHoldings((prev) => {
        const next = [...prev, saved];
        holdingsCache = next;
        return next;
      });
      return saved;
    },
    []
  );

  const removeHolding = useCallback(async (id: string) => {
    if (!supabase) return;

    setHoldings((prev) => {
      const next = prev.filter((h) => h.id !== id);
      holdingsCache = next;
      return next;
    });
    setTransactions((prev) => {
      const next = prev.filter((t) => t.holdingId !== id);
      transactionsCache = next;
      return next;
    });

    const { error } = await supabase.from("portfolio_holdings").delete().eq("id", id);
    if (error) console.error("Error eliminando holding en Supabase:", error);
  }, []);

  const updateHolding = useCallback(
    async (id: string, patch: Partial<Omit<Holding, "id" | "createdAt">>) => {
      if (!supabase) return;

      setHoldings((prev) => {
        const next = prev.map((h) => (h.id === id ? { ...h, ...patch } : h));
        holdingsCache = next;
        return next;
      });

      const { error } = await supabase
        .from("portfolio_holdings")
        .update(holdingUpdateRow(patch))
        .eq("id", id);

      if (error) console.error("Error actualizando holding en Supabase:", error);
    },
    []
  );

  const addTransaction = useCallback(
    async (txn: Omit<Transaction, "id" | "createdAt">) => {
      if (!supabase) return null;

      const holding = holdings.find((h) => h.id === txn.holdingId);
      if (!holding) return null;

      const newTxn: Transaction = {
        ...txn,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      const isBuy = txn.type === "buy";
      const newQty = isBuy
        ? holding.quantity + txn.quantity
        : Math.max(0, holding.quantity - txn.quantity);
      const newAvg = isBuy
        ? (holding.avgBuyPrice * holding.quantity + txn.price * txn.quantity) /
          (holding.quantity + txn.quantity)
        : holding.avgBuyPrice;

      const updatedHolding: Holding = {
        ...holding,
        quantity: newQty,
        avgBuyPrice: newAvg,
      };

      const { data, error } = await supabase
        .from("portfolio_transactions")
        .insert(transactionToRow(newTxn))
        .select("*")
        .single();

      if (error) {
        console.error("Error creando movimiento en Supabase:", error);
        return null;
      }

      const { error: holdingError } = await supabase
        .from("portfolio_holdings")
        .update({
          quantity: updatedHolding.quantity,
          avg_buy_price: updatedHolding.avgBuyPrice,
        })
        .eq("id", updatedHolding.id);

      if (holdingError) {
        console.error("Error actualizando holding del movimiento en Supabase:", holdingError);
        return null;
      }

      const savedTxn = transactionFromRow(data as TransactionRow);
      setTransactions((prev) => {
        const next = [savedTxn, ...prev];
        transactionsCache = next;
        return next;
      });
      setHoldings((prev) => {
        const next = prev.map((h) => (h.id === updatedHolding.id ? updatedHolding : h));
        holdingsCache = next;
        return next;
      });

      return savedTxn;
    },
    [holdings]
  );

  return {
    holdings,
    transactions,
    hydrated,
    addHolding,
    removeHolding,
    updateHolding,
    addTransaction,
  };
}
