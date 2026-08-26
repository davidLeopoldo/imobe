import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthSplitPanel } from "@/components/layout/auth-split-panel";
import { SignupForm } from "./_components/signup-form";

export default async function CadastroPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/dashboard");
  }

  return (
    <AuthSplitPanel
      headline="Organize seus imóveis, contratos e patrimônio em um só lugar"
      subtitle="O Immobiliare ajuda proprietários e corretores autônomos a cadastrar imóveis, gerar contratos e acompanhar o rendimento de aluguel sem depender de planilhas soltas."
    >
      <SignupForm />
    </AuthSplitPanel>
  );
}
