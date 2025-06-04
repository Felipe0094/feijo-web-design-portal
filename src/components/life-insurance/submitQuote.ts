import { LifeInsuranceFormData } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const submitQuote = async (
  formData: LifeInsuranceFormData,
  policyFile?: File
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Submitting life insurance quote:", formData);
    
    // Process the quote data
    let quoteData = {
      insurance_type: formData.insurance_type,
      full_name: formData.full_name,
      document_number: formData.document_number,
      birth_date: formData.birth_date,
      phone: formData.phone,
      email: formData.email,
      weight: formData.weight,
      height: formData.height,
      // Format monthly income to have max 2 decimal places
      monthly_income: formData.monthly_income ? Number(formData.monthly_income.toFixed(2)) : null,
      smoker: formData.smoker,
      practices_sports: formData.practices_sports,
      sports_description: formData.sports_description || null,
      retirement_status: formData.retirement_status,
      standard_death_coverage: formData.standard_death_coverage,
      accidental_death_coverage: formData.accidental_death_coverage,
      permanent_disability_coverage: formData.permanent_disability_coverage,
      seller: formData.seller
    };
    
    // Upload file if exists
    let policyFilePath = null;
    if (policyFile) {
      const fileName = `${Date.now()}_${policyFile.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('life_insurance_files')
        .upload(fileName, policyFile);
      
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return { success: false, error: "Erro ao enviar arquivo da apólice atual." };
      }
      
      if (uploadData) {
        policyFilePath = fileName;
      }
    }
    
    // Insert quote into the database
    const { data: quoteResult, error: quoteError } = await supabase
      .from('life_insurance_quotes')
      .insert([
        {
          ...quoteData,
          policy_file_path: policyFilePath
        }
      ])
      .select();

    if (quoteError) {
      console.error("Error inserting quote:", quoteError);
      return { success: false, error: "Erro ao salvar cotação no banco de dados." };
    }

    try {
      // Clean values - remove undefined and special type objects
      const cleanValues = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => {
          if (v === undefined) return false;
          if (v !== null && typeof v === 'object' && '_type' in v) return false;
          return true;
        })
      );

      // Send email notification using edge function
      console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
      const emailResponse = await fetch('https://ocapqzfqqgjcqohlomva.supabase.co/functions/v1/send-life-insurance-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYXBxemZxcWdqY3FvaGxvbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzY2OTYsImV4cCI6MjA2MTI1MjY5Nn0.BJVh01h7-s2aFsNdv_wIHm58CmuNxP70_5qfPuVPd4o`
        },
        body: JSON.stringify({ 
          quoteData: cleanValues,
          policyFile: policyFilePath ? {
            path: policyFilePath
          } : undefined
        })
      });
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Email response not OK:", errorText);
      } else {
        const emailResult = await emailResponse.json();
        console.log("Email sending result:", emailResult);
      }
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Continue with the operation even if email fails
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting life insurance quote:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar cotação." 
    };
  }
};
