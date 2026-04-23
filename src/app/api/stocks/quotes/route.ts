import { NextRequest, NextResponse } from "next/server";

const YF_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
};

const FIELDS = [
  "symbol",
  "shortName",
  "longName",
  "regularMarketPrice",
  "regularMarketChange",
  "regularMarketChangePercent",
  "currency",
  "marketState",
  "regularMarketPreviousClose",
  "regularMarketOpen",
  "regularMarketDayHigh",
  "regularMarketDayLow",
  "regularMarketVolume",
].join(",");

export async function GET(req: NextRequest) {
  const symbols = req.nextUrl.searchParams.get("symbols");
  if (!symbols) return NextResponse.json({ quotes: {} });

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}&fields=${FIELDS}`;
    const res = await fetch(url, {
      headers: YF_HEADERS,
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error(`YF responded ${res.status}`);

    const data = await res.json();
    const result: any[] = data?.quoteResponse?.result ?? [];

    const quotes: Record<string, unknown> = {};
    for (const q of result) {
      quotes[q.symbol] = {
        symbol: q.symbol,
        companyName: q.shortName ?? q.longName ?? q.symbol,
        price: q.regularMarketPrice ?? 0,
        change: q.regularMarketChange ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
        currency: q.currency ?? "USD",
        prevClose: q.regularMarketPreviousClose ?? 0,
        open: q.regularMarketOpen ?? 0,
        high: q.regularMarketDayHigh ?? 0,
        low: q.regularMarketDayLow ?? 0,
        volume: q.regularMarketVolume ?? 0,
        marketState: q.marketState ?? "CLOSED",
      };
    }

    return NextResponse.json({ quotes });
  } catch {
    return NextResponse.json(
      { quotes: {}, error: "No se pudo obtener precios." },
      { status: 500 }
    );
  }
}
