"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PAINEL_NAV_ITEMS } from "./nav-items";

export function PainelMobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="sm:hidden" />}
      >
        <Menu className="size-5" />
        <span className="sr-only">Abrir menu de navegação</span>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Imobe</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {PAINEL_NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <SheetClose
              key={href}
              nativeButton={false}
              render={
                <Link
                  href={href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                />
              }
            >
              <Icon className="size-4" />
              {label}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
