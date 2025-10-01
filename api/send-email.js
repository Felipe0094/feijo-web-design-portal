import { Resend } from 'resend';

// Debug: Verificar variáveis de ambiente disponíveis
console.log('=== DEBUG VARIÁVEIS DE AMBIENTE ===');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'CONFIGURADA' : 'NÃO ENCONTRADA');
console.log('Resend_API_Key:', process.env.Resend_API_Key ? 'CONFIGURADA' : 'NÃO ENCONTRADA');
console.log('VITE_RESEND_API_KEY:', process.env.VITE_RESEND_API_KEY ? 'CONFIGURADA' : 'NÃO ENCONTRADA');

// Tentar diferentes variações do nome da variável
const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key || process.env.VITE_RESEND_API_KEY;

console.log('API Key encontrada:', apiKey ? `Sim (${apiKey.substring(0, 8)}...)` : 'NÃO');

if (!apiKey) {
  console.error('ERRO: Nenhuma API key encontrada nas variáveis de ambiente');
  console.log('Variáveis disponíveis:', Object.keys(process.env).filter(key => key.toLowerCase().includes('resend')));
}

// No Vercel, variáveis de ambiente não precisam do prefixo VITE_ para serverless functions
const resend = new Resend(apiKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Debug: Log environment variables (sem expor a chave completa) - usando a mesma variável do topo
    console.log('Environment check:', {
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      hasResendApiKeyCase: !!process.env.Resend_API_Key,
      hasViteResendApiKey: !!process.env.VITE_RESEND_API_KEY,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 3) + '...' : 'none'
    });

    // Verificar se a API key está configurada
    if (!apiKey) {
      console.error('Nenhuma API key encontrada nas variáveis de ambiente');
      return res.status(500).json({
        success: false,
        error: 'Email service not configured - API key missing'
      });
    }

    const { to, subject, html, attachments } = req.body;

    console.log('Request body received:', {
      hasTo: !!to,
      hasSubject: !!subject,
      hasHtml: !!html,
      hasAttachments: !!attachments
    });

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, html'
      });
    }

    const payload = {
      from: 'Feijó Web Design <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      payload.attachments = attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        type: attachment.type || 'application/pdf'
      }));
    }

    console.log('Sending email with payload:', {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      hasHtml: !!payload.html,
      attachmentCount: payload.attachments ? payload.attachments.length : 0
    });

    const result = await resend.emails.send(payload);

    if (result.error) {
      console.error('Resend API error:', result.error);
      return res.status(400).json({
        success: false,
        error: result.error.message || 'Failed to send email'
      });
    }

    console.log('Email sent successfully:', result.data);

    return res.status(200).json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      details: error.stack
    });
  }
}