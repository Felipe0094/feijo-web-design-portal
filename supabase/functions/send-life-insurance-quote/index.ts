
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.25.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("Life insurance quote notification function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the request body
    const requestData = await req.json();
    const { quoteData, policyFile } = requestData;

    console.log("Processing life insurance quote:", quoteData.full_name);

    // Format the email content
    const emailSubject = `Nova Cotação de Seguro de Vida - ${quoteData.full_name}`;
    const insuranceType = quoteData.insurance_type === "new" ? "Novo seguro" : "Renovação";
    const smoker = quoteData.smoker ? "Sim" : "Não";
    const practicesSports = quoteData.practices_sports ? "Sim" : "Não";
    
    // Format monetary values
    const formatCurrency = (value: number | null) => {
      if (value === null || value === undefined) return 'Não informado';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    let retirementStatus = "Não aposentado";
    if (quoteData.retirement_status === "time_age") {
      retirementStatus = "Por tempo/idade";
    } else if (quoteData.retirement_status === "disability") {
      retirementStatus = "Por invalidez";
    }

    // Generate the email body
    let emailHtml = `
      <h2>Nova Cotação de Seguro de Vida</h2>
      <p><strong>Consultor responsável:</strong> ${quoteData.seller}</p>
      <p><strong>Tipo de seguro:</strong> ${insuranceType}</p>
      
      <h3>Informações Pessoais</h3>
      <ul>
        <li><strong>Nome:</strong> ${quoteData.full_name}</li>
        <li><strong>CPF/CNPJ:</strong> ${quoteData.document_number}</li>
        <li><strong>Data de Nascimento:</strong> ${quoteData.birth_date}</li>
        <li><strong>Telefone:</strong> ${quoteData.phone}</li>
        <li><strong>Email:</strong> ${quoteData.email}</li>
      </ul>
      
      <h3>Informações de Saúde</h3>
      <ul>
        <li><strong>Peso:</strong> ${quoteData.weight} kg</li>
        <li><strong>Altura:</strong> ${quoteData.height} cm</li>
        <li><strong>Renda Mensal:</strong> ${formatCurrency(quoteData.monthly_income)}</li>
        <li><strong>Fumante:</strong> ${smoker}</li>
        <li><strong>Pratica Esportes:</strong> ${practicesSports}</li>
    `;

    // Add sports description if available
    if (quoteData.practices_sports && quoteData.sports_description) {
      emailHtml += `<li><strong>Esportes praticados:</strong> ${quoteData.sports_description}</li>`;
    }

    emailHtml += `
        <li><strong>Aposentadoria:</strong> ${retirementStatus}</li>
      </ul>
      
      <h3>Valores de Cobertura</h3>
      <ul>
        <li><strong>Morte Padrão:</strong> ${formatCurrency(quoteData.standard_death_coverage)}</li>
        <li><strong>Morte Acidental:</strong> ${formatCurrency(quoteData.accidental_death_coverage)}</li>
        <li><strong>Invalidez Permanente (IPA):</strong> ${formatCurrency(quoteData.permanent_disability_coverage)}</li>
      </ul>
    `;

    // Set recipients based on consultant
    let recipients: string[];
    switch (quoteData.seller) {
      case "Felipe":
        recipients = ["felipe@feijoesouza.com"];
        break;
      case "Renan":
        recipients = ["renan@feijoesouza.com"];
        break;
      case "Renata":
        recipients = ["renata@feijoesouza.com"];
        break;
      case "Gabriel":
        recipients = ["gabriel@feijoesouza.com"];
        break;
      default:
        recipients = ["contato@feijoesouza.com"];
    }

    // Add a copy for the main email account
    if (!recipients.includes("contato@feijoesouza.com")) {
      recipients.push("contato@feijoesouza.com");
    }

    // Prepare the email payload
    const emailPayload = {
      to: recipients,
      subject: emailSubject,
      html: emailHtml,
      from: "noreply@feijoesouza.com",
      reply_to: quoteData.email,
    };

    // If a policy file was provided, attach it
    if (policyFile) {
      emailPayload["attachments"] = [
        {
          content: policyFile.content,
          filename: policyFile.name,
          type: policyFile.type,
          disposition: "attachment",
        },
      ];
    }

    // Send the email using the email service
    const { data: emailResult, error: emailError } = await supabase.functions.invoke(
      "send-email",
      {
        body: emailPayload,
      }
    );

    if (emailError) {
      console.error("Error sending life insurance quote email:", emailError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send notification email" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Life insurance quote email sent successfully");
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in life insurance quote notification function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
