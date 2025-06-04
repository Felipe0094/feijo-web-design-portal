// @ts-ignore
// Follow this setup guide to integrate the Deno runtime and use Edge Functions:
// https://deno.com/manual/runtime/manual/getting_started

// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-ignore
import { Resend } from "https://esm.sh/resend@2.0.0";

// Definindo a interface PolicyFile
interface PolicyFile {
  content: string;
  filename: string;
  type: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req): Promise<Response> => {
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
    let requestData: { quoteData: any; policyFile?: PolicyFile };
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
              max-width: 400px;
              margin: 0 auto;
            }
            .header {
              background-color: #000000;
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
      // Auto Insurance template
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
              background-color: #000000;
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
              <h2>Informações Pessoais</h2>
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
                <div class="info-label">Data de Nascimento:</div>
                <div class="info-value">${quoteData.birth_date || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Gênero:</div>
                <div class="info-value">${quoteData.gender || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Estado Civil:</div>
                <div class="info-value">${quoteData.marital_status || 'Não informado'}</div>
              </div>
            </div>

            <div class="info-section">
              <h2>Endereço</h2>
              <div class="info-row">
                <div class="info-label">CEP:</div>
                <div class="info-value">${quoteData.zip_code || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Rua:</div>
                <div class="info-value">${quoteData.street || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Número:</div>
                <div class="info-value">${quoteData.number || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Complemento:</div>
                <div class="info-value">${quoteData.complement || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Bairro:</div>
                <div class="info-value">${quoteData.neighborhood || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Cidade:</div>
                <div class="info-value">${quoteData.city || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Estado:</div>
                <div class="info-value">${quoteData.state || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Tipo de Residência:</div>
                <div class="info-value">${quoteData.residence_type || 'Não informado'}</div>
              </div>
            </div>

            <div class="info-section">
              <h2>Informações do Veículo</h2>
              <div class="info-row">
                <div class="info-label">Modelo:</div>
                <div class="info-value">${quoteData.model || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Placa:</div>
                <div class="info-value">${quoteData.license_plate || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Chassi:</div>
                <div class="info-value">${quoteData.chassis_number || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Ano de Fabricação:</div>
                <div class="info-value">${quoteData.manufacture_year || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Ano do Modelo:</div>
                <div class="info-value">${quoteData.model_year || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Combustível:</div>
                <div class="info-value">${quoteData.fuel_type || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Veículo Novo:</div>
                <div class="info-value">${quoteData.is_new_vehicle ? 'Sim' : 'Não'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Financiado:</div>
                <div class="info-value">${quoteData.is_financed ? 'Sim' : 'Não'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Blindado:</div>
                <div class="info-value">${quoteData.is_armored ? 'Sim' : 'Não'}</div>
              </div>
              ${quoteData.is_armored ? `
              <div class="info-row">
                <div class="info-label">Valor da Blindagem:</div>
                <div class="info-value">R$ ${quoteData.armoring_value?.toLocaleString('pt-BR') || 'Não informado'}</div>
              </div>
              ` : ''}
              <div class="info-row">
                <div class="info-label">GNV:</div>
                <div class="info-value">${quoteData.has_natural_gas ? 'Sim' : 'Não'}</div>
              </div>
              ${quoteData.has_natural_gas ? `
              <div class="info-row">
                <div class="info-label">Valor do Kit GNV:</div>
                <div class="info-value">R$ ${quoteData.gas_kit_value?.toLocaleString('pt-BR') || 'Não informado'}</div>
              </div>
              ` : ''}
              <div class="info-row">
                <div class="info-label">Teto Solar:</div>
                <div class="info-value">${quoteData.has_sunroof ? 'Sim' : 'Não'}</div>
              </div>
            </div>

            ${quoteData.is_driver_insured ? `
            <div class="info-section">
              <h2>Informações do Condutor</h2>
              <div class="info-row">
                <div class="info-label">Nome:</div>
                <div class="info-value">${quoteData.driver_full_name || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">CPF:</div>
                <div class="info-value">${quoteData.driver_document_number || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Data de Nascimento:</div>
                <div class="info-value">${quoteData.driver_birth_date || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Gênero:</div>
                <div class="info-value">${quoteData.driver_gender || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Estado Civil:</div>
                <div class="info-value">${quoteData.driver_marital_status || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Tipo de Residência:</div>
                <div class="info-value">${quoteData.driver_residence_type || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Parentesco:</div>
                <div class="info-value">${quoteData.driver_relationship || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">CNH:</div>
                <div class="info-value">${quoteData.driver_license_number || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Categoria:</div>
                <div class="info-value">${quoteData.driver_license_category || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Validade:</div>
                <div class="info-value">${quoteData.driver_license_expiration || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Profissão:</div>
                <div class="info-value">${quoteData.driver_profession || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Renda:</div>
                <div class="info-value">R$ ${quoteData.driver_income?.toLocaleString('pt-BR') || 'Não informado'}</div>
              </div>
            </div>
            ` : ''}

            <div class="info-section">
              <h2>Informações de Garagem</h2>
              <div class="info-row">
                <div class="info-label">Garagem em Casa:</div>
                <div class="info-value">${quoteData.has_home_garage ? 'Sim' : 'Não'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Portão Automático:</div>
                <div class="info-value">${quoteData.has_automatic_gate ? 'Sim' : 'Não'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Garagem no Trabalho:</div>
                <div class="info-value">${quoteData.has_work_garage === 'true' ? 'Sim' : quoteData.has_work_garage === 'false' ? 'Não' : 'Não se aplica'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Garagem na Escola:</div>
                <div class="info-value">${quoteData.has_school_garage === 'true' ? 'Sim' : quoteData.has_school_garage === 'false' ? 'Não' : 'Não se aplica'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Veículos na Residência:</div>
                <div class="info-value">${quoteData.vehicles_at_residence || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Uso do Veículo:</div>
                <div class="info-value">${quoteData.vehicle_usage === 'personal' ? 'Pessoal' : quoteData.vehicle_usage === 'work' ? 'Trabalho' : 'Transporte de Passageiros'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">CEP da Garagem:</div>
                <div class="info-value">${quoteData.parking_zip_code || 'Não informado'}</div>
              </div>
            </div>

            ${quoteData.covers_young_drivers ? `
            <div class="info-section">
              <h2>Informações de Condutor Jovem</h2>
              <div class="info-row">
                <div class="info-label">Cobre Condutores Jovens:</div>
                <div class="info-value">Sim</div>
              </div>
              <div class="info-row">
                <div class="info-label">Idade do Condutor Mais Jovem:</div>
                <div class="info-value">${quoteData.youngest_driver_age || 'Não informado'} anos</div>
              </div>
              <div class="info-row">
                <div class="info-label">Condutor Menor:</div>
                <div class="info-value">${quoteData.condutor_menor || 'Não informado'}</div>
              </div>
            </div>
            ` : ''}

            <div class="footer">
              <p>Esta é uma cotação automática. Para mais informações, entre em contato com o vendedor.</p>
            </div>
          </div>
        </body>
      </html>
      `;
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

    return new Response(emailContent, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html"
      }
    });
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