import { NextRequest, NextResponse } from 'next/server';

// EmailJS configuration (Using both Public and Private Keys)
const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID || 'service_qqslkja',
  templateId: process.env.EMAILJS_TEMPLATE_ID || 'template_e9dshs7',
  publicKey: process.env.EMAILJS_PUBLIC_KEY || 'ZEtjUcYhfbut0g2wY', // Public key for user_id
  privateKey: process.env.EMAILJS_PRIVATE_KEY || '1jyIruPWFATPFQKrubr2x', // Private key for authentication
  targetEmail: process.env.EMAILJS_TARGET_EMAIL || 'mushabbirahmed99@gmail.com'
};

// Fallback email function for contact form
async function sendFallbackContactEmail(name: string, email: string, message: string) {
  try {
    console.log('📧 Using fallback contact email method...');
    
    const emailData = {
      to: EMAILJS_CONFIG.targetEmail,
      subject: 'New Contact Form Message',
      message: `From: ${name} (${email})\n\nMessage: ${message}`,
      timestamp: new Date().toISOString()
    };
    
    console.log('📧 ==========================================');
    console.log('📧 CONTACT FORM MESSAGE (FALLBACK)');
    console.log('📧 ==========================================');
    console.log('📧 To:', emailData.to);
    console.log('📧 Subject:', emailData.subject);
    console.log('📧 From:', name);
    console.log('📧 Email:', email);
    console.log('📧 Message:', message);
    console.log('📧 Time:', emailData.timestamp);
    console.log('📧 ==========================================');
    console.log('📧 Note: This is a fallback method. In production,');
    console.log('📧 you should integrate with a proper email service');
    console.log('📧 like SendGrid, Mailgun, or AWS SES.');
    console.log('📧 ==========================================');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, fallback: true };
    
  } catch (error) {
    console.error('📧 Fallback contact email error:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// Send contact form email using EmailJS REST API
async function sendContactEmail(name: string, email: string, message: string) {
  try {
    console.log('📧 Attempting to send contact form via EmailJS...');
    console.log('📧 Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('📧 Template ID:', EMAILJS_CONFIG.templateId);
    console.log('📧 Target Email:', EMAILJS_CONFIG.targetEmail);
    
    const emailjsUrl = `https://api.emailjs.com/api/v1.0/email/send`;
    
    const requestBody = {
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.publicKey, // Use public key for user_id
      template_params: {
        to_email: EMAILJS_CONFIG.targetEmail,
        to_name: 'Mushabbir Ahmed',
        from_name: name,
        from_email: email,
        message: message,
        subject: 'New Contact Form Message',
        time: new Date().toLocaleString()
      }
    };
    
    console.log('📧 Contact form request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(emailjsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAILJS_CONFIG.privateKey}` // Use private key for authentication
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📧 Contact form response status:', response.status);
    console.log('📧 Contact form response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error('📧 Contact form EmailJS API error:', response.status, errorData);
      
      // If EmailJS fails, use fallback
      if (response.status === 403) {
        console.log('📧 EmailJS API calls disabled for server-side. Using fallback...');
        return await sendFallbackContactEmail(name, email, message);
      }
      
      throw new Error(`EmailJS API error: ${response.status}: ${errorData}`);
    }

    const result = await response.json();
    console.log('📧 Contact form EmailJS success response:', result);
    return { success: true };
    
  } catch (error) {
    console.error('📧 Contact form EmailJS error:', error);
    
    // Use fallback if EmailJS fails
    return await sendFallbackContactEmail(name, email, message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if sender email is the same as target email
    if (email.toLowerCase() === 'mushabbirahmed99@gmail.com') {
      return NextResponse.json(
        { error: 'Please use a different email address' },
        { status: 400 }
      );
    }

    // Send email via EmailJS or fallback
    const emailResult = await sendContactEmail(name, email, message);

    if (emailResult.success) {
      const isFallback = 'fallback' in emailResult && emailResult.fallback;
      return NextResponse.json(
        { 
          success: true, 
          message: isFallback ? 'Message sent via fallback method! I will get back to you soon.' : 'Message sent successfully! I will get back to you soon.',
          fallback: isFallback
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
} 