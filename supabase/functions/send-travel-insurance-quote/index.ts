
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
    // Verify authorization (when verify_jwt = true)
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      throw new Error('Missing authorization header');
    }

    // Use the API key from environment variables
    const resendApiKey = "re_2hAktQX4_MZFwiUSRBdNzge3oSxXAqnkh"; // Hardcoded for now as it's the same key used in other functions
    const resend = new Resend(resendApiKey);
    
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
    
    // Format the trip type and purpose for email
    const tripTypeText = quote.trip_type === "national" ? "Nacional" : "Internacional";
    const purposeText = quote.purpose === "business" ? "Negócios" : "Turismo/Lazer";
    
    // Format dates in Brazilian format
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    };

    // Create email content
    const emailContent = `
      <h2>Nova Cotação de Seguro Viagem</h2>
      
      <h3>Dados do Cliente:</h3>
      <p><strong>Nome:</strong> ${quote.full_name}</p>
      <p><strong>CPF:</strong> ${quote.cpf}</p>
      <p><strong>Telefone:</strong> ${quote.phone}</p>
      <p><strong>Email:</strong> ${quote.email}</p>
      
      <h3>Dados da Viagem:</h3>
      <p><strong>Tipo de Viagem:</strong> ${tripTypeText}</p>
      <p><strong>Destino:</strong> ${quote.destination}</p>
      <p><strong>Finalidade:</strong> ${purposeText}</p>
      <p><strong>Data de Saída:</strong> ${formatDate(quote.departure_date)}</p>
      <p><strong>Data de Retorno:</strong> ${formatDate(quote.return_date)}</p>
      <p><strong>Utilizará Moto:</strong> ${quote.motorcycle_use ? "Sim" : "Não"}</p>
      
      <h3>Passageiros:</h3>
      <p><strong>De 0 a 64 anos:</strong> ${quote.passengers_0_to_64}</p>
      <p><strong>De 65 a 70 anos:</strong> ${quote.passengers_65_to_70}</p>
      <p><strong>De 71 a 85 anos:</strong> ${quote.passengers_71_to_85}</p>
      
      <p><strong>Vendedor/Consultor:</strong> ${quote.seller}</p>
    `;

    // Send email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Cotações <onboarding@resend.dev>", // Using Resend's default verified sender
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: `Nova Cotação de Seguro Viagem - ${quote.full_name}`,
      html: emailContent
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      throw emailError;
    }
    
    console.log("Email sent successfully:", emailData);
    
    // Update quote status to "email_sent"
    await supabaseClient
      .from("travel_insurance_quotes")
      .update({ status: "email_sent" })
      .eq("id", quote.id);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
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
