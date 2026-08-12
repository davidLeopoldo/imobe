import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <LoginForm infoMessage={infoMessage} />
    </div>
  );
}
