import { NextRequest, NextResponse } from "next/server";

const YF_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 1) return NextResponse.json({ results: [] });

  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0&listsCount=0&enableFuzzyQuery=false&enableCb=false`;
    const res = await fetch(url, {
      headers: YF_HEADERS,
      next: { revalidate: 0 },
    });

    if (!res.ok) throw new Error(`YF responded ${res.status}`);

    const data = await res.json();
    const quotes: unknown[] = data?.quotes ?? [];

    const results = quotes
      .filter((q: any) => ["EQUITY", "ETF"].includes(q.quoteType))
      .slice(0, 8)
      .map((q: any) => ({
        symbol: q.symbol as string,
        shortname: (q.shortname ?? q.longname ?? q.symbol) as string,
        longname: q.longname as string | undefined,
        exchange: (q.exchDisp ?? q.exchange ?? "") as string,
        type: q.quoteType as string,
      }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: "No se pudo conectar con Yahoo Finance." },
      { status: 500 }
    );
  }
}
