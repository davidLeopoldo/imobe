import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PainelHeader } from "@/components/layout/painel-header";
import { PainelSidebar } from "@/components/layout/painel-sidebar";
import { logout } from "./_actions/logout";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PainelHeader onLogout={logout} />
      <div className="flex flex-1">
        <PainelSidebar />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
