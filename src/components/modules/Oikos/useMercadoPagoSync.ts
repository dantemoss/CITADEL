"use client";

import * as React from "react";

/**
 * Punto de integración futuro con Mercado Pago (OAuth / webhooks / pagos).
 * Descomenta e implementa cuando exista backend y credenciales.
 */
export async function syncWithProvider(
  _ctx?: Record<string, unknown>
): Promise<{ ok: boolean }> {
  // const res = await fetch("/api/integrations/mercadopago/sync", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(_ctx),
  // });
  // if (!res.ok) throw new Error("Mercado Pago sync failed");
  // return res.json();
  return Promise.resolve({ ok: false });
}

export function useMercadoPagoSync() {
  const [pending, setPending] = React.useState(false);

  const runSync = React.useCallback(async () => {
    setPending(true);
    try {
      await syncWithProvider();
    } finally {
      setPending(false);
    }
  }, []);

  return { syncWithProvider, runSync, pending };
}
