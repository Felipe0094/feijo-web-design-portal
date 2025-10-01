
import { CivilWorksInsuranceFormData } from './types';
import { toast } from "sonner";
import { sendEmail } from "@/lib/email-service";

export const submitCivilWorksInsuranceQuote = async (data: CivilWorksInsuranceFormData) => {
  try {
    console.log("Submitting civil works insurance quote:", data);

    // Clean up values before sending
    const cleanValues = {
      ...data,
      // Convert dates to proper format
      start_date: data.start_date instanceof Date ? data.start_date.toISOString().split('T')[0] : data.start_date,
      end_date: data.end_date instanceof Date ? data.end_date.toISOString().split('T')[0] : data.end_date,
      // Remove any undefined or null values from nested objects
      coverage_options: Object.fromEntries(
        Object.entries(data.coverage_options).filter(([_, v]) => v != null)
      ),
      structure_types: Object.fromEntries(
        Object.entries(data.structure_types).filter(([_, v]) => v != null)
      )
    };

    // Send email notification
    console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
    
    const emailData = {
      quoteData: cleanValues,
      quoteType: 'civil-works-insurance'
    };

    const emailResult = await sendEmail(emailData);
    
    if (!emailResult.success) {
      console.error("Erro ao enviar email:", emailResult.error);
      toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
      throw new Error(emailResult.error);
    }

    console.log("Email enviado com sucesso:", emailResult);
    toast.success("Cotação enviada com sucesso! Em breve entraremos em contato.");
    return { success: true };
  } catch (error) {
    console.error("Error in submitCivilWorksInsuranceQuote:", error);
    toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
