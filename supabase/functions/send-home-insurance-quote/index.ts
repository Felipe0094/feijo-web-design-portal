
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticação - The JWT token is validated automatically by Supabase
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      throw new Error('Missing authorization header');
    }

    // Use the API key from environment variables
    const resendApiKey = "re_2hAktQX4_MZFwiUSRBdNzge3oSxXAqnkh"; // Hardcoded for now
    const resend = new Resend(resendApiKey);
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get request data
    const { quoteData, quoteType, policyFile } = await req.json();
    
    if (!quoteData) {
      throw new Error("Missing quote data");
    }

    // Format security equipment
    let securityEquipmentText = "";
    if (quoteData.security_equipment && quoteData.security_equipment.length > 0) {
      securityEquipmentText = "Equipamentos de Segurança:\n" + 
        quoteData.security_equipment.map((item: string) => `- ${item}`).join("\n");
    }

    // Format additional data
    let additionalDataText = "";
    if (quoteData.additional_data) {
      additionalDataText = "Dados Adicionais:\n";
      for (const [key, value] of Object.entries(quoteData.additional_data)) {
        if (value === true) {
          const labelMap: Record<string, string> = {
            is_owner: "Segurado é o proprietário do imóvel",
            is_rural: "Imóvel localizado na zona rural",
            is_gated_community: "Imóvel localizado em condomínio fechado",
            is_vacant_or_construction: "Imóvel desocupado, em reforma ou em construção",
            is_historical: "Imóvel tombado pelo Patrimônio Histórico",
            has_professional_activity: "Exerce atividade profissional na residência",
            is_next_to_vacant: "Faz divisa com terrenos baldios ou imóveis desocupados"
          };
          // @ts-ignore
          additionalDataText += `- ${labelMap[key] || key}\n`;
        }
      }
    }

    // Format coverage values
    const formatCurrency = (value: any) => {
      if (value === null || value === undefined) return "Não informado";
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value);
    };

    // Create email content
    const emailContent = `
      <h2>Nova Cotação de Seguro Residencial</h2>
      
      <h3>Dados do Cliente:</h3>
      <p><strong>Nome:</strong> ${quoteData.full_name}</p>
      <p><strong>CPF/CNPJ:</strong> ${quoteData.document_number}</p>
      <p><strong>Telefone:</strong> ${quoteData.phone}</p>
      <p><strong>Email:</strong> ${quoteData.email}</p>
      
      <h3>Dados do Imóvel:</h3>
      <p><strong>Tipo de Residência:</strong> ${quoteData.residence_type === "house" ? "Casa" : "Apartamento"}</p>
      <p><strong>Tipo de Construção:</strong> ${quoteData.construction_type}</p>
      <p><strong>Tipo de Ocupação:</strong> ${quoteData.occupation_type === "habitual" ? "Habitual" : "Veraneio"}</p>
      
      <h3>Endereço:</h3>
      <p>${quoteData.street}, ${quoteData.number}${quoteData.complement ? `, ${quoteData.complement}` : ''}</p>
      <p>${quoteData.neighborhood}, ${quoteData.city} - ${quoteData.state}</p>
      <p>CEP: ${quoteData.zip_code}</p>
      
      ${securityEquipmentText ? `<h3>Equipamentos de Segurança:</h3><p>${securityEquipmentText.replace(/\n/g, '<br>')}</p>` : ''}
      
      ${additionalDataText ? `<h3>Dados Adicionais:</h3><p>${additionalDataText.replace(/\n/g, '<br>')}</p>` : ''}
      
      <h3>Valores de Cobertura:</h3>
      <p><strong>Valor do imóvel:</strong> ${formatCurrency(quoteData.insured_value)}</p>
      <p><strong>Danos elétricos:</strong> ${formatCurrency(quoteData.electrical_damage_value)}</p>
      <p><strong>Quebra de vidros:</strong> ${formatCurrency(quoteData.glass_value)}</p>
      <p><strong>Alagamento:</strong> ${formatCurrency(quoteData.flooding_value)}</p>
      <p><strong>Vazamento de tubulações:</strong> ${formatCurrency(quoteData.pipe_leakage_value)}</p>
      <p><strong>Roubo/furto:</strong> ${formatCurrency(quoteData.theft_value)}</p>
      
      <p><strong>Vendedor/Consultor:</strong> ${quoteData.seller}</p>
    `;

    // Send email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Cotações <onboarding@resend.dev>", // Using Resend's default verified sender
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: `Nova Cotação de Seguro Residencial - ${quoteData.full_name}`,
      html: emailContent
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      throw emailError;
    }
    
    console.log("Email sent successfully:", emailData);

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
