import type { LifeInsuranceFormData } from "./types";
import { toast } from "sonner";
import { sendEmail } from "@/lib/email-service";

// Função para gerar o conteúdo HTML do email
const generateEmailContent = (quoteData: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nova Cotação de Seguro de Vida</title>
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
        <h1>Nova Cotação de Seguro de Vida</h1>
      </div>
      <div class="content">
        <div class="section">
          <div class="section-title">Informações Pessoais</div>
          <div class="info-row">
            <div class="info-label">Nome Completo:</div>
            <div class="info-value">${quoteData.fullName || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">CPF:</div>
            <div class="info-value">${quoteData.cpf || 'Não informado'}</div>
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
            <div class="info-value">${quoteData.birthDate || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Gênero:</div>
            <div class="info-value">${quoteData.gender || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Estado Civil:</div>
            <div class="info-value">${quoteData.maritalStatus || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Profissão:</div>
            <div class="info-value">${quoteData.profession || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Renda Mensal:</div>
            <div class="info-value">${quoteData.monthlyIncome || 'Não informado'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Endereço</div>
          <div class="info-row">
            <div class="info-label">CEP:</div>
            <div class="info-value">${quoteData.zipCode || 'Não informado'}</div>
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

        <div class="section">
          <div class="section-title">Informações do Seguro</div>
          <div class="info-row">
            <div class="info-label">Capital Segurado Desejado:</div>
            <div class="info-value">${quoteData.desiredCoverage || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Cobertura:</div>
            <div class="info-value">${quoteData.coverageType || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Beneficiários:</div>
            <div class="info-value">${quoteData.beneficiaries || 'Não informado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Possui Doenças Preexistentes:</div>
            <div class="info-value">${quoteData.hasPreexistingConditions ? 'Sim' : 'Não'}</div>
          </div>
          ${quoteData.preexistingConditions ? `
          <div class="info-row">
            <div class="info-label">Doenças Preexistentes:</div>
            <div class="info-value">${quoteData.preexistingConditions}</div>
          </div>
          ` : ''}
          <div class="info-row">
            <div class="info-label">Pratica Esportes Radicais:</div>
            <div class="info-value">${quoteData.practicesExtremeSports ? 'Sim' : 'Não'}</div>
          </div>
          ${quoteData.extremeSports ? `
          <div class="info-row">
            <div class="info-label">Esportes Praticados:</div>
            <div class="info-value">${quoteData.extremeSports}</div>
          </div>
          ` : ''}
          <div class="info-row">
            <div class="info-label">Fumante:</div>
            <div class="info-value">${quoteData.isSmoker ? 'Sim' : 'Não'}</div>
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

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:mime/type;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

export async function submitQuote(
  formData: LifeInsuranceFormData,
  policyFile?: File | null
) {
  try {
    console.log("Submitting life insurance quote:", formData);

    // Clean values - remove undefined and special type objects
    const cleanValues = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => {
        if (v === undefined) return false;
        if (v !== null && typeof v === 'object' && '_type' in v) return false;
        return true;
      })
    );

    // Send email notification
    console.log("Enviando email para cotacoes.feijocorretora@gmail.com");
    
    // Format email data properly
    const emailData = {
      to: ["cotacoes.feijocorretora@gmail.com"],
      subject: "Nova Cotação - Seguro de Vida",
      html: generateEmailContent(cleanValues),
      attachments: policyFile ? [{
        filename: policyFile.name,
        content: await fileToBase64(policyFile),
        type: policyFile.type
      }] : undefined
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
    console.error("Error in submitLifeInsuranceQuote:", error);
    toast.error("Erro ao enviar cotação. Por favor, tente novamente mais tarde.");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}
