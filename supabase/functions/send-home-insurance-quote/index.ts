import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response('ok', { headers: corsHeaders });
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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nova Cotação de Seguro Residencial</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            max-width: 100px;
            margin-bottom: 20px;
          }
          .section {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .section-title {
            color: #544f4f;
            border-bottom: 2px solid #c92424;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: bold;
            width: 200px;
            color: #666;
            flex-shrink: 0;
          }
          .info-value {
            flex: 1;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          .seller-info {
            color: #c92424;
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0 30px 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://i.ibb.co/TSvpZzF/Captura-de-tela-2025-06-04-103812.png" alt="Feijó Corretora" class="logo">
          <h1 style="color: #544f4f; margin: 0;">Nova Cotação de Seguro Residencial</h1>
          <div class="seller-info">
            Vendedor: ${quoteData.seller}
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Dados do Cliente</h2>
          <div class="info-row">
            <div class="info-label">Nome:</div>
            <div class="info-value">${quoteData.full_name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CPF/CNPJ:</div>
            <div class="info-value">${quoteData.document_number}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Telefone:</div>
            <div class="info-value">${quoteData.phone}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">${quoteData.email}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Dados do Imóvel</h2>
          <div class="info-row">
            <div class="info-label">Tipo de Residência:</div>
            <div class="info-value">${quoteData.residence_type === "house" ? "Casa" : "Apartamento"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Construção:</div>
            <div class="info-value">${quoteData.construction_type}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Ocupação:</div>
            <div class="info-value">${quoteData.occupation_type === "habitual" ? "Habitual" : "Veraneio"}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Endereço</h2>
          <div class="info-row">
            <div class="info-label">Logradouro:</div>
            <div class="info-value">${quoteData.street}, ${quoteData.number}${quoteData.complement ? `, ${quoteData.complement}` : ''}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Bairro:</div>
            <div class="info-value">${quoteData.neighborhood}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Cidade/Estado:</div>
            <div class="info-value">${quoteData.city} - ${quoteData.state}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CEP:</div>
            <div class="info-value">${quoteData.zip_code}</div>
          </div>
        </div>

        ${securityEquipmentText ? `
        <div class="section">
          <h2 class="section-title">Equipamentos de Segurança</h2>
          <div class="info-row">
            <div class="info-value">${securityEquipmentText.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        ` : ''}

        ${additionalDataText ? `
        <div class="section">
          <h2 class="section-title">Dados Adicionais</h2>
          <div class="info-row">
            <div class="info-value">${additionalDataText.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        ` : ''}

        <div class="section">
          <h2 class="section-title">Valores de Cobertura</h2>
          <div class="info-row">
            <div class="info-label">Valor do imóvel:</div>
            <div class="info-value">${formatCurrency(quoteData.insured_value)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Danos elétricos:</div>
            <div class="info-value">${formatCurrency(quoteData.electrical_damage_value)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Quebra de vidros:</div>
            <div class="info-value">${formatCurrency(quoteData.glass_value)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Alagamento:</div>
            <div class="info-value">${formatCurrency(quoteData.flooding_value)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Vazamento de tubulações:</div>
            <div class="info-value">${formatCurrency(quoteData.pipe_leakage_value)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Roubo/furto:</div>
            <div class="info-value">${formatCurrency(quoteData.theft_value)}</div>
          </div>
        </div>

        <div class="footer">
          <p>Esta é uma mensagem automática. Por favor, não responda a este email.</p>
          <p>© 2024 Feijó Corretora. Todos os direitos reservados.</p>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Cotações <onboarding@resend.dev>",
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: `Nova Cotação de Seguro Residencial - ${quoteData.full_name} - Vendedor: ${quoteData.seller || "Não informado"}`,
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
