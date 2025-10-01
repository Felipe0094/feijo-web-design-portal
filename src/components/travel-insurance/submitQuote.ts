
import { TravelInsuranceFormData } from "./types";
import { toast } from "sonner";
import { sendEmail } from "@/lib/email-service";

export const submitTravelQuote = async (data: TravelInsuranceFormData) => {
  try {
    console.log("Submitting travel insurance quote:", data);

    // Clean values - remove undefined and special type objects
    const cleanValues = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => {
        if (v === undefined || v === null) return false;
        if (v !== null && typeof v === 'object' && '_type' in v) return false;
        return true;
      })
    );

    // Send email notification
    console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
    
    const emailData = {
      quoteData: cleanValues,
      quoteType: 'travel-insurance'
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
    console.error("Error in submitTravelQuote:", error);
    toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
    throw error;
  }
};
