import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailStyles = `
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
  }
  .header {
    background-color:rgb(163, 43, 43);
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

export async function POST(request: Request) {
  try {
    const { to, subject, content, replyTo, attachments } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'RESEND_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Feijo Web Design <noreply@feijowebdesign.com.br>',
      to,
      subject,
      html: content,
      reply_to: replyTo,
      attachments: attachments?.map((attachment: any) => ({
        filename: attachment.filename,
        content: Buffer.from(attachment.content, 'base64'),
        contentType: attachment.type
      }))
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
} 