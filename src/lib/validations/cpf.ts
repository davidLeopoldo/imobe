export const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function maskCpfInput(value: string): string {
  const digits = normalizeCpf(value).slice(0, 11);

  if (digits.length > 9)
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  if (digits.length > 6)
    return digits.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  if (digits.length > 3) return digits.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  return digits;
}
