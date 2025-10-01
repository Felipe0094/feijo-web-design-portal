
import { CivilWorksInsuranceFormData } from './types';
import { toast } from "sonner";
import { sendEmail } from "@/lib/email-service";

// Tipo para dados processados com datas como strings
type ProcessedCivilWorksData = Omit<CivilWorksInsuranceFormData, 'start_date' | 'end_date' | 'coverage_options' | 'structure_types'> & {
  start_date: string;
  end_date: string;
  coverage_options: { [k: string]: number };
  structure_types: { [k: string]: boolean };
};

// Função para gerar o conteúdo HTML do email
const generateEmailContent = (quoteData: ProcessedCivilWorksData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nova Cotação de Seguro de Obras Civis</title>
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
          background-color: #FA0108;
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
        .section {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .section-title {
          color: #544f4f;
          border-bottom: 2px solid #FA0108;
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: bold;
        }
        .info-row {
          display: flex;
          margin-bottom: 10px;
          padding: 5px 0;
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
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Nova Cotação de Seguro de Obras Civis</h1>
      </div>
      <div class="content">
        <div class="section">
          <div class="section-title">Informações Pessoais</div>
          <div class="info-row">
            <div class="info-label">Nome Completo:</div>
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
        </div>

        <div class="section">
          <div class="section-title">Histórico do Cliente</div>
          <div class="info-row">
            <div class="info-label">Possui Seguro Anterior:</div>
            <div class="info-value">${quoteData.has_previous_insurance ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Sinistros Anteriores:</div>
            <div class="info-value">${quoteData.has_previous_claims ? 'Sim' : 'Não'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Detalhes da Obra</div>
          <div class="info-row">
            <div class="info-label">Tipo de Construção:</div>
            <div class="info-value">${quoteData.construction_type || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Serviço:</div>
            <div class="info-value">${quoteData.service_type || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Descrição dos Serviços:</div>
            <div class="info-value">${quoteData.services_description || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Início:</div>
            <div class="info-value">${quoteData.start_date}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Término:</div>
            <div class="info-value">${quoteData.end_date}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Andares Superiores:</div>
            <div class="info-value">${quoteData.upper_floors_count || 0}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Subsolos:</div>
            <div class="info-value">${quoteData.basement_count || 0}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Serviço de Aterramento:</div>
            <div class="info-value">${quoteData.has_grounding_service ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Quantidade de Contratados:</div>
            <div class="info-value">${quoteData.contractors_count || 'Não informado'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Endereço da Obra</div>
          <div class="info-row">
            <div class="info-label">CEP:</div>
            <div class="info-value">${quoteData.zip_code || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Logradouro:</div>
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
        </div>

        ${quoteData.structure_types ? `
        <div class="section">
          <div class="section-title">Tipos de Estrutura</div>
          ${quoteData.structure_types.wood ? `
          <div class="info-row">
            <div class="info-label">Madeira:</div>
            <div class="info-value">Sim</div>
          </div>
          ` : ''}
          ${quoteData.structure_types.concrete ? `
          <div class="info-row">
            <div class="info-label">Concreto:</div>
            <div class="info-value">Sim</div>
          </div>
          ` : ''}
          ${quoteData.structure_types.metal ? `
          <div class="info-row">
            <div class="info-label">Metal:</div>
            <div class="info-value">Sim</div>
          </div>
          ` : ''}
          ${quoteData.structure_types.other ? `
          <div class="info-row">
            <div class="info-label">Outros:</div>
            <div class="info-value">Sim</div>
          </div>
          ` : ''}
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Informações Adicionais</div>
          <div class="info-row">
            <div class="info-label">Tipo de Demolição:</div>
            <div class="info-value">${quoteData.demolition_type === 'manual' ? 'Manual' : quoteData.demolition_type === 'mechanical' ? 'Mecânica' : 'Nenhuma'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Tirantes:</div>
            <div class="info-value">${quoteData.has_tie_rods ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Edificações Adjacentes:</div>
            <div class="info-value">${quoteData.has_adjacent_buildings ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Rebaixamento de Lençol:</div>
            <div class="info-value">${quoteData.has_water_table_lowering ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Escavação:</div>
            <div class="info-value">${quoteData.has_excavation ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Contenção de Terreno:</div>
            <div class="info-value">${quoteData.has_terrain_containment ? 'Sim' : 'Não'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Reforço Estrutural:</div>
            <div class="info-value">${quoteData.has_structural_reinforcement ? 'Sim' : 'Não'}</div>
          </div>
        </div>

        ${quoteData.coverage_options ? `
        <div class="section">
          <div class="section-title">Coberturas Desejadas</div>
          ${quoteData.coverage_options.basic ? `
          <div class="info-row">
            <div class="info-label">Básica:</div>
            <div class="info-value">R$ ${quoteData.coverage_options.basic.toLocaleString('pt-BR')}</div>
          </div>
          ` : ''}
          ${quoteData.coverage_options.property_owner_material_damages ? `
          <div class="info-row">
            <div class="info-label">Danos Materiais ao Proprietário:</div>
            <div class="info-value">R$ ${quoteData.coverage_options.property_owner_material_damages.toLocaleString('pt-BR')}</div>
          </div>
          ` : ''}
          ${quoteData.coverage_options.cross_liability ? `
          <div class="info-row">
            <div class="info-label">Responsabilidade Civil Cruzada:</div>
            <div class="info-value">R$ ${quoteData.coverage_options.cross_liability.toLocaleString('pt-BR')}</div>
          </div>
          ` : ''}
          ${quoteData.coverage_options.employer_liability ? `
          <div class="info-row">
            <div class="info-label">Responsabilidade Civil Empregador:</div>
            <div class="info-value">R$ ${quoteData.coverage_options.employer_liability.toLocaleString('pt-BR')}</div>
          </div>
          ` : ''}
          ${quoteData.coverage_options.moral_damages ? `
          <div class="info-row">
            <div class="info-label">Danos Morais:</div>
            <div class="info-value">R$ ${quoteData.coverage_options.moral_damages.toLocaleString('pt-BR')}</div>
          </div>
          ` : ''}
          ${quoteData.coverage_options.project_error ? `
          <div class="info-row">
            <div class="info-label">Erro de Projeto:</div>
            <div class="info-value">R$ ${quoteData.coverage_options.project_error.toLocaleString('pt-BR')}</div>
          </div>
          ` : ''}
          ${quoteData.coverage_options.water_leakage ? `
          <div class="info-row">
            <div class="info-label">Vazamento de Água:</div>
            <div class="info-value">R$ ${quoteData.coverage_options.water_leakage.toLocaleString('pt-BR')}</div>
          </div>
          ` : ''}
          ${quoteData.coverage_options.pollution ? `
          <div class="info-row">
            <div class="info-label">Poluição:</div>
            <div class="info-value">R$ ${quoteData.coverage_options.pollution.toLocaleString('pt-BR')}</div>
          </div>
          ` : ''}
          ${quoteData.coverage_options.resulting_moral_damages ? `
          <div class="info-row">
            <div class="info-label">Danos Morais Resultantes:</div>
            <div class="info-value">R$ ${quoteData.coverage_options.resulting_moral_damages.toLocaleString('pt-BR')}</div>
          </div>
          ` : ''}
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Consultor Responsável</div>
          <div class="info-row">
            <div class="info-label">Consultor:</div>
            <div class="info-value">${quoteData.seller || 'Não informado'}</div>
          </div>
        </div>

        <div class="footer">
          <p>Esta cotação foi gerada automaticamente pelo sistema Feijó Corretora de Seguros.</p>
          <p>Para mais informações, entre em contato conosco.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const submitCivilWorksInsuranceQuote = async (data: CivilWorksInsuranceFormData) => {
  try {
    console.log("Submitting civil works insurance quote:", data);

    // Clean up values before sending
    const cleanValues = {
      ...data,
      // Convert dates to proper format
      start_date: data.start_date instanceof Date ? data.start_date.toISOString().split('T')[0] : data.start_date,
      end_date: data.end_date instanceof Date ? data.end_date.toISOString().split('T')[0] : data.end_date,
      // Remove any undefined or null values from nested objects
      coverage_options: Object.fromEntries(
        Object.entries(data.coverage_options).filter(([_, v]) => v != null)
      ),
      structure_types: Object.fromEntries(
        Object.entries(data.structure_types).filter(([_, v]) => v != null)
      )
    };

    // Send email notification
    console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
    
    // Prepare email data with proper format
    const emailData = {
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: "Nova Cotação de Seguro de Obras Civis",
      html: generateEmailContent(cleanValues),
      attachments: []
    };

    const emailResult = await sendEmail(emailData);
    
    if (!emailResult.success) {
      console.error("Erro ao enviar email:", emailResult.error);
      toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
      throw new Error(emailResult.error);
    }

    console.log("Email enviado com sucesso:", emailResult);
    toast.success("Cotação enviada com sucesso! Em breve entraremos em contato.");
    return { success: true };
  } catch (error) {
    console.error("Error in submitCivilWorksInsuranceQuote:", error);
    toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
