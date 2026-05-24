import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        // Body / UI: Plus Jakarta Sans. Display: Libre Caslon (sólo hero / citas).
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-libre-caslon)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Paleta de marca CITADEL — paleta Spray cyan/teal (acento)
        spray: {
          50: "#edfdfe",
          100: "#d2f7fb",
          200: "#abedf6",
          300: "#6fdeef",
          400: "#30c6e0",
          500: "#14a9c6",
          600: "#1388a7",
          700: "#176d87",
          800: "#1b596f",
          900: "#1b4b5e",
          950: "#0c3040",
        },
        // Cobalto romántico — atmósferas, vignettes, halos de catedral.
        cobalt: "hsl(var(--cobalt))",
        "cobalt-soft": "hsl(var(--cobalt-soft))",
        // Aliases legacy — re-mapeados a tokens semánticos.
        // Permiten que los módulos antiguos (Chronos, Oikos, etc.) sigan
        // funcionando sin reescribir cientos de líneas.
        carbon: "hsl(var(--carbon))",
        piedra: "hsl(var(--piedra))",
        marfil: "hsl(var(--marfil))",
        oxido: "hsl(var(--oxido))",
        acero: "hsl(var(--acero))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      letterSpacing: {
        editorial: "0.01em",
        eyebrow: "0.28em",
        stoic: "0.32em",
      },
      boxShadow: {
        // Tarjetas: sombra slate fría, no marrón.
        paper:
          "0 1px 0 0 hsl(var(--foreground) / 0.03) inset, 0 1px 2px hsl(var(--foreground) / 0.04), 0 8px 24px -12px hsl(var(--foreground) / 0.10)",
        "paper-lg":
          "0 1px 0 0 hsl(var(--foreground) / 0.04) inset, 0 4px 12px hsl(var(--foreground) / 0.06), 0 24px 60px -28px hsl(var(--foreground) / 0.16)",
        // Glow acento spray para CTA y elementos clave en modo oscuro.
        "spray-glow":
          "0 0 0 1px hsl(var(--accent) / 0.20), 0 8px 32px -8px hsl(var(--accent) / 0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
