# CITADEL v2.0

> Suite táctica de herramientas personales para el **AI Builder**.
> _Terminal estoica · Bento Grid · Zinc/Dark._

## Módulos

| Módulo          | Griego       | Propósito                          |
| --------------- | ------------ | ---------------------------------- |
| **CHRONOS**     | Χρόνος       | Gestión del tiempo de vida         |
| **OIKOS**       | Οἶκος        | Control de finanzas y ahorros      |
| **HYPOMNEMATA** | Ὑπομνήματα   | Notas y Brain Dump                 |
| **TELOS**       | Τέλος        | Objetivos y Metas                  |
| **EGKRATEIA**   | Ἐγκράτεια    | Disciplina y Hábitos               |

## Stack

- **Next.js 14** (App Router)
- **TypeScript** estricto
- **Tailwind CSS** con tema **Zinc / Dark** estilo Shadcn
- **Shadcn/ui** (New York, zinc) — `components.json` ya configurado
- **lucide-react** para iconografía
- **Geist Sans** (UI) + **Geist Mono** (números / telemetría)

## Scripts

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Estructura

```
src/
  app/
    (dashboard)/
      layout.tsx        # Layout con Sidebar "Estoica"
      page.tsx          # Bienvenida Bento Grid
      chronos/
      oikos/
      hypomnemata/
      telos/
      egkrateia/
    layout.tsx          # Root: fuentes Geist + dark mode
    globals.css
  components/
    sidebar.tsx         # Sidebar táctica
    module-placeholder.tsx
    modules/            # Componentes de cada módulo (Chronos/Oikos/...)
    ui/                 # Primitivas Shadcn (button, ...)
  lib/
    modules.ts          # Metadata central de los módulos
    utils.ts            # cn()
```

## Añadir más primitivas de Shadcn

El proyecto ya tiene `components.json` listo con:

- `style: "new-york"`
- `baseColor: "zinc"`
- `iconLibrary: "lucide"`

Para añadir un componente nuevo:

```bash
npx shadcn@latest add card dialog input
```

## Filosofía

> _"Primero dite a ti mismo qué quieres ser; entonces, haz lo que tengas que hacer."_ — Epicteto

CITADEL separa la vida del Arquitecto en cinco dominios estoicos. Cada módulo es una celda independiente del grid: enfoque total, sin ruido.
