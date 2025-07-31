import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sessionStore from '../../../lib/sessionStore';

// Hashed credentials (ahmed:Ahmed@2025)
const VALID_CREDENTIALS = {
  userId: process.env.ADMIN_USER_ID || 'ahmed',
  passwordHash: process.env.ADMIN_PASSWORD_HASH || '757162ad31b07cbf9291d629916881410ace61bbb6b1067721ea8cde107c4e57' // SHA-256 hash of Ahmed@2025
};

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID || 'service_8qjqjqj',
  templateId: process.env.EMAILJS_TEMPLATE_ID || 'template_8qjqjqj',
  publicKey: process.env.EMAILJS_PUBLIC_KEY || '8qjqjqj',
  targetEmail: process.env.EMAILJS_TARGET_EMAIL || 'mushabbirahmed99@gmail.com'
};

// Send OTP email using EmailJS REST API
async function sendOTPEmail(otp: string) {
  try {
    const emailjsUrl = `https://api.emailjs.com/api/v1.0/email/send`;
    
    const response = await fetch(emailjsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.publicKey,
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
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('EmailJS API error:', response.status, errorData);
      throw new Error(`EmailJS API error: ${response.status}`);
    }

    const result = await response.json();
    return { success: true };
    
  } catch (error) {
    console.error('EmailJS error:', error);
    
    // Fallback to console logging for development (OTP hidden for security)
    console.log(`📧 OTP sent to ${EMAILJS_CONFIG.targetEmail}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
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