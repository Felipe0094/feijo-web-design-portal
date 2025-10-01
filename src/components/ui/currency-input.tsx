import { useState } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency, parseCurrency } from "@/lib/utils";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

export const CurrencyInput = ({ 
  value, 
  onChange, 
  placeholder = "R$ 0,00" 
}: CurrencyInputProps) => {
  const [inputValue, setInputValue] = useState(value ? formatCurrency(String(value * 100)) : '');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(formatCurrency(newValue.replace(/\D/g, '')));
  };
  
  const handleBlur = () => {
    const numericValue = parseCurrency(inputValue);
    onChange(numericValue);
  };

  return (
    <Input
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className="text-right"
    />
  );
}; 