import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, FileText, Heart, Clipboard, Loader2 } from 'lucide-react';
import { LifeInsuranceFormData } from './types';
import { formatCpfCnpj, formatPhone } from "@/utils/formatters";

const formSchema = z.object({
  insurance_type: z.enum(["new", "renewal"]),
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  document_number: z.string().min(1, "CPF/CNPJ é obrigatório"),
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  weight: z.string().min(1, "Peso é obrigatório"),
  height: z.string().min(1, "Altura é obrigatória"),
  monthly_income: z.string().min(1, "Renda mensal é obrigatória"),
  smoker: z.boolean(),
  practices_sports: z.boolean(),
  sports_description: z.string().optional(),
  retirement_status: z.enum(["none", "time_age", "disability"]),
  standard_death_coverage: z.string().optional(),
  accidental_death_coverage: z.string().optional(),
  permanent_disability_coverage: z.string().optional(),
  seller: z.enum(["Carlos Henrique", "Felipe", "Renan", "Renata", "Gabriel"]),
});

interface LifeInsuranceQuoteFormProps {
  onSuccess?: (data: LifeInsuranceFormData, policyFile?: File) => void;
  isSubmitting?: boolean;
}

const LifeInsuranceQuoteForm = ({ onSuccess, isSubmitting = false }: LifeInsuranceQuoteFormProps) => {
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insurance_type: "new",
      full_name: "",
      document_number: "",
      birth_date: "",
      phone: "",
      email: "",
      weight: "",
      height: "",
      monthly_income: "",
      smoker: false,
      practices_sports: false,
      sports_description: "",
      retirement_status: "none",
      standard_death_coverage: "",
      accidental_death_coverage: "",
      permanent_disability_coverage: "",
      seller: "Felipe",
    },
  });
  
  const watchInsuranceType = form.watch("insurance_type");
  const watchPracticesSports = form.watch("practices_sports");
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setPolicyFile(selectedFile);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLocalIsSubmitting(true);
      
      // Convert form data to match the LifeInsuranceFormData type
      const formData: LifeInsuranceFormData = {
        insurance_type: values.insurance_type,
        full_name: values.full_name,
        document_number: values.document_number,
        birth_date: values.birth_date,
        phone: values.phone,
        email: values.email,
        weight: parseFloat(values.weight),
        height: parseFloat(values.height),
        monthly_income: parseFloat(values.monthly_income.replace(/[^\d.-]/g, '')),
        smoker: values.smoker,
        practices_sports: values.practices_sports,
        sports_description: values.sports_description,
        retirement_status: values.retirement_status,
        standard_death_coverage: values.standard_death_coverage ? parseFloat(values.standard_death_coverage.replace(/[^\d.-]/g, '') || '0') : null,
        accidental_death_coverage: values.accidental_death_coverage ? parseFloat(values.accidental_death_coverage.replace(/[^\d.-]/g, '') || '0') : null,
        permanent_disability_coverage: values.permanent_disability_coverage ? parseFloat(values.permanent_disability_coverage.replace(/[^\d.-]/g, '') || '0') : null,
        seller: values.seller,
      };
      
      if (onSuccess) {
        onSuccess(formData, policyFile || undefined);
      }
      
      toast.success("Cotação enviada com sucesso!");
      form.reset();
      setPolicyFile(null);
    } catch (error) {
      toast.error("Erro ao enviar cotação. Tente novamente.");
      console.error("Error submitting form:", error);
    } finally {
      setLocalIsSubmitting(false);
    }
  }
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Insurance Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <FileText className="text-[#fa0008]" size={20} />
                Tipo de Seguro
              </h3>
              
              <FormField
                control={form.control}
                name="insurance_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3">
                          <RadioGroupItem value="new" id="new" className='peer h-5 w-5 border-2 border-red-500'/>
                          <FormLabel htmlFor="new" className="font-normal">
                            Seguro Novo
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                          <RadioGroupItem value="renewal" id="renewal" className='peer h-5 w-5 border-2 border-red-500'/>
                          <FormLabel htmlFor="renewal" className="font-normal">
                            Renovação
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {watchInsuranceType === "renewal" && (
                <div className="mt-4">
                  <Label htmlFor="policyFile" className="mb-2 block">Apólice Atual</Label>
                  <Input 
                    id="policyFile" 
                    type="file" 
                    onChange={handleFileChange} 
                    className="cursor-pointer"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Formatos aceitos: PDF, Word, JPEG, PNG
                  </p>
                </div>
              )}
            </div>
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <User className="text-[#fa0008]" size={20} />
                Informações Pessoais
              </h3>
              
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
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="birth_date"
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
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Health Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <Heart className="text-[#fa0008]" size={20} />
                Informações de Saúde
              </h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg)*</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura (cm)*</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="monthly_income"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Renda Mensal*</FormLabel>
                      <FormControl>
                        <Input 
                          {...rest} 
                          value={value || ''}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^\d]/g, '');
                            const numberValue = rawValue ? parseInt(rawValue) / 100 : '';
                            onChange(numberValue ? numberValue.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }) : '');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="smoker"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Fumante?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === 'true')}
                        defaultValue={field.value ? 'true' : 'false'}
                        className="flex space-x-6"
                      >
                        <FormItem className="flex items-center space-x-3">
                          <RadioGroupItem value="true" id="smoker-yes" className='peer h-5 w-5 border-2 border-red-500'/>
                          <FormLabel htmlFor="smoker-yes" className="font-normal">
                            Sim
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                          <RadioGroupItem value="false" id="smoker-no" className='peer h-5 w-5 border-2 border-red-500'/>
                          <FormLabel htmlFor="smoker-no" className="font-normal">
                            Não
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="practices_sports"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Pratica Esportes?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === 'true')}
                          defaultValue={field.value ? 'true' : 'false'}
                          className="flex space-x-6"
                        >
                          <FormItem className="flex items-center space-x-3">
                            <RadioGroupItem value="true" id="sports-yes" className='peer h-5 w-5 border-2 border-red-500'/>
                            <FormLabel htmlFor="sports-yes" className="font-normal">
                              Sim
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3">
                            <RadioGroupItem value="false" id="sports-no" className='peer h-5 w-5 border-2 border-red-500'/>
                            <FormLabel htmlFor="sports-no" className="font-normal">
                              Não
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchPracticesSports && (
                  <FormField
                    control={form.control}
                    name="sports_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quais esportes?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva os esportes que você pratica..." 
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <FormField
                control={form.control}
                name="retirement_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aposentadoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Não aposentado</SelectItem>
                        <SelectItem value="time_age">Por tempo/idade</SelectItem>
                        <SelectItem value="disability">Por invalidez</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Coverage Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <Clipboard className="text-[#fa0008]" size={20} />
                Cobertura
              </h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="standard_death_coverage"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Morte Padrão</FormLabel>
                      <FormControl>
                        <Input 
                          {...rest} 
                          value={value || ''}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^\d]/g, '');
                            const numberValue = rawValue ? parseInt(rawValue) / 100 : '';
                            onChange(numberValue ? numberValue.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }) : '');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accidental_death_coverage"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Morte Acidental</FormLabel>
                      <FormControl>
                        <Input 
                          {...rest} 
                          value={value || ''}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^\d]/g, '');
                            const numberValue = rawValue ? parseInt(rawValue) / 100 : '';
                            onChange(numberValue ? numberValue.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }) : '');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permanent_disability_coverage"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Invalidez Permanente (IPA)</FormLabel>
                      <FormControl>
                        <Input 
                          {...rest} 
                          value={value || ''}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^\d]/g, '');
                            const numberValue = rawValue ? parseInt(rawValue) / 100 : '';
                            onChange(numberValue ? numberValue.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }) : '');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Consultant/Seller Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <User className="text-[#fa0008]" size={20} />
                Consultor
              </h3>
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

export default LifeInsuranceQuoteForm;
