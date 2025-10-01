
import { supabase } from '@/integrations/supabase/client';
import { CivilWorksInsuranceFormData } from './types';
import { toast } from "sonner";

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

    // Insert into database
    const { error: dbError, data: insertedData } = await supabase
      .from('civil_works_insurance_quotes')
      .insert(cleanValues)
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
      throw new Error(`Error submitting civil works insurance quote: ${dbError.message}`);
    }

    try {
      // Send email notification via edge function
      console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
      const emailResponse = await fetch('https://ocapqzfqqgjcqohlomva.supabase.co/functions/v1/send-civil-works-insurance-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYXBxemZxcWdqY3FvaGxvbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzY2OTYsImV4cCI6MjA2MTI1MjY5Nn0.BJVh01h7-s2aFsNdv_wIHm58CmuNxP70_5qfPuVPd4o`
        },
        body: JSON.stringify({ 
          quoteData: cleanValues,
          quoteType: 'civil-works-insurance'
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
    console.error("Error in submitCivilWorksInsuranceQuote:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
