import { Resend } from 'resend';

// No Vercel, variáveis de ambiente não precisam do prefixo VITE_ para serverless functions
const resend = new Resend(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);

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
    // Verificar se a API key está configurada
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({
        success: false,
        error: 'Email service not configured'
      });
    }

    const { to, subject, html, attachments } = req.body;

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

    const result = await resend.emails.send(payload);

    if (result.error) {
      console.error('Resend API error:', result.error);
      return res.status(400).json({
        success: false,
        error: result.error.message || 'Failed to send email'
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}