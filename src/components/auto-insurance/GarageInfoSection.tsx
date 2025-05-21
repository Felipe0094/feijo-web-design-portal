
import { FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";

import type { AutoInsuranceFormData } from "./types";

export function GarageInfoSection() {
  const [showYoungDriverAge, setShowYoungDriverAge] = useState(false);
  const form = useFormContext<AutoInsuranceFormData>();
  
  // Get insurance_type value to determine visibility
  const insuranceType = useWatch({
    control: form.control,
    name: "insurance_type",
  });
  
  const coversYoungDrivers = useWatch({
    control: form.control,
    name: "covers_young_drivers",
  });
  
  // Update showYoungDriverAge when coversYoungDrivers changes
  useEffect(() => {
    setShowYoungDriverAge(coversYoungDrivers === true);
  }, [coversYoungDrivers]);
  
  // Don't render this component for renewal insurance
  if (insuranceType === "renewal") {
    return null;
  }
  
  return (
    <div className="space-y-4">
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="has_home_garage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Garagem em Casa?</FormLabel>
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
            name="has_automatic_gate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Portão Automático?</FormLabel>
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
            name="has_work_garage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Garagem no Trabalho?</FormLabel>
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
            name="has_school_garage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Garagem na Escola?</FormLabel>
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

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="vehicle_usage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uso do Veículo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="personal">Particular</SelectItem>
                  <SelectItem value="work">Trabalho</SelectItem>
                  <SelectItem value="passenger_transport">Transporte de Passageiros</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicles_at_residence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Veículos na Residência</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <FormField
          control={form.control}
          name="covers_young_drivers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cobertura para menores de 25 anos?</FormLabel>
              <Select 
                onValueChange={(value) => {
                  // Convert string to boolean
                  const boolValue = value === "yes";
                  field.onChange(boolValue);
                  setShowYoungDriverAge(boolValue);
                }} 
                defaultValue={field.value ? "yes" : "no"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Sim</SelectItem>
                  <SelectItem value="no">Não. Estou ciente que não haverá cobertura para condutores entre 18 a 25 anos.</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {showYoungDriverAge && (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <FormField 
            control={form.control} 
            name="condutor_menor" 
            render={({ field }) => (
            <FormItem>
              <FormLabel>Idade do Condutor menor de 25 anos:</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="Digite a idade" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}/>
        </div>
      )}
    </div>
  );
}
