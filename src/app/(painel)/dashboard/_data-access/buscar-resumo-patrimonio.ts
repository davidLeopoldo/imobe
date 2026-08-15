import { buscarResumoPatrimonio } from "@/services/patrimonio-service";

export async function buscarResumoPatrimonioDoUsuario() {
  return buscarResumoPatrimonio();
}
