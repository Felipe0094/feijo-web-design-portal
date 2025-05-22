import { AutoInsuranceFormData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const submitQuote = async (values: AutoInsuranceFormData, policyFile?: File) => {
  try {
    console.log("Submitting quote data:", values);
    console.log("Policy file:", policyFile);
    
    // Convert the manufacture_year to number if it exists
    const manufacture_year = values.manufacture_year !== undefined ? 
      values.manufacture_year : undefined;

    // Insert quote data into database - using the correct type signature
    const { data, error } = await supabase
      .from('auto_insurance_quotes')
      .insert({
        document_number: values.document_number,
        full_name: values.full_name,
        phone: values.phone,
        email: values.email,
        insurance_type: values.insurance_type,
        address: values.address,
        zip_code: values.zip_code,
        birth_date: values.birth_date,
        marital_status: values.marital_status,
        gender: values.gender,
        residence_type: values.residence_type,
        is_new_vehicle: values.is_new_vehicle,
        license_plate: values.license_plate,
        chassis_number: values.chassis_number,
        manufacture_year: manufacture_year,
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
        seller: values.seller
      })
      .select();

    if (error) throw error;

    try {
      // Prepare policy file if it exists
      let fileDetails = undefined;
      if (policyFile) {
        const fileContent = await policyFile.arrayBuffer();
        const base64Content = btoa(
          new Uint8Array(fileContent).reduce(
            (data, byte) => data + String.fromCharCode(byte), 
            ''
          )
        );
        
        fileDetails = {
          name: policyFile.name,
          type: policyFile.type,
          size: policyFile.size,
          content: base64Content
        };
      }

      // Clean values - remove undefined and special type objects
      const cleanValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => {
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
          policyFile: fileDetails,
          quoteType: 'auto'
        })
      });
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Email response not OK:", errorText);
        throw new Error(`Falha ao enviar email: ${errorText}`);
      }
      
      const emailResult = await emailResponse.json();
      console.log("Email sending result:", emailResult);
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError);
      // Continue with the operation even if email sending fails
    }

    toast.success("Cotação enviada com sucesso! Em breve entraremos em contato.");
    return { success: true, data };
  } catch (error) {
    console.error("Error submitting quote:", error);
    toast.error("Erro ao enviar cotação. Tente novamente.");
    throw error;
  }
};
