import { HealthInsuranceFormData } from "./types";
import { sendEmail } from "@/lib/email-service";
import { toast } from "sonner";

export const submitQuote = async (
  formData: HealthInsuranceFormData,
  currentPlanFile?: File
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Submitting health insurance quote:", formData);
    
    // Clean and prepare quote data
    const { dependents, ...quoteFields } = formData;
    const quoteData = {
      ...quoteFields,
      has_copayment: formData.has_copayment === 'yes',
      created_at: new Date().toISOString(),
      dependents: dependents || []
    };
    
    // Send email notification
    console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
    
    const emailData = {
      quoteData: quoteData,
      quoteType: 'health-insurance',
      policyFile: currentPlanFile ? {
        name: currentPlanFile.name,
        size: currentPlanFile.size,
        type: currentPlanFile.type
      } : undefined
    };

    const emailResult = await sendEmail(emailData);
    
    if (!emailResult.success) {
      console.error("Erro ao enviar email:", emailResult.error);
      toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
      return { success: false, error: emailResult.error };
    }

    console.log("Email enviado com sucesso:", emailResult);
    toast.success("Cotação enviada com sucesso! Em breve entraremos em contato.");
    return { success: true };
  } catch (error) {
    console.error("Error submitting health insurance quote:", error);
    toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar cotação." 
    };
  }
};
