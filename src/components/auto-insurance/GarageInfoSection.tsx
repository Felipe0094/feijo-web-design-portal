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
              <FormItem>
                <FormLabel>Garagem no Trabalho?</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                    <SelectItem value="not_applicable">Não utiliza para este fim</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_school_garage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garagem na Escola?</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                    <SelectItem value="not_applicable">Não utiliza para este fim</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
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
          name="covers_young_drivers"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Condutores menores de 26 anos?</FormLabel>
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

      {showYoungDriverAge && (
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="youngest_driver_age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade do Condutor mais Jovem</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
