import { NextRequest, NextResponse } from "next/server";

function detectType(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be"))
      return "youtube";
    if (hostname.includes("github.com")) return "github";
    if (hostname.includes("instagram.com")) return "instagram";
    if (hostname.includes("npmjs.com")) return "library";
    if (
      hostname.includes("vercel.app") ||
      hostname.includes("netlify.app") ||
      pathname.endsWith(".dev")
    )
      return "tool";
    return "page";
  } catch {
    return "page";
  }
}

function extractMeta(html: string, url: string) {
  const title =
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ??
    html.match(/property="og:title" content="([^"]+)"/i)?.[1]?.trim() ??
    "";

  const description =
    html.match(/property="og:description" content="([^"]+)"/i)?.[1]?.trim() ??
    html.match(/name="description" content="([^"]+)"/i)?.[1]?.trim() ??
    "";

  const thumbnail =
    html.match(/property="og:image" content="([^"]+)"/i)?.[1]?.trim() ?? "";

  try {
    const { origin } = new URL(url);
    const favicon = `${origin}/favicon.ico`;
    return { title, description, thumbnail, favicon };
  } catch {
    return { title, description, thumbnail, favicon: "" };
  }
}

export async function POST(req: NextRequest) {
  const { url } = (await req.json()) as { url: string };
  if (!url) return NextResponse.json({ error: "URL requerida" }, { status: 400 });

  const type = detectType(url);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      return NextResponse.json({ type, title: "", description: "", thumbnail: "", favicon: "" });
    }

    const html = await res.text();
    const meta = extractMeta(html, url);

    return NextResponse.json({ ...meta, type });
  } catch {
    return NextResponse.json({ type, title: "", description: "", thumbnail: "", favicon: "" });
  }
}
