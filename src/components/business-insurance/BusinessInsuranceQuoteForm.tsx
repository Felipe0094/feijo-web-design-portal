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
import { Building2, User, MapPin, FileText, Shield, Users, Loader2, Phone, Mail, Building, AlertTriangle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCnpj, formatPhone } from "@/utils/formatters";
import { sendEmail } from "@/lib/email-service";

// Form schema with Zod validation
const formSchema = z.object({
  insurance_type: z.enum(["new", "renewal"]),
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  company_name: z.string().min(1, "Nome da empresa é obrigatório"),
  
  zip_code: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Logradouro é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  
  floor: z.enum(["ground", "first", "second_plus"]),
  construction_year: z.string()
    .min(4, "O ano deve ter 4 dígitos")
    .max(4, "O ano deve ter 4 dígitos")
    .regex(/^\d{4}$/, "Digite um ano válido com 4 dígitos"),
  construction_type: z.enum(["superior", "solid", "mixed", "inferior"]),
  location_type: z.enum(["airport", "market", "commercial_condo", "mall", "supermarket"]),
  
  security_equipment: z.array(z.string()).optional(),
  fire_equipment: z.array(z.string()).optional(),
  
  main_activity: z.string().min(1, "Atividade principal é obrigatória"),
  
  additional_info: z.object({
    is_warehouse: z.boolean().default(false),
    is_next_to_vacant: z.boolean().default(false),
    is_historical: z.boolean().default(false),
    has_metal_structure: z.boolean().default(false),
    has_atm: z.boolean().default(false),
    has_isopanel: z.boolean().default(false),
    is_under_construction: z.boolean().default(false),
  }).optional(),
  
  coverage_options: z.object({
    basic: z.string().optional(),
    electrical_damage: z.string().optional(),
    glass: z.string().optional(),
    theft: z.string().optional(),
    equipment: z.string().optional(),
    vehicle_impact: z.string().optional(),
    rent: z.string().optional(),
    employer_liability: z.string().optional(),
    other_coverage_notes: z.string().optional(),
  }),
  
  seller: z.enum(["Carlos Henrique", "Felipe", "Renan", "Renata", "Gabriel"]),
});

// Security equipment options
const securityEquipmentOptions = [
  { id: "local_alarm", label: "Alarme Local" },
  { id: "cctv", label: "Circuito Fechado de TV" },
  { id: "security_24h", label: "Vigilância 24h" },
  { id: "tetra_lock", label: "Grade e fechadura Tetra" },
  { id: "infrared_sensor", label: "Sensor infravermelho" },
  { id: "monitored_alarm", label: "Alarme monitorado" },
];

// Fire equipment options
const fireEquipmentOptions = [
  { id: "extinguisher", label: "Extintor" },
  { id: "hydrant", label: "Hidrante" },
  { id: "sprinkler", label: "Sprinkler" },
  { id: "smoke_detector", label: "Detector de fumaça" },
  { id: "fire_brigade", label: "Brigada de Incêndio" },
];

// Additional info options
const additionalInfoOptions = [
  { id: "is_warehouse", label: "Local utilizado exclusivamente para depósito de materiais" },
  { id: "is_next_to_vacant", label: "Imóvel faz divisa com terreno baldio" },
  { id: "is_historical", label: "Imóvel tombado pelo patrimônio histórico" },
  { id: "has_metal_structure", label: "Imóvel possui telhado e/ou estrutura de metal" },
  { id: "has_atm", label: "Imóvel possui caixas eletrônicos em suas dependências" },
  { id: "has_isopanel", label: "Imóvel possui isopainel em sua construção" },
  { id: "is_under_construction", label: "Imóvel em construção ou reforma" },
];

