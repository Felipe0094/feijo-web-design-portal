// Follow this setup guide to integrate the Deno runtime and use Edge Functions:
// https://deno.com/manual/runtime/manual/getting_started

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Recebendo solicitação para enviar email de cotação");
    
    // Use the provided API key
    const apiKey = "re_2hAktQX4_MZFwiUSRBdNzge3oSxXAqnkh";
    
    if (!apiKey) {
      console.error("API key for Resend not found");
      return new Response(
        JSON.stringify({
          error: "API key for email service not configured"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Parse JSON request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error("Erro ao analisar corpo da requisição:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const { quoteData, policyFile } = requestData;
    
    console.log("Dados recebidos:", {
      cliente: quoteData?.full_name || quoteData?.responsible_name?.substring(0, 10),
      email_destino: "cotacoes.feijocorretora@gmail.com",
      api_key_exists: !!apiKey,
      arquivo_anexado: !!policyFile,
      tipo_seguro: quoteData?.insurance_type || 'auto'
    });
    
    // Initialize Resend with API key
    const resend = new Resend(apiKey);
    
    // Get seller name to display in email
    const sellerName = quoteData.seller || "Felipe";
    
    let emailContent;
    
    // Check if it's a health insurance quote
    if (quoteData.insurance_type === 'health') {
      // Create better formatted health insurance quote details for email with styling
      emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background-color: #b22222;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
              border: 1px solid #ddd;
              border-top: none;
              border-radius: 0 0 5px 5px;
            }
            h1, h2 {
              color: #b22222;
              margin-top: 25px;
            }
            .info-section {
              margin-bottom: 25px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            .info-row {
              display: flex;
              padding: 8px 0;
            }
            .info-label {
              font-weight: bold;
              width: 180px;
            }
            .info-value {
              flex: 1;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #666;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Nova Cotação de Plano de Saúde</h1>
            <p>Vendedor: ${sellerName}</p>
          </div>
          <div class="content">
            <div class="info-section">
              <h2>Informações do Responsável</h2>
              <div class="info-row">
                <div class="info-label">Nome:</div>
                <div class="info-value">${quoteData.responsible_name || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">CNPJ:</div>
                <div class="info-value">${quoteData.document_number || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${quoteData.email || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Telefone:</div>
                <div class="info-value">${quoteData.phone || 'Não informado'}</div>
              </div>
            </div>
            
            <div class="info-section">
              <h2>Informações do Titular</h2>
              <div class="info-row">
                <div class="info-label">Nome:</div>
                <div class="info-value">${quoteData.insured_name || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">CPF:</div>
                <div class="info-value">${quoteData.insured_cpf || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Data de Nascimento:</div>
                <div class="info-value">${quoteData.insured_birth_date || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Idade:</div>
                <div class="info-value">${quoteData.insured_age || 'Não informado'} anos</div>
              </div>
              <div class="info-row">
                <div class="info-label">Município:</div>
                <div class="info-value">${quoteData.municipality || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Tipo de Acomodação:</div>
                <div class="info-value">${quoteData.room_type === 'private' ? 'Quarto Privativo' : 'Enfermaria'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Coparticipação:</div>
                <div class="info-value">${quoteData.has_copayment === 'yes' || quoteData.has_copayment === true ? 'Sim' : 'Não'}</div>
              </div>
            </div>
      `;
      
      // Add dependents information if available
      if (quoteData.dependents && quoteData.dependents.length > 0) {
        emailContent += `
          <div class="info-section">
            <h2>Dependentes</h2>
        `;
        
        quoteData.dependents.forEach((dependent, index) => {
          emailContent += `
            <h3>Dependente ${index + 1}</h3>
            <div class="info-row">
              <div class="info-label">Nome:</div>
              <div class="info-value">${dependent.name || 'Não informado'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">CPF:</div>
              <div class="info-value">${dependent.cpf || 'Não informado'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Data de Nascimento:</div>
              <div class="info-value">${dependent.birth_date || 'Não informado'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Idade:</div>
              <div class="info-value">${dependent.age || 'Não informado'} anos</div>
            </div>
          `;
        });
        
        emailContent += `
          </div>
        `;
      }
      
      // Add notes if available
      if (quoteData.notes) {
        emailContent += `
          <div class="info-section">
            <h2>Observações</h2>
            <div class="info-row">
              <div class="info-value">${quoteData.notes}</div>
            </div>
          </div>
        `;
      }
    } else {
      // Auto Insurance template (keep existing code)
      emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background-color: #b22222;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
              border: 1px solid #ddd;
              border-top: none;
              border-radius: 0 0 5px 5px;
            }
            h1, h2 {
              color: #b22222;
              margin-top: 25px;
            }
            .info-section {
              margin-bottom: 25px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            .info-row {
              display: flex;
              padding: 8px 0;
            }
            .info-label {
              font-weight: bold;
              width: 180px;
            }
            .info-value {
              flex: 1;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #666;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Nova Cotação de Seguro Auto</h1>
            <p>Vendedor: ${sellerName}</p>
          </div>
          <div class="content">
            <div class="info-section">
              <h2>Informações do Cliente</h2>
              <div class="info-row">
                <div class="info-label">Nome:</div>
                <div class="info-value">${quoteData.full_name || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">CPF/CNPJ:</div>
                <div class="info-value">${quoteData.document_number || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${quoteData.email || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Telefone:</div>
                <div class="info-value">${quoteData.phone || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Tipo de Seguro:</div>
                <div class="info-value">${quoteData.insurance_type === 'new' ? 'Novo' : 'Renovação'}</div>
              </div>
            </div>
      `;
      
      // Add vehicle information if available
      if (quoteData.model || quoteData.manufacture_year || quoteData.license_plate) {
        emailContent += `
          <div class="info-section">
            <h2>Informações do Veículo</h2>
            ${quoteData.model ? `
              <div class="info-row">
                <div class="info-label">Modelo:</div>
                <div class="info-value">${quoteData.model}</div>
              </div>` : ''}
            ${quoteData.manufacture_year ? `
              <div class="info-row">
                <div class="info-label">Ano:</div>
                <div class="info-value">${quoteData.manufacture_year}</div>
              </div>` : ''}
            ${quoteData.license_plate ? `
              <div class="info-row">
                <div class="info-label">Placa:</div>
                <div class="info-value">${quoteData.license_plate}</div>
              </div>` : ''}
            ${quoteData.fuel_type ? `
              <div class="info-row">
                <div class="info-label">Combustível:</div>
                <div class="info-value">${quoteData.fuel_type}</div>
              </div>` : ''}
            ${quoteData.is_financed ? `
              <div class="info-row">
                <div class="info-label">Financiado:</div>
                <div class="info-value">Sim</div>
              </div>` : ''}
            ${quoteData.is_armored ? `
              <div class="info-row">
                <div class="info-label">Blindado:</div>
                <div class="info-value">Sim</div>
              </div>` : ''}
          </div>
        `;
      }
      
      // Add young driver information if available
      if (quoteData.covers_young_drivers) {
        emailContent += `
          <div class="info-section">
            <h2>Informações de Condutor Menor</h2>
            <div class="info-row">
              <div class="info-label">Idade do Condutor Menor de 25 anos:</div>
              <div class="info-value">${quoteData.condutor_menor || 'Informação não disponível'}</div>
            </div>
          </div>
        `;
      }
      
      // Add driver information if the driver is not the insured
      if (quoteData.is_driver_insured === false && quoteData.driver_full_name) {
        emailContent += `
          <div class="info-section">
            <h2>Informações do Principal Condutor</h2>
            <div class="info-row">
              <div class="info-label">Nome:</div>
              <div class="info-value">${quoteData.driver_full_name}</div>
            </div>
            ${quoteData.driver_document_number ? `
              <div class="info-row">
                <div class="info-label">CPF:</div>
                <div class="info-value">${quoteData.driver_document_number}</div>
              </div>` : ''}
            ${quoteData.driver_birth_date ? `
              <div class="info-row">
                <div class="info-label">Data de Nascimento:</div>
                <div class="info-value">${quoteData.driver_birth_date}</div>
              </div>` : ''}
            ${quoteData.driver_relationship ? `
              <div class="info-row">
                <div class="info-label">Relação com Segurado:</div>
                <div class="info-value">${quoteData.driver_relationship}</div>
              </div>` : ''}
          </div>
        `;
      }
    }
    
    // Add common footer
    emailContent += `
          <div class="footer">
            <p>Para entrar em contato com o cliente, responda diretamente a este email ou utilize os dados de contato fornecidos.</p>
            ${policyFile ? `<p>A apólice do cliente está anexada a este email.</p>` : ''}
          </div>
        </div>
        </body>
        </html>
      `;

    console.log("Preparando para enviar email via Resend");
    
    try {
      // Define email data - using the specified recipient email
      const emailData = {
        from: "Cotações Feijó <onboarding@resend.dev>",  // Using Resend's default verified sender
        to: ["cotacoes.feijocorretora@gmail.com"],  // Using the specified recipient
        subject: `${sellerName} - Cotação ${quoteData.insurance_type === 'health' ? 'Plano de Saúde' : 'Seguro Auto'} - ${quoteData.responsible_name || quoteData.full_name || 'Novo Cliente'}`,
        html: emailContent,
        attachments: []
      };
      
      // Add attachment if policy file exists
      if (policyFile && policyFile.content) {
        emailData.attachments.push({
          filename: policyFile.name || "apolice.pdf",
          content: policyFile.content,
          content_type: policyFile.type || "application/pdf"
        });
        
        console.log("Anexo adicionado ao email:", policyFile.name);
      }

      console.log("Enviando email para:", emailData.to);
      
      // Send email with Resend
      const emailResponse = await resend.emails.send(emailData);
      console.log("Resposta da API Resend:", JSON.stringify(emailResponse));
      
      return new Response(
        JSON.stringify(emailResponse),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (emailError) {
      console.error("Erro ao enviar email com Resend:", emailError);
      return new Response(
        JSON.stringify({
          error: `Falha ao enviar email: ${emailError.message || JSON.stringify(emailError)}`
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

  } catch (error) {
    console.error("Erro no processamento do envio de email:", error);
    
    return new Response(
      JSON.stringify({
        error: `Falha ao processar a solicitação de email: ${error.message || JSON.stringify(error)}`
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
