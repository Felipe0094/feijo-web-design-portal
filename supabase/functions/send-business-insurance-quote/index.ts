// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    const { quoteData, policyFile } = await req.json();

    // Initialize Resend with API key
    const resend = new Resend("re_123456789"); // Replace with your actual API key

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
      <h1>Nova Cotação de Seguro Empresarial</h1>
      
      <h2>Informações do Seguro</h2>
      <p>Tipo de Seguro: ${quoteData.insurance_type === 'new' ? 'Novo' : 'Renovação'}</p>
      
      <h2>Informações de Contato</h2>
      <p>Nome: ${quoteData.full_name}</p>
      <p>Telefone: ${quoteData.phone}</p>
      <p>Email: ${quoteData.email}</p>
      <p>CNPJ: ${quoteData.cnpj}</p>
      <p>Nome da Empresa: ${quoteData.company_name}</p>
      
      <h2>Endereço</h2>
      <p>CEP: ${quoteData.zip_code}</p>
      <p>Logradouro: ${quoteData.street}</p>
      <p>Número: ${quoteData.number}</p>
      <p>Complemento: ${quoteData.complement || 'Não informado'}</p>
      <p>Bairro: ${quoteData.neighborhood}</p>
      <p>Cidade: ${quoteData.city}</p>
      <p>Estado: ${quoteData.state}</p>
      
      <h2>Informações do Imóvel</h2>
      <p>Pavimento: ${quoteData.floor === 'ground' ? 'Térreo' : quoteData.floor === 'first' ? 'Primeiro andar' : 'Segundo andar em diante'}</p>
      <p>Ano de Construção: ${quoteData.construction_year}</p>
      <p>Tipo de Construção: ${
        quoteData.construction_type === 'superior' ? 'Superior' :
        quoteData.construction_type === 'solid' ? 'Sólida' :
        quoteData.construction_type === 'mixed' ? 'Mista' : 'Inferior'
      }</p>
      <p>Localização: ${
        quoteData.location_type === 'airport' ? 'Aeroporto' :
        quoteData.location_type === 'market' ? 'Ceasa/Mercado' :
        quoteData.location_type === 'commercial_condo' ? 'Condomínio Comercial' :
        quoteData.location_type === 'mall' ? 'Shopping' : 'Supermercado'
      }</p>
      
      <h2>Equipamentos de Segurança</h2>
      <p>Equipamentos de Segurança: ${formatArray(quoteData.security_equipment)}</p>
      <p>Equipamentos de Incêndio: ${formatArray(quoteData.fire_equipment)}</p>
      
      <h2>Atividade Principal</h2>
      <p>${quoteData.main_activity}</p>
      
      <h2>Informações Complementares</h2>
      <p>Local utilizado exclusivamente para depósito: ${formatBoolean(quoteData.additional_info.is_warehouse)}</p>
      <p>Faz divisa com terreno baldio: ${formatBoolean(quoteData.additional_info.is_next_to_vacant)}</p>
      <p>Tombado pelo patrimônio histórico: ${formatBoolean(quoteData.additional_info.is_historical)}</p>
      <p>Possui telhado/estrutura de metal: ${formatBoolean(quoteData.additional_info.has_metal_structure)}</p>
      <p>Possui caixas eletrônicos: ${formatBoolean(quoteData.additional_info.has_atm)}</p>
      <p>Possui isopainel: ${formatBoolean(quoteData.additional_info.has_isopanel)}</p>
      <p>Em construção/reforma: ${formatBoolean(quoteData.additional_info.is_under_construction)}</p>
      
      <h2>Coberturas</h2>
      <p>Básica: ${formatCurrency(quoteData.coverage_options.basic)}</p>
      <p>Danos Elétricos: ${formatCurrency(quoteData.coverage_options.electrical_damage)}</p>
      <p>Vidros: ${formatCurrency(quoteData.coverage_options.glass)}</p>
      <p>Roubo de bens: ${formatCurrency(quoteData.coverage_options.theft)}</p>
      <p>Equipamentos: ${formatCurrency(quoteData.coverage_options.equipment)}</p>
      <p>Impacto de veículos: ${formatCurrency(quoteData.coverage_options.vehicle_impact)}</p>
      <p>Aluguel: ${formatCurrency(quoteData.coverage_options.rent)}</p>
      <p>Responsabilidade Civil do Empregador: ${formatCurrency(quoteData.coverage_options.employer_liability)}</p>
      ${quoteData.coverage_options.other_coverage_notes ? `<p>Outras coberturas: ${quoteData.coverage_options.other_coverage_notes}</p>` : ''}
      
      <h2>Consultor</h2>
      <p>${quoteData.seller}</p>
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Feijó Seguros <noreply@feijoseguros.com.br>',
      to: ['cotacoes.feijocorretora@gmail.com'],
      subject: 'Nova Cotação de Seguro Empresarial',
      html: emailContent,
      attachments: policyFile ? [{
        filename: policyFile.name,
        content: policyFile.content,
      }] : undefined,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({ error: "Error sending email" }),
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
      JSON.stringify({ message: "Quote submitted successfully", data }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
}); 
