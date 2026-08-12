import { Home, Building2 } from "lucide-react";

export const PAINEL_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/imoveis", label: "Imóveis", icon: Building2 },
] as const;
