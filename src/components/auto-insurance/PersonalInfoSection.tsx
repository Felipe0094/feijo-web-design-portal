import React, { useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { formatCpfCnpj, formatPhone } from "@/utils/formatters";

export const PersonalInfoSection = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="document_number"
          render={({ field }) => {
            const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
              const formatted = formatCpfCnpj(e.target.value);
              field.onChange(formatted);
            }, [field]);
            
            return (
              <FormItem>
                <FormLabel>CPF/CNPJ*</FormLabel>
                <FormControl>
                  <Input {...field} onChange={handleChange} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => {
            const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
              const formatted = formatPhone(e.target.value);
              field.onChange(formatted);
            }, [field]);
            
            return (
              <FormItem>
                <FormLabel>Telefone*</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    onChange={handleChange}
                    value={field.value || ''}
                    placeholder="(99) 99999-9999"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="marital_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Civil</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Solteiro(a)</SelectItem>
                  <SelectItem value="married">Casado(a)</SelectItem>
                  <SelectItem value="divorced">Divorciado(a)</SelectItem>
                  <SelectItem value="widowed">Viúvo(a)</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gênero</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="residence_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Residência</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                  <SelectItem value="condominium">Condomínio</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
