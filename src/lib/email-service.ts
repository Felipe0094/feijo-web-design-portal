export interface EmailData {
  to: string[];
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: string;
    type: string;
  }[];
}

export const sendEmail = async (emailData: EmailData) => {
  try {
    // Use different API URL based on environment
    const apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3002/api/send-email'
      : 'https://feijo-seguros.vercel.app/api/send-email';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      throw new Error(result.error || 'Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};