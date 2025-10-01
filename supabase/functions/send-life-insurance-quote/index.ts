import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

console.log("Life insurance quote notification function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    console.log("Processing request...");
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get request body
    const { quoteData, policyFile } = await req.json();
    console.log('Received data:', {
      quoteData,
      policyFile
    }); // Debug log

    if (!quoteData) {
      throw new Error('No quote data provided');
    }

    // Format monetary values
    const formatCurrency = (value: number | null) => {
      if (value === null || value === undefined) return 'Não informado';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    // Create email content
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nova Cotação de Seguro de Vida</title>
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
          <h1 style="color: #544f4f; margin: 0;">Nova Cotação de Seguro de Vida</h1>
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
            <div class="info-label">CPF/CNPJ:</div>
            <div class="info-value">${quoteData.document_number}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Nascimento:</div>
            <div class="info-value">${quoteData.birth_date}</div>
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
          <h2 class="section-title">Informações de Saúde</h2>
          <div class="info-row">
            <div class="info-label">Peso:</div>
            <div class="info-value">${quoteData.weight} kg</div>
          </div>
          <div class="info-row">
            <div class="info-label">Altura:</div>
            <div class="info-value">${quoteData.height} cm</div>
          </div>
          <div class="info-row">
            <div class="info-label">Renda Mensal:</div>
            <div class="info-value">${formatCurrency(quoteData.monthly_income)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Fumante:</div>
            <div class="info-value">${quoteData.smoker ? "Sim" : "Não"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Pratica Esportes:</div>
            <div class="info-value">${quoteData.practices_sports ? "Sim" : "Não"}</div>
          </div>
          ${quoteData.practices_sports && quoteData.sports_description ? `
          <div class="info-row">
            <div class="info-label">Esportes praticados:</div>
            <div class="info-value">${quoteData.sports_description}</div>
          </div>
          ` : ''}
          <div class="info-row">
            <div class="info-label">Aposentadoria:</div>
            <div class="info-value">${quoteData.retirement_status === "time_age" ? "Por tempo/idade" : quoteData.retirement_status === "disability" ? "Por invalidez" : "Não aposentado"}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Valores de Cobertura</h2>
          <div class="info-row">
            <div class="info-label">Morte Padrão:</div>
            <div class="info-value">${formatCurrency(quoteData.standard_death_coverage)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Morte Acidental:</div>
            <div class="info-value">${formatCurrency(quoteData.accidental_death_coverage)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Invalidez Permanente (IPA):</div>
            <div class="info-value">${formatCurrency(quoteData.permanent_disability_coverage)}</div>
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
      subject: `Nova Cotação de Seguro de Vida - ${quoteData.full_name} - Vendedor: ${quoteData.seller || "Não informado"}`,
      html: emailContent,
      reply_to: quoteData.email,
      attachments: policyFile ? [{
        content: policyFile.content,
        filename: policyFile.name,
        type: policyFile.type,
      }] : undefined
    });

    if (emailError) {
      console.error("Error sending life insurance quote email:", emailError);
      throw emailError;
    }

    console.log("Life insurance quote email sent successfully");
    return new Response(JSON.stringify({
      success: true,
      data: emailData
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error details:', error); // Debug log
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
