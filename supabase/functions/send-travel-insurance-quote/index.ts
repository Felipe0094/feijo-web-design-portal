import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    // Get request body
    const { quoteData, quoteType } = await req.json();
    console.log('Received data:', { quoteData, quoteType }); // Debug log
    
    if (!quoteData) {
      throw new Error('No quote data provided');
    }
    
    // Format dates
    const departureDate = new Date(quoteData.departure_date).toLocaleDateString('pt-BR');
    const returnDate = new Date(quoteData.return_date).toLocaleDateString('pt-BR');
    // Format trip type and purpose
    const tripTypeText = quoteData.trip_type === "national" ? "Nacional" : "Internacional";
    const purposeText = quoteData.purpose === "business" ? "Negócios" : "Turismo/Lazer";
    // Create email content
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nova Cotação de Seguro Viagem</title>
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
          <h1 style="color: #544f4f; margin: 0;">Nova Cotação de Seguro Viagem</h1>
          <div class="seller-info">
            Vendedor: ${quoteData.seller || "Não informado"}
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Dados do Cliente</h2>
          <div class="info-row">
            <div class="info-label">Nome:</div>
            <div class="info-value">${quoteData.full_name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CPF:</div>
            <div class="info-value">${quoteData.cpf}</div>
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
          <h2 class="section-title">Dados da Viagem</h2>
          <div class="info-row">
            <div class="info-label">Tipo de Viagem:</div>
            <div class="info-value">${tripTypeText}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Destino:</div>
            <div class="info-value">${quoteData.destination}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Finalidade:</div>
            <div class="info-value">${purposeText}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Saída:</div>
            <div class="info-value">${departureDate}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Retorno:</div>
            <div class="info-value">${returnDate}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Utilizará Moto:</div>
            <div class="info-value">${quoteData.motorcycle_use ? "Sim" : "Não"}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Passageiros</h2>
          <div class="info-row">
            <div class="info-label">De 0 a 64 anos:</div>
            <div class="info-value">${quoteData.passengers_0_to_64}</div>
          </div>
          <div class="info-row">
            <div class="info-label">De 65 a 70 anos:</div>
            <div class="info-value">${quoteData.passengers_65_to_70}</div>
          </div>
          <div class="info-row">
            <div class="info-label">De 71 a 85 anos:</div>
            <div class="info-value">${quoteData.passengers_71_to_85}</div>
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
    const resendApiKey = "re_2hAktQX4_MZFwiUSRBdNzge3oSxXAqnkh";
    const resend = new Resend(resendApiKey);
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Cotações <onboarding@resend.dev>",
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: `Nova Cotação de Seguro Viagem - ${quoteData.full_name} - Vendedor: ${quoteData.seller || "Não informado"}`,
      html: emailContent
    });
    if (emailError) {
      throw emailError;
    }
    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error details:', error); // Debug log
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
