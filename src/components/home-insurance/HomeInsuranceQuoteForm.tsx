import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Home, User, MapPin, FileText, Shield, Users, Loader2, Info } from "lucide-react";
import { formatCpfCnpj, formatPhone } from "@/utils/formatters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Form schema with Zod validation
const formSchema = z.object({
  insurance_type: z.enum(["new", "renewal"]),
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  document_number: z.string().min(1, "CPF/CNPJ é obrigatório"),
  birth_date: z.string().optional(),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  
  residence_type: z.enum(["house", "apartment"]),
  construction_type: z.enum(["superior", "solid", "mixed", "inferior"]),
  occupation_type: z.enum(["habitual", "vacation"]),
  
  zip_code: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Logradouro é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  
  security_equipment: z.array(z.string()).optional(),
  
  additional_data: z.object({
    is_owner: z.boolean().default(false),
    is_rural: z.boolean().default(false),
    is_gated_community: z.boolean().default(false),
    is_vacant_or_construction: z.boolean().default(false),
    is_historical: z.boolean().default(false),
    has_professional_activity: z.boolean().default(false),
    is_next_to_vacant: z.boolean().default(false),
  }).optional(),
  
  insured_value: z.string().optional(),
  electrical_damage_value: z.string().optional(),
  glass_value: z.string().optional(),
  flooding_value: z.string().optional(),
  pipe_leakage_value: z.string().optional(),
  theft_value: z.string().optional(),
  other_coverage_notes: z.string().optional(),
  
  seller: z.enum(["Carlos Henrique", "Felipe", "Renan", "Renata", "Gabriel"])
});

// Security equipment options
const securityEquipmentOptions = [
  { id: "local_alarm", label: "Alarme Local" },
  { id: "monitored_alarm", label: "Alarme Monitorado" },
  { id: "security", label: "Vigilância" },
  { id: "bars", label: "Grades" },
  { id: "electric_fence", label: "Cerca Elétrica" },
  { id: "electronic_doorman", label: "Porteiro Eletrônico" },
  { id: "cctv", label: "Circuito Fechado de TV" },
];

// Additional data options
const additionalDataOptions = [
  { id: "is_owner", label: "Segurado é o proprietário do imóvel?" },
  { id: "is_rural", label: "Imóvel localizado na zona rural?" },
  { id: "is_gated_community", label: "Imóvel localizado em condomínio fechado?" },
  { id: "is_vacant_or_construction", label: "Imóvel desocupado, em reforma ou em construção?" },
  { id: "is_historical", label: "Imóvel tombado pelo Patrimônio Histórico?" },
  { id: "has_professional_activity", label: "Exerce atividade profissional na residência?" },
  { id: "is_next_to_vacant", label: "Faz divisa com terrenos baldios ou imóveis desocupados?" },
];

interface HomeInsuranceQuoteFormProps {
  onSuccess?: (data: any) => void;
  onFileChange?: (file: File | null) => void;
  isSubmitting?: boolean;
}

