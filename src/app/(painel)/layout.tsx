import { PainelHeader } from "@/components/layout/painel-header";
import { PainelSidebar } from "@/components/layout/painel-sidebar";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PainelHeader />
      <div className="flex flex-1">
        <PainelSidebar />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
