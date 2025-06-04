// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @deno-types="https://esm.sh/resend@2.0.0"
import { Resend } from "https://esm.sh/resend@2.0.0";

interface QuoteData {
  full_name: string;
  document_number: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  model?: string;
  license_plate?: string;
  chassis_number?: string;
  manufacture_year?: string;
  model_year?: string;
  fuel_type?: string;
  is_new_vehicle?: boolean;
  is_financed?: boolean;
  is_armored?: boolean;
  has_natural_gas?: boolean;
  has_sunroof?: boolean;
  is_driver_insured?: boolean;
  driver_full_name?: string;
  driver_document_number?: string;
  driver_birth_date?: string;
  driver_gender?: string;
  driver_marital_status?: string;
  driver_residence_type?: string;
  driver_relationship?: string;
  has_home_garage?: boolean;
  has_automatic_gate?: boolean;
  has_work_garage?: string;
  has_school_garage?: string;
  vehicles_at_residence?: string;
  parking_zip_code?: string;
  seller?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      throw new Error('Missing authorization header');
    }
    const resendApiKey = "re_2hAktQX4_MZFwiUSRBdNzge3oSxXAqnkh";
    const resend = new Resend(resendApiKey);
    const { quoteData, policyFile } = await req.json() as { quoteData: QuoteData, policyFile?: any };
    if (!quoteData) {
      throw new Error("Missing quote data");
    }
    const formatBool = (v: boolean | undefined | null): string => {
      if (v === true) return "Sim";
      if (v === false) return "Não";
      return "Não informado";
    };
    const formatGarageValue = (value: string | undefined | null): string => {
      if (value === "true") return "Sim";
      if (value === "false") return "Não";
      if (value === "not_applicable") return "Não utiliza para este fim";
      return "Não informado";
    };

    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
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
            overflow: visible;
          }
          .section-title {
            color: #b22222;
            border-bottom: 2px solid #b22222;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
            overflow: visible;
          }
          .info-label {
            font-weight: bold;
            width: 200px;
            color: #666;
            flex-shrink: 0;
          }
          .info-value {
            flex: 1;
            overflow: visible;
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
            color: #b22222;
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0 30px 0;
            text-align: center;
          }
          * {
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://i.ibb.co/TSvpZzF/Captura-de-tela-2025-06-04-103812.png" alt="Feijó Corretora" class="logo">
          <h1 style="color: #b22222; margin: 0;">Nova Cotação de Seguro Auto</h1>
          <div class="seller-info">
            Vendedor: ${quoteData.seller || "Não informado"}
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Dados do Cliente</h2>
          <div class="info-row">
            <div class="info-label">Nome/Razão Social:</div>
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

        <div class="section">
          <h2 class="section-title">Dados do Veículo</h2>
          <div class="info-row">
            <div class="info-label">Modelo:</div>
            <div class="info-value">${quoteData.model || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Placa:</div>
            <div class="info-value">${quoteData.license_plate || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Chassi:</div>
            <div class="info-value">${quoteData.chassis_number || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Ano de Fabricação:</div>
            <div class="info-value">${quoteData.manufacture_year || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Ano do Modelo:</div>
            <div class="info-value">${quoteData.model_year || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Combustível:</div>
            <div class="info-value">${quoteData.fuel_type || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Veículo Novo:</div>
            <div class="info-value">${formatBool(quoteData.is_new_vehicle)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Financiado:</div>
            <div class="info-value">${formatBool(quoteData.is_financed)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Blindado:</div>
            <div class="info-value">${formatBool(quoteData.is_armored)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">GNV:</div>
            <div class="info-value">${formatBool(quoteData.has_natural_gas)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Teto Solar:</div>
            <div class="info-value">${formatBool(quoteData.has_sunroof)}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Informações do Condutor</h2>
          <div class="info-row">
            <div class="info-label">Condutor Segurado:</div>
            <div class="info-value">${formatBool(quoteData.is_driver_insured)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Nome do Condutor:</div>
            <div class="info-value">${quoteData.driver_full_name || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CPF do Condutor:</div>
            <div class="info-value">${quoteData.driver_document_number || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Nascimento:</div>
            <div class="info-value">${quoteData.driver_birth_date || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Gênero:</div>
            <div class="info-value">${quoteData.driver_gender || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Estado Civil:</div>
            <div class="info-value">${quoteData.driver_marital_status || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Residência:</div>
            <div class="info-value">${quoteData.driver_residence_type || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Parentesco:</div>
            <div class="info-value">${quoteData.driver_relationship || "Não informado"}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Informações de Garagem</h2>
          <div class="info-row">
            <div class="info-label">Garagem em Casa:</div>
            <div class="info-value">${formatBool(quoteData.has_home_garage)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Portão Automático:</div>
            <div class="info-value">${formatBool(quoteData.has_automatic_gate)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Garagem no Trabalho:</div>
            <div class="info-value">${formatGarageValue(quoteData.has_work_garage)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Garagem na Escola:</div>
            <div class="info-value">${formatGarageValue(quoteData.has_school_garage)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Veículos na Residência:</div>
            <div class="info-value">${quoteData.vehicles_at_residence || "Não informado"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CEP da Garagem:</div>
            <div class="info-value">${quoteData.parking_zip_code || "Não informado"}</div>
          </div>
        </div>

        <div class="footer">
          <p>Data de envio: ${new Date().toLocaleString('pt-BR')}</p>
          <p>© 2024 Feijó Corretora. Todos os direitos reservados.</p>
        </div>
      </body>
      </html>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Cotações <onboarding@resend.dev>",
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: `Nova Cotação de Seguro Auto - ${quoteData.full_name} - Vendedor: ${quoteData.seller || "Não informado"}`,
      html: emailContent
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      throw emailError;
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Email sent successfully"
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 400
    });
  }
});