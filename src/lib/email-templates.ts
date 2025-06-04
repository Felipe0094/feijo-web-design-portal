import { supabase } from '@/integrations/supabase/client';

const emailStyles = `
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
`;

export const getRecipients = (seller: string) => {
  const baseEmail = 'cotacoes.feijocorretora@gmail.com';
  return [baseEmail];
};

export const sendEmail = async ({
  to,
  subject,
  content,
  replyTo,
  attachments
}: {
  to: string[];
  subject: string;
  content: string;
  replyTo?: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
  }[];
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-auto-insurance-quote', {
      body: {
        quoteData: JSON.parse(content),
        policyFile: attachments?.[0]
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendEmail:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};

export const generateAutoInsuranceEmailContent = (quoteData: any) => {
  const sellerName = quoteData.seller;
  
  return `
    <div class="header">
      <h1>Nova Cotação de Seguro Auto</h1>
      <p>Vendedor: ${sellerName}</p>
    </div>
    <div class="content">
      <div class="info-section">
        <h2>Informações Pessoais</h2>
        <div class="info-row">
          <div class="info-label">Nome/Razão Social:</div>
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
        <h2>Informações do Veículo</h2>
        <div class="info-row">
          <div class="info-label">Placa:</div>
          <div class="info-value">${quoteData.license_plate || 'Não informado'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Modelo:</div>
          <div class="info-value">${quoteData.model || 'Não informado'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Ano:</div>
          <div class="info-value">${quoteData.model_year || 'Não informado'}</div>
        </div>
      </div>

      <div class="footer">
        <p>Esta é uma cotação automática gerada pelo sistema.</p>
        <p>Data de envio: ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  `;
}; 