import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Debug environment variables
console.log('\n=== DEBUG VARIÁVEIS DE AMBIENTE ===');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'CONFIGURADA' : 'NÃO ENCONTRADA');
console.log('Resend_API_Key:', process.env.Resend_API_Key ? 'CONFIGURADA' : 'NÃO ENCONTRADA');
console.log('VITE_RESEND_API_KEY:', process.env.VITE_RESEND_API_KEY ? 'CONFIGURADA' : 'NÃO ENCONTRADA');

// Use RESEND_API_KEY first, fallback to VITE_RESEND_API_KEY
const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
console.log('API Key encontrada:', apiKey ? `Sim (${apiKey.substring(0, 7)}...)` : 'Não');

// Initialize Resend with API key from environment
const resend = new Resend(apiKey);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3001', 
    'http://localhost:3000',
    'https://feijo-seguros.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, attachments } = req.body;

    // Debug request body
    console.log('\nRequest body received:', {
      hasTo: !!to,
      hasSubject: !!subject,
      hasHtml: !!html,
      hasAttachments: !!(attachments && attachments.length > 0),
      to: to,
      subject: subject
    });

    if (!to || !subject || !html) {
      console.log('Missing required fields:', { to: !!to, subject: !!subject, html: !!html });
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
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Email server running on http://localhost:${port}`);
});