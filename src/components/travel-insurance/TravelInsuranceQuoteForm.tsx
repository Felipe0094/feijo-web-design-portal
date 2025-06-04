import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Calendar as CalendarIcon, FileText, Info, Plane, Users, Loader2 } from "lucide-react";
import { submitTravelQuote } from "./submitQuote";
import { toast } from "sonner";
import { TravelInsuranceFormData } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCpfCnpj, formatPhone } from "@/utils/formatters";

// Define the form schema with validation
const formSchema = z.object({
  fullName: z.string().min(2, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
  email: z.string().email("Email inválido"),
  tripType: z.enum(["national", "international"]),
  destination: z.string().min(1, "Destino é obrigatório"),
  purpose: z.enum(["business", "leisure"]),
  departureDate: z.string(),
  returnDate: z.string(),
  motorcycleUse: z.boolean(),
  passengers0to64: z.coerce.number().min(0),
  passengers65to70: z.coerce.number().min(0),
  passengers71to85: z.coerce.number().min(0),
  seller: z.string().min(1, "Vendedor/consultor é obrigatório"),
}).refine(data => {
  const departure = new Date(data.departureDate);
  const returnDate = new Date(data.returnDate);
  return returnDate >= departure;
}, {
  message: "A data de retorno deve ser igual ou posterior à data de saída",
  path: ["returnDate"],
});

const destinations = [
  "Brasil",
  "África",
  "América Central",
  "América do Norte",
  "América do Sul",
  "Ásia",
  "Europa",
  "Oceania",
  "Multidestino com Europa",
  "Multidestino sem Europa"
];

// Updated list of consultants as requested
const consultants = [
  "Felipe",
  "Gabriel", 
  "Renan", 
  "Renata"
];

interface TravelInsuranceQuoteFormProps {
  onSuccess?: (data: TravelInsuranceFormData) => void;
  onFileChange?: (file: File | null) => void;
  isSubmitting?: boolean;
}

const TravelInsuranceQuoteForm = ({ onSuccess, onFileChange, isSubmitting }: TravelInsuranceQuoteFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      cpf: "",
      phone: "",
      email: "",
      tripType: "international",
      destination: "",
      purpose: "leisure",
      departureDate: "",
      returnDate: "",
      motorcycleUse: false,
      passengers0to64: 0,
      passengers65to70: 0,
      passengers71to85: 0,
      seller: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    
    // Cast form values to TravelInsuranceFormData to match the required type
    const formData: TravelInsuranceFormData = {
      fullName: values.fullName,
      cpf: values.cpf,
      phone: values.phone,
      email: values.email,
      tripType: values.tripType,
      destination: values.destination,
      purpose: values.purpose,
      departureDate: values.departureDate,
      returnDate: values.returnDate,
      motorcycleUse: values.motorcycleUse,
      passengers0to64: values.passengers0to64,
      passengers65to70: values.passengers65to70,
      passengers71to85: values.passengers71to85,
      seller: values.seller
    };
    
    if (onSuccess) {
      onSuccess(formData);
    } else {
      toast.promise(
        submitTravelQuote(formData),
        {
          loading: 'Enviando cotação...',
          success: 'Cotação enviada com sucesso!',
          error: 'Erro ao enviar cotação. Tente novamente.'
        }
      );
    }
  };

  return (
    <Card className="w-full bg-white border-0 shadow-md">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-feijo-darkgray flex items-center gap-2">
            <FileText className="text-feijo-red" size={24} />
            Formulário para Cotação
          </h2>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Info className="text-feijo-red" size={20} />
                <h3 className="text-lg font-medium text-feijo-darkgray">Informações Pessoais</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000.000.000-00" 
                          {...field}
                          onChange={(e) => field.onChange(formatCpfCnpj(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Digite seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Trip Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Plane className="text-feijo-red" size={20} />
                <h3 className="text-lg font-medium text-feijo-darkgray">Detalhes da Viagem</h3>
              </div>
              
              <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Viagem</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="national" id="national" />
                          <label htmlFor="national" className="text-sm">Nacional</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="international" id="international" />
                          <label htmlFor="international" className="text-sm">Internacional</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o destino" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {destinations.map((destination) => (
                            <SelectItem key={destination} value={destination}>
                              {destination}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Finalidade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a finalidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="business">Negócios</SelectItem>
                          <SelectItem value="leisure">Lazer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Saída</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="returnDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Retorno</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            disabled={(date) => {
                              const departure = form.getValues("departureDate");
                              return date < new Date(departure || new Date());
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="motorcycleUse"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-feijo-red focus:ring-feijo-red"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Vou utilizar motocicleta durante a viagem
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Passengers */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Users className="text-feijo-red" size={20} />
                <h3 className="text-lg font-medium text-feijo-darkgray">Passageiros</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="passengers0to64"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>0 a 64 anos</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="passengers65to70"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>65 a 70 anos</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="passengers71to85"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>71 a 85 anos</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Consultant */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Users className="text-feijo-red" size={20} />
                <h3 className="text-lg font-medium text-feijo-darkgray">Consultor</h3>
              </div>
              
              <FormField
                control={form.control}
                name="seller"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecione seu consultor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um consultor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {consultants.map((consultant) => (
                          <SelectItem key={consultant} value={consultant}>
                            {consultant}
                          </SelectItem>
                        ))}
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
                className="bg-[#FA0108] hover:bg-red-600 text-white px-8 py-6 text-lg rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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

export default TravelInsuranceQuoteForm;
