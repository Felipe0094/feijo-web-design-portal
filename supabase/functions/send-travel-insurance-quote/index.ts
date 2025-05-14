
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticação (quando verify_jwt = true)
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the most recent quote
    const { data: quotes, error: quotesError } = await supabaseClient
      .from("travel_insurance_quotes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (quotesError) throw quotesError;
    if (!quotes || quotes.length === 0) {
      throw new Error("No quotes found");
    }

    const quote = quotes[0];
    
    // For now, just log the email that would be sent
    console.log(`
      Email would be sent with the following information:
      
      Nome: ${quote.full_name}
      CPF: ${quote.cpf}
      Telefone: ${quote.phone}
      Email: ${quote.email}
      
      Tipo de Viagem: ${quote.trip_type === "national" ? "Nacional" : "Internacional"}
      Destino: ${quote.destination}
      Finalidade: ${quote.purpose === "business" ? "Negócios" : "Turismo/Lazer"}
      Data de Saída: ${new Date(quote.departure_date).toLocaleDateString('pt-BR')}
      Data de Retorno: ${new Date(quote.return_date).toLocaleDateString('pt-BR')}
      Utilizará Moto: ${quote.motorcycle_use ? "Sim" : "Não"}
      
      Passageiros de 0 a 64 anos: ${quote.passengers_0_to_64}
      Passageiros de 65 a 70 anos: ${quote.passengers_65_to_70}
      Passageiros de 71 a 85 anos: ${quote.passengers_71_to_85}
      
      Vendedor/Consultor: ${quote.seller}
    `);
    
    // Update quote status to "email_sent"
    await supabaseClient
      .from("travel_insurance_quotes")
      .update({ status: "email_sent" })
      .eq("id", quote.id);

    return new Response(
      JSON.stringify({ success: true, message: "Email would be sent" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
