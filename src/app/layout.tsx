import type { Metadata } from "next";
import { Libre_Caslon_Display, Plus_Jakarta_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";

import { MotionProvider } from "@/components/motion";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const libreCaslon = Libre_Caslon_Display({
  subsets: ["latin"],
  variable: "--font-libre-caslon",
  weight: ["400"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
      className={`${jakarta.variable} ${libreCaslon.variable} ${GeistMono.variable}`}
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
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
