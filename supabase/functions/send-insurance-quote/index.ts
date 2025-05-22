
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
    
    const { quoteData, policyFile, quoteType = 'auto' } = requestData;
    
    console.log("Dados recebidos:", {
      cliente: quoteData?.full_name || quoteData?.responsible_name?.substring(0, 10),
      email_destino: "cotacoes.feijocorretora@gmail.com",
      api_key_exists: !!apiKey,
      arquivo_anexado: !!policyFile,
      tipo_seguro: quoteType || quoteData?.insurance_type || 'auto'
    });
    
    // Initialize Resend with API key
    const resend = new Resend(apiKey);
    
    // Get seller name to display in email
    const sellerName = quoteData.seller || "Felipe";
    
    let emailContent;
    
    // Check if it's a health insurance quote
    if (quoteType === 'health') {
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
              background-color: #dee1e1;
              color: #fa0108;
              padding: 15px;
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
              color: #fa0108;
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
    } else if (quoteType === 'civil-works') {
      // Civil Works Insurance template
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
              background-color: #dee1e1;
              color: #fa0108;
              padding: 15px;
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
              color: #fa0108;
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
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Nova Cotação de Seguro RC Obras Civis</h1>
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
            </div>
            
            <div class="info-section">
              <h2>Informações da Obra</h2>
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
                <div class="info-value">${quoteData.start_date || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Data de Término:</div>
                <div class="info-value">${quoteData.end_date || 'Não informado'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Número de Pavimentos:</div>
                <div class="info-value">${quoteData.upper_floors_count || '0'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Número de Subsolos:</div>
                <div class="info-value">${quoteData.basement_count || '0'}</div>
              </div>
            </div>
            
            <div class="info-section">
              <h2>Endereço da Obra</h2>
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
            
            <div class="info-section">
              <h2>Características da Obra</h2>
              <div class="info-row">
                <div class="info-label">Seguro Anterior:</div>
                <div class="info-value">${quoteData.has_previous_insurance ? 'Sim' : 'Não'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Sinistros Anteriores:</div>
                <div class="info-value">${quoteData.has_previous_claims ? 'Sim' : 'Não'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Tipo de Demolição:</div>
                <div class="info-value">${quoteData.demolition_type || 'Não informado'}</div>
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
                <div class="info-label">Possui Rebaixamento de Lençol Freático:</div>
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
              <div class="info-row">
                <div class="info-label">Número de Empreiteiros:</div>
                <div class="info-value">${quoteData.contractors_count || '0'}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // Auto Insurance and other insurance types template with updated styling
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
              background-color: #dee1e1;
              color: #fa0108;
              padding: 15px;
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
              color: #fa0108;
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
              ${quoteData.birth_date ? `
              <div class="info-row">
                <div class="info-label">Data de Nascimento:</div>
                <div class="info-value">${quoteData.birth_date}</div>
              </div>` : ''}
              ${quoteData.marital_status ? `
              <div class="info-row">
                <div class="info-label">Estado Civil:</div>
                <div class="info-value">${
                  quoteData.marital_status === 'single' ? 'Solteiro(a)' :
                  quoteData.marital_status === 'married' ? 'Casado(a)' :
                  quoteData.marital_status === 'divorced' ? 'Divorciado(a)' :
                  quoteData.marital_status === 'widowed' ? 'Viúvo(a)' : 'Outro'
                }</div>
              </div>` : ''}
              ${quoteData.gender ? `
              <div class="info-row">
                <div class="info-label">Gênero:</div>
                <div class="info-value">${
                  quoteData.gender === 'male' ? 'Masculino' :
                  quoteData.gender === 'female' ? 'Feminino' : 'Outro'
                }</div>
              </div>` : ''}
              ${quoteData.residence_type ? `
              <div class="info-row">
                <div class="info-label">Tipo de Residência:</div>
                <div class="info-value">${
                  quoteData.residence_type === 'house' ? 'Casa' :
                  quoteData.residence_type === 'apartment' ? 'Apartamento' : 'Condomínio'
                }</div>
              </div>` : ''}
              ${quoteData.address ? `
              <div class="info-row">
                <div class="info-label">Endereço:</div>
                <div class="info-value">${quoteData.address}</div>
              </div>` : ''}
              ${quoteData.zip_code ? `
              <div class="info-row">
                <div class="info-label">CEP:</div>
                <div class="info-value">${quoteData.zip_code}</div>
              </div>` : ''}
            </div>
      
            <div class="info-section">
              <h2>Informações do Veículo</h2>
              ${quoteData.model ? `
              <div class="info-row">
                <div class="info-label">Modelo:</div>
                <div class="info-value">${quoteData.model}</div>
              </div>` : ''}
              ${quoteData.is_new_vehicle !== undefined ? `
              <div class="info-row">
                <div class="info-label">Veículo Novo:</div>
                <div class="info-value">${quoteData.is_new_vehicle ? 'Sim' : 'Não'}</div>
              </div>` : ''}
              ${quoteData.license_plate ? `
              <div class="info-row">
                <div class="info-label">Placa:</div>
                <div class="info-value">${quoteData.license_plate}</div>
              </div>` : ''}
              ${quoteData.chassis_number ? `
              <div class="info-row">
                <div class="info-label">Número do Chassi:</div>
                <div class="info-value">${quoteData.chassis_number}</div>
              </div>` : ''}
              ${quoteData.manufacture_year ? `
              <div class="info-row">
                <div class="info-label">Ano de Fabricação:</div>
                <div class="info-value">${quoteData.manufacture_year}</div>
              </div>` : ''}
              ${quoteData.model_year ? `
              <div class="info-row">
                <div class="info-label">Ano do Modelo:</div>
                <div class="info-value">${quoteData.model_year}</div>
              </div>` : ''}
              ${quoteData.fuel_type ? `
              <div class="info-row">
                <div class="info-label">Combustível:</div>
                <div class="info-value">${quoteData.fuel_type}</div>
              </div>` : ''}
              ${quoteData.is_financed !== undefined ? `
              <div class="info-row">
                <div class="info-label">Financiado:</div>
                <div class="info-value">${quoteData.is_financed ? 'Sim' : 'Não'}</div>
              </div>` : ''}
              ${quoteData.is_armored !== undefined ? `
              <div class="info-row">
                <div class="info-label">Blindado:</div>
                <div class="info-value">${quoteData.is_armored ? 'Sim' : 'Não'}</div>
              </div>` : ''}
              ${quoteData.has_natural_gas !== undefined ? `
              <div class="info-row">
                <div class="info-label">Possui Gás Natural:</div>
                <div class="info-value">${quoteData.has_natural_gas ? 'Sim' : 'Não'}</div>
              </div>` : ''}
              ${quoteData.has_sunroof !== undefined ? `
              <div class="info-row">
                <div class="info-label">Possui Teto Solar:</div>
                <div class="info-value">${quoteData.has_sunroof ? 'Sim' : 'Não'}</div>
              </div>` : ''}
            </div>
            
            <div class="info-section">
              <h2>Informações de Garagem</h2>
              ${quoteData.parking_zip_code ? `
              <div class="info-row">
                <div class="info-label">CEP da Garagem:</div>
                <div class="info-value">${quoteData.parking_zip_code}</div>
              </div>` : ''}
              ${quoteData.has_home_garage !== undefined ? `
              <div class="info-row">
                <div class="info-label">Possui Garagem em Casa:</div>
                <div class="info-value">${quoteData.has_home_garage ? 'Sim' : 'Não'}</div>
              </div>` : ''}
              ${quoteData.has_automatic_gate !== undefined ? `
              <div class="info-row">
                <div class="info-label">Possui Portão Automático:</div>
                <div class="info-value">${quoteData.has_automatic_gate ? 'Sim' : 'Não'}</div>
              </div>` : ''}
              ${quoteData.has_work_garage !== undefined ? `
              <div class="info-row">
                <div class="info-label">Garagem no Trabalho:</div>
                <div class="info-value">${quoteData.has_work_garage === true ? 'Sim' : quoteData.has_work_garage === false ? 'Não' : quoteData.has_work_garage || 'Não informado'}</div>
              </div>` : ''}
              ${quoteData.has_school_garage !== undefined ? `
              <div class="info-row">
                <div class="info-label">Garagem na Escola:</div>
                <div class="info-value">${quoteData.has_school_garage === true ? 'Sim' : quoteData.has_school_garage === false ? 'Não' : quoteData.has_school_garage || 'Não informado'}</div>
              </div>` : ''}
              ${quoteData.vehicle_usage ? `
              <div class="info-row">
                <div class="info-label">Uso do Veículo:</div>
                <div class="info-value">${
                  quoteData.vehicle_usage === 'personal' ? 'Pessoal' :
                  quoteData.vehicle_usage === 'work' ? 'Trabalho' : 'Transporte de Passageiros'
                }</div>
              </div>` : ''}
              ${quoteData.vehicles_at_residence ? `
              <div class="info-row">
                <div class="info-label">Veículos na Residência:</div>
                <div class="info-value">${quoteData.vehicles_at_residence}</div>
              </div>` : ''}
            </div>
            
            <div class="info-section">
              <h2>Informações do Condutor</h2>
              ${quoteData.covers_young_drivers !== undefined ? `
              <div class="info-row">
                <div class="info-label">Cobre Condutores Jovens:</div>
                <div class="info-value">${quoteData.covers_young_drivers ? 'Sim' : 'Não'}</div>
              </div>` : ''}
              ${quoteData.condutor_menor ? `
              <div class="info-row">
                <div class="info-label">Idade do Condutor Menor:</div>
                <div class="info-value">${quoteData.condutor_menor}</div>
              </div>` : ''}
              ${quoteData.is_driver_insured !== undefined ? `
              <div class="info-row">
                <div class="info-label">Condutor é o Segurado:</div>
                <div class="info-value">${quoteData.is_driver_insured ? 'Sim' : 'Não'}</div>
              </div>` : ''}
              
              ${!quoteData.is_driver_insured && quoteData.driver_full_name ? `
              <div class="info-row">
                <div class="info-label">Nome do Condutor:</div>
                <div class="info-value">${quoteData.driver_full_name}</div>
              </div>` : ''}
              ${!quoteData.is_driver_insured && quoteData.driver_document_number ? `
              <div class="info-row">
                <div class="info-label">CPF do Condutor:</div>
                <div class="info-value">${quoteData.driver_document_number}</div>
              </div>` : ''}
              ${!quoteData.is_driver_insured && quoteData.driver_birth_date ? `
              <div class="info-row">
                <div class="info-label">Data de Nascimento do Condutor:</div>
                <div class="info-value">${quoteData.driver_birth_date}</div>
              </div>` : ''}
              ${!quoteData.is_driver_insured && quoteData.driver_marital_status ? `
              <div class="info-row">
                <div class="info-label">Estado Civil do Condutor:</div>
                <div class="info-value">${
                  quoteData.driver_marital_status === 'single' ? 'Solteiro(a)' :
                  quoteData.driver_marital_status === 'married' ? 'Casado(a)' :
                  quoteData.driver_marital_status === 'divorced' ? 'Divorciado(a)' :
                  quoteData.driver_marital_status === 'widowed' ? 'Viúvo(a)' : 'Outro'
                }</div>
              </div>` : ''}
              ${!quoteData.is_driver_insured && quoteData.driver_gender ? `
              <div class="info-row">
                <div class="info-label">Gênero do Condutor:</div>
                <div class="info-value">${
                  quoteData.driver_gender === 'male' ? 'Masculino' :
                  quoteData.driver_gender === 'female' ? 'Feminino' : 'Outro'
                }</div>
              </div>` : ''}
              ${!quoteData.is_driver_insured && quoteData.driver_relationship ? `
              <div class="info-row">
                <div class="info-label">Relação com o Segurado:</div>
                <div class="info-value">${quoteData.driver_relationship}</div>
              </div>` : ''}
            </div>
            
            ${policyFile ? `<p>A apólice do cliente está anexada a este email.</p>` : ''}
          </div>
        </body>
        </html>
      `;
    }

    console.log("Preparando para enviar email via Resend");
    
    try {
      // Define email data - using the specified recipient email
      const emailData = {
        from: "Cotações Feijó <onboarding@resend.dev>",  // Using Resend's default verified sender
        to: ["cotacoes.feijocorretora@gmail.com"],  // Using the specified recipient
        subject: `${sellerName} - Cotação ${
          quoteType === 'health' ? 'Plano de Saúde' : 
          quoteType === 'civil-works' ? 'RC Obras Civis' : 'Seguro Auto'
        } - ${quoteData.responsible_name || quoteData.full_name || 'Novo Cliente'}`,
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
