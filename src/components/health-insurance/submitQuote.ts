import { supabase } from "@/integrations/supabase/client";
import { HealthInsuranceFormData } from "./types";

export const submitQuote = async (
  formData: HealthInsuranceFormData,
  currentPlanFile?: File
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Submitting health insurance quote:", formData);
    
    // Clean and prepare quote data - remove dependents as they go in a separate table
    const { dependents, ...quoteFields } = formData;
    const quoteData = {
      ...quoteFields,
      has_copayment: formData.has_copayment === 'yes',
      created_at: new Date().toISOString(),
    };
    
    // Insert quote into database
    const { data: quoteResult, error: quoteError } = await supabase
      .from('health_insurance_quotes')
      .insert([quoteData])
      .select();
    
    if (quoteError) {
      console.error("Error inserting health insurance quote:", quoteError);
      return { success: false, error: quoteError.message };
    }
    
    // Process dependents if any
    if (dependents && dependents.length > 0 && quoteResult && quoteResult[0]) {
      const quoteId = quoteResult[0].id;
      
      // Prepare dependents data
      const dependentsData = dependents.map(dep => ({
        quote_id: quoteId,
        name: dep.name,
        cpf: dep.cpf,
        birth_date: dep.birth_date,
        age: dep.age || null,
        id: dep.id
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
    
    // Call the new Edge Function to send email
    const { data: emailResult, error: emailError } = await supabase.functions.invoke(
      'send-health-insurance-quote',
      {
        body: {
          quoteData: {
            ...quoteData,
            dependents: dependents
          }
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
