
import { supabase } from "@/integrations/supabase/client";
import type { HomeInsuranceFormData } from "./types";
import { toast } from "sonner";

export async function submitHomeInsuranceQuote(
  formData: HomeInsuranceFormData,
  policyFilePath?: string | null
) {
  try {
    const { error, data: insertedData } = await supabase
      .from("home_insurance_quotes")
      .insert({
        ...formData,
        policy_file_path: policyFilePath || null,
        security_equipment: formData.security_equipment || [],
        additional_data: formData.additional_data || {}
      })
      .select();

    if (error) {
      toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
      throw new Error(`Error submitting home insurance quote: ${error.message}`);
    }

    try {
      // Prepare policy file if it exists
      let fileDetails = undefined;
      if (policyFilePath) {
        fileDetails = {
          path: policyFilePath
        };
      }

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
      const emailResponse = await fetch('https://ocapqzfqqgjcqohlomva.supabase.co/functions/v1/send-insurance-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYXBxemZxcWdqY3FvaGxvbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzY2OTYsImV4cCI6MjA2MTI1MjY5Nn0.BJVh01h7-s2aFsNdv_wIHm58CmuNxP70_5qfPuVPd4o`
        },
        body: JSON.stringify({ 
          quoteData: cleanValues,
          quoteType: 'home-insurance',
          policyFile: fileDetails
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
      console.error("Erro ao enviar email:", emailError);
      // Continue with the operation even if email sending fails
    }

    toast.success("Cotação enviada com sucesso! Em breve entraremos em contato.");
    return { success: true, data: insertedData };
  } catch (error) {
    console.error("Error in submitHomeInsuranceQuote:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}
