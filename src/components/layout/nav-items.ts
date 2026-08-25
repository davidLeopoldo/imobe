import { Home, Building2, Users, FileText } from "lucide-react";

export const PAINEL_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/imoveis", label: "Imóveis", icon: Building2 },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/contratos", label: "Contratos", icon: FileText },
] as const;
