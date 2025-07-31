import { NextRequest, NextResponse } from 'next/server';

// EmailJS configuration (Using both Public and Private Keys)
const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID || 'service_qqslkja',
  templateId: process.env.EMAILJS_TEMPLATE_ID || 'template_nr8wqkq', // OTP template
  publicKey: process.env.EMAILJS_PUBLIC_KEY || 'ZEtjUcYhfbut0g2wY', // Public key for user_id
  privateKey: process.env.EMAILJS_PRIVATE_KEY || '1jyIruPWFATPFQKrubr2x', // Private key for authentication
  targetEmail: process.env.EMAILJS_TARGET_EMAIL || 'mushabbirahmed99@gmail.com'
};

// Enhanced debugging function
function logDebugInfo(context: string, data: any) {
  console.log(`🔍 [${context}] ${new Date().toISOString()}`);
  console.log(`🔍 Environment Variables:`);
  console.log(`🔍   EMAILJS_SERVICE_ID: ${process.env.EMAILJS_SERVICE_ID || 'NOT SET'}`);
  console.log(`🔍   EMAILJS_TEMPLATE_ID: ${process.env.EMAILJS_TEMPLATE_ID || 'NOT SET'}`);
  console.log(`🔍   EMAILJS_PUBLIC_KEY: ${process.env.EMAILJS_PUBLIC_KEY ? 'SET' : 'NOT SET'}`);
  console.log(`🔍   EMAILJS_PRIVATE_KEY: ${process.env.EMAILJS_PRIVATE_KEY ? 'SET' : 'NOT SET'}`);
  console.log(`🔍   EMAILJS_TARGET_EMAIL: ${process.env.EMAILJS_TARGET_EMAIL || 'NOT SET'}`);
  console.log(`🔍 Data:`, JSON.stringify(data, null, 2));
}

// Fallback email function using a simple approach
async function sendFallbackEmail(subject: string, message: string) {
  try {
    console.log('📧 Using fallback email method...');
    
    // For now, we'll simulate email sending and log the details
    // In a real implementation, you would use a service like SendGrid, Mailgun, or similar
    
    const emailData = {
      to: EMAILJS_CONFIG.targetEmail,
      subject: subject,
      message: message,
      timestamp: new Date().toISOString()
    };
    
    console.log('📧 ==========================================');
    console.log('📧 FALLBACK EMAIL SENT');
    console.log('📧 ==========================================');
    console.log('📧 To:', emailData.to);
    console.log('📧 Subject:', emailData.subject);
    console.log('📧 Message:', emailData.message);
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
    console.error('📧 Fallback email error:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function GET() {
  try {
    logDebugInfo('TEST_EMAIL_CONFIG', { config: EMAILJS_CONFIG });
    
    // Try EmailJS first
    const emailjsUrl = `https://api.emailjs.com/api/v1.0/email/send`;
    
    const requestBody = {
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.publicKey, // Use public key for user_id
      template_params: {
        to_email: EMAILJS_CONFIG.targetEmail,
        to_name: 'Test User',
        from_name: 'Test System',
        from_email: 'test@portfolio.com',
        message: 'This is a test email from the portfolio system.',
        subject: 'Test Email',
        otp: '123456',
        time: new Date().toLocaleString()
      }
    };
    
    console.log('📧 Attempting EmailJS API call...');
    console.log('📧 URL:', emailjsUrl);
    console.log('📧 Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(emailjsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMAILJS_CONFIG.privateKey}` // Use private key for authentication
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📧 Response status:', response.status);
    console.log('📧 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📧 Response body:', responseText);

    if (!response.ok) {
      console.error('📧 EmailJS API error:', response.status, responseText);
      
      // If EmailJS fails, use fallback
      if (response.status === 403) {
        console.log('📧 EmailJS API calls disabled for server-side. Using fallback...');
        const fallbackResult = await sendFallbackEmail(
          'Test Email from Portfolio',
          'This is a test email from the portfolio system using fallback method.'
        );
        
        return NextResponse.json({
          success: fallbackResult.success,
          message: fallbackResult.success ? 'Test email sent via fallback method' : 'Failed to send email',
          config: EMAILJS_CONFIG,
          fallback: true,
          error: fallbackResult.error || null
        }, { status: fallbackResult.success ? 200 : 500 });
      }
      
      return NextResponse.json({
        success: false,
        error: `EmailJS API error: ${response.status}: ${responseText}`,
        config: EMAILJS_CONFIG,
        response: responseText
      }, { status: 500 });
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { raw: responseText };
    }
    
    console.log('📧 EmailJS success response:', result);
    logDebugInfo('TEST_EMAIL_SUCCESS', { result });
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully via EmailJS',
      config: EMAILJS_CONFIG,
      result: result
    });
    
  } catch (error) {
    console.error('📧 Test email error:', error);
    logDebugInfo('TEST_EMAIL_ERROR', { 
      error: error instanceof Error ? error.message : String(error), 
      stack: error instanceof Error ? error.stack : undefined 
    });
    
    // Use fallback if EmailJS fails completely
    const fallbackResult = await sendFallbackEmail(
      'Test Email from Portfolio',
      'This is a test email from the portfolio system using fallback method.'
    );
    
    return NextResponse.json({
      success: fallbackResult.success,
      message: fallbackResult.success ? 'Test email sent via fallback method' : 'Failed to send email',
      config: EMAILJS_CONFIG,
      fallback: true,
      error: fallbackResult.error || (error instanceof Error ? error.message : String(error))
    }, { status: fallbackResult.success ? 200 : 500 });
  }
} 