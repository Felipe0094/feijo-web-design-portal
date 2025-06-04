import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { civilWorksInsuranceFormSchema, CivilWorksInsuranceFormSchemaType } from './schema';
import { submitCivilWorksInsuranceQuote } from './submitQuote';
import { fetchAddressFromCEP } from './fetchAddressFromCEP';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon, Loader2, InfoIcon, User, Building, FileText, Users, MapPin, Wrench, Shield } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { CurrencyInput } from '@/components/ui/currency-input';
import { formatCpfCnpj, formatPhone } from "@/utils/formatters";

// Coverage information tooltips
const coverageTooltips = {
  basic: "Garante indenizações por danos corporais e materiais causados a terceiros em decorrência direta da execução da obra civil descrita na apólice. Abrange acidentes dentro dos limites do canteiro de obras e situações diretamente ligadas à atividade principal.",
  property_owner_material_damages: "Cobre danos materiais causados ao imóvel do proprietário (contratante da obra), desde que esses danos sejam provocados pela execução dos serviços especificados na apólice e não por má conservação ou causas anteriores.",
  cross_liability: "Garante a responsabilidade civil entre os diversos empreiteiros e subempreiteiros envolvidos na obra. Ou seja, cobre danos corporais ou materiais causados entre os próprios prestadores de serviço durante a execução dos trabalhos.",
  employer_liability: "Cobre a responsabilidade do segurado por acidentes sofridos por seus empregados registrados, durante o exercício das atividades na obra, mesmo que não haja culpa direta. Abrange também custos com defesa e indenizações judiciais.",
  moral_damages: "Estende a cobertura para incluir indenizações por danos morais, mesmo que não haja dano corporal ou material. Trata-se de compensações por abalos de natureza psíquica, emocional ou à honra.",
  project_error: "Garante cobertura para danos causados por erros ou omissões no projeto técnico que resultem em responsabilidade civil do segurado. Importante: essa cobertura exige contratação específica e pode ter limites e franquias diferenciados.",
  water_leakage: "Cobre danos a terceiros provocados por eventos como infiltrações acidentais, descarga de água, rompimento de tubulações ou sistemas hidráulicos, durante a execução da obra.",
  pollution: "Cobre danos a terceiros causados por eventos súbitos e acidentais de poluição, contaminação ou vazamento (inclusive de substâncias perigosas). Não cobre eventos graduais ou resultantes de negligência continuada.",
  resulting_moral_damages: "Complementa a cobertura de RC básica ao garantir danos morais causados em conjunto com danos corporais ou materiais. Exemplo: uma pessoa lesionada por acidente na obra e que sofra abalo emocional decorrente disso."
};

// Currency formatter
const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

// Function to format currency input
const formatCurrency = (value: string): string => {
  if (!value) return '';
  
  // Remove non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Convert to number and divide by 100 to get the correct decimal value
  const numberValue = Number(numericValue) / 100;
  
  return formatter.format(numberValue);
};

// Function to parse currency input back to number
const parseCurrency = (value: string): number => {
  if (!value) return 0;
  
  // Remove non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Convert to number and divide by 100 to get the correct decimal value
  return Number(numericValue) / 100;
};

interface CivilWorksInsuranceQuoteFormProps {
  onSuccess?: (data: CivilWorksInsuranceFormSchemaType) => void;
  isSubmitting?: boolean;
}

