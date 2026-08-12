import Link from "next/link";
import { PAINEL_NAV_ITEMS } from "./nav-items";

export function PainelSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r sm:block">
      <nav className="flex flex-col gap-1 p-4">
        {PAINEL_NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
