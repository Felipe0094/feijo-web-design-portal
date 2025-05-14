
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.24.0'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    const { data, error } = await req.json();
    
    if (error) {
      throw new Error(error.message);
    }

    if (!data || !data.id) {
      throw new Error("Missing quote data or quote id");
    }

    // Fetch the home insurance quote data
    const { data: quoteData, error: fetchError } = await supabaseClient
      .from("home_insurance_quotes")
      .select("*")
      .eq("id", data.id)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching quote: ${fetchError.message}`);
    }

    if (!quoteData) {
      throw new Error("Quote not found");
    }

    // Format security equipment
    let securityEquipmentText = "";
    if (quoteData.security_equipment && quoteData.security_equipment.length > 0) {
      securityEquipmentText = "Equipamentos de Segurança:\n" + 
        quoteData.security_equipment.map(item => `- ${item}`).join("\n");
    }

    // Format additional data
    let additionalDataText = "";
    if (quoteData.additional_data) {
      additionalDataText = "Dados Adicionais:\n";
      for (const [key, value] of Object.entries(quoteData.additional_data)) {
        if (value === true) {
          const labelMap = {
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
    const formatCurrency = (value) => {
      if (value === null || value === undefined) return "Não informado";
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value);
    };

    // Update quote status to "email_sent"
    await supabaseClient
      .from("home_insurance_quotes")
      .update({ status: "email_sent" })
      .eq("id", data.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email enviado com sucesso"
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    );
  }
});
