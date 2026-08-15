import { Home, Building2, FileText } from "lucide-react";

export const PAINEL_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/imoveis", label: "Imóveis", icon: Building2 },
  { href: "/contratos", label: "Contratos", icon: FileText },
] as const;
