import { LifeInsuranceFormData } from "./types";
import { sendEmail } from "@/lib/email-service";
import { toast } from "sonner";

export const submitQuote = async (
  formData: LifeInsuranceFormData,
  policyFile?: File
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Submitting life insurance quote:", formData);
    
    // Clean values - remove undefined and special type objects
    const cleanValues = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => {
        if (v === undefined) return false;
        if (v !== null && typeof v === 'object' && '_type' in v) return false;
        return true;
      })
    );

    // Send email notification
    console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
    
    const emailData = {
      quoteData: cleanValues,
      quoteType: 'life-insurance',
      policyFile: policyFile ? {
        name: policyFile.name,
        size: policyFile.size,
        type: policyFile.type
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
    console.error("Error in submitQuote:", error);
    toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
