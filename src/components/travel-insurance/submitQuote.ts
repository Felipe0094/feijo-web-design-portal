
import { supabase } from "@/integrations/supabase/client";
import { TravelInsuranceFormData } from "./types";
import { toast } from "sonner";

export const submitTravelQuote = async (data: TravelInsuranceFormData) => {
  try {
    // Map camelCase fields to snake_case columns
    const quoteData = {
      full_name: data.fullName,
      cpf: data.cpf,
      phone: data.phone,
      email: data.email,
      trip_type: data.tripType,
      destination: data.destination,
      purpose: data.purpose,
      departure_date: data.departureDate,
      return_date: data.returnDate,
      motorcycle_use: data.motorcycleUse,
      passengers_0_to_64: data.passengers0to64,
      passengers_65_to_70: data.passengers65to70,
      passengers_71_to_85: data.passengers71to85,
      seller: data.seller
    };

    // Insert into database
    const { error: dbError, data: insertedData } = await supabase
      .from('travel_insurance_quotes')
      .insert(quoteData)
      .select();

    if (dbError) {
      toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
      throw new Error(`Error submitting travel insurance quote: ${dbError.message}`);
    }
    
    try {
      // Clean values - remove undefined and special type objects
      const cleanValues = Object.fromEntries(
        Object.entries(quoteData).filter(([_, v]) => {
          if (v === undefined) return false;
          if (v !== null && typeof v === 'object' && v !== null && '_type' in v) return false;
          return true;
        })
      );

      // Send email notification via edge function
      console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
      const emailResponse = await fetch('https://ocapqzfqqgjcqohlomva.supabase.co/functions/v1/send-travel-insurance-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYXBxemZxcWdqY3FvaGxvbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzY2OTYsImV4cCI6MjA2MTI1MjY5Nn0.BJVh01h7-s2aFsNdv_wIHm58CmuNxP70_5qfPuVPd4o`
        },
        body: JSON.stringify({ 
          quoteData: cleanValues,
          quoteType: 'travel-insurance'
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
    console.error("Error in submitTravelQuote:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
