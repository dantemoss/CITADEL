export interface Holding {
  id: string;
  ticker: string;
  companyName: string;
  logoUrl: string;
  quantity: number;
  avgBuyPrice: number;
  currency: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  holdingId: string;
  ticker: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface LiveQuote {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  prevClose: number;
  high: number;
  low: number;
  volume: number;
  marketState: string;
}

export interface StockSearchResult {
  symbol: string;
  shortname: string;
  longname?: string;
  exchange: string;
  type: string;
}
