import { Resend } from 'resend';

// Initialize Resend with API key or undefined
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(emailData: EmailData) {
  try {
    // Check if Resend is available
    if (!resend) {
      console.log('📧 Resend API key not configured. Using fallback method.');
      
      // Fallback: Log email details for development
      console.log('📧 ==========================================');
      console.log('📧 EMAIL SENT (FALLBACK)');
      console.log('📧 ==========================================');
      console.log('📧 To:', emailData.to);
      console.log('📧 Subject:', emailData.subject);
      console.log('📧 Content:', emailData.html.replace(/<[^>]*>/g, ''));
      console.log('📧 Time:', new Date().toISOString());
      console.log('📧 ==========================================');
      console.log('📧 Note: Set RESEND_API_KEY environment variable');
      console.log('📧 to enable actual email sending.');
      console.log('📧 ==========================================');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, fallback: true };
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio System <noreply@yourdomain.com>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function createOTPEmail(otp: string, recipientEmail: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">🔐 Admin Login OTP</h2>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #0066cc; margin: 0; font-size: 24px;">Your OTP Code</h3>
          <div style="background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border: 2px dashed #0066cc;">
            <span style="font-size: 32px; font-weight: bold; color: #0066cc; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="color: #666; margin: 0; font-size: 14px;">This code will expire in 5 minutes</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This is an automated message from your portfolio system.<br>
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
      </div>
    </div>
  `;

  return {
    to: recipientEmail,
    subject: 'Admin Login OTP - Portfolio System',
    html: html
  };
}

export function createContactEmail(name: string, email: string, message: string, recipientEmail: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">📧 New Contact Form Message</h2>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0066cc; margin: 0 0 15px 0;">Message Details</h3>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #333; margin: 0 0 10px 0;">Message:</h4>
          <p style="color: #555; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This message was sent from your portfolio contact form.<br>
            Please respond directly to ${email} to reply to the sender.
          </p>
        </div>
      </div>
    </div>
  `;

  return {
    to: recipientEmail,
    subject: `New Contact Form Message from ${name}`,
    html: html
  };
} 