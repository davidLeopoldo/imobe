import { buscarPerfilDoUsuario, buscarEmailDoUsuario } from "@/services/perfil-service";

export async function buscarDadosDoPerfil() {
  const [perfil, email] = await Promise.all([
    buscarPerfilDoUsuario(),
    buscarEmailDoUsuario(),
  ]);

  return { perfil, email };
}