// Construction type descriptions
const constructionTypeDescriptions = {
  superior: {
    title: "Superior (Classe 1)",
    description: "Estrutura: Concreto armado ou aço revestido por concreto ou alvenaria.\n\n" +
      "Paredes externas: Material incombustível, permitindo até 25% de materiais combustíveis (como PVC ou poliéster).\n\n" +
      "Pisos e forros: Lajes de concreto; forros incombustíveis ou lajes.\n\n" +
      "Cobertura: Material incombustível, com até 25% de materiais combustíveis para iluminação.\n\n" +
      "Instalações elétricas: Embutidas ou aparentes, desde que protegidas adequadamente."
  },
  solid: {
    title: "Sólida (Classe 2)",
    description: "Paredes externas: Material incombustível, sem revestimentos combustíveis.\n\n" +
      "Pisos: Madeira ou laje.\n\n" +
      "Cobertura: Material incombustível, permitindo até 25% de materiais combustíveis.\n\n" +
      "Outros elementos: Colunas, travejamento, forros e escadas podem ser de qualquer material."
  },
  mixed: {
    title: "Mista (Classe 3)",
    description: "Paredes externas: Até 25% de material combustível.\n\n" +
      "Demais elementos: Pisos, colunas, travejamento, forros, escadas e cobertura podem ser de qualquer material."
  },
  inferior: {
    title: "Inferior (Classe 4)",
    description: "Paredes externas: Mais de 25% de material combustível.\n\n" +
      "Demais elementos: Pisos, colunas, travejamento, forros, escadas e cobertura podem ser de qualquer material, inclusive combustíveis."
  }
};

interface BusinessInsuranceQuoteFormProps {
  onSuccess?: (data: any) => void;
  onFileChange?: (file: File | null) => void;
  isSubmitting?: boolean;
}

