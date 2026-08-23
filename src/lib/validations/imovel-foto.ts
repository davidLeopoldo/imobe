export const TIPOS_ACEITOS = ["image/png", "image/jpeg"] as const;
export const TAMANHO_MAXIMO_BYTES = 3 * 1024 * 1024;
export const MAXIMO_FOTOS_POR_IMOVEL = 10;

export function validarArquivoFoto(file: File): string | null {
  if (!TIPOS_ACEITOS.includes(file.type as (typeof TIPOS_ACEITOS)[number])) {
    return `"${file.name}": formato não suportado. Envie PNG ou JPG/JPEG.`;
  }
  if (file.size > TAMANHO_MAXIMO_BYTES) {
    return `"${file.name}": arquivo maior que 3MB.`;
  }
  return null;
}

export function extensaoDoArquivo(file: File): string {
  return file.type === "image/png" ? "png" : "jpg";
}
