export type ExpenseCategory = "Comida" | "Transporte" | "Ocio" | "Fijo";

export type Holding = {
  ticker: string;
  quantity: number;
  currentPrice: number;
  /** Serie reciente (últimos puntos) para sparkline */
  series: number[];
};

export type Expense = {
  id: string;
  store: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
};

export const DEFAULT_SALARY = 1_700_000;

export const MOCK_HOLDINGS: Holding[] = [
  {
    ticker: "ALUA",
    quantity: 420,
    currentPrice: 528.5,
    series: [480, 492, 488, 505, 510, 518, 522, 528.5],
  },
  {
    ticker: "YPFD",
    quantity: 180,
    currentPrice: 38_420,
    series: [37200, 37800, 38100, 37950, 38200, 38310, 38420],
  },
  {
    ticker: "GGAL",
    quantity: 95,
    currentPrice: 6_180,
    series: [5920, 5980, 6010, 5990, 6050, 6120, 6180],
  },
  {
    ticker: "BMA",
    quantity: 60,
    currentPrice: 8_940,
    series: [9100, 8980, 8920, 8880, 8910, 8960, 8940],
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: "1",
    store: "Coto Digital",
    category: "Comida",
    amount: 84_320,
    date: "2026-04-18",
  },
  {
    id: "2",
    store: "SUBE",
    category: "Transporte",
    amount: 12_000,
    date: "2026-04-17",
  },
  {
    id: "3",
    store: "HBO Max",
    category: "Ocio",
    amount: 4_499,
    date: "2026-04-15",
  },
  {
    id: "4",
    store: "Edenor",
    category: "Fijo",
    amount: 41_200,
    date: "2026-04-12",
  },
  {
    id: "5",
    store: "Rappi",
    category: "Comida",
    amount: 18_750,
    date: "2026-04-10",
  },
];

export function portfolioMarketValue(holdings: Holding[]): number {
  return holdings.reduce((acc, h) => acc + h.quantity * h.currentPrice, 0);
}

/** Patrimonio neto mock: cartera + efectivo operativo (API reemplazará lógica). */
export function computeNetWorth(holdings: Holding[], liquidCash: number): number {
  return portfolioMarketValue(holdings) + liquidCash;
}
