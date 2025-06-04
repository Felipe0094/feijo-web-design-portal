
import { HealthInsuranceFormData } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const submitQuote = async (
  formData: HealthInsuranceFormData,
  currentPlanFile?: File
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Submitting health insurance quote:", formData);
    
    // Process the quote data
    let quoteData = {
      document_number: formData.document_number,
      responsible_name: formData.responsible_name,
      phone: formData.phone,
      email: formData.email,
      insured_name: formData.insured_name,
      insured_cpf: formData.insured_cpf,
      insured_birth_date: formData.insured_birth_date,
      insured_age: formData.insured_age || null,
      municipality: formData.municipality,
      room_type: formData.room_type,
      has_copayment: formData.has_copayment === 'yes',
      notes: formData.notes || null,
      seller: formData.seller
    };
    
    // Upload file if exists
    let currentPlanFilePath = null;
    if (currentPlanFile) {
      const fileName = `${Date.now()}_${currentPlanFile.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('health_insurance_files')
        .upload(fileName, currentPlanFile);
      
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return { success: false, error: "Erro ao enviar arquivo da apólice atual." };
      }
      
      if (uploadData) {
        currentPlanFilePath = fileName;
      }
    }
    
    // Insert quote into the database
    const { data: quoteResult, error: quoteError } = await supabase
      .from('health_insurance_quotes')
      .insert([
        {
          ...quoteData,
          current_plan_file_path: currentPlanFilePath
        }
      ])
      .select();
    
    if (quoteError) {
      console.error("Error inserting health insurance quote:", quoteError);
      return { success: false, error: quoteError.message };
    }
    
    // Process dependents if any
    if (formData.dependents && formData.dependents.length > 0 && quoteResult && quoteResult[0]) {
      const quoteId = quoteResult[0].id;
      
      // Prepare dependents data - ensure all required fields are included
      const dependentsData = formData.dependents.map(dep => ({
        quote_id: quoteId,
        name: dep.name,
        cpf: dep.cpf,
        birth_date: dep.birth_date,
        age: dep.age || null,
        id: dep.id // Ensure id is explicitly included
      }));
      
      // Insert dependents
      const { error: dependentsError } = await supabase
        .from('health_insurance_dependents')
        .insert(dependentsData);
      
      if (dependentsError) {
        console.error("Error inserting dependents:", dependentsError);
        // We continue even if there's an error with dependents
      }
    }
    
    // Send email notification
    let policyFile = null;
    if (currentPlanFile) {
      const reader = new FileReader();
      
      // Convert file to base64
      const base64File = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Content = base64String.split(',')[1]; // Remove the data URL part
          resolve(base64Content);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(currentPlanFile);
      });
      
      policyFile = {
        name: currentPlanFile.name,
        type: currentPlanFile.type,
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
            dependents: formData.dependents,
            insurance_type: 'health', // To differentiate in the email template
          },
          policyFile
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
    console.error("Error submitting health insurance quote:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar cotação." 
    };
  }
};
