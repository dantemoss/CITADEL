import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CITADEL · Pensamiento · Disciplina · Legado",
  description:
    "Suite táctica de herramientas personales para el AI Builder. Chronos · Oikos · Hypomnemata · Telos · Egkrateia · Alexandria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${GeistSans.variable} ${cinzel.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="stoic-canvas relative min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="citadel-theme"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
