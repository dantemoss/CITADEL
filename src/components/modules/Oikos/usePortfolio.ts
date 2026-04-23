"use client";

import { useState, useEffect, useCallback } from "react";
import type { Holding, Transaction } from "./types";

const HOLDINGS_KEY = "citadel:portfolio:holdings";
const TXN_KEY = "citadel:portfolio:transactions";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHoldings(load<Holding[]>(HOLDINGS_KEY, []));
    setTransactions(load<Transaction[]>(TXN_KEY, []));
    setHydrated(true);
  }, []);

  const addHolding = useCallback(
    (holding: Omit<Holding, "id" | "createdAt">) => {
      const newHolding: Holding = {
        ...holding,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setHoldings((prev) => {
        const next = [...prev, newHolding];
        save(HOLDINGS_KEY, next);
        return next;
      });
      return newHolding;
    },
    []
  );

  const removeHolding = useCallback((id: string) => {
    setHoldings((prev) => {
      const next = prev.filter((h) => h.id !== id);
      save(HOLDINGS_KEY, next);
      return next;
    });
    setTransactions((prev) => {
      const next = prev.filter((t) => t.holdingId !== id);
      save(TXN_KEY, next);
      return next;
    });
  }, []);

  const updateHolding = useCallback(
    (id: string, patch: Partial<Omit<Holding, "id" | "createdAt">>) => {
      setHoldings((prev) => {
        const next = prev.map((h) => (h.id === id ? { ...h, ...patch } : h));
        save(HOLDINGS_KEY, next);
        return next;
      });
    },
    []
  );

  const addTransaction = useCallback(
    (txn: Omit<Transaction, "id" | "createdAt">) => {
      const newTxn: Transaction = {
        ...txn,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => {
        const next = [...prev, newTxn];
        save(TXN_KEY, next);
        return next;
      });

      // Update holding quantity and avgBuyPrice
      setHoldings((prev) => {
        const next = prev.map((h) => {
          if (h.id !== txn.holdingId) return h;
          const isBuy = txn.type === "buy";
          const newQty = isBuy
            ? h.quantity + txn.quantity
            : Math.max(0, h.quantity - txn.quantity);
          const newAvg = isBuy
            ? (h.avgBuyPrice * h.quantity + txn.price * txn.quantity) /
              (h.quantity + txn.quantity)
            : h.avgBuyPrice;
          return { ...h, quantity: newQty, avgBuyPrice: newAvg };
        });
        save(HOLDINGS_KEY, next);
        return next;
      });
    },
    []
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
