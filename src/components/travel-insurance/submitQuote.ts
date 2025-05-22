
import { supabase } from "@/integrations/supabase/client";
import { TravelInsuranceFormData } from "./types";
import { toast } from "sonner";

export const submitTravelQuote = async (data: TravelInsuranceFormData) => {
  try {
    // Map camelCase fields to snake_case columns
    const { error } = await supabase
      .from('travel_insurance_quotes')
      .insert({
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
      });

    if (error) throw error;
    
    try {
      // Send email notification via edge function
      const emailResponse = await fetch('https://ocapqzfqqgjcqohlomva.supabase.co/functions/v1/send-travel-insurance-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYXBxemZxcWdqY3FvaGxvbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NzY2OTYsImV4cCI6MjA2MTI1MjY5Nn0.BJVh01h7-s2aFsNdv_wIHm58CmuNxP70_5qfPuVPd4o`
        },
        body: JSON.stringify({})
      });
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Email response not OK:", errorText);
        throw new Error(`Failed to send email: ${errorText}`);
      }
      
      const emailResult = await emailResponse.json();
      console.log("Email sending result:", emailResult);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Continue with the operation even if email sending fails
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting travel insurance quote:", error);
    return { success: false, error };
  }
};
