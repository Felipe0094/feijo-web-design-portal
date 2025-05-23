
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
import { Users, Plus, Trash2, User, CarFront, Home, FileText, Heart, MessageSquare, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { HealthInsuranceFormData, Dependent } from './types';
import { formatCpfCnpj, formatPhone } from "@/utils/formatters";



// Updated the formSchema to match the required fields in HealthInsuranceFormData
const formSchema = z.object({
  document_number: z.string().min(1, "CNPJ é obrigatório"),
  responsible_name: z.string().min(1, "Nome do responsável é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  insured_name: z.string().min(1, "Nome do segurado é obrigatório"),
  insured_cpf: z.string().min(1, "CPF do segurado é obrigatório"),
  insured_birth_date: z.string().min(1, "Data de nascimento do segurado é obrigatória"),
  municipality: z.string().min(1, "Município é obrigatório"),
  room_type: z.enum(["individual", "shared"]),
  has_copayment: z.enum(["yes", "no"]),
  notes: z.string().optional(),
  dependents: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Nome do dependente é obrigatório"),
      cpf: z.string().min(1, "CPF do dependente é obrigatório"),
      birth_date: z.string().min(1, "Data de nascimento do dependente é obrigatória"),
      age: z.number().optional(),
    })
  ),
  seller: z.enum(["Felipe", "Renan", "Renata", "Gabriel"]),
});

interface HealthInsuranceQuoteFormProps {
  onSuccess?: (data: HealthInsuranceFormData) => void;
  onFileChange?: (file: File | null) => void;
  isSubmitting?: boolean;
}

const HealthInsuranceQuoteForm = ({ onSuccess, onFileChange, isSubmitting = false }: HealthInsuranceQuoteFormProps) => {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_number: "",
      responsible_name: "",
      phone: "",
      email: "",
      insured_name: "",
      insured_cpf: "",
      insured_birth_date: "",
      municipality: "",
      room_type: "individual",
      has_copayment: "no",
      notes: "",
      dependents: [],
      seller: "Carlos Henrique",
    },
  });

  const addDependent = () => {
    const newId = uuidv4();
    const newDependent: Dependent = { 
      id: newId, 
      name: "", 
      cpf: "", 
      birth_date: "" 
    };
    setDependents((prevDependents) => [...prevDependents, newDependent]);
    form.setValue("dependents", [...dependents, newDependent]);
  };

  const removeDependent = (id: string) => {
    const updatedDependents = dependents.filter((dependent) => dependent.id !== id);
    setDependents(updatedDependents);
    form.setValue("dependents", updatedDependents);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (onFileChange) {
      onFileChange(selectedFile);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLocalIsSubmitting(true);
      if (!values.document_number || !values.responsible_name || !values.email || !values.phone || !values.insured_name || !values.insured_cpf || !values.insured_birth_date || !values.municipality) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        setLocalIsSubmitting(false);
        return;
      }
      
      // Convert the form data to match the required HealthInsuranceFormData type
      const formData: HealthInsuranceFormData = {
        document_number: values.document_number,
        responsible_name: values.responsible_name,
        phone: values.phone,
        email: values.email,
        insured_name: values.insured_name,
        insured_cpf: values.insured_cpf,
        insured_birth_date: values.insured_birth_date,
        municipality: values.municipality,
        room_type: values.room_type,
        has_copayment: values.has_copayment,
        dependents: values.dependents.map(dep => ({
          id: dep.id,
          name: dep.name,
          cpf: dep.cpf,
          birth_date: dep.birth_date,
          age: dep.age
        })),
        seller: values.seller,
      };
      
      // Add optional fields if they exist
      if (values.notes) {
        formData.notes = values.notes;
      }
      
      if (onSuccess) {
        onSuccess(formData);
      }
      
      form.reset();
      setDependents([]);
    } catch (error) {
      toast.error("Erro ao enviar cotação. Tente novamente.");
    } finally {
      setLocalIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company/Responsible Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <Users className="text-[#fa0008]" size={20} />
                Informações da Empresa/Responsável
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="responsible_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Responsável*</FormLabel>
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
                        <FormLabel>CNPJ*</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={handleChange} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
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
              </div>
            </div>
            
            {/* Insured Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <User className="text-[#fa0008]" size={20} />
                Informações do Segurado
              </h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="insured_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Segurado*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="insured_cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF do Segurado*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="insured_birth_date"
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
              </div>
            </div>
            
            {/* Plan Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <FileText className="text-[#fa0008]" size={20} />
                Opções do Plano
              </h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="municipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Município*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="room_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de Quarto</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3">
                            <RadioGroupItem value="individual" id="individual" className='peer h-5 w-5 border-2 border-red-500'/>
                            <FormLabel htmlFor="individual" className="font-normal">
                              Individual
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3">
                            <RadioGroupItem value="shared" id="shared" className='peer h-5 w-5 border-2 border-red-500'/>
                            <FormLabel htmlFor="shared" className="font-normal">
                              Compartilhado
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_copayment"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Coparticipação</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3">
                            <RadioGroupItem value="yes" id="yes" className='peer h-5 w-5 border-2 border-red-500'/>
                            <FormLabel htmlFor="yes" className="font-normal">
                              Sim
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3">
                            <RadioGroupItem value="no" id="no" className='peer h-5 w-5 border-2 border-red-500'/>
                            <FormLabel htmlFor="no" className="font-normal">
                              Não
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Dependents Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <Users className="text-[#fa0008]" size={20} />
                Informações dos Dependentes
              </h3>
              
              {dependents.map((dependent, index) => (
                <div key={dependent.id} className="space-y-2 border p-4 rounded">
                  <h4 className="text-md font-semibold">Dependente {index + 1}</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`dependents.${index}.name` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`dependents.${index}.cpf` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`dependents.${index}.birth_date` as const}
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
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDependent(dependent.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover
                  </Button>
                </div>
              ))}
              
              <Button type="button" variant="outline" onClick={addDependent}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Dependente
              </Button>
            </div>
            
            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-feijo-darkgray flex items-center gap-2">
                <MessageSquare className="text-[#fa0008]" size={20} />
                Observações
              </h3>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Adicionais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informações adicionais relevantes para a cotação..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Seller Selection - Moved to end of the form */}
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

export default HealthInsuranceQuoteForm;
