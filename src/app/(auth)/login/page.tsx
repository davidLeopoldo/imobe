import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthSplitPanel } from "@/components/layout/auth-split-panel";
import { LoginForm } from "./_components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ cadastro?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/dashboard");
  }

  const { cadastro } = await searchParams;
  const infoMessage =
    cadastro === "verifique-email"
      ? "Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar."
      : undefined;

  return (
    <AuthSplitPanel
      headline="Organize seus imóveis, contratos e patrimônio em um só lugar"
      subtitle="O Immobiliare ajuda proprietários e corretores autônomos a cadastrar imóveis, gerar contratos e acompanhar o rendimento de aluguel sem depender de planilhas soltas."
    >
      <LoginForm infoMessage={infoMessage} />
    </AuthSplitPanel>
  );
}
