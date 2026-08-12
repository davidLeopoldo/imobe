"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export async function login(input: LoginFormValues) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { message: "E-mail ou senha inválidos." };
  }

  redirect("/dashboard");
}
