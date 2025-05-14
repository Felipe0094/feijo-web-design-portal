
import { useState, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";

// Função para formatar CPF ou CNPJ
function formatCpfCnpj(value: string) {

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

// Função para formatar telefone
function formatPhone(value: string) {

  value = value.replace(/\D/g, ""); // Remove tudo que não for número

  if (value.length > 11) value = value.slice(0, 11); // Limitar no máximo 11 dígitos

  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");

  return value;
}


const formSchema = z.object({
  document_number: z.string().min(1, "CPF/CNPJ é obrigatório"),
  full_name: z.string().min(1, "Nome/Razão Social é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),

  insurance_type: z.enum(["new", "renewal"]).optional(),
  address: z.string().optional(),
  zip_code: z.string().optional(),
  birth_date: z.string().optional(),
  marital_status: z.enum(["single", "married", "divorced", "widowed", "other"]).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  residence_type: z.enum(["house", "apartment", "condominium"]).optional(),
  
  is_new_vehicle: z.boolean().optional(),
  license_plate: z.string().optional(),
  chassis_number: z.string().optional(),
  manufacture_year: z.string().refine((value) => /^\d{4}$/.test(value), { message: "Ano deve conter 4 dígitos numéricos" }).optional(),
  model_year: z.number().optional(),
  model: z.string().optional(),
  fuel_type: z.string().optional(),
  is_financed: z.boolean().optional(),
  is_armored: z.boolean().optional(),
  has_natural_gas: z.boolean().optional(),
  has_sunroof: z.boolean().optional(),
  parking_zip_code: z.string().optional(),
  
  has_home_garage: z.boolean().optional(),
  has_automatic_gate: z.boolean().optional(),
  has_work_garage: z.boolean().optional(),
  has_school_garage: z.boolean().optional(),
  vehicle_usage: z.enum(["personal", "work", "passenger_transport"]).optional(),
  vehicles_at_residence: z.number().optional(),
  covers_young_drivers: z.boolean().optional(),
  
  is_driver_insured: z.boolean().optional(),
  driver_document_number: z.string().optional(),
  driver_full_name: z.string().optional(),
  driver_birth_date: z.string().optional(),
  driver_marital_status: z.enum(["single", "married", "divorced", "widowed", "other"]).optional(),
  driver_gender: z.enum(["male", "female", "other"]).optional(),
  driver_relationship: z.string().optional(),
  driver_residence_type: z.enum(["house", "apartment", "condominium"]).optional(),
  seller: z.enum(["Felipe", "Renan", "Renata"]).optional(),
});

interface AutoInsuranceQuoteFormProps {
  onSuccess?: (data: any) => void;
}

const AutoInsuranceQuoteForm = ({ onSuccess }: AutoInsuranceQuoteFormProps) => {
  const [showDriverInfo, setShowDriverInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coberturaMenor, setCoberturaMenor] = useState(false);
  const [idadeCondutorMenor, setIdadeCondutorMenor] = useState('');

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insurance_type: "new",
      is_new_vehicle: false,
      license_plate: undefined,
      chassis_number: undefined,
      is_financed: false,
      is_armored: false,
      has_natural_gas: false,
      has_sunroof: false,
      has_home_garage: false,
      has_automatic_gate: false,
      has_work_garage: false,
      has_school_garage: false,
      vehicle_usage: "personal",
      vehicles_at_residence: 1,
      covers_young_drivers: false,
      is_driver_insured: true,
      driver_document_number: undefined,
      driver_full_name: undefined,
      driver_birth_date: undefined,
      driver_marital_status: undefined,
      driver_gender: undefined,
      driver_relationship: undefined,
      driver_residence_type: undefined,
      seller: "Felipe",
    },
    
  });

  const handleCoberturaMenorChange = (event: boolean) => {
    setCoberturaMenor(event);
  };

  const handleIdadeCondutorMenorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdadeCondutorMenor(event.target.value);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      if (!values.document_number || !values.full_name || !values.email || !values.phone ) {
      

        toast.error("Por favor, preencha todos os campos obrigatórios.");
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('auto_insurance_quotes')
        .insert({
          document_number: values.document_number,
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          seller: values.seller || "Felipe",
          address: values.address,
          zip_code: values.zip_code,
          birth_date: values.birth_date,
          marital_status: values.marital_status,
          gender: values.gender,
          residence_type: values.residence_type,
          insurance_type: values.insurance_type,
          is_new_vehicle: values.is_new_vehicle,
          license_plate: values.license_plate,
          chassis_number: values.chassis_number,
          manufacture_year: values.manufacture_year ? Number(values.manufacture_year) : undefined,
          model_year: values.model_year,
          model: values.model,
          fuel_type: values.fuel_type,
          is_financed: values.is_financed,
          is_armored: values.is_armored,
          has_natural_gas: values.has_natural_gas,
          has_sunroof: values.has_sunroof,
          parking_zip_code: values.parking_zip_code,
          has_home_garage: values.has_home_garage,
          has_automatic_gate: values.has_automatic_gate,
          has_work_garage: values.has_work_garage,
          has_school_garage: values.has_school_garage,
          vehicle_usage: values.vehicle_usage,
          vehicles_at_residence: values.vehicles_at_residence,
          covers_young_drivers: values.covers_young_drivers,
          is_driver_insured: values.is_driver_insured,
          driver_document_number: values.driver_document_number,
          driver_full_name: values.driver_full_name,
          driver_birth_date: values.driver_birth_date,
          driver_marital_status: values.driver_marital_status,
          driver_gender: values.driver_gender,
          driver_relationship: values.driver_relationship,
          driver_residence_type: values.driver_residence_type,
          cobertura_menor: coberturaMenor,
          idade_condutor_menor: idadeCondutorMenor,
        });


      if (error) throw error;

      try {
        // Fix the environment variable issue and make sure the endpoint URL is correct
        const emailResponse = await fetch('https://ocapqzfqqgjcqohlomva.supabase.co/functions/v1/send-insurance-quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYXBxemZxcWdqY3FvaGxvbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzY2OTYsImV4cCI6MjA2MTI1MjY5Nn0.BJVh01h7-s2aFsNdv_wIHm58CmuNxP70_5qfPuVPd4o`
          },
          body: JSON.stringify({ 
            quoteData: values,
            recipientEmail: "cotacoes.feijocorretora@gmail.com"
          })
        });
        
        if (!emailResponse.ok) {
          console.error("Email response not OK:", await emailResponse.text());
          throw new Error('Falha ao enviar email');
        }
      } catch (emailError) {
        console.error("Erro ao enviar email:", emailError);
      }

      toast.success("Cotação enviada com sucesso!");
      
      if (onSuccess) {
        onSuccess(values);
      }
      
      form.reset();
      setShowDriverInfo(false);
      
    } catch (error) {
      toast.error("Erro ao enviar cotação. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#b22222]">Informações Pessoais</h3>
              
              <div className="grid gap-4 md:grid-cols-3">
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
                    const formatted = formatCpfCnpj(e.target.value.replace(/\D/g, ''));
                    field.onChange(formatted);
                  }, [field]);
                return (
                  <FormItem>
                    <FormLabel>CPF/CNPJ*</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 

                        onChange={handleChange} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                }/>                

                <FormField
                  control={form.control}
                  name="seller"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendedor/Corretor*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o vendedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Felipe">Felipe</SelectItem>
                          <SelectItem value="Renan">Renan</SelectItem>
                          <SelectItem value="Renata">Renata</SelectItem>
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone*</FormLabel>
                       <FormControl>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => {
                              const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                                const formatted = formatPhone(e.target.value);
                                field.onChange(formatted);
                              }, [field]);
                          return (
                          <Input {...field} onChange={handleChange} value={field.value || ''}/>
                        );
                        }}/>

                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                          <SelectItem value="condominium">Casa em Condomínio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Vehicle Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#b22222]">Informações do Veículo</h3>
              
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
                          <Input {...field} />
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
                          type="number" 
                          {...field}                          
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano do Modelo</FormLabel>
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
              


                <FormField
                  control={form.control}
                  name="parking_zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP de Pernoite</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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

            {/* Garage Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#b22222]">Informações de Garagem</h3>
              
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

              <FormField
                control={form.control}
                name="covers_young_drivers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Cobertura para menores de 25 anos?</FormLabel>
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

            {/* Principal Driver Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#b22222]">Informações do Principal Condutor</h3>
              
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
                      name="driver_document_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF do Condutor</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="driver_full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo do Condutor</FormLabel>
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
                      name="driver_birth_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento do Condutor</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="driver_relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relação com o Segurado</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="driver_marital_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Civil do Condutor</FormLabel>
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
                          <FormLabel>Gênero do Condutor</FormLabel>
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
                      name="driver_residence_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Residência do Condutor</FormLabel>
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
              )}
            </div>

            <Button type="submit" className="w-full bg-feijo-red hover:bg-red-700" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Cotação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AutoInsuranceQuoteForm;
