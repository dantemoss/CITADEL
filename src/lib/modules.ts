import {
  Hourglass,
  Wallet,
  PenTool,
  Target,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type CitadelModule = {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  greek: string;
};

export const MODULES: CitadelModule[] = [
  {
    id: "chronos",
    name: "CHRONOS",
    href: "/chronos",
    icon: Hourglass,
    description: "Gestión del tiempo de vida",
    greek: "Χρόνος",
  },
  {
    id: "oikos",
    name: "OIKOS",
    href: "/oikos",
    icon: Wallet,
    description: "Control de finanzas y ahorros",
    greek: "Οἶκος",
  },
  {
    id: "hypomnemata",
    name: "HYPOMNEMATA",
    href: "/hypomnemata",
    icon: PenTool,
    description: "Notas y Brain Dump",
    greek: "Ὑπομνήματα",
  },
  {
    id: "telos",
    name: "TELOS",
    href: "/telos",
    icon: Target,
    description: "Objetivos y Metas",
    greek: "Τέλος",
  },
  {
    id: "egkrateia",
    name: "EGKRATEIA",
    href: "/egkrateia",
    icon: ShieldCheck,
    description: "Disciplina y Hábitos",
    greek: "Ἐγκράτεια",
  },
];
