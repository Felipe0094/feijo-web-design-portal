import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend('re_2hAktQX4_MZFwiUSRBdNzge3oSxXAqnkh');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Email API route called:', req.method);
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Processing email request...');
    const { to, subject, html, attachments } = req.body;

    if (!to || !subject || !html) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }

    console.log('Sending email to:', to);

    const emailData: any = {
      from: 'Feijó Web Design <noreply@feijowebdesign.com>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      emailData.attachments = attachments.map((attachment: any) => ({
        filename: attachment.filename,
        content: attachment.content,
        type: attachment.type || 'application/pdf'
      }));
    }

    const result = await resend.emails.send(emailData);

    console.log('Email sent successfully:', result);
    return res.status(200).json({ success: true, id: result.data?.id });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}