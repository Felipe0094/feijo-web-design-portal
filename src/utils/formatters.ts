// Função para formatar telefone
export function formatPhone(value: string) {
  value = value.replace(/\D/g, ""); // Remove tudo que não for número
  if (value.length > 11) value = value.slice(0, 11); // Limitar no máximo 11 dígitos
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value;
}

// Função para formatar CPF ou CNPJ
export function formatCpfCnpj(value: string) {
  value = value.replace(/\D/g, "");
  if (value.length <= 11) {
    // Formatar como CPF
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // Formatar como CNPJ
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  }
  return value;
}

// Função para formatar apenas CPF
export function formatCpf(value: string) {
  value = value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
}

// Função para formatar apenas CNPJ
export function formatCnpj(value: string) {
  value = value.replace(/\D/g, "");
  if (value.length > 14) value = value.slice(0, 14);
  value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
  value = value.replace(/(\d{4})(\d)/, "$1-$2");
  return value;
} 