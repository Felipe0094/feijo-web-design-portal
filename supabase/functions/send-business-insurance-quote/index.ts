// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { Resend } from "https://esm.sh/resend@2.0.0";
import { corsHeaders } from "../_shared/cors";

console.log("Business insurance quote notification function started");

serve(async (req: Request) => {
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

    const { quoteData } = await req.json();

    // Initialize Resend with API key
    const resend = new Resend("re_2hAktQX4_MZFwiUSRBdNzge3oSxXAqnkh"); // Using the same API key as civil works

    // Format currency values for email
    const formatCurrency = (value: number | null) => {
      if (value === null) return 'Não informado';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    // Format arrays for email
    const formatArray = (arr: string[]) => {
      if (!arr || arr.length === 0) return 'Nenhum';
      return arr.join(', ');
    };

    // Format boolean values for email
    const formatBoolean = (value: boolean) => value ? 'Sim' : 'Não';

    // Create email content
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nova Cotação de Seguro Empresarial</title>
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
          <h1 style="color: #544f4f; margin: 0;">Nova Cotação de Seguro Empresarial</h1>
          <div class="seller-info">
            Vendedor: ${quoteData.seller || 'Não informado'}
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Informações do Seguro</h2>
          <div class="info-row">
            <div class="info-label">Tipo de Seguro:</div>
            <div class="info-value">${quoteData.insurance_type === 'new' ? 'Novo' : 'Renovação'}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Informações de Contato</h2>
          <div class="info-row">
            <div class="info-label">Nome:</div>
            <div class="info-value">${quoteData.full_name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Telefone:</div>
            <div class="info-value">${quoteData.phone}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">${quoteData.email}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CNPJ:</div>
            <div class="info-value">${quoteData.cnpj}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Nome da Empresa:</div>
            <div class="info-value">${quoteData.company_name}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Endereço</h2>
          <div class="info-row">
            <div class="info-label">CEP:</div>
            <div class="info-value">${quoteData.zip_code}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Logradouro:</div>
            <div class="info-value">${quoteData.street}, ${quoteData.number}${quoteData.complement ? ` - ${quoteData.complement}` : ''}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Bairro:</div>
            <div class="info-value">${quoteData.neighborhood}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Cidade/UF:</div>
            <div class="info-value">${quoteData.city}/${quoteData.state}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Informações do Imóvel</h2>
          <div class="info-row">
            <div class="info-label">Pavimento:</div>
            <div class="info-value">${quoteData.floor === 'ground' ? 'Térreo' : quoteData.floor === 'first' ? 'Primeiro andar' : 'Segundo andar em diante'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Ano de Construção:</div>
            <div class="info-value">${quoteData.construction_year}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Construção:</div>
            <div class="info-value">${
        quoteData.construction_type === 'superior' ? 'Superior' :
        quoteData.construction_type === 'solid' ? 'Sólida' :
        quoteData.construction_type === 'mixed' ? 'Mista' : 'Inferior'
            }</div>
          </div>
          <div class="info-row">
            <div class="info-label">Localização:</div>
            <div class="info-value">${
        quoteData.location_type === 'airport' ? 'Aeroporto' :
        quoteData.location_type === 'market' ? 'Ceasa/Mercado' :
        quoteData.location_type === 'commercial_condo' ? 'Condomínio Comercial' :
        quoteData.location_type === 'mall' ? 'Shopping' : 'Supermercado'
            }</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Equipamentos de Segurança</h2>
          <div class="info-row">
            <div class="info-label">Equipamentos de Segurança:</div>
            <div class="info-value">${formatArray(quoteData.security_equipment)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Equipamentos de Incêndio:</div>
            <div class="info-value">${formatArray(quoteData.fire_equipment)}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Atividade Principal</h2>
          <div class="info-row">
            <div class="info-value">${quoteData.main_activity}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Informações Complementares</h2>
          <div class="info-row">
            <div class="info-label">Local para depósito:</div>
            <div class="info-value">${formatBoolean(quoteData.additional_info.is_warehouse)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Divisa com terreno baldio:</div>
            <div class="info-value">${formatBoolean(quoteData.additional_info.is_next_to_vacant)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tombado pelo patrimônio:</div>
            <div class="info-value">${formatBoolean(quoteData.additional_info.is_historical)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Estrutura de metal:</div>
            <div class="info-value">${formatBoolean(quoteData.additional_info.has_metal_structure)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Caixas eletrônicos:</div>
            <div class="info-value">${formatBoolean(quoteData.additional_info.has_atm)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui isopainel:</div>
            <div class="info-value">${formatBoolean(quoteData.additional_info.has_isopanel)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Em construção/reforma:</div>
            <div class="info-value">${formatBoolean(quoteData.additional_info.is_under_construction)}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Coberturas</h2>
          <div class="info-row">
            <div class="info-label">Básica:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.basic)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Danos Elétricos:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.electrical_damage)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Vidros:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.glass)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Roubo de bens:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.theft)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Equipamentos:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.equipment)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Impacto de veículos:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.vehicle_impact)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Aluguel:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.rent)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">RC do Empregador:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.employer_liability)}</div>
          </div>
          ${quoteData.coverage_options.other_coverage_notes ? `
          <div class="info-row">
            <div class="info-label">Outras coberturas:</div>
            <div class="info-value">${quoteData.coverage_options.other_coverage_notes}</div>
          </div>
          ` : ''}
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
      subject: `Nova Cotação de Seguro Empresarial - ${quoteData.full_name} - Vendedor: ${quoteData.seller || "Não informado"}`,
      html: emailContent,
      reply_to: quoteData.email
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: emailError.message || "Error sending email",
          details: emailError 
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error details:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to send email",
        details: error
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 500
      }
    );
  }
}); 