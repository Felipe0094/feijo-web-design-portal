import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend('re_2hAktQX4_MZFwiUSRBdNzge3oSxXAqnkh');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route called:', req.method);
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Processing request body...');
    const { quoteData } = req.body;

    if (!quoteData) {
      console.log('No quote data provided');
      return res.status(400).json({ error: 'No quote data provided' });
    }

    console.log('Quote data received:', quoteData);

    // Format monetary values
    const formatCurrency = (value) => {
      if (value === null || value === undefined) return 'Não informado';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return 'Não informado';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Data inválida';
      }
    };

    // Create email content
    const emailContent = `
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
          <h1 style="color: #544f4f; margin: 0;">Nova Cotação de Seguro de Obras Civis</h1>
          <div class="seller-info">
            Vendedor: ${quoteData.seller || 'Não informado'}
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
          <h2 class="section-title">Histórico</h2>
          <div class="info-row">
            <div class="info-label">Possui seguro anterior:</div>
            <div class="info-value">${quoteData.has_previous_insurance ? "Sim" : "Não"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui sinistros anteriores:</div>
            <div class="info-value">${quoteData.has_previous_claims ? "Sim" : "Não"}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Detalhes da Obra</h2>
          <div class="info-row">
            <div class="info-label">Tipo de Obra:</div>
            <div class="info-value">${quoteData.construction_type}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Serviço:</div>
            <div class="info-value">${quoteData.service_type}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Descrição dos Serviços:</div>
            <div class="info-value">${quoteData.services_description || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Início:</div>
            <div class="info-value">${formatDate(quoteData.start_date)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Término:</div>
            <div class="info-value">${formatDate(quoteData.end_date)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Pavimentos:</div>
            <div class="info-value">${quoteData.upper_floors_count}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Subsolos:</div>
            <div class="info-value">${quoteData.basement_count}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Serviço de Aterramento:</div>
            <div class="info-value">${quoteData.has_grounding_service ? "Sim" : "Não"}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Estrutura</h2>
          <div class="info-row">
            <div class="info-label">Tipos de Estrutura:</div>
            <div class="info-value">
              ${[
                quoteData.structure_types.wood ? "Madeira" : null,
                quoteData.structure_types.concrete ? "Concreto" : null,
                quoteData.structure_types.metal ? "Metal" : null,
                quoteData.structure_types.other ? "Outro" : null
              ].filter(Boolean).join(", ")}
            </div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Demolição:</div>
            <div class="info-value">${quoteData.demolition_type === "manual" ? "Manual" : quoteData.demolition_type === "mechanical" ? "Mecânica" : "Não há"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Tirantes:</div>
            <div class="info-value">${quoteData.has_tie_rods ? "Sim" : "Não"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Edificações Adjacentes:</div>
            <div class="info-value">${quoteData.has_adjacent_buildings ? "Sim" : "Não"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Rebaixamento de Lençol:</div>
            <div class="info-value">${quoteData.has_water_table_lowering ? "Sim" : "Não"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Escavação:</div>
            <div class="info-value">${quoteData.has_excavation ? "Sim" : "Não"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Contenção de Terreno:</div>
            <div class="info-value">${quoteData.has_terrain_containment ? "Sim" : "Não"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Reforço Estrutural:</div>
            <div class="info-value">${quoteData.has_structural_reinforcement ? "Sim" : "Não"}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Quantidade de Contratados:</div>
            <div class="info-value">${quoteData.contractors_count}</div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Endereço da Obra</h2>
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
          <h2 class="section-title">Coberturas</h2>
          <div class="info-row">
            <div class="info-label">Básica:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.basic)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Danos Materiais ao Proprietário:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.property_owner_material_damages)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Responsabilidade Civil Cruzada:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.cross_liability)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Responsabilidade Civil Empregador:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.employer_liability)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Danos Morais:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.moral_damages)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Erro de Projeto:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.project_error)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Vazamento de Água:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.water_leakage)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Poluição:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.pollution)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Danos Morais Resultantes:</div>
            <div class="info-value">${formatCurrency(quoteData.coverage_options.resulting_moral_damages)}</div>
          </div>
        </div>

        <div class="footer">
          <p>Esta é uma mensagem automática. Por favor, não responda a este email.</p>
          <p>© 2024 Feijó Corretora. Todos os direitos reservados.</p>
        </div>
      </body>
      </html>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Cotações <onboarding@resend.dev>",
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: `Nova Cotação de Seguro de Obras Civis - ${quoteData.full_name} - Vendedor: ${quoteData.seller || "Não informado"}`,
      html: emailContent,
      reply_to: quoteData.email
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ error: emailError.message });
    }

    return res.status(200).json({ success: true, data: emailData });
  } catch (error) {
    console.error("Error in API route:", error);
    return res.status(500).json({ error: error.message });
  }
} 