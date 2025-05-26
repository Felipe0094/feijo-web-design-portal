import { supabase } from "@/integrations/supabase/client";
import { CivilWorksInsuranceFormData } from "./types";
import { toast } from "sonner";
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
      structure_types: typeof data.structure_types === 'object' ? JSON.stringify(data.structure_types) : data.structure_types,
      demolition_type: data.demolition_type,
      has_tie_rods: data.has_tie_rods,
      has_adjacent_buildings: data.has_adjacent_buildings,
      has_water_table_lowering: data.has_water_table_lowering,
      has_excavation: data.has_excavation,
      has_terrain_containment: data.has_terrain_containment,
      has_structural_reinforcement: data.has_structural_reinforcement,
      contractors_count: data.contractors_count,
      coverage_options: typeof data.coverage_options === 'object' ? JSON.stringify(data.coverage_options) : data.coverage_options,
      seller: data.seller
    };

    // Insert the formatted data into Supabase
    const { error, data: insertedData } = await supabase
      .from('civil_works_insurance_quotes')
      .insert(formattedData)
      .select();

    if (error) {
      console.error('Error submitting quote:', error);
      toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
      return { success: false, error };
    }

    try {
      // Clean values for email - remove undefined and special type objects
      const cleanValues = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => {
          if (v === undefined) return false;
          if (v !== null && typeof v === 'object' && '_type' in v) return false;
          return true;
        })
      );

      // Send email notification
      console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
      const emailResponse = await fetch('https://ocapqzfqqgjcqohlomva.supabase.co/functions/v1/send-insurance-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYXBxemZxcWdqY3FvaGxvbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzY2OTYsImV4cCI6MjA2MTI1MjY5Nn0.BJVh01h7-s2aFsNdv_wIHm58CmuNxP70_5qfPuVPd4o`
        },
        body: JSON.stringify({ 
          quoteData: cleanValues,
          quoteType: 'civil-works'
        })
      });
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Email response not OK:", errorText);
        // Continue with the operation even if email sending fails
      } else {
        const emailResult = await emailResponse.json();
        console.log("Email sending result:", emailResult);
      }
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError);
      // Continue with the operation even if email sending fails
    }

    toast.success("Cotação enviada com sucesso! Em breve entraremos em contato.");
    return { success: true, data: insertedData };
  } catch (error: any) {
    console.error('Exception when submitting quote:', error);
    toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
    return { success: false, error };
  }
};
