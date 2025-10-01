import type { HomeInsuranceFormData } from "./types";
import { toast } from "sonner";
import { sendEmail } from "@/lib/email-service";

export async function submitHomeInsuranceQuote(
  formData: HomeInsuranceFormData,
  policyFile?: File | null
) {
  try {
    console.log("Submitting home insurance quote:", formData);

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
    
    // Format email data properly
    const emailData = {
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: "Nova Cotação - Seguro Residencial",
      html: `
        <h2>Nova Cotação de Seguro Residencial</h2>
        <h3>Dados do Cliente:</h3>
        <ul>
          ${Object.entries(cleanValues).map(([key, value]) => 
            `<li><strong>${key}:</strong> ${value}</li>`
          ).join('')}
        </ul>
        ${policyFile ? `<p><strong>Arquivo anexado:</strong> ${policyFile.name} (${policyFile.size} bytes)</p>` : ''}
      `,
      attachments: policyFile ? [{
        filename: policyFile.name,
        content: await fileToBase64(policyFile),
        type: policyFile.type
      }] : undefined
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
    console.error("Error in submitHomeInsuranceQuote:", error);
    toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:mime/type;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}