const CivilWorksInsuranceQuoteForm: React.FC<CivilWorksInsuranceQuoteFormProps> = ({ onSuccess, isSubmitting: externalIsSubmitting }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const { toast } = useToast();

  const form = useForm<CivilWorksInsuranceFormSchemaType>({
    resolver: zodResolver(civilWorksInsuranceFormSchema),
    defaultValues: {
      full_name: '',
      document_number: '',
      phone: '',
      email: '',
      has_previous_insurance: false,
      has_previous_claims: false,
      construction_type: 'Residencial',
      service_type: 'Obra nova',
      zip_code: '',
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      number: '',
      complement: '',
      services_description: '',
      start_date: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 12)),
      upper_floors_count: 0,
      basement_count: 0,
      has_grounding_service: false,
      structure_types: {
        wood: false,
        concrete: true,
        metal: false,
        other: false,
      },
      demolition_type: 'none',
      has_tie_rods: false,
      has_adjacent_buildings: false,
      has_water_table_lowering: false,
      has_excavation: false,
      has_terrain_containment: false,
      has_structural_reinforcement: false,
      contractors_count: 1,
      coverage_options: {
        basic: 0,
        property_owner_material_damages: 0,
        cross_liability: 0,
        employer_liability: 0,
        moral_damages: 0,
        project_error: 0,
        water_leakage: 0,
        pollution: 0,
        resulting_moral_damages: 0,
      },
      
    },
  });

  const handleCEPChange = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    if (cep.length === 8 || cep.length === 9) {
      setIsLoadingCEP(true);
      const address = await fetchAddressFromCEP(cep);
      setIsLoadingCEP(false);
      
      if (address) {
        form.setValue('street', address.logradouro);
        form.setValue('neighborhood', address.bairro);
        form.setValue('city', address.localidade);
        form.setValue('state', address.uf);
      }
    }
  };

  const handleFormSubmit = async (values: CivilWorksInsuranceFormSchemaType) => {
    if (isSubmitting) return;
    
    console.log("Form submit event triggered");
    console.log("Form values before submission:", values);
    console.log("Form errors:", form.formState.errors);

    try {
      setIsSubmitting(true);
      const result = await submitCivilWorksInsuranceQuote(values);
      
      if (result.success) {
        onSuccess?.(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao enviar cotação. Por favor, tente novamente."
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao enviar cotação. Por favor, tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <User className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Informações do Contratante</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="CPF ou CNPJ" 
                          {...field}
                          onChange={(e) => field.onChange(formatCpfCnpj(e.target.value))}
                        />
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
                        <Input 
                          placeholder="(XX) XXXXX-XXXX" 
                          {...field}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <FileText className="text-[#fa0008]" size={20} />
                  <h3 className="text-lg font-semibold text-feijo-darkgray">Histórico</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="has_previous_insurance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Nos últimos anos o segurado contratou algum seguro de Responsabilidade Civil?
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Risk Object Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Building className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Objeto de Risco</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="construction_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Obra*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de obra" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Residencial">Residencial</SelectItem>
                          <SelectItem value="Comercial">Comercial</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="service_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo do Serviço da Obra*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Obra nova">Obra nova</SelectItem>
                          <SelectItem value="Ampliação">Ampliação</SelectItem>
                          <SelectItem value="Reforma">Reforma</SelectItem>
                          <SelectItem value="Instalação/montagem/desmontagem">Instalação, montagem e desmontagem</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <MapPin className="text-[#fa0008]" size={20} />
                  <h3 className="text-lg font-semibold text-feijo-darkgray">Endereço da Obra</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP*</FormLabel>
                        <FormControl>
                          <Input placeholder="00000-000" {...field} />
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
                          <Input placeholder="Rua, Avenida, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número*</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                        <FormLabel>UF*</FormLabel>
                        <FormControl>
                          <Input placeholder="UF" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Construction Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Wrench className="text-[#fa0008]" size={20} />
                  <h3 className="text-lg font-semibold text-feijo-darkgray">Detalhes da Construção</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="services_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição dos Serviços*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva detalhadamente os serviços que serão realizados na obra"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="upper_floors_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de Pavimentos*</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="basement_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de Subsolos*</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início*</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Término*</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Coverage Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Shield className="text-[#fa0008]" size={20} />
                <h3 className="text-lg font-semibold text-feijo-darkgray">Coberturas</h3>
              </div>
              
              <p className="text-sm text-feijo-gray">Informe os valores para cada cobertura desejada:</p>
              
              <div className="space-y-4">
                <TooltipProvider>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="coverage_options.basic"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Cobertura Básica*</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-feijo-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{coverageTooltips.basic}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="R$ 0,00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverage_options.property_owner_material_damages"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Danos Materiais ao Proprietário</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-feijo-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{coverageTooltips.property_owner_material_damages}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="R$ 0,00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverage_options.cross_liability"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Responsabilidade Cruzada</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-feijo-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{coverageTooltips.cross_liability}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="R$ 0,00"
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
                          <div className="flex items-center gap-2">
                            <FormLabel>Responsabilidade Patronal</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-feijo-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{coverageTooltips.employer_liability}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="R$ 0,00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverage_options.moral_damages"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Danos Morais</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-feijo-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{coverageTooltips.moral_damages}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="R$ 0,00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverage_options.project_error"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Erro de Projeto</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-feijo-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{coverageTooltips.project_error}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="R$ 0,00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverage_options.water_leakage"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Vazamento de Água</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-feijo-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{coverageTooltips.water_leakage}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="R$ 0,00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverage_options.pollution"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Poluição</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-feijo-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{coverageTooltips.pollution}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="R$ 0,00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverage_options.resulting_moral_damages"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Danos Morais Decorrentes</FormLabel>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-feijo-gray" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{coverageTooltips.resulting_moral_damages}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="R$ 0,00"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TooltipProvider>
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
                    <FormLabel>Consultor/Corretor*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o consultor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Carlos Henrique">Carlos Henrique</SelectItem>
                        <SelectItem value="Felipe">Felipe</SelectItem>
                        <SelectItem value="Gabriel">Gabriel</SelectItem>
                        <SelectItem value="Renan">Renan</SelectItem>
                        <SelectItem value="Renata">Renata</SelectItem>
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
                className="w-full"
                disabled={isSubmitting || externalIsSubmitting}
              >
                {isSubmitting || externalIsSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Cotação"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CivilWorksInsuranceQuoteForm;