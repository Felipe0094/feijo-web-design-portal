
import { supabase } from "@/integrations/supabase/client";
import type { HomeInsuranceFormData } from "./types";

export async function submitHomeInsuranceQuote(
  formData: HomeInsuranceFormData,
  policyFilePath?: string | null
) {
  try {
    const { error } = await supabase
      .from("home_insurance_quotes")
      .insert({
        ...formData,
        policy_file_path: policyFilePath || null,
        security_equipment: formData.security_equipment || [],
        additional_data: formData.additional_data || {}
      });

    if (error) {
      throw new Error(`Error submitting home insurance quote: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error in submitHomeInsuranceQuote:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}
