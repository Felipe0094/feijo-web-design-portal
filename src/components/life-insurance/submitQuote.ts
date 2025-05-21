
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
      monthly_income: formData.monthly_income,
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
      .select(); // Important: include this to return the inserted data
    
    if (quoteError) {
      console.error("Error inserting life insurance quote:", quoteError);
      return { success: false, error: quoteError.message };
    }
    
    // Send email notification
    let policyFileData = null;
    if (policyFile) {
      const reader = new FileReader();
      
      // Convert file to base64
      const base64File = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Content = base64String.split(',')[1]; // Remove the data URL part
          resolve(base64Content);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(policyFile);
      });
      
      policyFileData = {
        name: policyFile.name,
        type: policyFile.type,
        content: base64File
      };
    }
    
    // Call the edge function to send email
    const { data: emailResult, error: emailError } = await supabase.functions.invoke(
      'send-insurance-quote',
      {
        body: {
          quoteData: {
            ...quoteData,
            insurance_type: formData.insurance_type,
            insurance_category: 'life', // To differentiate in the email template
          },
          policyFile: policyFileData
        }
      }
    );
    
    if (emailError) {
      console.error("Error sending email notification:", emailError);
      // We return success even if email fails since quote is saved
      return { success: true, error: "Cotação salva, mas houve erro no envio do email." };
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
