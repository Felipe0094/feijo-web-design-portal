import { HealthInsuranceFormData } from "./types";
import { sendEmail } from "@/lib/email-service";
import { toast } from "sonner";

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Function to generate HTML email content
const generateEmailContent = (formData: HealthInsuranceFormData): string => {
  const dependentsList = formData.dependents && formData.dependents.length > 0 
    ? formData.dependents.map((dep, index) => `
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <strong>Dependente ${index + 1}:</strong><br>
          Nome: ${dep.name}<br>
          CPF: ${dep.cpf}<br>
          Data de Nascimento: ${dep.birth_date}<br>
          Parentesco: ${dep.relationship}
        </div>
      `).join('')
    : '<p>Nenhum dependente informado</p>';

  return `
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
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #FA0108 0%, #8B0000 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
        }
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #FA0108;
        }
        .section h2 {
          color: #FA0108;
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
          font-weight: bold;
        }
        .info-row {
          display: flex;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .info-label {
          font-weight: bold;
          color: #333;
          min-width: 150px;
          margin-right: 10px;
        }
        .info-value {
          color: #666;
          flex: 1;
        }
        .footer {
          background-color: #333;
          color: white;
          padding: 20px;
          text-align: center;
          font-size: 14px;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nova Cotação - Plano de Saúde</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Feijó Corretora de Seguros</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>📋 Informações da Empresa</h2>
            <div class="info-row">
              <span class="info-label">CNPJ:</span>
              <span class="info-value">${formData.document_number || 'Não informado'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nome do Responsável:</span>
              <span class="info-value">${formData.responsible_name || 'Não informado'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Telefone:</span>
              <span class="info-value">${formData.phone || 'Não informado'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">E-mail:</span>
              <span class="info-value">${formData.email || 'Não informado'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Município:</span>
              <span class="info-value">${formData.municipality || 'Não informado'}</span>
            </div>
          </div>

          <div class="section">
            <h2>👤 Informações do Segurado</h2>
            <div class="info-row">
              <span class="info-label">Nome:</span>
              <span class="info-value">${formData.insured_name || 'Não informado'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">CPF:</span>
              <span class="info-value">${formData.insured_cpf || 'Não informado'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data de Nascimento:</span>
              <span class="info-value">${formData.insured_birth_date || 'Não informado'}</span>
            </div>
          </div>

          <div class="section">
            <h2>🏥 Informações do Plano</h2>
            <div class="info-row">
              <span class="info-label">Tipo de Acomodação:</span>
              <span class="info-value">${formData.room_type === 'individual' ? 'Individual' : 'Coletiva'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Coparticipação:</span>
              <span class="info-value">${formData.has_copayment === 'yes' ? 'Sim' : 'Não'}</span>
            </div>
          </div>

          <div class="section">
            <h2>👨‍👩‍👧‍👦 Dependentes</h2>
            ${dependentsList}
          </div>

          ${formData.notes ? `
          <div class="section">
            <h2>📝 Observações</h2>
            <p style="margin: 0; color: #666;">${formData.notes}</p>
          </div>
          ` : ''}

          <div class="section">
            <h2>👤 Vendedor Responsável</h2>
            <div class="info-row">
              <span class="info-label">Vendedor:</span>
              <span class="info-value">${formData.seller || 'Felipe'}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Feijó Corretora de Seguros</strong></p>
          <p>Esta é uma cotação automática gerada pelo sistema.</p>
          <p>Data: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const submitQuote = async (
  formData: HealthInsuranceFormData,
  currentPlanFile?: File
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Submitting health insurance quote:", formData);
    
    // Clean and prepare quote data
    const { dependents, ...quoteFields } = formData;
    const quoteData = {
      ...quoteFields,
      has_copayment: formData.has_copayment === 'yes',
      created_at: new Date().toISOString(),
      dependents: dependents || []
    };
    
    // Send email notification
    console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
    
    // Prepare attachments
    const attachments = [];
    if (currentPlanFile) {
      try {
        const base64Content = await fileToBase64(currentPlanFile);
        const base64Data = base64Content.split(',')[1]; // Remove data:type;base64, prefix
        
        attachments.push({
          filename: currentPlanFile.name,
          content: base64Data,
          type: currentPlanFile.type,
          disposition: 'attachment'
        });
      } catch (error) {
        console.error("Erro ao converter arquivo para base64:", error);
      }
    }
    
    const emailData = {
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: `Nova Cotação - Plano de Saúde - ${formData.responsible_name || 'Cliente'}`,
      html: generateEmailContent(formData),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    const emailResult = await sendEmail(emailData);
    
    if (!emailResult.success) {
      console.error("Erro ao enviar email:", emailResult.error);
      toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
      return { success: false, error: emailResult.error };
    }

    console.log("Email enviado com sucesso:", emailResult);
    toast.success("Cotação enviada com sucesso! Em breve entraremos em contato.");
    return { success: true };
  } catch (error) {
    console.error("Error submitting health insurance quote:", error);
    toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar cotação." 
    };
  }
};
