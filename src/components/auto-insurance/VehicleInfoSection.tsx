import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

// Helper function to format year inputs to always be 4 digits
const formatYearInput = (value: string): string => {
  // Keep only digits and limit to 4 characters
  return value.replace(/\D/g, '').slice(0, 4);
};

export const VehicleInfoSection = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="is_new_vehicle"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Veículo Zero?</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!form.watch("is_new_vehicle") && (
          <FormField
            control={form.control}
            name="license_plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    maxLength={7}
                    onChange={(e) => {
                      // Remove caracteres especiais e converte para maiúsculas
                      const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                      field.onChange(value);
                    }}
                    placeholder="ABC1234"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="manufacture_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano de Fabricação</FormLabel>
              <FormControl>
                <Input
                  value={field.value || ''}
                  onChange={(e) => {
                    const formattedValue = formatYearInput(e.target.value);
                    // Convert to number before setting the value
                    field.onChange(formattedValue ? parseInt(formattedValue) : undefined);
                  }}
                  placeholder="9999"
                  maxLength={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model_year"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Ano do Modelo</FormLabel>
                <FormControl>
                  <Input
                    value={field.value || ''}
                    onChange={(e) => {
                      const formattedValue = formatYearInput(e.target.value);
                      field.onChange(formattedValue ? parseInt(formattedValue) : undefined);
                    }}
                    placeholder="9999"
                    maxLength={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="fuel_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Combustível</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gasoline">Gasolina</SelectItem>
                  <SelectItem value="ethanol">Etanol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="flex">Flex (Gasolina/Etanol)</SelectItem>
                  <SelectItem value="electric">Elétrico</SelectItem>
                  <SelectItem value="hybrid">Híbrido</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="is_financed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Financiado?</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_armored"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Blindado?</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="has_natural_gas"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Kit Gás?</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_sunroof"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Teto Solar?</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