const HomeInsuranceQuoteForm = ({
  onSuccess,
  onFileChange,
  isSubmitting = false
}: HomeInsuranceQuoteFormProps) => {
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [selectedSecurityEquipment, setSelectedSecurityEquipment] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insurance_type: "new",
      residence_type: "house",
      construction_type: "solid",
      occupation_type: "habitual",
      security_equipment: [],
      additional_data: {
        is_owner: false,
        is_rural: false,
        is_gated_community: false,
        is_vacant_or_construction: false,
        is_historical: false,
        has_professional_activity: false,
        is_next_to_vacant: false,
      },
    },
  });

  // Watch for insurance_type changes to determine when to show policy upload
  const insuranceType = form.watch("insurance_type");
  const isRenewalType = insuranceType === "renewal";
  
  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setPolicyFile(selectedFile);
    
    if (onFileChange) {
      onFileChange(selectedFile);
    }
  };

  // Handle security equipment checkbox changes
  const handleSecurityEquipmentChange = (checked: boolean, value: string) => {
    if (checked) {
      setSelectedSecurityEquipment(prev => [...prev, value]);
    } else {
      setSelectedSecurityEquipment(prev => prev.filter(item => item !== value));
    }
  };

  // Fetch address from CEP
  const fetchAddressFromCep = async (cep: string) => {
    if (cep.length < 8) return;
    
    try {
      const formattedCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        form.setValue('street', data.logradouro || '');
        form.setValue('neighborhood', data.bairro || '');
        form.setValue('city', data.localidade || '');
        form.setValue('state', data.uf || '');
      }
    } catch (error) {
      console.error("Error fetching address from CEP:", error);
    }
  };

  // Update form values when selected security equipment changes
  useEffect(() => {
    form.setValue('security_equipment', selectedSecurityEquipment);
  }, [selectedSecurityEquipment, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLocalIsSubmitting(true);
      
      if (!values.full_name || !values.document_number || !values.email || !values.phone) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        setLocalIsSubmitting(false);
        return;
      }

      // Format currency values to numeric
      const processedData = {
        ...values,
        insured_value: values.insured_value ? parseFloat(values.insured_value.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
        electrical_damage_value: values.electrical_damage_value ? parseFloat(values.electrical_damage_value.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
        glass_value: values.glass_value ? parseFloat(values.glass_value.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
        flooding_value: values.flooding_value ? parseFloat(values.flooding_value.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
        pipe_leakage_value: values.pipe_leakage_value ? parseFloat(values.pipe_leakage_value.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
        theft_value: values.theft_value ? parseFloat(values.theft_value.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
      };
      
      if (onSuccess) {
        onSuccess(processedData);
        form.reset();
        setPolicyFile(null);
        setSelectedSecurityEquipment([]);
      }
      
    } catch (error) {
      toast.error("Erro ao enviar cotação. Tente novamente.");
      console.error(error);
    } finally {
      setLocalIsSubmitting(false);
    }
  }

  // Format currency input
  const formatCurrency = (value: string) => {
    if (!value) return '';
    
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d)(\d{2})$/, '$1,$2');
    value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');
    
    return `R$ ${value}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Insurance Type Selection */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="insurance_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="text-[#fa0008]" size={20} />
                      <FormLabel className="text-lg font-semibold text-feijo-darkgray">Tipo de Seguro</FormLabel>
                    </div>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="new" id="new" />
                          <Label htmlFor="new">Seguro Novo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="renewal" id="renewal" />
                          <Label htmlFor="renewal">Renovação</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Policy File Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="text-[#fa0008]" size={20} />
                <Label htmlFor="policy-file" className="text-lg font-semibold text-feijo-darkgray">
                  {isRenewalType ? "Anexar Apólice Atual" : "Anexar Apólice (opcional)"}
                </Label>
              </div>
              <Input
                id="policy-file"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {policyFile && (
                <p className="text-sm text-green-600">
                  Arquivo selecionado: {policyFile.name}
                </p>
              )}
            </div>
            
            <Separator className="my-4" />
            
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <User className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Informações Pessoais</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="document_number"
                  render={({ field }) => {
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const formatted = formatCpfCnpj(e.target.value);
                      field.onChange(formatted);
                    };
                    
                    return (
                      <FormItem>
                        <FormLabel>CPF*</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={handleChange} value={field.value || ''} />
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
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => {
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const formatted = formatPhone(e.target.value);
                      field.onChange(formatted);
                    };
                    
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Property Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Home className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Informações do Imóvel</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="residence_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Residência*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="house">Casa</SelectItem>
                          <SelectItem value="apartment">Apartamento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="construction_type"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Tipo de Construção*</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 p-0">
                              <Info className="h-4 w-4 text-[#fa0008]" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2 text-xs">
                              <div>
                                <h4 className="font-semibold mb-1 text-sm">1. Construção Superior</h4>
                                <ul className="list-disc pl-4 space-y-0.5">
                                  <li>Estrutura: Concreto armado ou alvenaria.</li>
                                  <li>Pisos: Lajes de concreto em todos os pavimentos.</li>
                                  <li>Cobertura: Material incombustível (ex: telha de barro, fibrocimento), com até 25% de material combustível permitido para iluminação.</li>
                                  <li>Forro: Laje ou material incombustível.</li>
                                  <li>Escadas: Material incombustível.</li>
                                  <li>Fiação elétrica: Embutida ou protegida adequadamente.</li>
                                </ul>
                                <p className="mt-1">Construções com essas características são consideradas de menor risco e, portanto, podem ter prêmios de seguro mais baixos.</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1 text-sm">2. Construção Sólida</h4>
                                <ul className="list-disc pl-4 space-y-0.5">
                                  <li>Paredes externas: Alvenaria (tijolos, cimento, pedra).</li>
                                  <li>Pisos: Madeira ou laje.</li>
                                  <li>Cobertura: Material incombustível, podendo ser sustentada por estrutura de madeira.</li>
                                  <li>Forro e escadas: Podem ser de qualquer material.</li>
                                  <li>Fiação elétrica: Embutida ou aparente.</li>
                                </ul>
                                <p className="mt-1">Embora seguras, essas construções podem ter um risco ligeiramente maior devido ao uso de madeira em alguns elementos.</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1 text-sm">3. Construção Mista</h4>
                                <ul className="list-disc pl-4 space-y-0.5">
                                  <li>Paredes externas: Até 25% de material combustível (ex: madeira).</li>
                                  <li>Estrutura: Pode incluir metal, madeira ou materiais pré-fabricados.</li>
                                  <li>Cobertura: Material incombustível, permitindo até 25% de material combustível.</li>
                                  <li>Forro, pisos e escadas: Podem ser de qualquer material.</li>
                                </ul>
                                <p className="mt-1">Essa categoria é comum em construções que combinam alvenaria e madeira, especialmente em áreas rurais.</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1 text-sm">4. Construção Inferior</h4>
                                <ul className="list-disc pl-4 space-y-0.5">
                                  <li>Paredes externas: Mais de 25% de material combustível (ex: madeira).</li>
                                  <li>Cobertura: Material combustível ou mais de 25% de material combustível.</li>
                                  <li>Estrutura, forro, pisos e escadas: Podem ser de qualquer material.</li>
                                </ul>
                                <p className="mt-1">Construções predominantemente de madeira ou materiais combustíveis se enquadram nessa categoria, sendo consideradas de maior risco pelas seguradoras.</p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="superior">Superior</SelectItem>
                          <SelectItem value="solid">Sólida</SelectItem>
                          <SelectItem value="mixed">Mista</SelectItem>
                          <SelectItem value="inferior">Inferior</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="occupation_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Ocupação*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="habitual">Habitual</SelectItem>
                          <SelectItem value="vacation">Veraneio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <MapPin className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Endereço do Imóvel</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="00000-000" 
                          {...field} 
                          onBlur={(e) => {
                            field.onBlur();
                            fetchAddressFromCep(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logradouro*</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, Avenida..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro*</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade*</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado*</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número*</FormLabel>
                      <FormControl>
                        <Input placeholder="Número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartamento, bloco, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Security Equipment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Shield className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Equipamentos de Segurança</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {securityEquipmentOptions.map((option) => (
                  <div className="flex items-center space-x-2" key={option.id}>
                    <Checkbox 
                      id={option.id} 
                      checked={selectedSecurityEquipment.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          handleSecurityEquipmentChange(checked, option.id);
                        }
                      }}
                    />
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Additional Data Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <FileText className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Dados Complementares</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {additionalDataOptions.map((option) => (
                  <div className="flex items-center space-x-2" key={option.id}>
                    <FormField
                      control={form.control}
                      name={`additional_data.${option.id as keyof typeof form.formState.defaultValues.additional_data}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">{option.label}</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Coverage Values Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Shield className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Coberturas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="insured_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Segurado</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00"
                          {...field}
                          onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="electrical_damage_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danos Elétricos</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00"
                          {...field}
                          onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="glass_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vidros</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00"
                          {...field}
                          onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="flooding_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alagamento</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00"
                          {...field}
                          onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pipe_leakage_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vazamentos de Tubulações</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00"
                          {...field}
                          onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="theft_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roubo/Furto</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00"
                          {...field}
                          onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="other_coverage_notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Outras Coberturas</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite aqui caso queira coberturas específicas para o seu imóvel" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Seller Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Users className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Atendimento</h3>
              </div>
              <FormField
                control={form.control}
                name="seller"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultor*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o consultor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Carlos Henrique">Carlos Henrique</SelectItem>
                        <SelectItem value="Felipe">Felipe</SelectItem>
                        <SelectItem value="Renan">Renan</SelectItem>
                        <SelectItem value="Renata">Renata</SelectItem>
                        <SelectItem value="Gabriel">Gabriel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-center pt-6">
              <Button 
                type="submit" 
                className="bg-feijo-red hover:bg-red-600 text-white px-8 py-6 text-lg rounded-md"
                disabled={isSubmitting || localIsSubmitting}
              >
                {(isSubmitting || localIsSubmitting) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Solicitar cotação"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HomeInsuranceQuoteForm;
