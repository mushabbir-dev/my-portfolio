import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sessionStore from '../../../lib/sessionStore';

// Hashed credentials (ahmed:Ahmed@2025)
const VALID_CREDENTIALS = {
  userId: process.env.ADMIN_USER_ID || 'ahmed',
  passwordHash: process.env.ADMIN_PASSWORD_HASH || '757162ad31b07cbf9291d629916881410ace61bbb6b1067721ea8cde107c4e57' // SHA-256 hash of Ahmed@2025
};

// EmailJS configuration (SECURE - Using Private Key)
const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID || 'service_qqslkja',
  templateId: process.env.EMAILJS_TEMPLATE_ID || 'template_nr8wqkq', // OTP template
  privateKey: process.env.EMAILJS_PRIVATE_KEY || '1jyIruPWFATPFQKrubr2x', // Using private key for server-side
  targetEmail: process.env.EMAILJS_TARGET_EMAIL || 'mushabbirahmed99@gmail.com'
};

// Enhanced debugging function
function logDebugInfo(context: string, data: any) {
  console.log(`🔍 [${context}] ${new Date().toISOString()}`);
  console.log(`🔍 Environment Variables:`);
  console.log(`🔍   EMAILJS_SERVICE_ID: ${process.env.EMAILJS_SERVICE_ID || 'NOT SET'}`);
  console.log(`🔍   EMAILJS_TEMPLATE_ID: ${process.env.EMAILJS_TEMPLATE_ID || 'NOT SET'}`);
  console.log(`🔍   EMAILJS_PRIVATE_KEY: ${process.env.EMAILJS_PRIVATE_KEY ? 'SET' : 'NOT SET'}`);
  console.log(`🔍   EMAILJS_TARGET_EMAIL: ${process.env.EMAILJS_TARGET_EMAIL || 'NOT SET'}`);
  console.log(`🔍 Data:`, JSON.stringify(data, null, 2));
}

// Send OTP email using EmailJS REST API
async function sendOTPEmail(otp: string) {
  try {
    logDebugInfo('OTP_ATTEMPT', { otp, config: EMAILJS_CONFIG });
    
    const emailjsUrl = `https://api.emailjs.com/api/v1.0/email/send`;
    
    const requestBody = {
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.privateKey,
      template_params: {
        to_email: EMAILJS_CONFIG.targetEmail,
        to_name: 'Admin',
        from_name: 'Portfolio System',
        from_email: 'noreply@portfolio.com',
        message: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
        subject: 'Admin Login OTP',
        otp: otp,
        time: new Date().toLocaleString()
      }
    };
    
    console.log('📧 Sending request to EmailJS...');
    console.log('📧 URL:', emailjsUrl);
    console.log('📧 Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(emailjsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📧 Response status:', response.status);
    console.log('📧 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📧 Response body:', responseText);

    if (!response.ok) {
      console.error('📧 EmailJS API error:', response.status, responseText);
      throw new Error(`EmailJS API error: ${response.status}: ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { raw: responseText };
    }
    
    console.log('📧 EmailJS success response:', result);
    logDebugInfo('OTP_SUCCESS', { result });
    return { success: true, result };
    
  } catch (error) {
    console.error('📧 EmailJS error:', error);
    logDebugInfo('OTP_ERROR', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
    
    // For development/testing, show OTP in console
    console.log(`📧 ==========================================`);
    console.log(`📧 ADMIN LOGIN OTP (FALLBACK)`);
    console.log(`📧 ==========================================`);
    console.log(`📧 Email: ${EMAILJS_CONFIG.targetEmail}`);
    console.log(`📧 OTP Code: ${otp}`);
    console.log(`📧 Expires: 5 minutes`);
    console.log(`📧 Time: ${new Date().toLocaleString()}`);
    console.log(`📧 ==========================================`);
    console.log(`📧 Check the server console above for your OTP`);
    console.log(`📧 ==========================================`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, fallback: true };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json();

    // Validate required fields
    if (!userId || !password) {
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      );
    }

    // Hash the provided password
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Validate credentials
    if (userId !== VALID_CREDENTIALS.userId || passwordHash !== VALID_CREDENTIALS.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid user ID or password' },
        { status: 401 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    sessionStore.setOTP(sessionId, otp, expires);

    // Send OTP via EmailJS
    try {
      await sendOTPEmail(otp);

      return NextResponse.json(
        { 
          success: true, 
          message: 'Verification code sent to your email.',
          sessionId
        },
        { status: 200 }
      );

    } catch (emailError) {
      console.error('Email error:', emailError);
      
      // Return error instead of exposing OTP
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send OTP. Please try again later.',
          sessionId
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 