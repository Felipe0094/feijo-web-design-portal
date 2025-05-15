
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
    
    return { success: true };
  } catch (error) {
    console.error("Error submitting travel insurance quote:", error);
    return { success: false, error };
  }
};
