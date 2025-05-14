
import { supabase } from "@/integrations/supabase/client";
import { CivilWorksInsuranceFormData } from "./types";
import { toast } from "@/components/ui/use-toast";
import { CivilWorksInsuranceFormSchemaType } from "./schema";

export const submitCivilWorksInsuranceQuote = async (data: CivilWorksInsuranceFormSchemaType) => {
  try {
    // Ensure all required fields are present and properly formatted
    const formattedData = {
      full_name: data.full_name,
      document_number: data.document_number,
      phone: data.phone,
      email: data.email,
      has_previous_insurance: data.has_previous_insurance,
      has_previous_claims: data.has_previous_claims,
      construction_type: data.construction_type,
      service_type: data.service_type,
      zip_code: data.zip_code,
      street: data.street,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      number: data.number,
      complement: data.complement,
      services_description: data.services_description,
      start_date: data.start_date instanceof Date ? data.start_date.toISOString().split('T')[0] : data.start_date,
      end_date: data.end_date instanceof Date ? data.end_date.toISOString().split('T')[0] : data.end_date,
      upper_floors_count: data.upper_floors_count,
      basement_count: data.basement_count,
      has_grounding_service: data.has_grounding_service,
      structure_types: JSON.stringify(data.structure_types),
      demolition_type: data.demolition_type,
      has_tie_rods: data.has_tie_rods,
      has_adjacent_buildings: data.has_adjacent_buildings,
      has_water_table_lowering: data.has_water_table_lowering,
      has_excavation: data.has_excavation,
      has_terrain_containment: data.has_terrain_containment,
      has_structural_reinforcement: data.has_structural_reinforcement,
      contractors_count: data.contractors_count,
      coverage_options: JSON.stringify(data.coverage_options),
      seller: data.seller
    };

    // Insert the formatted data into Supabase
    const { error } = await supabase
      .from('civil_works_insurance_quotes')
      .insert(formattedData);

    if (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Erro ao enviar cotação",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
      return { success: false, error };
    }

    toast({
      title: "Cotação enviada com sucesso!",
      description: "Em breve entraremos em contato.",
    });
    return { success: true };
  } catch (error: any) {
    console.error('Exception when submitting quote:', error);
    toast({
      title: "Erro ao enviar cotação",
      description: "Por favor, tente novamente mais tarde.",
      variant: "destructive",
    });
    return { success: false, error };
  }
};