const BusinessInsuranceQuoteForm = ({
  onSuccess,
  onFileChange,
  isSubmitting = false
}: BusinessInsuranceQuoteFormProps) => {
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [selectedSecurityEquipment, setSelectedSecurityEquipment] = useState<string[]>([]);
  const [selectedFireEquipment, setSelectedFireEquipment] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insurance_type: "new",
      floor: "ground",
      construction_type: "solid",
      location_type: "commercial_condo",
      security_equipment: [],
      fire_equipment: [],
      additional_info: {
        is_warehouse: false,
        is_next_to_vacant: false,
        is_historical: false,
        has_metal_structure: false,
        has_atm: false,
        has_isopanel: false,
        is_under_construction: false,
      },
      coverage_options: {
        basic: "",
        electrical_damage: "",
        glass: "",
        theft: "",
        equipment: "",
        vehicle_impact: "",
        rent: "",
        employer_liability: "",
        other_coverage_notes: "",
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

  // Handle fire equipment checkbox changes
  const handleFireEquipmentChange = (checked: boolean, value: string) => {
    if (checked) {
      setSelectedFireEquipment(prev => [...prev, value]);
    } else {
      setSelectedFireEquipment(prev => prev.filter(item => item !== value));
    }
  };

  // Format currency input
  const formatCurrency = (value: string) => {
    if (!value) return '';
    
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d)(\d{2})$/, '$1,$2');
    value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');
    
    return `R$ ${value}`;
  };

  // Handle CNPJ search
  const handleCnpjSearch = async (cnpj: string) => {
    try {
      // Here you would implement the CNPJ search API call
      // For example, using the Receita Federal API or a third-party service
      const response = await fetch(`https://api.example.com/cnpj/${cnpj}`);
      const data = await response.json();
      
      if (data.company_name) {
        form.setValue('company_name', data.company_name);
      }
    } catch (error) {
      console.error('Error searching CNPJ:', error);
      toast.error('Erro ao buscar CNPJ. Tente novamente.');
    }
  };

  // Handle CEP search
  const handleCepSearch = async (cep: string) => {
    try {
      // Remove any non-numeric characters from CEP
      const cleanCep = cep.replace(/\D/g, '');
      
      // Only proceed if we have exactly 8 digits
      if (cleanCep.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        form.setValue('street', data.logradouro);
        form.setValue('neighborhood', data.bairro);
        form.setValue('city', data.localidade);
        form.setValue('state', data.uf);
      }
    } catch (error) {
      console.error('Error searching CEP:', error);
      toast.error('Erro ao buscar CEP. Tente novamente.');
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLocalIsSubmitting(true);
      
      if (!values.full_name || !values.phone || !values.email || !values.cnpj) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        setLocalIsSubmitting(false);
        return;
      }

      // Format currency values to numeric
      const processedData = {
        insurance_type: values.insurance_type,
        full_name: values.full_name,
        phone: values.phone,
        email: values.email,
        cnpj: values.cnpj,
        company_name: values.company_name,
        zip_code: values.zip_code,
        street: values.street,
        number: values.number,
        complement: values.complement || null,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        construction_type: values.construction_type,
        document_number: values.cnpj,
        main_activity: values.main_activity,
        seller: values.seller,
        security_equipment: selectedSecurityEquipment,
        fire_equipment: selectedFireEquipment,
        coverage_options: {
          basic: values.coverage_options.basic ? parseFloat(values.coverage_options.basic.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
          electrical_damage: values.coverage_options.electrical_damage ? parseFloat(values.coverage_options.electrical_damage.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
          glass: values.coverage_options.glass ? parseFloat(values.coverage_options.glass.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
          theft: values.coverage_options.theft ? parseFloat(values.coverage_options.theft.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
          equipment: values.coverage_options.equipment ? parseFloat(values.coverage_options.equipment.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
          vehicle_impact: values.coverage_options.vehicle_impact ? parseFloat(values.coverage_options.vehicle_impact.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
          rent: values.coverage_options.rent ? parseFloat(values.coverage_options.rent.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
          employer_liability: values.coverage_options.employer_liability ? parseFloat(values.coverage_options.employer_liability.replace(/[^\d.,]/g, '').replace(',', '.')) : null,
          other_coverage_notes: values.coverage_options.other_coverage_notes || null,
        },
        additional_info: {
          is_warehouse: values.additional_info?.is_warehouse || false,
          is_next_to_vacant: values.additional_info?.is_next_to_vacant || false,
          is_historical: values.additional_info?.is_historical || false,
          has_metal_structure: values.additional_info?.has_metal_structure || false,
          has_atm: values.additional_info?.has_atm || false,
          has_isopanel: values.additional_info?.has_isopanel || false,
          is_under_construction: values.additional_info?.is_under_construction || false,
        },
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      // Send email notification
      console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
      
      const emailData = {
        quoteData: processedData,
        quoteType: 'business-insurance',
        policyFile: policyFile ? {
          name: policyFile.name,
          size: policyFile.size,
          type: policyFile.type
        } : undefined
      };

      const emailResult = await sendEmail(emailData);
      
      if (!emailResult.success) {
        console.error("Erro ao enviar email:", emailResult.error);
        toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
        throw new Error(emailResult.error);
      }

      console.log("Email enviado com sucesso:", emailResult);
      
      if (onSuccess) {
        onSuccess(processedData);
        form.reset();
        setPolicyFile(null);
        setSelectedSecurityEquipment([]);
        setSelectedFireEquipment([]);
      }

      toast.success("Cotação enviada com sucesso!", {
        description: "Nossa equipe entrará em contato em breve."
      });
      
    } catch (error) {
      toast.error("Erro ao enviar cotação. Tente novamente.");
      console.error(error);
    } finally {
      setLocalIsSubmitting(false);
    }
  }

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
            {isRenewalType && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#fa0008]" size={20} />
                  <FormLabel className="text-lg font-semibold text-feijo-darkgray">Apólice Atual</FormLabel>
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                </div>
              </div>
            )}
            
            <Separator className="my-4" />
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <User className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Informações de Contato</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome para Contato*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
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
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => {
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const formatted = formatCnpj(e.target.value);
                      field.onChange(formatted);
                    };
                    
                    return (
                      <FormItem>
                        <FormLabel>CNPJ*</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            onChange={handleChange}
                            value={field.value || ''}
                            placeholder="00.000.000/0000-00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome da Empresa*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <MapPin className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Endereço</h3>
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
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            const formattedValue = value
                              .replace(/^(\d{5})(\d)/, '$1-$2')
                              .replace(/[^\d-]/, '')
                              .slice(0, 9);
                            
                            field.onChange(formattedValue);
                            
                            // Call handleCepSearch when we have 8 digits
                            if (value.length === 8) {
                              handleCepSearch(value);
                            }
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
                        <Input placeholder="Rua/Avenida" {...field} />
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
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Complemento" {...field} />
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
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Property Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Building2 className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Informações do Imóvel</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pavimento*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o pavimento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ground">Térreo</SelectItem>
                          <SelectItem value="first">Primeiro andar</SelectItem>
                          <SelectItem value="second_plus">Segundo andar em diante</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="construction_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano da Construção*</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="AAAA"
                          maxLength={4}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
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
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="w-[400px] p-3">
                              <div className="space-y-3">
                                {Object.entries(constructionTypeDescriptions).map(([key, value]) => (
                                  <div key={key} className="space-y-1">
                                    <h4 className="font-medium text-xs">{value.title}</h4>
                                    <p className="text-xs whitespace-pre-line leading-relaxed">{value.description}</p>
                                    {key !== 'inferior' && <Separator className="my-1" />}
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                  name="location_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a localização" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="airport">Aeroporto</SelectItem>
                          <SelectItem value="market">Ceasa/Mercado</SelectItem>
                          <SelectItem value="commercial_condo">Condomínio Comercial</SelectItem>
                          <SelectItem value="mall">Shopping</SelectItem>
                          <SelectItem value="supermarket">Supermercado</SelectItem>
                        </SelectContent>
                      </Select>
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
            
            {/* Fire Equipment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <AlertTriangle className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Equipamentos de Incêndio</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {fireEquipmentOptions.map((option) => (
                  <div className="flex items-center space-x-2" key={option.id}>
                    <Checkbox 
                      id={option.id} 
                      checked={selectedFireEquipment.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          handleFireEquipmentChange(checked, option.id);
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
            
            {/* Main Activity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Building className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Atividade Principal</h3>
              </div>
              <FormField
                control={form.control}
                name="main_activity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Atividade da Empresa*</FormLabel>
                    <FormControl>
                      <Input placeholder="Descreva a atividade principal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator className="my-4" />
            
            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <FileText className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Informações Complementares</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {additionalInfoOptions.map((option) => (
                  <div className="flex items-center space-x-2" key={option.id}>
                    <FormField
                      control={form.control}
                      name={`additional_info.${option.id as keyof typeof form.formState.defaultValues.additional_info}`}
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
            
            {/* Coverage Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Shield className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Coberturas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="coverage_options.basic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Básica</FormLabel>
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
                  name="coverage_options.electrical_damage"
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
                  name="coverage_options.glass"
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
                  name="coverage_options.theft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roubo de bens</FormLabel>
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
                  name="coverage_options.equipment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipamentos</FormLabel>
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
                  name="coverage_options.vehicle_impact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impacto de veículos</FormLabel>
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
                  name="coverage_options.rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aluguel</FormLabel>
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
                  name="coverage_options.employer_liability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsabilidade Civil do Empregador</FormLabel>
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
                  name="coverage_options.other_coverage_notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Outras coberturas</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite aqui caso queira coberturas específicas" 
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
            
            <Separator className="my-4" />
            
            {/* Consultor Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Users className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Consultor</h3>
              </div>
              <FormField
                control={form.control}
                name="seller"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecione o Consultor*</FormLabel>
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
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting || localIsSubmitting}
                className="bg-[#fa0008] hover:bg-[#d40006] px-8 py-6 text-lg"
              >
                {(isSubmitting || localIsSubmitting) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Cotação'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BusinessInsuranceQuoteForm;
