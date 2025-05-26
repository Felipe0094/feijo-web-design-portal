import { supabase } from "@/integrations/supabase/client";
import type { HomeInsuranceFormData } from "./types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export async function submitHomeInsuranceQuote(
  formData: HomeInsuranceFormData,
  policyFile?: File | null
) {
  try {
    // Handle file upload first if file exists
    let policyFilePath = null;
    if (policyFile) {
      const fileExt = policyFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `home-insurance/${fileName}`;

      // Create storage bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'policy-files');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('policy-files', {
          public: false,
          fileSizeLimit: 10485760 // 10MB
        });
      }

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('policy-files')
        .upload(filePath, policyFile);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        toast.error("Erro ao fazer upload do arquivo. Por favor, tente novamente.");
        // Continue without the file
      } else {
        policyFilePath = filePath;
      }
    }

    const { error, data: insertedData } = await supabase
      .from("home_insurance_quotes")
      .insert({
        ...formData,
        policy_file_path: policyFilePath,
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

      // Send email notification using edge function
      console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
      const emailResponse = await fetch('https://ocapqzfqqgjcqohlomva.supabase.co/functions/v1/send-home-insurance-quote', {
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
