import { useState, useCallback, useEffect } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { GarageInfoSection } from "./GarageInfoSection";
import { VehicleInfoSection } from "./VehicleInfoSection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { DriverInfoSection } from "./DriverInfoSection";
import { AutoInsuranceFormData } from "./types";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { User, CarFront, Home, FileText, Users, Loader2, MapPin } from "lucide-react";
import { formatCpfCnpj, formatPhone } from "@/utils/formatters";
import { fetchAddressFromCEP } from "./fetchAddressFromCEP";

const formSchema = z.object({
  document_number: z.string().min(1, "CPF/CNPJ é obrigatório"),
  full_name: z.string().min(1, "Nome/Razão Social é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  insurance_type: z.enum(["new", "renewal"]),
  
  // Optional fields
  zip_code: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Logradouro é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  
  birth_date: z.string().optional(),
  marital_status: z.enum(["single", "married", "divorced", "widowed", "other"]).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  residence_type: z.enum(["house", "apartment", "condominium"]).optional(),
  
  is_new_vehicle: z.boolean().optional(),
  license_plate: z.string().optional(),
  chassis_number: z.string().optional(),
  manufacture_year: z.number().optional(),
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
  has_work_garage: z.enum(["not_applicable", "true", "false"]).optional(),
  has_school_garage: z.enum(["not_applicable", "true", "false"]).optional(),
  vehicle_usage: z.enum(["personal", "work", "passenger_transport"]).optional(),
  vehicles_at_residence: z.number().optional(),
  covers_young_drivers: z.boolean().optional(),
  condutor_menor: z.string().optional(),
  
  is_driver_insured: z.boolean().optional(),
  driver_document_number: z.string().optional(),
  driver_full_name: z.string().optional(),
  driver_birth_date: z.string().optional(),
  driver_marital_status: z.enum(["single", "married", "divorced", "widowed", "other"]).optional(),
  driver_gender: z.enum(["male", "female", "other"]).optional(),
  driver_relationship: z.string().optional(),
  driver_license_number: z.string().optional(),
  driver_license_category: z.string().optional(),
  driver_license_expiration: z.string().optional(),
  driver_profession: z.string().optional(),
  driver_income: z.number().optional(),
  seller: z.enum(["Carlos Henrique", "Felipe", "Renan", "Renata", "Gabriel"])
});

interface AutoInsuranceQuoteFormProps {
  onSuccess?: (data: AutoInsuranceFormData) => void;
  onFileChange?: (file: File | null) => void;
  isSubmitting?: boolean;
}

const AutoInsuranceQuoteForm = ({ 
  onSuccess, 
  onFileChange, 
  isSubmitting = false 
}: AutoInsuranceQuoteFormProps) => {
  const [showDriverInfo, setShowDriverInfo] = useState(false);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [sameAsParkingZip, setSameAsParkingZip] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insurance_type: "new",
      zip_code: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      number: "",
      complement: "",
      is_new_vehicle: false,
      license_plate: undefined,
      chassis_number: undefined,
      is_financed: false,
      is_armored: false,
      has_natural_gas: false,
      has_sunroof: false,
      has_home_garage: false,
      has_automatic_gate: false,
      has_work_garage: "not_applicable",
      has_school_garage: "not_applicable",
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
      driver_license_number: undefined,
      driver_license_category: undefined,
      driver_license_expiration: undefined,
      driver_profession: undefined,
      driver_income: undefined,
    },
  });

  // Watch for insurance_type changes to determine which sections to show
  const insuranceType = form.watch("insurance_type");
  const isRenewalType = insuranceType === "renewal";
  
  // Watch for zip_code changes to update parking_zip_code when sameAsParkingZip is true
  const zipCode = form.watch("zip_code");
  useEffect(() => {
    if (sameAsParkingZip && zipCode) {
      form.setValue("parking_zip_code", zipCode);
    }
  }, [zipCode, sameAsParkingZip, form]);

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setPolicyFile(selectedFile);
    
    if (onFileChange) {
      onFileChange(selectedFile);
    }
  };

  // Handle CEP search
  const handleCepSearch = async (cep: string) => {
    try {
      const address = await fetchAddressFromCEP(cep);
      
      if (address) {
        form.setValue('street', address.logradouro);
        form.setValue('neighborhood', address.bairro);
        form.setValue('city', address.localidade);
        form.setValue('state', address.uf);
        toast.success("Endereço encontrado!");
      } else {
        toast.error("CEP não encontrado. Por favor, verifique o CEP informado.");
      }
    } catch (error) {
      console.error('Error searching CEP:', error);
      toast.error('Erro ao buscar CEP. Tente novamente.');
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLocalIsSubmitting(true);
      
      if (!values.document_number || !values.full_name || !values.email || !values.phone) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        setLocalIsSubmitting(false);
        return;
      }
      
      if (onSuccess) {
        // Ensure all required fields for AutoInsuranceFormData are provided
        const formData: AutoInsuranceFormData = {
          document_number: values.document_number,
          full_name: values.full_name,
          phone: values.phone,
          email: values.email,
          insurance_type: values.insurance_type,
          seller: values.seller,
          
          // Address fields
          zip_code: values.zip_code,
          street: values.street,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state,
          number: values.number,
          complement: values.complement,
          
          // Optional fields
          birth_date: values.birth_date,
          marital_status: values.marital_status,
          gender: values.gender,
          residence_type: values.residence_type,
          is_new_vehicle: values.is_new_vehicle,
          license_plate: values.license_plate,
          chassis_number: values.chassis_number,
          manufacture_year: values.manufacture_year,
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
          condutor_menor: values.condutor_menor,
          is_driver_insured: values.is_driver_insured,
          driver_document_number: values.driver_document_number,
          driver_full_name: values.driver_full_name,
          driver_birth_date: values.driver_birth_date,
          driver_marital_status: values.driver_marital_status,
          driver_gender: values.driver_gender,
          driver_relationship: values.driver_relationship,
          driver_license_number: values.driver_license_number,
          driver_license_category: values.driver_license_category,
          driver_license_expiration: values.driver_license_expiration,
          driver_profession: values.driver_profession,
          driver_income: values.driver_income,
        };
        
        onSuccess(formData);
        form.reset();
        setShowDriverInfo(false);
        setPolicyFile(null);
      }
      
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
              <PersonalInfoSection />

              {/* Address Section */}
              <div className="grid gap-4">
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
                            if (e.target.value) {
                              handleCepSearch(e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-3">
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
                          <Input placeholder="Apartamento, bloco, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
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
            </div>
            
            {/* Conditional sections based on insurance type */}
            {!isRenewalType && (
              <>
                {/* Vehicle Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <CarFront className="text-[#fa0008]" size={20} />
                    <h3 className="text-lg font-semibold text-feijo-darkgray">Detalhes do Veículo</h3>
                  </div>
                  <VehicleInfoSection />

                  {/* Add the parking ZIP code section with the switch */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="same-parking-zip"
                        checked={sameAsParkingZip}
                        onCheckedChange={(checked) => {
                          setSameAsParkingZip(checked);
                          if (checked) {
                            form.setValue("parking_zip_code", form.getValues("zip_code"));
                          } else {
                            form.setValue("parking_zip_code", "");
                          }
                        }}
                      />
                      <Label htmlFor="same-parking-zip">CEP de pernoite é o mesmo da residência</Label>
                    </div>

                    <FormField
                      control={form.control}
                      name="parking_zip_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP de Pernoite</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="00000-000" 
                              {...field}
                              disabled={sameAsParkingZip}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Garage Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Home className="text-[#fa0008]" size={20} />
                    <h3 className="text-lg font-semibold text-feijo-darkgray">Informações de Garagem</h3>
                  </div>
                  <GarageInfoSection />
                </div>
                
                {/* Principal Driver Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <User className="text-[#fa0008]" size={20} />
                    <h3 className="text-lg font-semibold text-feijo-darkgray">Informações do Principal Condutor</h3>
                  </div>
                  <DriverInfoSection
                    showDriverInfo={showDriverInfo}
                    setShowDriverInfo={setShowDriverInfo}
                  />
                </div>
              </>
            )}
            
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
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value}
                    >
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

export default AutoInsuranceQuoteForm;
