"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";

export async function signup(input: SignupFormValues) {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { message: error.message };
  }

  // Se a confirmação de e-mail estiver habilitada no projeto Supabase, o
  // signUp não retorna uma sessão ativa — o usuário precisa confirmar antes
  // de logar.
  if (!data.session) {
    redirect("/login?cadastro=verifique-email");
  }

  redirect("/dashboard");
}
