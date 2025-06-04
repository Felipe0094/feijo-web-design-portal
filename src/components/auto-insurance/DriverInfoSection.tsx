import React, { useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import type { AutoInsuranceFormData } from "./types";
import { formatCpfCnpj } from "@/utils/formatters";

interface DriverInfoSectionProps {
  showDriverInfo: boolean;
  setShowDriverInfo: Dispatch<SetStateAction<boolean>>;
}

export const DriverInfoSection = ({ showDriverInfo, setShowDriverInfo }: DriverInfoSectionProps) => {
  const form = useFormContext<AutoInsuranceFormData>();
  
  return (
    <div className="space-y-4">
      
      <FormField
        control={form.control}
        name="is_driver_insured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Principal Condutor é o Segurado?</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(value) => {
                  field.onChange(value);
                  setShowDriverInfo(!value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {showDriverInfo && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="driver_full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Condutor*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="driver_document_number"
              render={({ field }) => {
                const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                  const formatted = formatCpfCnpj(e.target.value);
                  field.onChange(formatted);
                }, [field]);
                
                return (
                  <FormItem>
                    <FormLabel>CPF do Condutor*</FormLabel>
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
              name="driver_birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driver_license_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da CNH*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driver_license_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria da CNH*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="AD">AD</SelectItem>
                      <SelectItem value="AE">AE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="driver_license_expiration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade da CNH*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driver_marital_status"
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
              name="driver_gender"
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="driver_profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissão</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driver_income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renda Mensal</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};
