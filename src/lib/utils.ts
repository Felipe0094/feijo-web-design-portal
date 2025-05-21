import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: string): string => {
  const number = parseInt(value.replace(/\D/g, ''));
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number / 100);
};

export const parseCurrency = (value: string): number => {
  const number = parseInt(value.replace(/\D/g, ''));
  return number / 100;
};
